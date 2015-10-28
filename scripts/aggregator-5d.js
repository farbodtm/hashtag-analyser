var fs = require('fs');
var moment = require('moment');
var progress = require('progress');
var chalk = require('chalk');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');
var ht = db.collection('hashtags_5d');

var start = new Date('19 Aug 2015'),
    end = new Date('8 Sep 2015');

var hts;

var finish = function(hashtags) {
  var sortedHashtags = [];
  // do some cleaning before storing
  for(var hashtag in hashtags) {
    if (hashtags[hashtag].total > 0) {
      var h = {};
      h.text = hashtag;

      sortedHashtags.push(h);
    }
  }

  hts = sortedHashtags;

  var counter = hts.length;
  console.log(counter);

  ht.remove({}, function(err, result) {
    var add = function(index) {
      var hashtag = hts[index];
      if (!hashtag) {
        console.log(chalk.green('Done'));
        process.exit(0);
      }
      ht.insert(hashtag, function(err, result) {
        add(index+1);
      });
    };
    add(0);

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
      var done = false;
      result.forEach(function(tweet) {
	// set the date
	date = new Date(tweet.created_at);
  var day = date;
  date = moment(date).format('D MMM YYYY');
  var day5 = new Date('24 Aug 2015');
  if (day > day5) {
    done = true;
  } else{
    tweet.hashtags.forEach(function(hashtag) {
      hashtag = hashtag.toLowerCase();
      hashtags[hashtag] = hashtags[hashtag] || {};
      hashtags[hashtag][date] = hashtags[hashtag][date] || 0;
      hashtags[hashtag].total = hashtags[hashtag].total || 0;
      hashtags[hashtag][date]++;
      hashtags[hashtag].total++;
    });
      }
  });

      result = null;
      if (i > count || done) {
	console.log(chalk.yellow('Saving...'));
	finish(hashtags);
      } else {
	countIt(i + perRequest);
      }
    });
  };
  countIt(0);

});
