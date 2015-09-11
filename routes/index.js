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
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;
  var censor = ['horny'];
  db.collection('hashtags').find({ aasOverTotal: {$gt : 0.015}, text: /^[A-Za-z0-9]*$/ }).sort({ total: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).toArray(function(err, result) {
    if (result) {
      result.forEach(function(el, i, arr) {
	if (censor.indexOf(el.text) > -1) {
	  arr.splice(i, 1);
	}
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
