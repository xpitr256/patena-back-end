const Task = require('../model/schema/Task');
const TYPE_ANALYSIS = 1;
const TYPE_DESIGN = 2;
const STATE_NOT_FOUND = 0;
const STATE_PENDING = 1;
const STATE_IN_PROGRESS = 2;
const STATE_FINISHED = 3;
const STATE_CANCELLED = 4;

module.exports = {
    TYPE_ANALYSIS,
    TYPE_DESIGN,
    STATE_NOT_FOUND,
    STATE_PENDING,
    STATE_IN_PROGRESS,
    STATE_FINISHED,
    STATE_CANCELLED,
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
        const tasks = await Task.find({id: taskId});
        return tasks.length > 0 ? tasks[0]["_doc"] : undefined;
    }
}