let validationService = require('../services/validationService.js');
let designService = require ('../services/designService');
let design1 = require('../services/validationServiceDesignNothing.js');
let design2 = require('../services/validationServiceDesignInitialSequence.js');
let design3 = require('../services/validationServiceDesignSequencesFlanking.js');
let design4 = require('../services/validationServiceDesignInitialSequenceAndFlanking');

function getMapDesign(req){
    let MapDesign = new Map();
        MapDesign.set('design1',design1.validate(req.body));
        MapDesign.set('design2',design2.validate(req.body));
        MapDesign.set('design3',design3.validate(req.body));
        MapDesign.set('design4',design4.validate(req.body));
    return MapDesign;
}


function postDesign(req, res) {
    let MapDesign = getMapDesign(req)

    if (req.body) {
        if ( MapDesign.get(req.body.designType)) {
            try {
                let orderNumber = designService.sendOrderNumber(req.body.email);
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
    postDesign: postDesign
};