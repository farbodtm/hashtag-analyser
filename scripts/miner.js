//
// tweet miner
// hashtag-analyser
//

var twit = require('twit');
var chalk = require('chalk');
var keys = require('./keys.js');
var database = require('./db.js');
var helpers = require('./helpers.js');

var client = new twit(keys);
var stream = client.stream('statuses/sample');

var db = new database();

stream.on('tweet', function(data) {
  tweet = helpers.fetchTweetData(data);
  if (tweet) {
    db.saveTweet(tweet);
  }
});

stream.on('delete', function(data) {
});

stream.on('reconnect', function(e) {
  console.log(e);
  console.log(chalk.yellow('Reconnecting...'));
  helpers.sendMail('I am reconnecting..!!');
});

stream.on('connect', function() {
  console.log(chalk.yellow('Connecting...'));
});

stream.on('connected', function() {
  console.log(chalk.green('Connected'));
  helpers.sendMail('OK, I am connected.');
});

stream.on('disconnect', function(msg) {
  console.log(chalk.red('Disconnected'));
  console.log(chalk.red(msg));
  helpers.sendMail('I got disconnected!!');
});


var geo = client.stream('statuses/filter', {'locations':'-180,-90,180,90'});

geo.on('tweet', function(data) {
  tweet = helpers.fetchTweetData(data);
  if (tweet) {
    db.saveGeo(tweet);
  }
});
