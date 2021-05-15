const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../../services/constants");

let TaskSchema = new Schema({
  id: String,
  stateId: { type: Number, default: constants.TASK_STATE_PENDING },
  messageError: { type: String, default: "" },
  typeId: Number, // 1-analyze, 2-design
  creationDate: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 },
  lastExecutionDate: { type: Date, default: null },
  executionMinutesElapsed: { type: Number, default: 0 },
  output: { type: Object, default: null },
  emailSent: { type: Boolean, default: false },
  sentEmailDate: { type: Date, default: null },
  taskData: { type: Object, default: null },
  language: { type: String, default: "en" },
});

TaskSchema.methods.status = function () {
  return constants.getTaskStatusAsString(this.stateId);
};

TaskSchema.methods.type = function () {
  return constants.getDesignTypeAsString(this.taskData.designType);
};

module.exports = mongoose.model("TaskSchema", TaskSchema);
