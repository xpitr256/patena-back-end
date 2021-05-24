const Task = require("../model/schema/Task");
const constants = require("./constants");

async function getProcessingTime(sortCriteria) {
  const tasks = await Task.find({
    stateId: constants.TASK_STATE_FINISHED,
  })
    .sort({
      executionMinutesElapsed: sortCriteria,
    })
    .limit(1);
  return tasks.length !== 0 && tasks[0].executionMinutesElapsed !== null ? tasks[0].executionMinutesElapsed : 0;
}

async function getTaskCount(state) {
  return Task.countDocuments({
    stateId: state,
  });
}

module.exports = {
  getSuccessRate: async () => {
    let [finishedTaskCount, cancelledTaskCount] = await Promise.all([
      getTaskCount(constants.TASK_STATE_FINISHED),
      getTaskCount(constants.TASK_STATE_CANCELLED),
    ]);
    const totalCount = finishedTaskCount + cancelledTaskCount;
    if (totalCount > 0) {
      return Math.ceil((finishedTaskCount / totalCount) * 100);
    }
    return totalCount;
  },

  getAverageProcessingTime: async () => {
    const response = await Task.aggregate([{ $group: { _id: "_id", AverageValue: { $avg: "$executionMinutesElapsed" } } }]);
    if (response.length === 0) {
      return 0;
    }
    return response[0].AverageValue === null ? 0 : response[0].AverageValue;
  },

  getFastestProcessingTime: async () => {
    const ascendingValue = 1;
    return getProcessingTime(ascendingValue);
  },

  getSlowestProcessingTime: async () => {
    const descendingValue = -1;
    return getProcessingTime(descendingValue);
  },

  getQueueStatus: async () => {
    let [finished, cancelled, pending, inProgress] = await Promise.all([
      getTaskCount(constants.TASK_STATE_FINISHED),
      getTaskCount(constants.TASK_STATE_CANCELLED),
      getTaskCount(constants.TASK_STATE_PENDING),
      getTaskCount(constants.TASK_STATE_IN_PROGRESS),
    ]);

    return [
      {
        name: constants.getTaskStatusAsString(constants.TASK_STATE_IN_PROGRESS),
        value: inProgress,
      },
      {
        name: constants.getTaskStatusAsString(constants.TASK_STATE_PENDING),
        value: pending,
      },
      {
        name: constants.getTaskStatusAsString(constants.TASK_STATE_FINISHED),
        value: finished,
      },
      {
        name: constants.getTaskStatusAsString(constants.TASK_STATE_CANCELLED),
        value: cancelled,
      },
    ];
  },
};
