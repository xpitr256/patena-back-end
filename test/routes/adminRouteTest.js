const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const application = require("../../app");
const proxyquire = require("proxyquire");
const constants = require("./../../services/constants");
const tokenService = require("./../../services/tokenService");
const config = require("./../../config/config");
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
const validTaskId = "550e8400-e29b-41d4-a716-446655440000";
const validTaskId1 = "550e8400-e29b-41d4-a716-446655440001";
const validTaskId2 = "550e8400-e29b-41d4-a716-446655440002";
const validTaskId3 = "550e8400-e29b-41d4-a716-446655440003";

const invalidToken = tokenService.createTokenFor("fake");
const validToken = tokenService.createTokenFor(config.FRONT_END_NAME);

describe("/tasks/:id route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/tasks/" + validTaskId)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/tasks/" + validTaskId)
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });
  it("should return a 404 error for invalid task id", (done) => {
    chai
      .request(application)
      .get("/tasks/1")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res.body).to.have.property("message").to.be.equal("There is no task with id: 1");
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const taskServiceMock = {
      getTaskForAdmin: async function (orderNumber) {
        return new Promise((resolve, reject) => {
          reject("getTaskForAdmin: Failing on purpose");
        });
      },
    };
    const taskWithMockedResultService = proxyquire("../../routes/admin/tasks", {
      "../../services/taskService": taskServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/tasks": taskWithMockedResultService,
    });

    chai
      .request(application)
      .get("/tasks/1")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with an already created task", () => {
    const finalSequence = "GAFAMGKWAHDEAMFPLAQMPV";

    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should get the task", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/tasks/" + validTaskId)
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.status).to.be.equals("Pending");
          expect(res.body.duration).to.be.equals("-");
          expect(res.body.type).to.be.equals("No initial data");
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/tasks/:id/retry route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .put("/tasks/" + validTaskId + "/retry")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .put("/tasks/" + validTaskId + "/retry")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return a 404 error for no taskId", (done) => {
    chai
      .request(application)
      .put("/tasks//retry")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });
  it("should return a 404 error for invalid task id", (done) => {
    chai
      .request(application)
      .put("/tasks/1/retry")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res.body).to.have.property("message").to.be.equal("There is no task with id: 1");
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const taskServiceMock = {
      retryCancelledTask: async function (orderNumber) {
        return new Promise((resolve, reject) => {
          reject("retryCancelledTask: Failing on purpose");
        });
      },
    };
    const taskWithMockedResultService = proxyquire("../../routes/admin/tasks", {
      "../../services/taskService": taskServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/tasks": taskWithMockedResultService,
    });

    chai
      .request(application)
      .put("/tasks/1/retry")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with a cancelled task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_CANCELLED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should update the task status", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .put("/tasks/" + validTaskId + "/retry")
        .set("Authorization", "Bearer " + validToken)
        .end(async (err, res) => {
          expect(res).to.have.status(204);
          const updatedTask = await Task.find({
            id: validTaskId,
          });
          expect(updatedTask).not.to.be.equals(undefined);
          expect(updatedTask[0]).not.to.be.equals(undefined);
          expect(updatedTask[0].stateId).to.be.equals(constants.TASK_STATE_PENDING);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with a not cancelled task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_IN_PROGRESS,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should return a bad request status 400 and not update the task status", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .put("/tasks/" + validTaskId + "/retry")
        .set("Authorization", "Bearer " + validToken)
        .end(async (err, res) => {
          expect(res).to.have.status(400);
          const notUpdatedTask = await Task.find({
            id: validTaskId,
          });
          expect(notUpdatedTask).not.to.be.equals(undefined);
          expect(notUpdatedTask[0]).not.to.be.equals(undefined);
          expect(notUpdatedTask[0].stateId).to.be.equals(constants.TASK_STATE_IN_PROGRESS);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/tasks route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/tasks")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/tasks")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });
  it("should return a 400 error for invalid task state", (done) => {
    chai
      .request(application)
      .get("/tasks?state=invalid")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res.body).to.have.property("message").to.be.equal("Invalid task state: invalid");
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const taskServiceMock = {
      getTasks: async function () {
        return new Promise((resolve, reject) => {
          reject("getTaskForAdmin: Failing on purpose");
        });
      },
    };
    const taskWithMockedResultService = proxyquire("../../routes/admin/tasks", {
      "../../services/taskService": taskServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/tasks": taskWithMockedResultService,
    });

    chai
      .request(application)
      .get("/tasks")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with already created task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should get the task", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/tasks")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.total).to.be.equals(1);
          expect(res.body.tasks).to.be.array();
          expect(res.body.tasks).to.be.ofSize(1);
          expect(res.body.tasks[0].status).to.be.equals("Pending");
          expect(res.body.tasks[0].duration).to.be.equals("-");
          expect(res.body.tasks[0].type).to.be.equals("No initial data");
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with created tasks", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const finishedTask = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await finishedTask.save();

      const inProgressTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_IN_PROGRESS,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await inProgressTask.save();

      const firstPendingTask = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await firstPendingTask.save();

      const secondPendingTask = new Task({
        id: validTaskId3,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await secondPendingTask.save();
    });

    it("should get the task order by state and creation date from new to oldest one", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/tasks")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.total).to.be.equals(4);
          expect(res.body.tasks).to.be.array();
          expect(res.body.tasks).to.be.ofSize(4);
          expect(res.body.tasks[0].status).to.be.equals("Pending");
          expect(res.body.tasks[1].status).to.be.equals("Pending");
          expect(res.body.tasks[2].status).to.be.equals("In Progress");
          expect(res.body.tasks[3].status).to.be.equals("Finished");
          done();
        });
    });

    it("should get the right total", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/tasks?limit=2")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.total).to.be.equals(4);
          expect(res.body.tasks).to.be.array();
          expect(res.body.tasks).to.be.ofSize(2);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});
