const taskService = require('./taskService');

module.exports = {
    getResultsFor : async function (orderNumber) {
        //TODO create a result response from Task
        return await taskService.getTask(orderNumber);
    }
}