let express = require('express');
let router = express.Router();
let validationService = require('../services/validationService.js');
let lengthService = require('../services/linkerLengthService');


router.get('/', async function(req, res, next) {

  if (validationService.isValidDistance(req.query.distance)) {
    const longitud =await lengthService.getLength(req.query.distance);
    res.json({
      length: longitud ,
      distance: Number(req.query.distance)
    });
  } else {
    return res.status(400).send({
      message: 'Invalid distance value ' + req.query.distance
    });
  }
});

module.exports = router;
