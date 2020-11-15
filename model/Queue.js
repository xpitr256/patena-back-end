const Queue = require("bull");
const OneDayInMs = 86400000;
const config = require("../config/config");

module.exports = {
  getQueue: () => {
    return new Queue(config.PATENA_QUEUE_NAME, config.REDIS_URL, { settings: { lockDuration: OneDayInMs, maxStalledCount: 0 } });
  },
};
