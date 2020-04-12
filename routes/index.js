var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //TODO create index with endpoints documentation
  res.render('index', { title: 'Express' });
});

module.exports = router;
