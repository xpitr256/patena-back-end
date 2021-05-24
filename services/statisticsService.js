const Task = require("../model/schema/Task");
const constants = require("./constants");

module.exports = {
  getSuccessRate: async function () {
    let [finishedTaskCount, cancelledTaskCount] = await Promise.all([
      Task.countDocuments({
        stateId: constants.TASK_STATE_FINISHED,
      }),
      Task.countDocuments({
        stateId: constants.TASK_STATE_CANCELLED,
      }),
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
};
