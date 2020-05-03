const validationService = require('../services/validation/validationService.js');
const analyzeService = require ('../services/analyzeService');
const DOMPurify = require('isomorphic-dompurify');

async function postAnalyze(req, res) {

    if (req.body.sequence) {

        const sequenceValue = DOMPurify.sanitize(req.body.sequence.value);
        const sequenceName = DOMPurify.sanitize(req.body.sequence.name);
        const sequence = {
            name: sequenceName,
            value: sequenceValue
        };
        const email = DOMPurify.sanitize(req.body.email);

        if (validationService.isValidAnalyzeData(email, sequence)) {
            try {
                let orderNumber = await analyzeService.createAnalysis(email, sequence);
                res.json({
                    orderNumber: orderNumber.toString()
                });
            } catch (err) {
                res.status(500).send(err);
            }
        } else {
            res.status(400).send({
                message:'Invalid analyze information (wrong email or invalid sequence)'
            });
        }
    } else {
        res.status(400).send({ message: 'There is no sequence to analyze'});
    }
}

module.exports = {
    postAnalyze: postAnalyze
};