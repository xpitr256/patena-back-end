const taskService = require ('../services/taskService');
const utilsService = require ('../services/utilsService');

module.exports = {
    sendOrderNumber: async function(data) {
        const id = utilsService.uuidv4();
        await taskService.save(id, data, taskService.TYPE_DESIGN);
        return id;
    },
    createDesign: async function (data) {
        const id = utilsService.uuidv4();
        await taskService.save(id, data, taskService.TYPE_DESIGN);
        return id;
    }
};