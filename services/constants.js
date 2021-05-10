const TYPE_ANALYSIS = 1;
const TYPE_DESIGN = 2;
const TASK_STATE_NOT_FOUND = 0;
const TASK_STATE_PENDING = 1;
const TASK_STATE_IN_PROGRESS = 2;
const TASK_STATE_FINISHED = 3;
const TASK_STATE_CANCELLED = 4;

const DESIGN_TYPE_NO_INITIAL_SEQUENCE = 1;
const DESIGN_TYPE_ONLY_INITIAL_SEQUENCE = 2;
const DESIGN_TYPE_ONLY_FLANKING_SEQUENCES = 3;
const DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES = 4;

// This represents the amount of amino acids we take before and after the flanking sequences.
const FLANKING_WINDOW_SIZE = 10;

const taskStates = new Map()
taskStates.set(TASK_STATE_NOT_FOUND,"Not Found")
taskStates.set(TASK_STATE_PENDING,"Pending")
taskStates.set(TASK_STATE_IN_PROGRESS,"In Progress")
taskStates.set(TASK_STATE_FINISHED,"Finished")
taskStates.set(TASK_STATE_CANCELLED,"Cancelled")

function getTaskStatusAsString(stateId) {
  return taskStates.has(stateId) ? taskStates.get(stateId) : '';
}

module.exports = {
  TYPE_ANALYSIS,
  TYPE_DESIGN,
  TASK_STATE_NOT_FOUND,
  TASK_STATE_PENDING,
  TASK_STATE_IN_PROGRESS,
  TASK_STATE_FINISHED,
  TASK_STATE_CANCELLED,
  DESIGN_TYPE_NO_INITIAL_SEQUENCE,
  DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
  DESIGN_TYPE_ONLY_FLANKING_SEQUENCES,
  DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES,
  FLANKING_WINDOW_SIZE,
  getTaskStatusAsString,
};
