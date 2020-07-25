const constants = require("./constants");
const taskService = require("./taskService");

const taskStateStatusMap = new Map();
taskStateStatusMap.set(
  constants.TASK_STATE_NOT_FOUND,
  "The order was not found."
);
taskStateStatusMap.set(
  constants.TASK_STATE_PENDING,
  "The order is waiting to be processed."
);
taskStateStatusMap.set(
  constants.TASK_STATE_IN_PROGRESS,
  "The order is being processed right now. Results will be ready very soon."
);
taskStateStatusMap.set(
  constants.TASK_STATE_FINISHED,
  "The order is successfully finished."
);
taskStateStatusMap.set(
  constants.TASK_STATE_CANCELLED,
  "The order has been cancelled."
);

module.exports = {
  getResultsFor: async function (orderNumber) {
    const task = await taskService.getTask(orderNumber);
    if (!task) {
      return {
        stateId: constants.TASK_STATE_NOT_FOUND,
        status: taskStateStatusMap.get(0),
      };
    }
    let response = {
      stateId: task.stateId,
      status: taskStateStatusMap.get(task.stateId),
      orderNumber: orderNumber,
    };
    if (response.stateId === constants.TASK_STATE_FINISHED) {
      response.results = task.output;
    }
    return response;
  },
};
