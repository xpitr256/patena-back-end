
const start = require('./taskAnalyzer');

start().then( () => {
    console.log("Worker finished: " + new Date());
    process.exit();
}).catch( error => {
    console.error("An error occurred running the taskWorker");
    console.error(error);
    process.exit(1);
});
