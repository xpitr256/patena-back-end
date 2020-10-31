const taskService = require("./../services/taskService");
const database = require("./../model/database");
const notifyService = require("./../services/notifier/notifyService");
const logger = require("./../services/log/logService");
const config = require("../config/config")
const constants = require("../services/constants")

const getNextPendingTask = taskService.getNextPendingTask;
const getTaskInProgress = taskService.getTaskInProgress;
const promoteTaskToInProgress = taskService.promoteTaskToInProgress;
const cancelTask = taskService.cancelTask;
const notifyUserThatTaskWasCancelled = notifyService.notifyUserThatTaskWasCancelled;
const oneDayInMs = 86400000;
let Queue = require("bull");

function isTaskOverdue(task) {
  // If task exceeds 1 day processing => is overdue
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
  const functions = [
    cancelTask(task),
    workQueue.removeJobs(task.id)
  ];
  await Promise.all(functions);
  await notifyUserThatTaskWasCancelled(task);
}

async function start() {
  await database.connect();

  logger.log("STARTING workerId=[" + process.pid + "]");

  const taskInProgress = await getTaskInProgress();
  const workQueue = new Queue(constants.PATENA_QUEUE, config.REDIS_URL);

  if (taskInProgress) {
    if (isTaskOverdue(taskInProgress)) {
      await abortTask(taskInProgress, workQueue)
    }
    return;
  }

  const task = await promoteNextTask();
  if (task) {
    workQueue.add(task.id,{ task: task })
  }
}

module.exports = start;
