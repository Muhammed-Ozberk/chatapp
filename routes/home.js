var express = require('express');
var router = express.Router();

router.get('/chats', function(req, res, next) {
  res.render('pages/chats', { title: "Chats", activePage: "chats" });
});

router.get('/contacts', function(req, res, next) {
  res.render('pages/contacts', { title: "Contacts", activePage: "contacts" });
});

router.get('/groups', function(req, res, next) {
  res.render('pages/groups', { title: "Groups", activePage: "groups" });
});

router.get('/profile', function(req, res, next) {
  res.render('pages/profile', { title: "Profile", activePage: "profile" });
});

router.get('/settings', function(req, res, next) {
  res.render('pages/settings', { title: "Settings", activePage: "settings" });
});


module.exports = router;
