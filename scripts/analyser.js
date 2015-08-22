var fs = require('fs');
var moment = require('moment');

var db = require('mongoskin').db('mongodb://root@localhost:27017/hashtag');
var tweets = db.collection('tweets');
var ht = db.collection('hashtags');


var hts;

tweets.count(function(err, count) {
  var i = 0, counter = count;
  var hashtags = {}; 
  var date;
  var perRequest = 100000;
  while (i < count) {
    tweets.find({},{ hashtags: 1, created_at: 1}).skip(i).limit(perRequest).toArray(function(err, result) {
      console.log(counter);
      counter -= perRequest;
      result.forEach(function(tweet) {
	date = new Date(tweet.created_at);
	date = moment(date).format('D MMM YYYY');
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
      if (counter < 0) {
	console.log('Processing Now...');
	store(hashtags);
      }
    });
    i += perRequest;
  }
});

function store(hashtags) {
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
	  console.log('Done');
	  process.exit(0);
	}
      });
    });
  });

}


