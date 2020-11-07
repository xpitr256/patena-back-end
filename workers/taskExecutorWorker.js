const workers = config.WEB_CONCURRENCY;
const throng = require('throng');
const Queue = require("bull");
const constants = require("../services/constants");
const startWith = require("./taskExecutor");

async function start () {
    const workQueue = new Queue(constants.PATENA_QUEUE_NAME, config.REDIS_URL);
    await startWith(workQueue);
}
// Initialize the clustered worker process
throng({ workers, start });