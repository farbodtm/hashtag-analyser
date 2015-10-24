var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://root@localhost:27017/hashtag');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hashtag'});
});

router.get('/cluster/:hashtags/:clusters', function(req, res, next) {
  res.render('cluster', { title: 'Clustering', hashtags: req.params.hashtags, clusters: req.params.clusters});
});

// stat json
router.get('/hashtags', function(req, res, next) {
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;
  var censor = [];
  db.collection('hashtags_daily').find({ aasOverTotal: {$gt : 0.015}, text: /^[A-Za-z0-9]*$/ }).sort({ total: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).toArray(function(err, result) {
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

router.get('/cluster/json/:hashtags/:clusters', function(req, res, next) {
  var hts = req.params.hashtags;
  var cl = req.params.clusters;
  db.collection('hashtags_clustered_' + hts + '_' + cl).find().toArray(function(err, hashtags) {
    if (hashtags) {
      db.collection('clusters_' + hts + '_' + cl).find().toArray(function(err, clusters) {
        if (clusters) {
          c = {};
          clusters.forEach(function(el) {
            c[el.index] = {};
            c[el.index].temporal = el.temporal;
            c[el.index].hashtags = [];
          });
          hashtags.forEach(function(el) {
            c[el.cluster].hashtags.push(el.text);
          });
          res.json(c);
        } else {
          var err = new Error('Cant');
          err.status = 404;
          next(err);
        }
      });
    } else {
      var err = new Error('Cant');
      err.status = 404;
      next(err);
    }
  });
});

// json for each hashtag
router.get('/json/:hashtag', function(req, res, next) {
  // get the json data of a hashtag from database
  var hashtag =  req.params.hashtag.toLowerCase();
  db.collection('hashtags_daily').findOne({ text: hashtag }, function(err, result) {
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
