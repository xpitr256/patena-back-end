const Task = require('../model/schema/Task');
const TYPE_ANALYSIS = 1;
const TYPE_DESIGN = 2;

module.exports = {
    TYPE_ANALYSIS,
    TYPE_DESIGN,
    create: async function (id, taskData, typeId) {
        let task;
        try {
            task = new Task({
                id: id,
                typeId: typeId,
                taskData: taskData,
                language: taskData.language
            });
            await task.save();
        } catch (e) {
            console.error("Error creating a new Task: " + JSON.stringify(taskData));
            return e;
        }
    },
    getTask: async function (taskId) {
        return await Task.find({taskId: taskId});
    }
}