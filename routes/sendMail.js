let express = require('express');
let router = express.Router();
let validationService = require('../services/validationService.js');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', function(req, res, next) {

    if (validationService.isValidMail(req.query.email)){
    const email = {
        to: 'ncoco@fi.uba.ar',
        from: req.query.email,
        subject: 'Sending SendGrid is Fun, enviado por ' + req.query.email,
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail.send(email, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
    });
    return res.status(200).send({
        message:'I send successfull mail'
    });
    }else{
        return res.status(400).send({
            message:'Invalid mail'
        });
    }
});

module.exports = router;