var fs = require('fs');
var moment = require('moment');
var progress = require('progress');
var chalk = require('chalk');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var ht5 = db.collection('hashtags_5d');
var ht = db.collection('hashtags');

var doIt = function(i) {
  ht5.find({},{ text: 1}).skip(i).limit(10000).toArray(function(err, result) {
    console.log(result.length);
    if (!result.length) {
      console.log('Done');
      process.exit(0);
    }
    var hashtags = [];
    result.forEach(function(el) {
      hashtags.push(el.text);
    });
    ht.remove({'value.text': { $in: hashtags } }, function(err) {
      doIt(i+10000);
    });
  });
};
doIt(0);
