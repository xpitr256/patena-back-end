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

module.exports = {
  getTask: getTask,
};
