const mailService = require("./../mail/mailService");
const taskService = require("./../taskService");
const logger = require("./../log/logService");

module.exports = {
  notifyUserThatTaskIsReady: async function (task) {
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
          logger.error(
            "Notify Service: Cannot Update Sent Email Notification for workId=" +
              workId
          );
        }
      } catch (e) {
        logger.error(
          "Notify Service: Cannot send work success email to=" +
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
          logger.error(
            "Notify Service: Cannot Update Sent Email Notification for workId=" +
              workId
          );
        }
      } catch (e) {
        logger.error(
          "Notify Service: Cannot send work error email to=" +
            email +
            " for workId=" +
            workId
        );
      }
    }
    return task;
  },
};
