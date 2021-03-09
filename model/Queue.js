const Queue = require("bull");
const config = require("../config/config");
const maxExecutionTimeInMs = config.MAX_JOB_EXECUTION_TIME_IN_MS_SECONDS;

module.exports = {
  getQueue: () => {
    return new Queue(config.PATENA_QUEUE_NAME, config.REDIS_URL, { settings: { lockDuration: maxExecutionTimeInMs, maxStalledCount: 0 } });
  },
};
