//
// database
// hashtag-anaylser
//

var mongoskin = require('mongoskin');

function Database() {

}

var _db = mongoskin.db('mongodb://root@localhost:27017/hashtag');

Database.prototype.saveTweet = function(tweet) {
  _db.collection('tweets').insert(tweet, function(err,result) {
  });
};

Database.prototype.saveGeo = function(tweet) {
  _db.collection('geo').insert(tweet, function(err,result) {
  });
}

Database.prototype.saveDelete = function(id) {
  _db.collection('deletes').insert(id, function(err, result) {
  });
};

module.exports = Database;
