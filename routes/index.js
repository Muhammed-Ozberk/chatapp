var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session.passport.user.id);
  res.render('index', { title: 'Express' });
});

module.exports = router;
