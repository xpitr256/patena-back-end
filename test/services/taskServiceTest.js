const chai = require("chai");
const expect = require("chai").expect;
const proxyquire = require("proxyquire").noCallThru();
const constants = require("../../services/constants");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const MockLogger = require("./../mocks/MockLogger");
const mockLogger = MockLogger.buildLogger(false);

describe("Task Service", async () => {
  describe("when create a new Task", async () => {
    it("should successfully persist a new Task", () => {
      const id = "123345";
      const newTaskData = {
        language: "en",
      };
      let createdTask;

      const taskMock = class TaskMock {
        constructor(data) {
          this.id = data.id;
          this.stateId = data.stateId;
          this.typeId = data.typeId;
          this.taskData = data.taskData;
          this.language = data.taskData.language;
        }

        async save() {
          createdTask = this;
        }
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      taskService.create(id, newTaskData, constants.TYPE_ANALYSIS);
      expect(createdTask.id).to.be.equals(id);
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_PENDING);
      expect(createdTask.typeId).to.be.equals(constants.TYPE_ANALYSIS);
      expect(createdTask.language).to.be.equals("en");
    });

    it("should not persist a new Task if BD fails", () => {
      const id = "123345";
      const newTaskData = {
        language: "en",
      };
      let createdTask;

      const taskMock = class TaskMock {
        constructor(data) {}
        async save() {
          return new Promise((resolve, reject) => {
            reject("Save Task failure");
          });
        }
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      taskService.create(id, newTaskData, constants.TYPE_ANALYSIS);
      expect(createdTask).to.be.equals(undefined);
    });
  });

  describe("when getTask by Id", async () => {
    it("should return existent task", async () => {
      const id = "123345";
      let createdTasks = [];

      const taskMock = class TaskMock {
        constructor(data) {
          this.id = data.id;
        }

        static async find() {
          return createdTasks;
        }
      };

      createdTasks.push(new taskMock({ id: id }));

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      const retrievedTask = await taskService.getTask(id);
      expect(retrievedTask).not.to.be.equals(undefined);
      expect(retrievedTask.id).to.be.equals(id);
    });

    it("should return nothing for non existent task", async () => {
      const id = "123345";
      let createdTasks = [];

      const taskMock = class TaskMock {
        constructor(data) {
          this.id = data.id;
        }

        static async find() {
          return createdTasks;
        }
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      const retrievedTask = await taskService.getTask(id);
      expect(retrievedTask).to.be.equals(undefined);
    });
  });

  describe("getTaskInProgress", async () => {
    it("should return the existent task in progress ", async () => {
      const id = "123345";
      let createdTasks = [];

      const taskMock = class TaskMock {
        constructor(data) {
          this.id = data.id;
          this.stateId = data.stateId;
        }

        static async find() {
          return createdTasks;
        }
      };

      createdTasks.push(new taskMock({ id: id, stateId: constants.TASK_STATE_IN_PROGRESS }));

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
      });

      const retrievedTask = await taskService.getTaskInProgress();
      expect(retrievedTask).not.to.be.equals(undefined);
      expect(retrievedTask.id).to.be.equals(id);
      expect(retrievedTask.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
    });

    it("should return nothing for non existent in progress task", async () => {
      let createdTasks = [];

      const taskMock = class TaskMock {
        constructor(data) {
          this.id = data.id;
        }

        static async find() {
          return createdTasks;
        }
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      const retrievedTask = await taskService.getTaskInProgress();
      expect(retrievedTask).to.be.equals(undefined);
    });
  });

  describe("promoteTaskToInProgress", async () => {
    it("should change and persist a PENDING task state to IN PROGRESS", async () => {
      const id = "123345";

      const taskMock = class TaskMock {
        constructor(data) {
          this.id = data.id;
          this.stateId = data.stateId;
        }

        async save() {}
      };

      let createdTask = new taskMock({
        id: id,
        stateId: constants.TASK_STATE_PENDING,
      });

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      await taskService.promoteTaskToInProgress(createdTask);
      expect(createdTask.id).to.be.equals(id);
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
      expect(createdTask.lastExecutionDate).to.be.a("Number");
    });
  });

  describe("updateFailingTask", async () => {
    it("should increase the number of attempts, set error message and set back to PENDING state if number of attempts is equals or less than 2", async () => {
      const errorMessage = "Default error message";

      const taskMock = class TaskMock {
        constructor(data) {
          this.stateId = data.stateId;
          this.attempts = 0;
        }

        async save() {}
      };

      let createdTask = new taskMock({
        stateId: constants.TASK_STATE_IN_PROGRESS,
      });

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      await taskService.updateFailingTask(createdTask, errorMessage);
      expect(createdTask.attempts).to.be.equals(1);
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_PENDING);
      expect(createdTask.lastExecutionDate).to.be.a("Number");
    });

    it("should increase the number of attempts, set error message and set CANCEL state if number of attempts is bigger than 2", async () => {
      const errorMessage = "Default error message";

      const taskMock = class TaskMock {
        constructor(data) {
          this.stateId = data.stateId;
          this.attempts = 2;
        }

        async save() {}
      };

      let createdTask = new taskMock({
        stateId: constants.TASK_STATE_IN_PROGRESS,
      });

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      await taskService.updateFailingTask(createdTask, errorMessage);
      expect(createdTask.attempts).to.be.equals(3);
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
      expect(createdTask.lastExecutionDate).to.be.a("Number");
    });
  });

  describe("cancelTask", async () => {
    it("should set CANCEL state and set message Error in the task language", async () => {
      const taskMock = class TaskMock {
        constructor(data) {
          this.stateId = data.stateId;
        }
        async save() {}
      };

      let createdTask = new taskMock({ stateId: constants.TASK_STATE_PENDING });
      const translationServiceMock = {
        getTranslationsIn: function (language) {
          return {
            taskService: {
              cancelMessageError: "cancelMessageError",
            },
          };
        },
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./translationService": translationServiceMock,
        "./log/logService": mockLogger,
      });

      await taskService.cancelTask(createdTask);
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_CANCELLED);
      expect(createdTask.messageError).to.be.equals("cancelMessageError");
    });
  });

  describe("getNextPendingTask", async () => {
    const mockLogger = {
      log: function () {},
      error: function () {},
    };
    const databaseWithMockLogger = proxyquire("../../model/database", {
      "../services/log/logService": mockLogger,
    });

    const mockDatabase = proxyquire("../model/databaseTestHelper", {
      "./../../model/database": databaseWithMockLogger,
    });

    const Task = require("../../model/schema/Task");

    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });

    it("should get nothing if there is no PENDING task", async () => {
      const taskService = proxyquire("../../services/taskService", {});
      const nextPendingTask = await taskService.getNextPendingTask();
      expect(nextPendingTask).to.be.equals(undefined);
    });

    it("should get the only PENDING task", async () => {
      const task = new Task({
        id: 123,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_ANALYSIS,
        taskData: {},
        language: "en",
      });
      await task.save();
      const taskService = proxyquire("../../services/taskService", {});
      const nextPendingTask = await taskService.getNextPendingTask();
      expect(nextPendingTask).not.to.be.equals(undefined);
      expect(nextPendingTask.stateId).to.be.equals(constants.TASK_STATE_PENDING);
      expect(nextPendingTask.id).to.be.equals("123");
    });

    it("should get the oldest PENDING task", async () => {
      const task0 = new Task({
        id: 0,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_ANALYSIS,
        taskData: {},
        language: "en",
      });
      await task0.save();

      const task1 = new Task({
        id: 1,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {},
        language: "en",
      });
      await task1.save();

      const task2 = new Task({
        id: 2,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_ANALYSIS,
        taskData: {},
        language: "en",
      });
      await task2.save();

      const task3 = new Task({
        id: 3,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {},
        language: "en",
      });
      await task3.save();

      const task4 = new Task({
        id: 4,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_ANALYSIS,
        taskData: {},
        language: "en",
      });
      await task4.save();

      const taskService = proxyquire("../../services/taskService", {});
      const nextPendingTask = await taskService.getNextPendingTask();
      expect(nextPendingTask).not.to.be.equals(undefined);
      expect(nextPendingTask.stateId).to.be.equals(constants.TASK_STATE_PENDING);
      expect(nextPendingTask.id).to.be.equals("1");
      expect(nextPendingTask.typeId).to.be.equals(constants.TYPE_DESIGN);
    });
  });

  describe("taskIsCancelled", () => {
    it("should return true for cancelled task", () => {
      const taskService = proxyquire("../../services/taskService", {});
      const result = taskService.taskIsCancelled({
        stateId: constants.TASK_STATE_CANCELLED,
      });
      expect(result).to.be.true;
    });

    it("should return false for a not cancelled task", () => {
      const taskService = proxyquire("../../services/taskService", {});
      const result = taskService.taskIsCancelled({
        stateId: constants.TASK_STATE_FINISHED,
      });
      expect(result).to.be.false;
    });
  });

  describe("updateSentEmailNotification", async () => {
    it("should update task setting email sent and sent Email Date", async () => {
      const taskMock = class TaskMock {
        constructor() {
          this.emailSent = false;
        }
        async save() {}
      };

      let createdTask = new taskMock({});

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./log/logService": mockLogger,
      });

      await taskService.updateSentEmailNotification(createdTask);
      expect(createdTask.emailSent).to.be.true;
      expect(createdTask.sentEmailDate).to.be.a("Date");
    });
  });

  describe("runTask", async () => {
    it("should not update a task if patena service fails", async () => {
      const taskMock = class TaskMock {
        constructor() {
          this.stateId = constants.TASK_STATE_IN_PROGRESS;
        }
        async save() {}
      };

      let createdTask = new taskMock({});

      const patenaServiceMock = {
        async start(task) {
          return new Promise((resolve, reject) => {
            reject("Save Task failure");
          });
        },
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./patena/patenaService": patenaServiceMock,
        "./log/logService": mockLogger,
      });
      await expect(taskService.runTask(createdTask)).to.be.rejected;
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
    });

    it("should update a task with patena results", async () => {
      const taskMock = class TaskMock {
        constructor() {
          this.stateId = constants.TASK_STATE_IN_PROGRESS;
          this.attempts = 1;
        }
        async save() {}
      };

      let createdTask = new taskMock({});

      const patenaServiceMock = {
        async start(task) {},
      };
      const fsMock = {
        readFileSync: function (path, encode) {
          return '{"result":{"sequence":"ABC"}}';
        },
      };
      const fseMock = {
        removeSync: function () {},
      };

      const taskService = proxyquire("../../services/taskService", {
        "../model/schema/Task": taskMock,
        "./patena/patenaService": patenaServiceMock,
        fs: fsMock,
        "fs-extra": fseMock,
        "./log/logService": mockLogger,
      });
      await taskService.runTask(createdTask);
      expect(createdTask.stateId).to.be.equals(constants.TASK_STATE_FINISHED);
      expect(createdTask.attempts).to.be.equals(2);
      expect(createdTask.output).not.to.be.undefined;
      expect(createdTask.output.result.sequence).to.be.equals("ABC");
    });
  });
});
