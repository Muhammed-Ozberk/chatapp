var express = require('express');
var router = express.Router();

router.get('/chats', function (req, res, next) {

  var activePage = "chats";

  var data = {
    activePage
  };
  res.render('pages/chats', { title: "Chats", data });
});

router.get('/contacts', function (req, res, next) {

  var activePage = "contacts";

  var data = {
    activePage,
  };
  res.render('pages/contacts', { title: "Contacts", data });
});

router.get('/groups', function (req, res, next) {

  var activePage = "groups";

  var data = {
    activePage,
  };
  res.render('pages/groups', { title: "Groups", data });
});

router.get('/profile', function (req, res, next) {

  var user = req.session.passport.user;
  var username = user.username;
  var email = user.email;
  var activePage = "profile";

  var data = {
    activePage,
    username,
    email
  };

  res.render('pages/profile', { title: "Profile", data });
});

router.get('/settings', function (req, res, next) {

  var activePage = "settings";

  var data = {
    activePage,
  };
  res.render('pages/settings', { title: "Settings", data });
});


module.exports = router;
