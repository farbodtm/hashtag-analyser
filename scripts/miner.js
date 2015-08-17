//
// tweet miner
// hashtag-anaylser
//

var twit = require('twit');
var keys = require('./keys.js');
var database = require('./db.js');

var client = new twit(keys);
var stream = client.stream('statuses/sample');

var db = new database();

stream.on('tweet', function(tweet) {
  db.saveTweet(tweet);
});


