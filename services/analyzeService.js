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
                const language = data.language ? data.language : 'en';
                await mailService.sendWorkInProgressMail(email, language, constants.TYPE_ANALYSIS, id);
            }
            return id;
        } catch (e) {
            return new Error(e);
        }
    },
};