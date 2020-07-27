const validationService = require("../services/validation/validationService.js");
const mailService = require("../services/mail/mailService.js");
const DOMPurify = require("isomorphic-dompurify");

async function postContact(req, res) {
  const email = DOMPurify.sanitize(req.body.email);
  const name = DOMPurify.sanitize(req.body.name);
  const message = DOMPurify.sanitize(req.body.message);

  if (validationService.isValidContactData(email, name, message)) {
    try {
      await mailService.sendContactMail(email, name, message);
      res.json({
        message: "Contact form sent ok!",
      });
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(400).send({
      message: "Invalid contact information",
    });
  }
}

module.exports = {
  postContact: postContact,
};
