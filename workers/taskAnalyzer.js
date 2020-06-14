const taskService = require('./../services/taskService');
const database = require('./../model/database');
const mailService = require('./../services/mail/mailService');

const thereIsNoTaskInProgress = taskService.thereIsNoTaskInProgress;
const getNextPendingTask = taskService.getNextPendingTask;
const getTaskInProgress = taskService.getTaskInProgress;
const promoteTaskToInProgress = taskService.promoteTaskToInProgress;
const updateFailingTask = taskService.updateFailingTask;
const taskIsCancelled = taskService.taskIsCancelled;
const updateSentEmailNotification = taskService.updateSentEmailNotification;
const runTask = taskService.runTask;
const cancelTask = taskService.cancelTask;
const oneDayInMs = 86400000;

async function notifyUserThatTaskIsReady(task) {
    const email = task.taskData.email;
    if (email) {
        const workType = task.typeId;
        const workId = task.id;
        try {
            await mailService.sendWorkSuccessMail(email, task.language, workType, workId);
            try {
                await updateSentEmailNotification(task);
            } catch (e) {
                console.error("Task Analyzer: Cannot Update Sent Email Notification for workId=" + workId)
            }
        } catch (e) {
            console.error("Task Analyzer: Cannot send work success email to=" + email + " for workId=" + workId)
        }
    }
}

async function notifyUserThatTaskWasCancelled(task) {
    const email = task.taskData.email;
    if (email) {
        const workType = task.typeId;
        const workId = task.id;
        try {
            await mailService.sendWorkErrorMail(email, task.language, workType, workId);
            try {
                await updateSentEmailNotification(task);
            } catch (e) {
                console.error("Task Analyzer: Cannot Update Sent Email Notification for workId=" + workId)
            }
        } catch (e) {
            console.error("Task Analyzer: Cannot send work error email to=" + email + " for workId=" + workId)
        }
    }
}

async function start() {

    await database.connect();

    if (await thereIsNoTaskInProgress()) {
        let task = await getNextPendingTask();
        if (task) {
            task = await promoteTaskToInProgress(task);
            try {
                await runTask(task);
                await notifyUserThatTaskIsReady(task);
            } catch (error) {
                task = await updateFailingTask(task, error);
                if (taskIsCancelled(task)) {
                    await notifyUserThatTaskWasCancelled(task);
                }
            }
        }
    } else {
        const taskInProgress = await getTaskInProgress();
        if (taskInProgress) {
            // We investigate how long this task is in progress to avoid infinite loop processing
            const dateDifferenceInMs = Date.now() - taskInProgress.lastExecutionDate;
            if (dateDifferenceInMs > oneDayInMs) {
                // We stop this task and mark it as cancelled
                await cancelTask(taskInProgress);
                await notifyUserThatTaskWasCancelled(taskInProgress);
            }
        }
    }
}

module.exports = start;