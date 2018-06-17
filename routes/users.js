var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/api/playlist', function(req, res, next) {
  console.log('respond with a resource');
  res.render('index')
});

module.exports = router;
