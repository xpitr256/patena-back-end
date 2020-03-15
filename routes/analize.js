let validationService = require('../services/validationService.js');
let analizeService = require ('../services/analizeService');


async function postAnalyze(req, res) {
    if (req.body.sequence) {

        if ( validationService.isValidAnalyzeData(req.body)) {
            try {
                let orderNumber = await analizeService.sendOrderNumber(req.body.email, req.body.sequence);
                res.json({
                    orderNumber: orderNumber.toString()
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