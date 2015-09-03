var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://root@localhost:27017/hashtag');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hashtag'});
});

// stat json
router.get('/hashtags', function(req, res, next) {
  db.collection('hashtags').find().sort({ total: -1 }).limit(10000).toArray(function(err, result) {
    if (result) {
      result.forEach(function(h, index, arr) {
	var temporalArr = [];
	for (var date in h.temporal) {
	  temporalArr.push(h.temporal[date]);
	}
	var aas = 0;
	for (var i = 1; i < temporalArr.length-2; i++) {
	  aas += Math.abs(temporalArr[i] - temporalArr[i-1]);
	}
	aas /= ((temporalArr.length-2) * h.total / 100);
	arr[index].aas = aas;
      });

      res.json(result);
    } else {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }
  });
});

// json for each hashtag
router.get('/json/:hashtag', function(req, res, next) {
  // get the json data of a hashtag from database
  var hashtag =  req.params.hashtag.toLowerCase();
  db.collection('hashtags').findOne({ text: hashtag }, function(err, result) {
    if (result) {
      res.json(result);
    } else {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;
