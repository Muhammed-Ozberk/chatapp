var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('pages/home', { title: "Home" });
});

module.exports = router;
