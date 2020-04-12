const taskService = require ('../services/taskService');
const utilsService = require('../services/utilsService')

module.exports = {
    sendOrderNumber: async function(email, sequence) {
        const id = utilsService.uuidv4();
        await taskService.save(id, sequence, taskService.TYPE_ANALYSIS, email);
        return id;
    },
    createAnalysis: async function(email, sequence) {
        const id = utilsService.uuidv4();
        await taskService.save(id, sequence, taskService.TYPE_ANALYSIS, email);
        return id;
    },
};