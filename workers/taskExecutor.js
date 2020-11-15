const config = require("../config/config");
const taskService = require("./../services/taskService");
const notifyService = require("./../services/notifier/notifyService");
const runTask = taskService.runTask;
const updateFailingTask = taskService.updateFailingTask;
const taskIsCancelled = taskService.taskIsCancelled;
const getTask = taskService.getTask;
const notifyUserThatTaskIsReady = notifyService.notifyUserThatTaskIsReady;
const notifyUserThatTaskWasCancelled = notifyService.notifyUserThatTaskWasCancelled;
const maxJobsPerWorker = config.JOB_CONCURRENCY;
const logger = require("../services/log/logService");
const database = require("./../model/database");

async function startWith(workQueue) {
  logger.log("[Task Executor] startWith with queue=[" + workQueue.name + "]");
  await database.connect();
  // The '*' means that this process handler function will listen to all jobs added to the Queue
  // Detailed explanation in: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueprocess
  await workQueue.process("*", maxJobsPerWorker, async (job) => {
    logger.log("[Task Executor] workQueue is processing a job=" + JSON.stringify(job) + "");
    const taskId = job.name;
    try {
      logger.log("[Task Executor] getting task=[" + taskId + "]");
      const task = await getTask(taskId);
      try {
        logger.log("[Task Executor] running task=[" + taskId + "]");
        await runTask(task);
        logger.log("[Task Executor] finished task running for task=[" + task.id + "]");
        logger.log("[Task Executor] calling notifyUserThatTaskIsReady");
        await notifyUserThatTaskIsReady(task);
        logger.log("[Task Executor] finished notifyUserThatTaskIsReady");
        return { success: true };
      } catch (error) {
        logger.log("[Task Executor] There was an error running task=[" + task.id + "]");
        logger.log("[Task Executor] calling updateFailingTask");
        const failingTask = await updateFailingTask(task, error);
        logger.log("[Task Executor] finished updateFailingTask");
        if (taskIsCancelled(failingTask)) {
          logger.log("[Task Executor] The task is cancelled !");
          logger.log("[Task Executor] calling notifyUserThatTaskWasCancelled");
          await notifyUserThatTaskWasCancelled(failingTask);
          logger.log("[Task Executor] finished notifyUserThatTaskWasCancelled");
        }
        logger.log("[Task Executor] finished with error: " + error);
        return { error: error };
      }
    } catch (error) {
      logger.log("[Task Executor] Cannot retrieve TaskId=[" + taskId + "] due to error: " + error);
      return { error: error };
    }
  });
}

module.exports = startWith;
