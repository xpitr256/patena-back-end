const expect = require("chai").expect;
const proxyquire = require("proxyquire");

const genericErrorMessage = "FAILING ON PURPOSE";
const constants = require("../../services/constants");
const MockQueue = require("./../mocks/MockQueue");
const MockLogger = require("./../mocks/MockLogger");
const MockDatabase = require("./../mocks/MockDatabase");

const DEBUG_MODE = false;
const TEST_QUEUE_NAME = "patena-test-job-queue";
const TEST_REDIS_URL = "redis://127.0.0.1:6379";
const TEST_TASK_ID = "47774471-b6d0-480e-b134-81578b044049";

const mockLogger = MockLogger.buildLogger(DEBUG_MODE);

//TASK SERVICE MOCK FUNCTIONS
function failingUpdateSentEmailNotification(task) {
  mockLogger.log("taskServiceMock:: updateSentEmailNotification => FAILED");
  return new Promise((resolve, reject) => {
    reject(genericErrorMessage);
  });
}

function updateSentEmailNotification(task) {
  mockLogger.log("taskServiceMock:: updateSentEmailNotification => updated task");
  task.emailSent = true;
  task.sentEmailDate = new Date();
  return task;
}

function getNoTaskInProgress(task) {
  mockLogger.log("taskServiceMock:: getTaskInProgress => undefined");
}

function getNoNextPendingTask(task) {
  mockLogger.log("taskServiceMock:: getNextPendingTask => undefined");
}

function runNoTask(task) {
  mockLogger.log("taskServiceMock:: runTask => nothing");
}

function runFailingTask(task) {
  mockLogger.log("taskServiceMock:: runTask => FAILED");
  return new Promise((resolve, reject) => {
    reject(genericErrorMessage);
  });
}

function promoteTaskToInProgress(task) {
  mockLogger.log("taskServiceMock:: promoteTaskToInProgress => updated task");
  task.stateId = constants.TASK_STATE_IN_PROGRESS;
  return task;
}

function updateFailingTask(task, error) {
  mockLogger.log("taskServiceMock:: updateFailingTask => ok");
  task.attempts = task.attempts + 1;
  task.messageError = error;
  return task;
}

function updateFailingTaskCancellingTask(task, error) {
  mockLogger.log("taskServiceMock:: updateFailingTaskCancellingTask => ok");
  task.attempts = task.attempts + 1;
  task.messageError = error;
  task.stateId = constants.TASK_STATE_CANCELLED;
  return task;
}

function taskIsCancelledReturnFalse(task) {
  mockLogger.log("taskServiceMock:: taskIsCancelled => false");
  return false;
}

//EMAIL SERVICE MOCK FUNCTIONS
function sendWorkSuccessMail(email, language, workType, workId) {
  mockLogger.log("emailServiceMock:: sendWorkSuccessMail => sent OK");
}

function sendWorkErrorMail(email, language, workType, workId) {
  mockLogger.log("emailServiceMock:: sendWorkErrorMail => sent OK");
}

function failSendingEmail(task) {
  mockLogger.log("emailServiceMock:: sendWorkSuccessMail | sendWorkErrorMail => FAILED");
  return new Promise((resolve, reject) => {
    reject(genericErrorMessage);
  });
}

