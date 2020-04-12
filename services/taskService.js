const Task = require('../model/schema/Task');
const TYPE_ANALYSIS = 1;
const TYPE_DESIGN = 2;

module.exports = {
    TYPE_ANALYSIS,
    TYPE_DESIGN,
    save: async function (id, body, typeId) {
        let task;
        try {
            task = new Task({
                taskId: id,
                typeId: typeId,
                body: body,
                language: body.language

            });
            await task.save();
        } catch (e) {
            console.error(e);
            return e;
        }
    },
    getTask: async function (taskId) {
        return await Task.find({taskId: taskId});
    }
}