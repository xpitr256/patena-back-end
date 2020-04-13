let express = require('express');
let router = express.Router();
let validationService = require('../services/validation/validationService.js');
let resultService = require('../services/resultService');
/*
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
*/
router.get('/', function(req, res, next) {
    if (validationService.isValidOrderNumber(req.query.orderNumber)) {
            res.json({
                "orderNumber": req.query.orderNumber,
                "initialSequence":"WGKLLVTTINKLNSFRQTLTPP",
                "mode":"design",
                "initialScore":131.0,
                "mutationsHistory":[
                    {
                        "mutated_sequence":"WGKTLVTTINKLNSFRQTLTPP",
                        "mutated_position":3,
                        "previous_residue":"L",
                        "replacement_aa":"T",
                        "method":"score_difference",
                        "score_after_mutation": 120
                    },
                    {
                        "mutated_sequence":"WGKTLVTTINKLNSFKQTLTPP",
                        "mutated_position":15,
                        "previous_residue":"R",
                        "replacement_aa":"K",
                        "method":"score_difference",
                        "score_after_mutation": 110
                    },
                    {
                        "mutated_sequence":"WGKALVTTINKLNSFKQTLTPP",
                        "mutated_position":3,
                        "previous_residue":"T",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 100
                    },
                    {
                        "mutated_sequence":"WGKALVTSINKLNSFKQTLTPP",
                        "mutated_position":7,
                        "previous_residue":"T",
                        "replacement_aa":"S",
                        "method":"score_difference",
                        "score_after_mutation": 94.3
                    },
                    {
                        "mutated_sequence":"WGKALVTSINKLNSFKQTLKPP",
                        "mutated_position":19,
                        "previous_residue":"T",
                        "replacement_aa":"K",
                        "method":"score_difference",
                        "score_after_mutation": 91.2
                    },
                    {
                        "mutated_sequence":"WGKALVTSINKLNSFKQTLEPP",
                        "mutated_position":19,
                        "previous_residue":"K",
                        "replacement_aa":"E",
                        "method":"score_difference",
                        "score_after_mutation": 88
                    },
                    {
                        "mutated_sequence":"WGKALVTSINKLNGFKQTLEPP",
                        "mutated_position":13,
                        "previous_residue":"S",
                        "replacement_aa":"G",
                        "method":"score_difference",
                        "score_after_mutation": 76.3
                    },
                    {
                        "mutated_sequence":"WGKALVTSIRKLNGFKQTLEPP",
                        "mutated_position":9,
                        "previous_residue":"N",
                        "replacement_aa":"R",
                        "method":"score_difference",
                        "score_after_mutation": 66.7
                    },
                    {
                        "mutated_sequence":"WGKALVTSIRKLNGFKQTLEAP",
                        "mutated_position":20,
                        "previous_residue":"P",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 60
                    },
                    {
                        "mutated_sequence":"WGKALVTQIRKLNGFKQTLEAP",
                        "mutated_position":7,
                        "previous_residue":"S",
                        "replacement_aa":"Q",
                        "method":"score_difference",
                        "score_after_mutation": 58
                    },
                    {
                        "mutated_sequence":"WGKALPTQIRKLNGFKQTLEAP",
                        "mutated_position":5,
                        "previous_residue":"V",
                        "replacement_aa":"P",
                        "method":"score_difference",
                        "score_after_mutation": 55
                    },
                    {
                        "mutated_sequence":"WGKALPTQIRKLNQFKQTLEAP",
                        "mutated_position":13,
                        "previous_residue":"G",
                        "replacement_aa":"Q",
                        "method":"score_difference",
                        "score_after_mutation": 49
                    },
                    {
                        "mutated_sequence":"WGKALDTQIRKLNQFKQTLEAP",
                        "mutated_position":5,
                        "previous_residue":"P",
                        "replacement_aa":"D",
                        "method":"score_difference",
                        "score_after_mutation": 44
                    },
                    {
                        "mutated_sequence":"WGRALDTQIRKLNQFKQTLEAP",
                        "mutated_position":2,
                        "previous_residue":"K",
                        "replacement_aa":"R",
                        "method":"score_difference",
                        "score_after_mutation": 42.4
                    },
                    {
                        "mutated_sequence":"WGRALDTQIRKLNQFKQTAEAP",
                        "mutated_position":18,
                        "previous_residue":"L",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 40
                    },
                    {
                        "mutated_sequence":"WGRALDTVIRKLNQFKQTAEAP",
                        "mutated_position":7,
                        "previous_residue":"Q",
                        "replacement_aa":"V",
                        "method":"score_difference",
                        "score_after_mutation": 39.8
                    },
                    {
                        "mutated_sequence":"WGRALDTVIRKLNQFKQTAENP",
                        "mutated_position":20,
                        "previous_residue":"A",
                        "replacement_aa":"N",
                        "method":"score_difference",
                        "score_after_mutation": 37
                    },
                    {
                        "mutated_sequence":"WGRALDTVIRCLNQFKQTAENP",
                        "mutated_position":10,
                        "previous_residue":"K",
                        "replacement_aa":"C",
                        "method":"score_difference",
                        "score_after_mutation": 33
                    },
                    {
                        "mutated_sequence":"WGRALDKVIRCLNQFKQTAENP",
                        "mutated_position":6,
                        "previous_residue":"T",
                        "replacement_aa":"K",
                        "method":"score_difference",
                        "score_after_mutation": 33
                    },
                    {
                        "mutated_sequence":"WGRALDKVIRCLNQFKQTALNP",
                        "mutated_position":19,
                        "previous_residue":"E",
                        "replacement_aa":"L",
                        "method":"score_difference",
                        "score_after_mutation": 33
                    },
                    {
                        "mutated_sequence":"WGRALDKVIRTLNQFKQTALNP",
                        "mutated_position":10,
                        "previous_residue":"C",
                        "replacement_aa":"T",
                        "method":"score_difference",
                        "score_after_mutation": 33
                    },
                    {
                        "mutated_sequence":"MGRALDKVIRTLNQFKQTALNP",
                        "mutated_position":0,
                        "previous_residue":"W",
                        "replacement_aa":"M",
                        "method":"score_difference",
                        "score_after_mutation": 33
                    },
                    {
                        "mutated_sequence":"MGLALDKVIRTLNQFKQTALNP",
                        "mutated_position":2,
                        "previous_residue":"R",
                        "replacement_aa":"L",
                        "method":"score_difference",
                        "score_after_mutation": 33
                    },
                    {
                        "mutated_sequence":"MGLALDKVIRTLNQFKQQALNP",
                        "mutated_position":17,
                        "previous_residue":"T",
                        "replacement_aa":"Q",
                        "method":"MC",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"MGLALDKVIRTLNQFKQQALVP",
                        "mutated_position":20,
                        "previous_residue":"N",
                        "replacement_aa":"V",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"MGLALDKVIRTLNQFKQQALFP",
                        "mutated_position":20,
                        "previous_residue":"V",
                        "replacement_aa":"F",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"MGYALDKVIRTLNQFKQQALFP",
                        "mutated_position":2,
                        "previous_residue":"L",
                        "replacement_aa":"Y",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"MGYALDKVIRTLNQFKQQALFN",
                        "mutated_position":21,
                        "previous_residue":"P",
                        "replacement_aa":"N",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"MGYALDKVIRTLNQFKQQALPN",
                        "mutated_position":20,
                        "previous_residue":"F",
                        "replacement_aa":"P",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"AGYALDKVIRTLNQFKQQALPN",
                        "mutated_position":0,
                        "previous_residue":"M",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"AGYALDKVIRTLNQFKQQALPG",
                        "mutated_position":21,
                        "previous_residue":"N",
                        "replacement_aa":"G",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"AGYALDKVIRTLNQFPQQALPG",
                        "mutated_position":15,
                        "previous_residue":"K",
                        "replacement_aa":"P",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"AGYALDKVIRTVNQFPQQALPG",
                        "mutated_position":11,
                        "previous_residue":"L",
                        "replacement_aa":"V",
                        "method":"score_difference",
                        "score_after_mutation": 30
                    },
                    {
                        "mutated_sequence":"AGYALDKVIRTVNGFPQQALPG",
                        "mutated_position":13,
                        "previous_residue":"Q",
                        "replacement_aa":"G",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALDKVIRTVNGFPQQALPG",
                        "mutated_position":1,
                        "previous_residue":"G",
                        "replacement_aa":"P",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALGKVIRTVNGFPQQALPG",
                        "mutated_position":5,
                        "previous_residue":"D",
                        "replacement_aa":"G",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALGKVLRTVNGFPQQALPG",
                        "mutated_position":8,
                        "previous_residue":"I",
                        "replacement_aa":"L",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALGKVLRTVNGFPQQALPA",
                        "mutated_position":21,
                        "previous_residue":"G",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALGKVLREVNGFPQQALPA",
                        "mutated_position":10,
                        "previous_residue":"T",
                        "replacement_aa":"E",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALGKVLREVNGFPQQAMPA",
                        "mutated_position":19,
                        "previous_residue":"L",
                        "replacement_aa":"M",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"APYALGKVLQEVNGFPQQAMPA",
                        "mutated_position":9,
                        "previous_residue":"R",
                        "replacement_aa":"Q",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"LPYALGKVLQEVNGFPQQAMPA",
                        "mutated_position":0,
                        "previous_residue":"A",
                        "replacement_aa":"L",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"LPYALGKVLSEVNGFPQQAMPA",
                        "mutated_position":9,
                        "previous_residue":"Q",
                        "replacement_aa":"S",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"LPYALGKVLSEVNGFPQKAMPA",
                        "mutated_position":17,
                        "previous_residue":"Q",
                        "replacement_aa":"K",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYALGKVLSEVNGFPQKAMPA",
                        "mutated_position":0,
                        "previous_residue":"L",
                        "replacement_aa":"G",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYALGKVLSRVNGFPQKAMPA",
                        "mutated_position":10,
                        "previous_residue":"E",
                        "replacement_aa":"R",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYALGKVLSRVNGFPWKAMPA",
                        "mutated_position":16,
                        "previous_residue":"Q",
                        "replacement_aa":"W",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYAMGKVLSRVNGFPWKAMPA",
                        "mutated_position":4,
                        "previous_residue":"L",
                        "replacement_aa":"M",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYAMGKVISRVNGFPWKAMPA",
                        "mutated_position":8,
                        "previous_residue":"L",
                        "replacement_aa":"I",
                        "method":"MC",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYAMGKVNSRVNGFPWKAMPA",
                        "mutated_position":8,
                        "previous_residue":"I",
                        "replacement_aa":"N",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GPYAMGKVDSRVNGFPWKAMPA",
                        "mutated_position":8,
                        "previous_residue":"N",
                        "replacement_aa":"D",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GDYAMGKVDSRVNGFPWKAMPA",
                        "mutated_position":1,
                        "previous_residue":"P",
                        "replacement_aa":"D",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVDSRVNGFPWKAMPA",
                        "mutated_position":1,
                        "previous_residue":"D",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVVSRVNGFPWKAMPA",
                        "mutated_position":8,
                        "previous_residue":"D",
                        "replacement_aa":"V",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVVSRVNGFPWKAMPP",
                        "mutated_position":21,
                        "previous_residue":"A",
                        "replacement_aa":"P",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASRVNGFPWKAMPP",
                        "mutated_position":8,
                        "previous_residue":"V",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASSVNGFPWKAMPP",
                        "mutated_position":10,
                        "previous_residue":"R",
                        "replacement_aa":"S",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASSVNGKPWKAMPP",
                        "mutated_position":14,
                        "previous_residue":"F",
                        "replacement_aa":"K",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASSVNGAPWKAMPP",
                        "mutated_position":14,
                        "previous_residue":"K",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASSVNGFPWKAMPP",
                        "mutated_position":14,
                        "previous_residue":"A",
                        "replacement_aa":"F",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASSNNGFPWKAMPP",
                        "mutated_position":11,
                        "previous_residue":"V",
                        "replacement_aa":"N",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVASSNLGFPWKAMPP",
                        "mutated_position":12,
                        "previous_residue":"N",
                        "replacement_aa":"L",
                        "method":"score_difference",
                        "score_after_mutation": 25
                    },
                    {
                        "mutated_sequence":"GAYAMGKVTSSNLGFPWKAMPP",
                        "mutated_position":8,
                        "previous_residue":"A",
                        "replacement_aa":"T",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GAYAMGKVTSSNLGFPWKAMPI",
                        "mutated_position":21,
                        "previous_residue":"P",
                        "replacement_aa":"I",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GAYAMGKVTSSNLGFPAKAMPI",
                        "mutated_position":16,
                        "previous_residue":"W",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVTSSNLGFPAKAMPI",
                        "mutated_position":2,
                        "previous_residue":"Y",
                        "replacement_aa":"T",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVTSSNLGFPLKAMPI",
                        "mutated_position":16,
                        "previous_residue":"A",
                        "replacement_aa":"L",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVTSSNLGFPLKAMPV",
                        "mutated_position":21,
                        "previous_residue":"I",
                        "replacement_aa":"V",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVSSSNLGFPLKAMPV",
                        "mutated_position":8,
                        "previous_residue":"T",
                        "replacement_aa":"S",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVQSSNLGFPLKAMPV",
                        "mutated_position":8,
                        "previous_residue":"S",
                        "replacement_aa":"Q",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVQSSNLGFPLAAMPV",
                        "mutated_position":17,
                        "previous_residue":"K",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GATAMGKVQSSNLGFPLANMPV",
                        "mutated_position":18,
                        "previous_residue":"A",
                        "replacement_aa":"N",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQSSNLGFPLANMPV",
                        "mutated_position":2,
                        "previous_residue":"T",
                        "replacement_aa":"F",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQSSNAGFPLANMPV",
                        "mutated_position":12,
                        "previous_residue":"L",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 20
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQSDNAGFPLANMPV",
                        "mutated_position":10,
                        "previous_residue":"S",
                        "replacement_aa":"D",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQKDNAGFPLANMPV",
                        "mutated_position":9,
                        "previous_residue":"S",
                        "replacement_aa":"K",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQKDNAAFPLANMPV",
                        "mutated_position":13,
                        "previous_residue":"G",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQKDEAAFPLANMPV",
                        "mutated_position":11,
                        "previous_residue":"N",
                        "replacement_aa":"E",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKVQKDEAAFPLAQMPV",
                        "mutated_position":18,
                        "previous_residue":"N",
                        "replacement_aa":"Q",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKWQKDEAAFPLAQMPV",
                        "mutated_position":7,
                        "previous_residue":"V",
                        "replacement_aa":"W",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKWQKDEAMFPLAQMPV",
                        "mutated_position":13,
                        "previous_residue":"A",
                        "replacement_aa":"M",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKWQQDEAMFPLAQMPV",
                        "mutated_position":9,
                        "previous_residue":"K",
                        "replacement_aa":"Q",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKWQHDEAMFPLAQMPV",
                        "mutated_position":9,
                        "previous_residue":"Q",
                        "replacement_aa":"H",
                        "method":"score_difference",
                        "score_after_mutation": 10
                    },
                    {
                        "mutated_sequence":"GAFAMGKWAHDEAMFPLAQMPV",
                        "mutated_position":8,
                        "previous_residue":"Q",
                        "replacement_aa":"A",
                        "method":"score_difference",
                        "score_after_mutation": 5
                    }
                ],
                "finalScore":0.0,
                "finalSequence":"GAFAMGKWAHDEAMFPLAQMPV"
            });
    } else {
        res.status(400).send({
            message:'Invalid order number'
        });
    }
});







module.exports = router;
