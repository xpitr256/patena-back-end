let express = require('express');
let router = express.Router();
let validationService = require('../services/validationService.js');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get('/', function(req, res, next) {

    if (validationService.isValidMail(req.query.email)) {
        const msg = {
            to: 'ncoco@fi.uba.ar',
            from: req.query.email,
            subject: req.query.fullName +'Consulta Patena',
            text: req.query.message,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        sgMail.send(msg);
        return res.status(200).send({
            message: 'I send successful mail'
        });
    } else {
        return res.status(400).send({
            message: 'Invalid mail'
        });
    }
});

module.exports = router;