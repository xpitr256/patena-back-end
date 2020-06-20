const patenaService = require('./patenaService');
const Task = require('../model/schema/Task');
const translationService = require('./translationService');
const constants = require('./constants');
const fse = require('fs-extra')
const fs = require('fs');

async function updateTaskState(task, state) {
    task.stateId = state;
    task.lastExecutionDate = Date.now();
    await task.save();
    return task;
}

async function addResultsTo(task) {
    const directory = './workers/Output/' + task.id;
    const result = JSON.parse(fs.readFileSync(directory + '/results.json', 'utf8'));
    if (result) {
        task.output = result
        task.attempts = task.attempts + 1;
        task.stateId = constants.STATE_FINISHED;
        await task.save();
        fse.removeSync(directory);
    }
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
        task.messageError = error;
        let nextState = constants.STATE_PENDING;
        if (task.attempts > 2) {
            nextState = constants.STATE_CANCELLED
        }
        return updateTaskState(task, nextState);
    },
    cancelTask: async function(task) {
        const translations = translationService.getTranslationsIn(task.language);
        task.messageError = translations.taskService.cancelMessageError;
        return updateTaskState(task, constants.STATE_CANCELLED);
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
        await patenaService.start(task);
        await addResultsTo(task);
    }
}