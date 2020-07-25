const validationService = require("../services/validation/validationService.js");
const designService = require("../services/designService");
const DOMPurify = require("isomorphic-dompurify");

async function postDesign(req, res) {
  req.body.designType = Number(DOMPurify.sanitize(req.body.designType));
  if (validationService.isValidDesign(req.body)) {
    try {
      const orderNumber = await designService.createDesign(req.body);
      res.json({
        orderNumber: orderNumber,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(400).send({
      message: "Invalid Design information",
    });
  }
}

module.exports = {
  postDesign: postDesign,
};
