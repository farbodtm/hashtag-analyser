var fs = require('fs');
var moment = require('moment');
var progress = require('progress');
var chalk = require('chalk');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');
var ht = db.collection('hashtags');


var hts;

var store = function(hashtags) {
  var sortedHashtags = [];
  for(var hashtag in hashtags) {
    if (hashtags[hashtag].total > 200) {
      var h = {};
      h.text = hashtag;
      h.temporal = hashtags[hashtag];
      h.total = hashtags[hashtag].total;
      delete hashtags[hashtag].total;
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
	if (counter == 0) {
	  console.log(chalk.green('Done'));
	  process.exit(0);
	}
      });
    });
  });
}

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

  var process = function(i) {
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
	store(hashtags);
      } else {
	process(i + perRequest);
      }
    });
  }
  process(0);

});



