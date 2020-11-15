const config = require("../config/config");
const workers = config.WEB_CONCURRENCY;
const throng = require("throng");
const startWith = require("./taskExecutor");
const logger = require("../services/log/logService");
const Queue = require("../model/Queue");

function start() {
  startWith(Queue.getQueue());
}

logger.log("[Task Executor Worker] STARTING Task Executor worker Id=[" + process.pid + "] with WEB_CONCURRENCY: " + workers);

// Initialize the clustered worker process
throng({ workers, start });
