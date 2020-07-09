const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    name: 'PATENA api',
    version: 'v1'
  });
});

module.exports = router;
