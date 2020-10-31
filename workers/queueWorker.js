const throng = require('throng');
const Queue = require("bull");
const config = require("../config/config")
const constants = require("../services/constants")
const taskService = require("./../services/taskService");
const notifyService = require("./../services/notifier/notifyService")
const runTask = taskService.runTask;
const updateFailingTask = taskService.updateFailingTask;
const taskIsCancelled = taskService.taskIsCancelled;
const notifyUserThatTaskIsReady = notifyService.notifyUserThatTaskIsReady;
const notifyUserThatTaskWasCancelled = notifyService.notifyUserThatTaskWasCancelled;
const workers = config.WEB_CONCURRENCY;
const maxJobsPerWorker = config.JOB_CONCURRENCY;

function start() {
    const workQueue = new Queue(constants.PATENA_QUEUE, config.REDIS_URL);
    workQueue.process(maxJobsPerWorker, async (job) => {
        const task = job.data
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

// Initialize the clustered worker process
throng({ workers, start });