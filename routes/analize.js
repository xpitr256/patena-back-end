let validationService = require('../services/validationService.js');
let analizeService = require ('../services/analizeService');

function postAnalize(req, res) {
    if ( validationService.isValidForAnalize(req.body.email, req.body.fileName)) {
        try {
            let orderNumber = analizeService.sendOrderNumber(req.body.email, req.body.fileName);
            res.json({
                message: "Analize OK:" + orderNumber.toString()
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