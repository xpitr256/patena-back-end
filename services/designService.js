const taskService = require ('./taskService');
const utilsService = require ('./utilsService');
const mailService = require('./mail/mailService');
const constants = require('../services/constants')

module.exports = {
    createDesign: async function (data) {
        try {
            const id = utilsService.uuidv4();
            await taskService.create(id, data, constants.TYPE_DESIGN);
            if (data.email) {
                const language = data.language ? data.language : 'en';
                await mailService.sendWorkInProgressMail(data.email, language, constants.TYPE_DESIGN, id);
            }
            return id;
        } catch (e) {
            return new Error(e);
        }
    }
};