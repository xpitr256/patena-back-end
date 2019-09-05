let express = require('express');
let router = express.Router();
let validationService = require('../services/validationService.js');

router.get('/', function(req, res, next) {

  if (validationService.isValidDistance(req.query.distance)) {
    res.json({
      length: Number(req.query.distance) * 2,
      distance: Number(req.query.distance)
    });
  } else {
    return res.status(400).send({
      message: 'Invalid distance value ' + req.query.distance
    });
  }
});

module.exports = router;
