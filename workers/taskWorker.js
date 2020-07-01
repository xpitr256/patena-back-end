
const start = require('./taskAnalyzer');
const functions = require('./workerFunctions');

start().then( () => {
    functions.log("Worker finished: " + new Date());
    functions.exit();
}).catch( error => {
    functions.error("An error occurred running the taskWorker: " + new Date());
    functions.error(error);
    functions.exit(1);
});
