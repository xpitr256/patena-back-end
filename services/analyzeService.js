const taskService = require ('./taskService');
const idGenerator = require('./idGeneratorService');
const mailService = require('./mail/mailService');
const constants = require('./constants');

module.exports = {
    createAnalysis: async function(email, sequence) {
        try {
            const taskData = {
                sequence: sequence,
                email: email
            }
            const id = idGenerator.uuidv4();
            await taskService.create(id, taskData, constants.TYPE_ANALYSIS);
            if (email) {
                const english = 'en'; //TODO read it from client.
                await mailService.sendWorkInProgressMail(email, english, constants.TYPE_ANALYSIS, id);
            }
            return id;
        } catch (e) {
            return new Error(e);
        }
    },
};