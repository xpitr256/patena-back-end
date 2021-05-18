const taskService = require("../../services/taskService");

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
    res.status(500).send(error);
  }
}

module.exports = {
  getTask,
  retryTask,
};
