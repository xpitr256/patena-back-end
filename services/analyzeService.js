const taskService = require ('../services/taskService');
const utilsService = require('../services/utilsService');
const mailService = require('../services/mail/mailService');

module.exports = {
    createAnalysis: async function(email, sequence) {
        try {
            const taskData = {
                sequence: sequence,
                email: email
            }
            const id = utilsService.uuidv4();
            await taskService.create(id, taskData, taskService.TYPE_ANALYSIS);
            if (email) {
                const english = 'en'; //TODO read it from client.
                await mailService.sendWorkInProgressMail(email, english, taskService.TYPE_ANALYSIS, id);
            }
            return id;
        } catch (e) {
            return new Error(e);
        }
    },
};