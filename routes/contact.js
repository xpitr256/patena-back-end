let validationService = require('../services/validationService.js');
let mailService = require('../services/mailService.js');

async function postContact(req, res) {
    if ( validationService.isValidContactData(req.body.email, req.body.name, req.body.message)) {
        try {
            await mailService.sendContactMail(req.body.email, req.body.name, req.body.message);
            res.json({
                message: "Contact form sent ok!"
            });

        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({
            message:'Invalid contact information'
        });
    }
}

module.exports = {
    postContact: postContact
};
