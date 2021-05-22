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
};