describe("Queue worker", () => {
  it("should mark email sent and sent email date for a successful task run with email and remove task from queue jobs", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      emailSent: false,
      taskData: {
        email: "test_email@test.com",
      },
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runNoTask;
    taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };

    let emailServiceMock = {};
    emailServiceMock.sendWorkSuccessMail = sendWorkSuccessMail;

    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../mail/mailService": emailServiceMock,
      "./../taskService": taskServiceMock,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID);
    expect(mockQueue.count()).to.be.equals(1);

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/log/logService": mockLogger,
    });

    await startWith(mockQueue);

    expect(task.emailSent).to.be.true;
    expect(task.sentEmailDate).to.be.an("Date");
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should not mark email sent if sendWorkSuccessMail fails for a successful task", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      emailSent: false,
      taskData: {
        email: "test_email@test.com",
      },
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runNoTask;
    taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    let emailServiceMock = {};
    emailServiceMock.sendWorkSuccessMail = failSendingEmail;

    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../mail/mailService": emailServiceMock,
      "./../taskService": taskServiceMock,
      "./../log/logService": { error: () => null },
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, task);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);

    expect(task.emailSent).to.be.false;
    expect(task.sentEmailDate).to.be.an("undefined");
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should not mark email sent if updateSentEmailNotification fails for a successful task", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      emailSent: false,
      taskData: {
        email: "test_email@test.com",
      },
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runNoTask;
    taskServiceMock.updateSentEmailNotification = failingUpdateSentEmailNotification;

    let emailServiceMock = {};
    emailServiceMock.sendWorkSuccessMail = sendWorkSuccessMail;

    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../mail/mailService": emailServiceMock,
      "./../taskService": taskServiceMock,
      "./../log/logService": mockLogger,
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);

    expect(task.emailSent).to.be.false;
    expect(task.sentEmailDate).to.be.an("undefined");
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should update a failing task by increasing its attempts and saving error message", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      attempts: 0,
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runFailingTask;
    taskServiceMock.updateFailingTask = updateFailingTask;
    taskServiceMock.taskIsCancelled = taskIsCancelledReturnFalse;
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../taskService": taskServiceMock,
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, task);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);
    expect(task.attempts).to.be.equals(1);
    expect(task.messageError).to.be.equals(genericErrorMessage);
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should cancel a 3 times failing task", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      attempts: 2,
      taskData: {},
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runFailingTask;
    taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../taskService": taskServiceMock,
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, task);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);

    expect(task.attempts).to.be.equals(3);
    expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should notify a user that task is canceled", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      emailSent: false,
      attempts: 2,
      taskData: {
        email: "test_email@test.com",
      },
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runFailingTask;
    taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
    taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;

    let emailServiceMock = {};
    emailServiceMock.sendWorkErrorMail = sendWorkErrorMail;

    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../mail/mailService": emailServiceMock,
      "./../taskService": taskServiceMock,
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, task);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);

    expect(task.attempts).to.be.equals(3);
    expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    expect(task.emailSent).to.be.true;
    expect(task.sentEmailDate).to.be.an("Date");
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should not notify a user that task is canceled if updateSentEmailNotification fails", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      emailSent: false,
      attempts: 2,
      taskData: {
        email: "test_email@test.com",
      },
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runFailingTask;
    taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
    taskServiceMock.updateSentEmailNotification = failingUpdateSentEmailNotification;

    let emailServiceMock = {};
    emailServiceMock.sendWorkErrorMail = sendWorkErrorMail;

    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../mail/mailService": emailServiceMock,
      "./../taskService": taskServiceMock,
      "./../log/logService": mockLogger,
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, task);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);

    expect(task.attempts).to.be.equals(3);
    expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    expect(task.emailSent).to.be.false;
    expect(task.sentEmailDate).to.be.an("undefined");
    expect(mockQueue.count()).to.be.equals(0);
  });

  it("should not notify a user that task is canceled  if sendWorkErrorMail fails", async () => {
    let task = {
      id: TEST_TASK_ID,
      stateId: constants.TASK_STATE_PENDING,
      emailSent: false,
      attempts: 2,
      taskData: {
        email: "test_email@test.com",
      },
    };

    let taskServiceMock = {};
    taskServiceMock.getTaskInProgress = getNoTaskInProgress;
    taskServiceMock.getNextPendingTask = function () {
      mockLogger.log("taskServiceMock:: getNextPendingTask => task");
      return task;
    };
    taskServiceMock.promoteTaskToInProgress = promoteTaskToInProgress;
    taskServiceMock.runTask = runFailingTask;
    taskServiceMock.updateFailingTask = updateFailingTaskCancellingTask;
    taskServiceMock.updateSentEmailNotification = updateSentEmailNotification;
    taskServiceMock.getTask = async (taskId) => {
      return task;
    };
    let emailServiceMock = {};
    emailServiceMock.sendWorkErrorMail = failSendingEmail;

    let notifyServiceMock = proxyquire("./../../services/notifier/notifyService", {
      "./../mail/mailService": emailServiceMock,
      "./../taskService": taskServiceMock,
      "./../log/logService": mockLogger,
    });

    const startWith = proxyquire("../../workers/taskExecutor", {
      "./../model/database": MockDatabase.buildDatabaseWith(mockLogger),
      "./../services/taskService": taskServiceMock,
      "./../services/notifier/notifyService": notifyServiceMock,
      "./../services/log/logService": mockLogger,
    });

    const mockQueue = new MockQueue(TEST_QUEUE_NAME, TEST_REDIS_URL);
    mockQueue.add(TEST_TASK_ID, task);
    expect(mockQueue.count()).to.be.equals(1);

    await startWith(mockQueue);

    expect(task.attempts).to.be.equals(3);
    expect(task.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
    expect(task.emailSent).to.be.false;
    expect(task.sentEmailDate).to.be.an("undefined");
    expect(mockQueue.count()).to.be.equals(0);
  });
});
