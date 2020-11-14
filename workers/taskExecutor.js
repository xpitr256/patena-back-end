const config = require("../config/config");
const taskService = require("./../services/taskService");
const notifyService = require("./../services/notifier/notifyService");
const runTask = taskService.runTask;
const updateFailingTask = taskService.updateFailingTask;
const taskIsCancelled = taskService.taskIsCancelled;
const notifyUserThatTaskIsReady = notifyService.notifyUserThatTaskIsReady;
const notifyUserThatTaskWasCancelled =
  notifyService.notifyUserThatTaskWasCancelled;
const maxJobsPerWorker = config.JOB_CONCURRENCY;

async function startWith(workQueue) {
  await workQueue.process(maxJobsPerWorker, async (job) => {
    const task = job.data;
    try {
      await runTask(task);
      await notifyUserThatTaskIsReady(task);
      return { done: task.id };
    } catch (error) {
      const failingTask = await updateFailingTask(task, error);
      if (taskIsCancelled(failingTask)) {
        await notifyUserThatTaskWasCancelled(failingTask);
      }
      return { error: error };
    }
  });
}

module.exports = startWith;
