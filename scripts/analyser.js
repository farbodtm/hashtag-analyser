var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');

var fs = require('fs');

var hts;

tweets.count(function(err, count) {
  var i = 0, counter = count;
  var hashtags = {}; 
  var perRequest = 100000;
  while (i < count) {
    tweets.find({},{hashtags: 1}).skip(i).limit(perRequest).toArray(function(err, result) {
      console.log(counter);
      counter -= perRequest;
      result.forEach(function(tweet) {
	tweet.hashtags.forEach(function(hashtag) {
	  hashtag = hashtag.toLowerCase();
	  hashtags[hashtag] = hashtags[hashtag] || 0;
	  hashtags[hashtag]++;
	});
      });
      result = null;
      if (counter < 0) {
	console.log('It is ready');
	process(hashtags);
      }
    });
    i += perRequest;
  }
});

function process(hashtags) {
  var sortedHashtags = [];
  for(var hashtag in hashtags) {
    if (hashtags[hashtag] > 1000) {
      var h = {};
      h.text = hashtag;
      h.count = hashtags[hashtag];
      sortedHashtags.push(h);
    }
  }
  sortedHashtags.sort(function(a,b) {
    return b.count - a.count;
  });
  hts = sortedHashtags;
  fs.writeFile('./test.json', JSON.stringify(hts,null,4), function() {
    console.log(hts);
  });
}


