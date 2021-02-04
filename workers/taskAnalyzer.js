const taskService = require("./../services/taskService");
const database = require("./../model/database");
const notifyService = require("./../services/notifier/notifyService");
const logger = require("./../services/log/logService");
const config = require("../config/config");

const getNextPendingTask = taskService.getNextPendingTask;
const getTasksInProgress = taskService.getTasksInProgress;
const promoteTaskToInProgress = taskService.promoteTaskToInProgress;
const cancelTask = taskService.cancelTask;
const notifyUserThatTaskWasCancelled = notifyService.notifyUserThatTaskWasCancelled;
const maxTasksExecutionInParallel = config.JOB_CONCURRENCY;

function isTaskOverdue(task) {
  // If task exceeds 1 day processing => is overdue
  const oneDayInMs = 86400000;
  const dateDifferenceInMs = Date.now() - task.lastExecutionDate;
  return dateDifferenceInMs > oneDayInMs;
}

async function promoteNextTask() {
  let task = await getNextPendingTask();
  if (task) {
    return await promoteTaskToInProgress(task);
  }
}

async function abortTask(task, workQueue) {
  const functions = [cancelTask(task), workQueue.removeJobs(task.id)];
  await Promise.all(functions);
  await notifyUserThatTaskWasCancelled(task);
}

async function start(workQueue) {
  logger.log("[Task Analyzer] STARTING workerId=[" + process.pid + "]");

  await database.connect();

  const jobCountBefore = await workQueue.getJobCounts();
  logger.log("[Task Analyzer] Queue size BEFORE: " + JSON.stringify(jobCountBefore));

  logger.log("[Task Analyzer] GETTING Tasks In Progress...");
  const tasksInProgress = await getTasksInProgress();
  if (tasksInProgress) {
    logger.log("[Task Analyzer] GOT an amount of " + tasksInProgress.length + "  tasks In Progress.");
    let promises = [];
    tasksInProgress.forEach((taskInProgress) => {
      logger.log("[Task Analyzer] GOT a Task In Progress: " + taskInProgress.id);
      if (isTaskOverdue(taskInProgress)) {
        logger.log("[Task Analyzer] Task In Progress " + taskInProgress.id + " is overdue: " + taskInProgress.lastExecutionDate);
        promises.push(abortTask(taskInProgress, workQueue));
      }
    });
    if (promises.length > 0) {
      logger.log("[Task Analyzer] Waiting for task(s) to be cancelled.");
      try {
        await Promise.all(promises);
        logger.log("[Task Analyzer] Task(s) were successfully cancelled.");
      } catch (error) {
        logger.error("[Task Analyzer ERROR] There was and error trying to cancel overdue tasks: " + error);
        return;
      }
    }
    if (tasksInProgress.length >= maxTasksExecutionInParallel) {
      logger.log(
        "[Task Analyzer] EXITING workerId=[" +
          process.pid +
          "] There are " +
          tasksInProgress.length +
          " tasks In Progress and max allowed is " +
          maxTasksExecutionInParallel
      );
      return;
    }
  }

  logger.log("[Task Analyzer] PROMOTING Next Task...");
  const task = await promoteNextTask();
  if (task) {
    logger.log("[Task Analyzer] GOT a Next Task: " + task.id + " Adding task to Queue");
    let job = await workQueue.add(task.id);
    const jobCountAfter = await workQueue.getJobCounts();
    logger.log("[Task Analyzer] Obtained job from QUEUE: " + job.id);
    logger.log("[Task Analyzer] Queue size AFTER adding the task: " + JSON.stringify(jobCountAfter));
  }
  logger.log("[Task Analyzer] EXITING workerId=[" + process.pid + "]");
}

module.exports = start;
