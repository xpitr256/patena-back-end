const utils = require('./validationUtils');

const noInitialSequenceDesign = {
    validate: function (data) {
        return isValidOptionalEmail(data.email) && utils.isPositiveDecimal(data.distance);
    }
}

const initialSequenceDesign = {
    validate: function(data) {
        return isValidOptionalEmail(data.email) && isValidFasta(data.initialSequence);
    }
}

const flankingSequencesDesign = {
    validate: function(data) {
        return isValidOptionalEmail(data.email) && isValidFasta(data.flankingSequence1) && isValidFasta(data.flankingSequence2);
    }
}

const initialAndFlankingSequencesDesign = {
    validate: function(data) {
        return isValidOptionalEmail(data.email) &&  isValidFasta(data.flankingSequence1) && isValidFasta(data.flankingSequence2) && isValidFasta(data.initialSequence);
    }
}

const aminoAcids = [
    "A",
    "R",
    "N",
    "D",
    "B",
    "C",
    "E",
    "Q",
    "Z",
    "G",
    "H",
    "I",
    "L",
    "K",
    "M",
    "F",
    "P",
    "S",
    "T",
    "W",
    "Y",
    "V"
];

const designValidationMap = new Map();
designValidationMap.set(1, noInitialSequenceDesign.validate);
designValidationMap.set(2, initialSequenceDesign.validate);
designValidationMap.set(3, flankingSequencesDesign.validate);
designValidationMap.set(4, initialAndFlankingSequencesDesign.validate);

function isValidOptionalEmail(email) {
    if (email) {
        return utils.isValidMail(email);
    }
    return true; // if there is no email then the validation is Ok.
}

function isValidNetCharge (netCharge = undefined, initialSequence= undefined){
    if (netCharge === undefined || initialSequence === undefined || initialSequence.value === undefined ){
        return true
    }
    return utils.isInt(netCharge) && netCharge <= initialSequence.value.length;
}

function areValidAlgorithms(algorithms) {
    return algorithms.some((item) => item.active === true);
}

function areValidFrequencies(frequencies) {
    let result = 0
    for (const amino in frequencies) {
        result += parseFloat(amino.value);
    }
    return result.toFixed(1) === "100.0"
}
function isValidCustomConfig(data) {
    if (data.config) {
        return areValidFrequencies(data.config.frequencies) &&
            isValidNetCharge(data.config.netCharge, data.initialSequence) &&
            areValidAlgorithms(data.config.algorithms);
    }
    return true; // if no config then we use default Patena's settings.
}

function isValidFasta(sequence) {
    if (!sequence) {
        return false;
    }
    const lines = sequence.value.toString().split("\n");
    const linesWithoutComments = lines.filter(line => !line.startsWith(">"));
    const allContent = linesWithoutComments.join("").trim();
    if (!allContent) {
        return false;
    }
    for (const aminoAcid of allContent) {
        if (!aminoAcids.includes(aminoAcid)) {
            return false;
        }
    }
    return true;
}

module.exports = {
    isValidDesign: function(data) {
        return designValidationMap.has(data.designType) && designValidationMap.get(data.designType).validate(data) && isValidCustomConfig(data);
    },
    isValidFasta: function(data) {
        return isValidFasta(data);
    }
}