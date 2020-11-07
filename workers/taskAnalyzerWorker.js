const start = require("./taskAnalyzer");
const functions = require("./workerFunctions");
const logger = require("./../services/log/logService");
const Queue = require("bull");
const config = require("../config/config")
const constants = require("../services/constants")

const workQueue = new Queue(constants.PATENA_QUEUE_NAME, config.REDIS_URL);

start(workQueue)
  .then(() => {
    logger.log("Worker finished: " + new Date());
    logger.log("FINISHING workerId=[" + process.pid + "]");
    functions.exit();
  })
  .catch((error) => {
    logger.error("An error occurred running the taskWorker: " + new Date());
    logger.log("FINISHING WITH ERROR workerId=[" + process.pid + "]");
    logger.error(error);
    functions.exit(1);
  });
