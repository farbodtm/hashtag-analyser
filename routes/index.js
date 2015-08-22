var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://root@localhost:27017/hashtag');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hashtag'});
});

router.get('/json/:hashtag', function(req, res, next) {
  var hashtag =  req.params.hashtag;
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
