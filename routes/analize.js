let validationService = require('../services/validationService.js');
let analizeService = require ('../services/analizeService');


function postAnalyze(req, res) {
    if (req.body.fastaContent) {
        if ( validationService.isValidAnalyzeData(req.body)) {
            try {
                let orderNumber = analizeService.sendOrderNumber(req.body.email, req.files.name);
                res.json({
                    message: req.files.files.name+" --> OK:" + orderNumber.toString() + "Enviado a: " + req.body.email.toString()
                });
            } catch (err) {
                res.status(400).send(err);
            }
        } else {
            res.status(400).send({
                message:'Invalid analyze information'
            });
        }
    } else {
        res.status(400).send({ message: 'No files uploaded'});
    }
}

module.exports = {
    postAnalyze: postAnalyze
};