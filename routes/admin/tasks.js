const taskService = require("../../services/taskService");
const isValidTaskState = require("../../services/constants").isValidTaskState;

async function getTask(req, res) {
  const taskId = req.params.id;
  try {
    const task = await taskService.getTaskForAdmin(taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send({ message: "There is no task with id: " + taskId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

async function retryTask(req, res) {
  const taskId = req.params.id;
  try {
    const response = await taskService.retryCancelledTask(taskId);
    if (response.taskNotFound) {
      res.status(404).send({ message: "There is no task with id: " + taskId });
    } else if (response.taskUpdated) {
      res.status(204).send();
    } else {
      res.status(400).send({ message: "Invalid task status. The task is not cancelled to be retried" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

async function getTasks(req, res) {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;
  const state = parseInt(req.query.state, 10);

  if ((req.query.state || req.query.state === "") && !isValidTaskState(state)) {
    res.status(400).send({ message: "Invalid task state: " + req.query.state });
    return;
  }

  try {
    const tasks = await taskService.getTasks(limit, offset, state);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

module.exports = {
  getTask,
  retryTask,
  getTasks,
};
