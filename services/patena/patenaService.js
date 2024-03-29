const constants = require("../constants");
const utils = require("../validation/validationUtils");
const lengthService = require("../linkerLengthService");
const logger = require("../log/logService");
const pythonRunner = require("./pythonRunner");

function runPatenaFor(args, workId) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: "text",
      args: args,
    };
    logger.log("[Patena Service] before calling pythonRunner");
    pythonRunner.run("./patena/patena.py", options, function (err, results) {
      if (err) {
        logger.error("There was an ERROR running PATENA for workId=" + workId);
        logger.error(err);
        reject(err);
      }
      logger.log("[Patena Service] successfully ran PATENA, results=" + results);
      resolve();
    });
  });
}

function combineSequences(initial, sequence, final, length) {
  const pre = initial.slice(Number(-1 * length));
  const pos = final.slice(0, length);
  return pre + sequence + pos;
}

function generateRandomSequence(length) {
  let sequence = "";
  if (length > 0) {
    const amountOfAminoAcids = utils.getAminoAcids().length;
    for (let i = 0; i < length; i++) {
      const aminoAcidPosition = Math.floor(Math.random() * amountOfAminoAcids);
      sequence = sequence + utils.getAminoAcids()[aminoAcidPosition];
    }
  }
  return sequence;
}

function getSequenceFrom(task) {
  if (task.typeId === constants.TYPE_ANALYSIS) {
    return task.taskData.sequence.value;
  }
  switch (task.taskData.designType) {
    case constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE:
      return task.taskData.initialSequence.value;
    case constants.DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES:
      return combineSequences(
        task.taskData.flankingSequence1.value,
        task.taskData.initialSequence.value,
        task.taskData.flankingSequence2.value,
        constants.FLANKING_WINDOW_SIZE
      );
    case constants.DESIGN_TYPE_ONLY_FLANKING_SEQUENCES:
      const randomSequence = generateRandomSequence(lengthService.getLength(task.taskData.distance));
      return combineSequences(task.taskData.flankingSequence1.value, randomSequence, task.taskData.flankingSequence2.value, constants.FLANKING_WINDOW_SIZE);
    default:
      return;
  }
}

function getSequenceLengthFrom(task) {
  if (task.taskData.designType && task.taskData.designType === constants.DESIGN_TYPE_NO_INITIAL_SEQUENCE) {
    return lengthService.getLength(task.taskData.distance);
  }
}

const patenaAvoidAlgorithmMap = new Map();
patenaAvoidAlgorithmMap.set("BLAST", "--noblast");
patenaAvoidAlgorithmMap.set("TANGO", "--notango");
patenaAvoidAlgorithmMap.set("ELM", "--noelm");
patenaAvoidAlgorithmMap.set("IUPred", "--noiupred");
patenaAvoidAlgorithmMap.set("ANCHOR", "--noanchor");
patenaAvoidAlgorithmMap.set("Prosite", "--noprosite");
patenaAvoidAlgorithmMap.set("Limbo", "--nolimbo");
patenaAvoidAlgorithmMap.set("TMHMM", "--notmhmm");
patenaAvoidAlgorithmMap.set("PASTA", "--nopasta");
patenaAvoidAlgorithmMap.set("Waltz", "--nowaltz");
patenaAvoidAlgorithmMap.set("Amyloid pattern", "--noamyloidpattern");

function getMandatoryParameters(task) {
  const args = [];
  args.push("--jobid=" + task.id);
  args.push("--json");
  return args;
}

function getTaskInformationParameters(task) {
  const args = [];
  // Design / Analysis parameters
  if (task.typeId === constants.TYPE_ANALYSIS) {
    args.push("--evaluation-only");
  }

  const sequence = getSequenceFrom(task);
  if (sequence) {
    args.push("--seq=" + sequence);
  }

  const sequenceLength = getSequenceLengthFrom(task);
  if (sequenceLength) {
    args.push("--length=" + sequenceLength);
  }
  return args;
}

function getConfigParameters(task) {
  const args = [];

  if (task.taskData.config) {
    if (task.taskData.config.netCharge) {
      args.push("--net-charge=" + task.taskData.config.netCharge);
    }

    const avoidedAlgorithms = task.taskData.config.algorithms.filter((algorithm) => !algorithm.active).map((algorithm) => algorithm.name);
    avoidedAlgorithms.forEach((algorithm) => {
      if (patenaAvoidAlgorithmMap.has(algorithm)) {
        args.push(patenaAvoidAlgorithmMap.get(algorithm));
      }
    });

    //Add Blast web
    if (task.taskData.config.algorithms.some((algorithm) => algorithm.active && algorithm.name === "BLAST")) {
      args.push("--blast-web");
    }

    const frequencies = task.taskData.config.frequencies.map((frequency) => {
      let loweredName = frequency.name.toLowerCase();
      if (loweredName === "h") {
        loweredName = "hh";
      }
      return {
        name: loweredName,
        value: frequency.value,
      };
    });
    frequencies.forEach((frequency) => {
      args.push("-" + frequency.name + "=" + frequency.value);
    });
  } else {
    // If no config is specified => default config will be applied, and that includes running blast.
    args.push("--blast-web");
  }

  return args;
}

function getPatenaArgumentsFor(task) {
  let args = getMandatoryParameters(task);
  args = args.concat(getTaskInformationParameters(task));
  args = args.concat(getConfigParameters(task));
  return args;
}

module.exports = {
  start: async function (task) {
    logger.log("[Patena Service] calling getPatenaArgumentsFor=[" + task.id + "]");
    const args = getPatenaArgumentsFor(task);
    logger.log("[Patena Service] after calling getPatenaArgumentsFor=[" + task.id + "], getting args: " + JSON.stringify(args));
    await runPatenaFor(args, task.id);
    logger.log("[Patena Service] after calling runPatenaFor=[" + task.id + "]");
  },
};
