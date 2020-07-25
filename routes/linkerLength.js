let express = require("express");
let router = express.Router();
let validationService = require("../services/validation/validationService.js");
let lengthService = require("../services/linkerLengthService");

router.get("/", function (req, res, next) {
  if (validationService.isValidDistance(req.query.distance)) {
    const length = lengthService.getLength(req.query.distance);
    res.json({
      length: length,
      distance: Number(req.query.distance),
    });
  } else {
    return res.status(400).send({
      message: "Invalid distance value " + req.query.distance,
    });
  }
});

module.exports = router;
