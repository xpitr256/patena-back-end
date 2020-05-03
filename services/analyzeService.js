const taskService = require ('../services/taskService');
const utilsService = require('../services/utilsService')

module.exports = {
    createAnalysis: async function(email, sequence) {
        try {
            const taskData = {
                sequence: sequence,
                email: email
            }
            const id = utilsService.uuidv4();
            await taskService.create(id, taskData, taskService.TYPE_ANALYSIS);
            return id;
        } catch (e) {
            return new Error(e);
        }
    },
};