var fs = require('fs');
var moment = require('moment');
require('moment-range');
var progress = require('progress');
var chalk = require('chalk');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');
var ht = db.collection('hashtags');

var hts;

var map = function() {
	// set the date
	var date = new Date(this.created_at);
  date = date.getHours() + ' ' + date.getDate() + ' ' + (date.getMonth()+1) + ' ' + date.getFullYear();
  var day5 = new Date('24 Aug 2015');
  if (date < day5) {
    this.hashtags.forEach(function(hashtag) {
      hashtag = hashtag.toLowerCase();
      var value = {};
      value[date] = 1;
      value.total = 1;
      emit(hashtag, value);
    });
  }
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

  // FILTER
  if (total < 200) {
    return false;
  }

  delete value.total;
  var hashtag = {};
  hashtag.temporal = value;
  hashtag.text = key;
  hashtag.total = total;

  var aas = 0;
  var temporalArr = [];
  for (var date in hashtag.temporal) {
    temporalArr.push(hashtag.temporal[date]);
  }
  for (i = 1; i < temporalArr.length-1; i++) {
    aas += Math.abs(temporalArr[i] - temporalArr[i-1]);
  }
  aas /= temporalArr.length-1;
  aas /= total;
  aas *= 100;
  /*if (aas < 1.5) {
    return false;
  }*/
  hashtag.aas = aas;

  var fullTemporalArr = [];

  hours.forEach(function(hour) {
    hashtag.temporal[hour] = hashtag.temporal[hour] || 0;
    fullTemporalArr.push(hashtag.temporal[hour]);
  });
  hashtag.fullTemporalArr = fullTemporalArr;

  var maxIndex = 0;
  for (var i = 0; i < fullTemporalArr.length; i++) {
    if (fullTemporalArr[maxIndex] < fullTemporalArr[i]) {
      maxIndex = i;
    }
  }
  hashtag.maxIndex = maxIndex;

  if (maxIndex < 42 || maxIndex > fullTemporalArr.length-86) {
    return false;
  }

  var newArray = [];
  for (var i = maxIndex - 42; i <= maxIndex + 85; i++) {
    newArray.push(fullTemporalArr[i]);
  }

  hashtag.temporalArr = newArray;

  return hashtag;
};

var range = moment.range(new Date('00:00 19 Aug 2015'), new Date('00:00 26 Oct 2015'));
var hours = [];

range.by('hours', function(moment) {
  hours.push(moment.format('H D M YYYY'));
});

tweets.mapReduce(map.toString(), reduce.toString(), { out: 'hashtags_5day', finalize: finalize.toString(), scope: { hours: hours } }, function(err, log) {
  if (err) {
    console.log(err);
  } else {
	  console.log(chalk.green('Done'));
  }
  process.exit(0);
});

