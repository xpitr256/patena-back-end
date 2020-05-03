const taskService = require ('../services/taskService');
const utilsService = require ('../services/utilsService');
const mailService = require('../services/mail/mailService');

module.exports = {
    createDesign: async function (data) {
        try {
            const id = utilsService.uuidv4();
            await taskService.create(id, data, taskService.TYPE_DESIGN);
            if (data.email) {
                const language = data.language ? data.language : 'en';
                await mailService.sendWorkInProgressMail(data.email, language, taskService.TYPE_DESIGN, id);
            }
            return id;
        } catch (e) {
            return new Error(e);
        }
    }
};