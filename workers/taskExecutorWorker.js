const config = require("../config/config");
const workers = config.WEB_CONCURRENCY;
const throng = require("throng");
const startWith = require("./taskExecutor");
const logger = require("../services/log/logService");
const Queue = require("../model/Queue");
const shell = require('shelljs')

function start() {
  startWith(Queue.getQueue());
}

logger.log("[Task Executor Worker] STARTING Task Executor worker Id=[" + process.pid + "] with WEB_CONCURRENCY: " + workers);
logger.log("[Task Executor Worker] RUNNING PATENA install.sh");
const { stdout, stderr, code } = shell.exec('./../patena/install.sh')
logger.log("[Task Executor Worker] AFTER RUNNING PATENA install.sh stdout: " + stdout);
logger.log("[Task Executor Worker] AFTER RUNNING PATENA install.sh stderr: " + stderr);
logger.log("[Task Executor Worker] AFTER RUNNING PATENA install.sh code: " + code);

// Initialize the clustered worker process
throng({ workers, start });
