var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readFile('./hashtag.json', function(err, data){
    res.render('index', { title: 'Hashtag', hashtag: data});
  });
});

module.exports = router;
