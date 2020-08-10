const start = require("./taskAnalyzer");
const functions = require("./workerFunctions");
const logger = require("./../services/log/logService");

start()
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
