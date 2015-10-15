var fs = require('fs');
var moment = require('moment');
var progress = require('progress');
var chalk = require('chalk');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');
var ht = db.collection('hashtags');

var hts;

var map = function() {
	// set the date
	var date = new Date(this.created_at);
  date = date.toDateString();

	// counting each hastag of a tweet
	this.hashtags.forEach(function(hashtag) {
	  hashtag = hashtag.toLowerCase();
    var value = {};
	  value[date] = 1;
	  value.total = 1;
    emit(hashtag, value);
	});
};

var reduce = function(h, values) {
  var hashtag = {};
  values.forEach(function(value) {
    for (var key in value) {
      hashtag[key] = hashtag[key] || 0;
      hashtag[key] += value[key];
    }
  });
  return hashtag;
};

var finalize = function(key, value) {
  var total = value.total;
  delete value.total;
  var hashtag = {};
  hashtag.temporal = value;
  hashtag.text = key;
  hashtag.total = total;

  return hashtag;
};

tweets.mapReduce(map.toString(), reduce.toString(), { out: 'hashtags', finalize: finalize.toString() }, function(err, log) {
  if (err) {
    console.log(err);
  } else {
	  console.log(chalk.green('Done'));
  }
  process.exit(0);
});

