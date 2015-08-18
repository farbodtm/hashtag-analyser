var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');

var hts;

tweets.count(function(err, count) {
  var i = 0, counter = count;
  var hashtags = {}; 
  while (i < count) {
    tweets.find({},{entities: 1}).skip(i).limit(1000).toArray(function(err, result) {
      console.log(counter);
      counter -= 1000;
      result.forEach(function(tweet) {
	tweet.entities.hashtags.forEach(function(hashtag) {
	  hashtag = hashtag.text.toLowerCase();
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
    i += 1000;
  }
});

function process(hashtags) {
  var sortedHashtags = [];
  for(var hashtag in hashtags) {
    if (hashtags[hashtag] > 20) {
      var h = {};
      h.text = hashtag;
      h.number = hashtags[hashtag];
      sortedHashtags.push(h);
    }
  }
  sortedHashtags.sort(function(a,b) {
    return a.number - b.number;
  });
  hts = sortedHashtags;
  console.log(hts);
}


