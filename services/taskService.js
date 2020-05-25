const patenaService = require('./patenaService');
const Task = require('../model/schema/Task');
const constants = require('./constants');

async function updateTaskState(task, state) {
    task.stateId = state;
    await task.save();
    return task;
}

module.exports = {
    create: async function (id, taskData, typeId) {
        let task;
        try {
            task = new Task({
                id: id,
                stateId: constants.STATE_PENDING,
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
        const tasks = await Task.find({
            id: taskId
        });
        return tasks.length > 0 ? tasks[0]["_doc"] : undefined;
    },
    getTaskInProgress: async function() {
        const tasks = await Task.find({
            stateId: constants.STATE_IN_PROGRESS
        });
        return tasks.length > 0 ? tasks[0] : undefined;
    },
    promoteTaskToInProgress: async function(task) {
        return updateTaskState(task, constants.STATE_IN_PROGRESS);
    },
    updateFailingTask: async function(task, error) {
        task.attempts = task.attempts + 1;
        task.lastExecutionDate = new Date();
        task.messageError = error;
        let nextState = constants.STATE_PENDING;
        if (task.attempts > 2) {
            nextState = constants.STATE_CANCELLED
        }
        return updateTaskState(task, nextState);
    },
    thereIsNoTaskInProgress: async function() {
        const tasks = await Task.find({
            stateId: constants.STATE_IN_PROGRESS
        });
        //TODO CHANGE AFTER local test
        //return tasks.length === 0;
        return true;
    },
    getNextPendingTask: async function() {
        const tasks = await Task.find({
            stateId: constants.STATE_PENDING
        }).sort({
            creationDate: 'asc'
        }).limit(1);
        return tasks.length > 0 ? tasks[0] : undefined;
    },
    taskIsCancelled: function(task) {
        return task.stateId === constants.STATE_CANCELLED;
    },
    updateSentEmailNotification: async function (task) {
        task.emailSent = true;
        task.sentEmailDate = new Date();
        await task.save();
        return task;
    },
    runTask: async function (task) {
        await patenaService.start(task)
        // TODO look for PATENA results in output folder and put it into task and save the task.
    }
}