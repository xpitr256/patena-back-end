const utils = require("./validationUtils");

function validateFlankingSequences(data) {
  return (
    isValidFasta(data.flankingSequence1) && isValidFasta(data.flankingSequence2)
  );
}

const noInitialSequenceDesign = {
  validate: function (data) {
    return (
      isValidOptionalEmail(data.email) && utils.isPositiveDecimal(data.distance)
    );
  },
};

const initialSequenceDesign = {
  validate: function (data) {
    return (
      isValidOptionalEmail(data.email) && isValidFasta(data.initialSequence)
    );
  },
};

const flankingSequencesDesign = {
  validate: function (data) {
    return (
      noInitialSequenceDesign.validate(data) && validateFlankingSequences(data)
    );
  },
};

const initialAndFlankingSequencesDesign = {
  validate: function (data) {
    return (
      initialSequenceDesign.validate(data) && validateFlankingSequences(data)
    );
  },
};

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

function isValidNetCharge(netCharge, initialSequence) {
  function isNotDefined(value) {
    return value === undefined || value === null;
  }

  if (isNotDefined(netCharge) && initialSequence) {
    return false;
  }

  if (netCharge && !initialSequence) {
    return false;
  }

  if (netCharge && initialSequence && !initialSequence.value) {
    return false;
  }

  if (isNotDefined(netCharge) && !initialSequence) {
    return true;
  }

  return (
    utils.isInt(netCharge) &&
    Math.abs(netCharge) <= initialSequence.value.length
  );
}

function areValidAlgorithms(algorithms) {
  if (!algorithms) {
    return false;
  }
  return algorithms.some((item) => item.active === true);
}

function areValidFrequencies(frequencies) {
  if (!frequencies) {
    return false;
  }
  let result = 0;
  for (const amino of frequencies) {
    result += parseFloat(amino.value);
  }
  return result.toFixed(1) === "100.0";
}
function isValidCustomConfig(data) {
  if (data.config) {
    return (
      areValidFrequencies(data.config.frequencies) &&
      isValidNetCharge(data.config.netCharge, data.initialSequence) &&
      areValidAlgorithms(data.config.algorithms)
    );
  }
  return true; // if no config then we use default Patena's settings.
}

function isValidFasta(sequence) {
  if (!sequence) {
    return false;
  }
  const lines = sequence.value.toString().split("\n");
  const linesWithoutComments = lines.filter((line) => !line.startsWith(">"));
  const allContent = linesWithoutComments.join("").trim();
  if (!allContent) {
    return false;
  }
  for (const aminoAcid of allContent) {
    if (!utils.getAminoAcids().includes(aminoAcid)) {
      return false;
    }
  }
  return true;
}

module.exports = {
  isValidDesign: function (data) {
    if (data && designValidationMap.has(data.designType)) {
      const validateFunc = designValidationMap.get(data.designType);
      return validateFunc(data) && isValidCustomConfig(data);
    }
    return false;
  },
  isValidFasta: function (data) {
    return isValidFasta(data);
  },
};
