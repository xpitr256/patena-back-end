const validationService = require('../services/validation/validationService.js');
const designService = require ('../services/designService');

function postDesign(req, res) {
    if (validationService.isValidDesign(req.body)) {
        try {
            //TODO call designService.createDesign(req.body)
            let orderNumber = designService.sendOrderNumber(req.body.email);
            res.json({
                orderNumber: orderNumber.toString()
            });
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({
            message:'Invalid Design information'
        });
    }
}

module.exports = {
    postDesign: postDesign
};