const start = require("./taskAnalyzer");
const functions = require("./workerFunctions");
const logger = require("./../services/log/logService");
const Queue = require("bull");
const config = require("../config/config");
const constants = require("../services/constants");

const workQueue = new Queue(constants.PATENA_QUEUE_NAME, config.REDIS_URL);
logger.log("[Task Analyzer Worker] STARTING Task Executor worker Id=[" + process.pid + "] and Queue name: " + workQueue.name);
start(workQueue)
  .then(() => {
    logger.log("[Task Analyzer Worker] Worker finished: " + new Date());
    logger.log("[Task Analyzer Worker] FINISHING workerId=[" + process.pid + "]");
    functions.exit();
  })
  .catch((error) => {
    logger.error("[Task Analyzer Worker] An error occurred running the taskWorker: " + new Date());
    logger.log("[Task Analyzer Worker] FINISHING WITH ERROR workerId=[" + process.pid + "]");
    logger.error(error);
    functions.exit(1);
  });
