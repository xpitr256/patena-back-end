const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const constants = require("../../services/constants");
const translationService = require("../../services/translationService");
const MockQueue = require("../mocks/MockQueue");
const MockDatabase = require("../mocks/MockDatabase");
const MockLogger = require("../mocks/MockLogger");
const DEBUG_MODE = false;
const TEST_QUEUE_NAME = "patena-test-job-queue";
const TEST_REDIS_URL = "redis://127.0.0.1:6379";
const TEST_TASK_ID = "47774471-b6d0-480e-b134-81578b044049";

const mockLogger = MockLogger.buildLogger(DEBUG_MODE);

//TASK SERVICE MOCK FUNCTIONS
function getNoTaskInProgress(task) {
  mockLogger.log("taskServiceMock:: getTaskInProgress => undefined");
}

function getNoNextPendingTask(task) {
  mockLogger.log("taskServiceMock:: getNextPendingTask => undefined");
}

function runNoTask(task) {
  mockLogger.log("taskServiceMock:: runTask => nothing");
}

function promoteTaskToInProgress(task) {
  mockLogger.log("taskServiceMock:: promoteTaskToInProgress => updated task");
  task.stateId = constants.TASK_STATE_IN_PROGRESS;
  return task;
}

describe("Task analyzer", () => {
  it("should do nothing when no task is pending ", async () => {
    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = getNoNextPendingTask;
    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    const start = proxyquire("../../workers/taskAnalyzer", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const result = await start(mockQueue);
    expect(result).to.be.equals(undefined);
    expect(mockQueue.count()).to.be.equals(0);
  });

  it('should promote task to "in progress" for pending task and put it in the job Queue', async () => {
    let task = {
      stateId: constants.TASK_STATE_PENDING,
      taskData: {},
      id: TEST_TASK_ID,
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = () => {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runNoTask;

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);

    const start = proxyquire("../../workers/taskAnalyzer", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/log/logService": mockLogger,
    });

    await start(mockQueue);
    expect(task.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
    expect(mockQueue.count()).to.be.equals(1);
    expect(mockQueue.getJob(TEST_TASK_ID)).not.to.be.undefined;
  });

  it("should wait (do nothing) if a non overdue task is currently in progress", async () => {
    let taskInProgress = {
      stateId: constants.TASK_STATE_IN_PROGRESS,
      lastExecutionDate: new Date(),
      taskData: {},
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = function () {
      mockLogger.log("taskServiceMock:: getTaskInProgress => taskInProgress");
      return taskInProgress;
    };

    const start = proxyquire("../../workers/taskAnalyzer", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/log/logService": mockLogger,
    });
    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);

    await start(mockQueue);

    expect(taskInProgress.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should cancel an overdue task", async () => {
    const translations = translationService.getTranslationsIn("en");

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let taskInProgress = {
      stateId: constants.TASK_STATE_IN_PROGRESS,
      lastExecutionDate: yesterday,
      taskData: {},
      id: TEST_TASK_ID,
    };
    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = function () {
      mockLogger.log("taskServiceMock:: getTaskInProgress => taskInProgress");
      return taskInProgress;
    };

    taskServiceMock.cancelTask = function (task) {
      mockLogger.log("taskServiceMock:: updateFailingTask => ok");
      task.messageError = translations.taskService.cancelMessageError;
      task.stateId = constants.TASK_STATE_CANCELLED;
      return task;
    };

    const start = proxyquire("../../workers/taskAnalyzer", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, taskInProgress);
    expect(mockQueue.count()).to.be.equals(1);

    await start(mockQueue);

    expect(taskInProgress.messageError).to.be.equals(translations.taskService.cancelMessageError);
    expect(taskInProgress.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    expect(mockQueue.count()).to.be.equals(0);
  });
});
