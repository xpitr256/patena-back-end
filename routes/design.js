const validationService = require('../services/validation/validationService.js');
const designService = require ('../services/designService');
const DOMPurify = require('isomorphic-dompurify');

function postDesign(req, res) {
    req.body.designType = DOMPurify.sanitize(req.body.designType);
    if (validationService.isValidDesign(req.body)) {
        try {
            let orderNumber = designService.createDesign(req.body);
            res.json({
                orderNumber: orderNumber.toString()
            });
        } catch (err) {
            res.status(500).send(err);
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