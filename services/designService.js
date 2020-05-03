const taskService = require ('../services/taskService');
const utilsService = require ('../services/utilsService');

module.exports = {
    createDesign: async function (data) {
        try {
            const id = utilsService.uuidv4();
            await taskService.create(id, data, taskService.TYPE_DESIGN);
            return id;
        } catch (e) {
            return new Error(e);
        }
    }
};