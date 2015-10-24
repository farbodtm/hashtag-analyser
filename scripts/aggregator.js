var fs = require('fs');
var moment = require('moment');
var progress = require('progress');
var chalk = require('chalk');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');
var ht = db.collection('hashtags_daily');

var start = new Date('19 Aug 2015'),
    end = new Date('8 Sep 2015');

var hts;

// get a temporal object initialized with 'startDate' to 'stopDate' keys
function getTemporalObj(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('D MMM YYYY'));
        currentDate = moment(currentDate).add(1, 'days');
    }
    var temporalObj = {};
    dateArray.forEach(function(day) {
      temporalObj[day] = 0;
    });
    return temporalObj;
}

var finish = function(hashtags) {
  var sortedHashtags = [];
  // do some cleaning before storing
  for(var hashtag in hashtags) {
    if (hashtags[hashtag].total > 20) {
      var h = {};
      h.text = hashtag;
      h.temporal = hashtags[hashtag];
      h.total = hashtags[hashtag].total;
      delete hashtags[hashtag].total;
      // average absolute slope
      // peaks
      var temporalArr = [];
      var temporalArrFull = [];
      var temporalObj = getTemporalObj(start, end);
      for (var date in h.temporal) {
	temporalArr.push(h.temporal[date]);
      }
      for (date in temporalObj) {
	if (h.temporal[date]) {
	  temporalArrFull.push(h.temporal[date]);
	} else {
	  temporalArrFull.push(0);
	}
      }
      var aas = 0;
      var peaks = 0;
      var mean = 0;
      var variance = 0;
      for (var i = 0; i < temporalArrFull.length; i++) {
	mean += temporalArrFull[i];
      }
      mean /= temporalArrFull.length;
      for (i = 0; i < temporalArrFull.length; i++) {
	variance = Math.pow(temporalArrFull[i] - mean, 2);
      }
      variance /= temporalArrFull.length-1;
      for (i = 1; i < temporalArr.length-1; i++) {
	aas += Math.abs(temporalArr[i] - temporalArr[i-1]);
	if (temporalArr[i] - temporalArr[i-1] > 0 && temporalArr[i] - temporalArr[i+1] > 0) {
	  peaks++;
	}
      }
      aas /= temporalArr.length-1;

      h.aas = aas;
      h.aasOverTotal = h.aas/h.total;

      h.peaks = peaks;

      h.mean = mean;
      h.variance = variance;
      h.varianceOverTotal = h.variance/h.total;

      sortedHashtags.push(h);
    }
  }

  sortedHashtags.sort(function(a,b) {
    return b.total - a.total;
  });
  hts = sortedHashtags;

  var counter = hts.length;

  ht.remove({}, function(err, result) {
    hts.forEach(function(hashtag) {
      ht.insert(hashtag, function(err, result) {
	counter--;
	if (counter === 0) {
	  console.log(chalk.green('Done'));
	  process.exit(0);
	}
      });
    });
  });
};

tweets.count(function(err, count) {
  console.log(chalk.yellow('Loading...'));
  var hashtags = {};
  var date;
  var perRequest = 100000;

  var bar = new progress(chalk.yellow('Counting [:bar] :percent :etas'), {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: count
  });

  var countIt = function(i) {
    tweets.find({},{ hashtags: 1, created_at: 1}).skip(i).limit(perRequest).toArray(function(err, result) {
      bar.tick(perRequest);
      result.forEach(function(tweet) {
	// set the date
	date = new Date(tweet.created_at);
	date = moment(date).format('D MMM YYYY');
	// counting each hastag of a tweet
	tweet.hashtags.forEach(function(hashtag) {
	  hashtag = hashtag.toLowerCase();
	  hashtags[hashtag] = hashtags[hashtag] || {};
	  hashtags[hashtag][date] = hashtags[hashtag][date] || 0;
	  hashtags[hashtag].total = hashtags[hashtag].total || 0;
	  hashtags[hashtag][date]++;
	  hashtags[hashtag].total++;
	});
      });

      result = null;
      if (i > count) {
	console.log(chalk.yellow('Saving...'));
	finish(hashtags);
      } else {
	countIt(i + perRequest);
      }
    });
  };
  countIt(0);

});
