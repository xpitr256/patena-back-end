const config = require("../config/config");
const workers = config.WEB_CONCURRENCY;
const throng = require("throng");
const Queue = require("bull");
const constants = require("../services/constants");
const startWith = require("./taskExecutor");
const logger = require("../services/log/logService");

async function start() {
  const workQueue = new Queue(constants.PATENA_QUEUE_NAME, config.REDIS_URL);
  await startWith(workQueue);
}

logger.log("[Task Executor Worker] STARTING Task Executor worker Id=[" + process.pid + "] with WEB_CONCURRENCY: " + workers);
// Initialize the clustered worker process
throng({ workers, start });
