const taskService = require("./../services/taskService");
const database = require("./../model/database");
const notifyService = require("./../services/notifier/notifyService");
const logger = require("./../services/log/logService");

const getNextPendingTask = taskService.getNextPendingTask;
const getTaskInProgress = taskService.getTaskInProgress;
const promoteTaskToInProgress = taskService.promoteTaskToInProgress;
const cancelTask = taskService.cancelTask;
const notifyUserThatTaskWasCancelled = notifyService.notifyUserThatTaskWasCancelled;

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

  logger.log("[Task Analyzer] GETTING Task In Progress...");
  const taskInProgress = await getTaskInProgress();
  if (taskInProgress) {
    logger.log("[Task Analyzer] GOT a Task In Progress: " + taskInProgress.id);
    if (isTaskOverdue(taskInProgress)) {
      logger.log("[Task Analyzer] Task In Progress " + taskInProgress.id + " is overdue: " + taskInProgress.lastExecutionDate);
      await abortTask(taskInProgress, workQueue);
      logger.log("[Task Analyzer] Task In Progress " + taskInProgress.id + " was cancelled: ");
    }
    logger.log("[Task Analyzer] EXITING workerId=[" + process.pid + "] for task : " + taskInProgress.id);
    return;
  }

  logger.log("[Task Analyzer] PROMOTING Next Task...");
  const task = await promoteNextTask();
  if (task) {
    logger.log("[Task Analyzer] GOT a Next Task: " + task.id + " Adding task to Queue");
    const jobCountBefore = await workQueue.getJobCounts();
    logger.log("[Task Analyzer] Queue size BEFORE adding the task: " + JSON.stringify(jobCountBefore));
    let job = await workQueue.add(task.id, { task: task });
    const jobCountAfter = await workQueue.getJobCounts();
    logger.log("[Task Analyzer] Obtained job from QUEUE: " + job.id);
    logger.log("[Task Analyzer] Queue size AFTER adding the task: " + JSON.stringify(jobCountAfter));
  }
  logger.log("[Task Analyzer] EXITING workerId=[" + process.pid + "]");
}

module.exports = start;
