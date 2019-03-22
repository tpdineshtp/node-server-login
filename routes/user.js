var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'),
    User = mongoose.model('User');

router.post('/login', function(req, res, next){
  User.findOne({ userID : req.body.username, password: req.body.password }, function(err, user) {
    if (err)
      res.send(err);
    // Username not exists in DB
    if(user === null) {
      res.status(404).send({});
    }
    else{
      res.json(user);
    }
});
})

router.post('/register', function(req, res, next){
  var newUser = new User();
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.userID = req.body.username;
  newUser.password = req.body.password;
  newUser.userGroup = req.body.userGroup;
  newUser.email = req.body.email;

  newUser.save(function(err, doc) {
    if (err)
      return res.status(400).send(err);

    return res.status(200).send({});
  });
})

module.exports = router;