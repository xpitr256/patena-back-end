let express = require("express");
let router = express.Router();
let validationService = require("../services/validation/validationService.js");
let resultService = require("../services/resultService");

router.get("/", async function (req, res, next) {
  if (validationService.isValidOrderNumber(req.query.orderNumber)) {
    try {
      res.json(await resultService.getResultsFor(req.query.orderNumber));
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(400).send({
      message: "Invalid order number",
    });
  }
});

module.exports = router;
