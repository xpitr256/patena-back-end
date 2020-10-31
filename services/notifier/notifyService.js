const mailService = require('./../mail/mailService')
const taskService = require('./../taskService');

module.exports = {
    notifyUserThatTaskIsReady : async function (task) {
        const email = task.taskData.email;
        if (email) {
            const workType = task.typeId;
            const workId = task.id;
            try {
                await mailService.sendWorkSuccessMail(
                    email,
                    task.language,
                    workType,
                    workId
                );
                try {
                    task = await taskService.updateSentEmailNotification(task);
                } catch (e) {
                    console.error(
                        "Task Analyzer: Cannot Update Sent Email Notification for workId=" +
                        workId
                    );
                }
            } catch (e) {
                console.error(
                    "Task Analyzer: Cannot send work success email to=" +
                    email +
                    " for workId=" +
                    workId
                );
            }
        }
        return task;
    },
    notifyUserThatTaskWasCancelled: async function (task) {
        const email = task.taskData.email;
        if (email) {
            const workType = task.typeId;
            const workId = task.id;
            try {
                await mailService.sendWorkErrorMail(
                    email,
                    task.language,
                    workType,
                    workId
                );
                try {
                    task = await taskService.updateSentEmailNotification(task);
                } catch (e) {
                    console.error(
                        "Task Analyzer: Cannot Update Sent Email Notification for workId=" +
                        workId
                    );
                }
            } catch (e) {
                console.error(
                    "Task Analyzer: Cannot send work error email to=" +
                    email +
                    " for workId=" +
                    workId
                );
            }
        }
        return task;
    }
}
