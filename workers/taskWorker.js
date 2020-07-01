
const start = require('./taskAnalyzer');
const functions = require('./workerFunctions');
const logger = require('./../services/log/logService');

start().then( () => {
    logger.log("Worker finished: " + new Date());
    functions.exit();
}).catch( error => {
    logger.error("An error occurred running the taskWorker: " + new Date());
    logger.error(error);
    functions.exit(1);
});
