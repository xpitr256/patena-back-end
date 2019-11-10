let validationService = require('../services/validationService.js');
let analizeService = require ('../services/analizeService');


function postAnalize(req, res) {
    if ( validationService.isValidForAnalize(req.body.email, req.files)) {
        try {
            console.log(req.files)
            let orderNumber = analizeService.sendOrderNumber(req.body.email, req.files.name);
            res.json({
                message: req.files.files.name+" --> OK:" + orderNumber.toString() + "Enviado a: " + req.body.email.toString()
            });

        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({
            message:'Invalid analize information'
        });
    }
}

module.exports = {
    postAnalize: postAnalize
};