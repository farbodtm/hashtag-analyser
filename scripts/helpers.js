//
// helpers
// hashtag-analyser
//

var nodemailer = require('nodemailer');
var chalk = require('chalk');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hashtag.farbod@gmail.com',
    pass: 'hf290694'
  }
});

module.exports.fetchTweetData = function(data) {
  if (!data.entities.hashtags.length) {
    return false; 
  }
  var tweet = {};
  tweet.created_at = data.created_at;
  tweet.id = data.id_str;
  tweet.hashtags = [];
  data.entities.hashtags.forEach(function(hashtag) {
    tweet.hashtags.push(hashtag.text);
  });
  tweet.coordinates = data.coordinates;

  return tweet;
};

module.exports.sendMail = function(msg) {
  var mailOptions = {
    from: 'hashtag.farbod@gmail.com',
    to: 'farbod.motlagh@adelaide.edu.au', 
    subject: 'HASHTAG ANALAYSER',
    text: "SOMETHINGS HAPPENING - CHECK YOUR SCRIPT\n" + msg
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(chalk.red(error));
    } else {
      console.log(chalk.green('Message sent: ' + info.response));
    }
  });
};
