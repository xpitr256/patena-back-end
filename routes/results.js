let express = require('express');
let router = express.Router();
let validationService = require('../services/validation/validationService.js');
let resultService = require('../services/resultService');

router.get('/', function(req, res, next) {
    if (validationService.isValidOrderNumber(req.query.orderNumber)) {
        try {
            //TODO await for result service response
            res.json({
                orderNumber: resultService.getResultsFor(req.query.orderNumber),
                message: "Order number OK"
            });

        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({
            message:'Invalid order number'
        });
    }
});


module.exports = router;
