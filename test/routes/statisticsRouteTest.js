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
const validTaskId4 = "550e8400-e29b-41d4-a716-446655440004";
const validTaskId5 = "550e8400-e29b-41d4-a716-446655440005";

const invalidToken = tokenService.createTokenFor("fake");
const validToken = tokenService.createTokenFor(config.FRONT_END_NAME);

describe("/statistics/rate route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/statistics/rate")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/statistics/rate")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const statisticsServiceMock = {
      getSuccessRate: async function () {
        return new Promise((resolve, reject) => {
          reject("getSuccessRate: Failing on purpose");
        });
      },
    };
    const statisticsWithStatisticsMockedService = proxyquire("../../routes/admin/statistics", {
      "../../services/statisticsService": statisticsServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/statistics": statisticsWithStatisticsMockedService,
    });

    chai
      .request(application)
      .get("/statistics/rate")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with no finished task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should get a 0% rate", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/rate")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.success_rate).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 1 cancelled task", () => {
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

    it("should get a 0% rate", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/rate")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.success_rate).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 1 finished task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should get a 100% rate", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/rate")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.success_rate).to.be.equals(100);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 1 finished task + 1 cancelled task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_CANCELLED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();
    });

    it("should get a 50% rate", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/rate")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.success_rate).to.be.equals(50);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task + 1 cancelled task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_CANCELLED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();

      const otherFinishedTask = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await otherFinishedTask.save();
    });

    it("should get a 67% rate", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/rate")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.success_rate).to.be.equals(67);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/statistics/time/average route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/statistics/time/average")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/statistics/time/average")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const statisticsServiceMock = {
      getAverageProcessingTime: async function () {
        return new Promise((resolve, reject) => {
          reject("getAverageProcessingTime: Failing on purpose");
        });
      },
    };
    const statisticsWithStatisticsMockedService = proxyquire("../../routes/admin/statistics", {
      "../../services/statisticsService": statisticsServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/statistics": statisticsWithStatisticsMockedService,
    });

    chai
      .request(application)
      .get("/statistics/time/average")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with no finished task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should get a 0 as avg time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/average")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.avg_minutes).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 1 cancelled task", () => {
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

    it("should get a 0 avg time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/average")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.avg_minutes).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with only 1 finished task of 5 minutes", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should get a 5 avg time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/average")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.avg_minutes).to.be.equals(5);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task with 10 and 2 minutes", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 10,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 2,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();
    });

    it("should get an avg time of 6 minutes ", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/average")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.avg_minutes).to.be.equals(6);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task + 1 pending task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 25,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();

      const otherFinishedTask = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 15,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await otherFinishedTask.save();
    });

    it("should not consider pending task and only calculates avg for 2 finished tasks", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/average")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.avg_minutes).to.be.equals(20);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/statistics/time/fastest route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/statistics/time/fastest")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/statistics/time/fastest")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const statisticsServiceMock = {
      getFastestProcessingTime: async function () {
        return new Promise((resolve, reject) => {
          reject("getAverageProcessingTime: Failing on purpose");
        });
      },
    };
    const statisticsWithStatisticsMockedService = proxyquire("../../routes/admin/statistics", {
      "../../services/statisticsService": statisticsServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/statistics": statisticsWithStatisticsMockedService,
    });

    chai
      .request(application)
      .get("/statistics/time/fastest")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with no finished task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should get a 0 as fastest time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/fastest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 1 cancelled task", () => {
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

    it("should get a 0 fastest time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/fastest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with only 1 finished task of 5 minutes", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should get a 5 fastest time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/fastest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(5);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task with 10 and 2 minutes", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 10,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 2,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();
    });

    it("should get a fastest time of 2 minutes ", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/fastest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(2);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task + 1 pending task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 25,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();

      const otherFinishedTask = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 15,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await otherFinishedTask.save();
    });

    it("should avoid pending task and get fastest time between 2 finished tasks", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/fastest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(15);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/statistics/time/slowest route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/statistics/time/slowest")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/statistics/time/slowest")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const statisticsServiceMock = {
      getSlowestProcessingTime: async function () {
        return new Promise((resolve, reject) => {
          reject("getAverageProcessingTime: Failing on purpose");
        });
      },
    };
    const statisticsWithStatisticsMockedService = proxyquire("../../routes/admin/statistics", {
      "../../services/statisticsService": statisticsServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/statistics": statisticsWithStatisticsMockedService,
    });

    chai
      .request(application)
      .get("/statistics/time/slowest")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with no finished task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should get a 0 as slowest time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/slowest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 1 cancelled task", () => {
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

    it("should get a 0 slowest time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/slowest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with only 1 finished task of 5 minutes", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();
    });

    it("should get a 5 slowest time", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/slowest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(5);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task with 10 and 2 minutes", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 10,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 2,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();
    });

    it("should get a slowest time of 10 minutes ", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/slowest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(10);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 finished task + 1 pending task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const task = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 25,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await task.save();

      const cancelledTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();

      const otherFinishedTask = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 15,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await otherFinishedTask.save();
    });

    it("should avoid pending task and get slowest time between 2 finished tasks", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/time/slowest")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body.time_minutes).to.be.equals(25);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/statistics/queue/status route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/statistics/queue/status")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/statistics/queue/status")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const statisticsServiceMock = {
      getQueueStatus: async function () {
        return new Promise((resolve, reject) => {
          reject("getAverageProcessingTime: Failing on purpose");
        });
      },
    };
    const statisticsWithStatisticsMockedService = proxyquire("../../routes/admin/statistics", {
      "../../services/statisticsService": statisticsServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/statistics": statisticsWithStatisticsMockedService,
    });

    chai
      .request(application)
      .get("/statistics/queue/status")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with no task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should get a 0 value for 4 status", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/queue/status")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body).to.be.an.array();
          expect(res.body).to.be.ofSize(4);
          expect(res.body[0].value).to.be.equals(0);
          expect(res.body[1].value).to.be.equals(0);
          expect(res.body[2].value).to.be.equals(0);
          expect(res.body[3].value).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 task for finished status and 1 for others", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const pendingTask = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await pendingTask.save();

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
      const cancelledTask = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_CANCELLED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await cancelledTask.save();

      const finishedTask = new Task({
        id: validTaskId3,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await finishedTask.save();

      const finishedTask2 = new Task({
        id: validTaskId4,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: 1,
        },
        language: "en",
      });
      await finishedTask2.save();
    });

    it("should retrieve 1 for each one but 2 for finished", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/queue/status")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body).to.be.an.array();
          expect(res.body).to.be.ofSize(4);
          expect(res.body[0].value).to.be.equals(1);
          expect(res.body[1].value).to.be.equals(1);
          expect(res.body[2].value).to.be.equals(2);
          expect(res.body[3].value).to.be.equals(1);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});

describe("/statistics/queue/composition route", () => {
  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .get("/statistics/queue/composition")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .get("/statistics/queue/composition")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return 500 for internal error", (done) => {
    const statisticsServiceMock = {
      getQueueDesignTaskComposition: async function () {
        return new Promise((resolve, reject) => {
          reject("getAverageProcessingTime: Failing on purpose");
        });
      },
    };
    const statisticsWithStatisticsMockedService = proxyquire("../../routes/admin/statistics", {
      "../../services/statisticsService": statisticsServiceMock,
      "../../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/admin/statistics": statisticsWithStatisticsMockedService,
    });

    chai
      .request(application)
      .get("/statistics/queue/composition")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with no task", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should get a 0 value for 4 design types", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/queue/composition")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body).to.be.an.array();
          expect(res.body).to.be.ofSize(4);
          expect(res.body[0].value).to.be.equals(0);
          expect(res.body[1].value).to.be.equals(0);
          expect(res.body[2].value).to.be.equals(0);
          expect(res.body[3].value).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });

  describe("with 2 task for initial sequence design type and 1 for others", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();

      const noInitialSequenceTask = new Task({
        id: validTaskId,
        stateId: constants.TASK_STATE_PENDING,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: constants.DESIGN_TYPE_NO_INITIAL_SEQUENCE,
        },
        language: "en",
      });
      await noInitialSequenceTask.save();

      const onlyInitialTask = new Task({
        id: validTaskId1,
        stateId: constants.TASK_STATE_IN_PROGRESS,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
        },
        language: "en",
      });
      await onlyInitialTask.save();

      const onlyInitialTask2 = new Task({
        id: validTaskId2,
        stateId: constants.TASK_STATE_CANCELLED,
        typeId: constants.TYPE_DESIGN,
        taskData: {
          designType: constants.DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
        },
        language: "en",
      });
      await onlyInitialTask2.save();

      const onlyFlankingTask = new Task({
        id: validTaskId3,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: constants.DESIGN_TYPE_ONLY_FLANKING_SEQUENCES,
        },
        language: "en",
      });
      await onlyFlankingTask.save();

      const allTask = new Task({
        id: validTaskId4,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_DESIGN,
        executionMinutesElapsed: 5,
        taskData: {
          designType: constants.DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES,
        },
        language: "en",
      });
      await allTask.save();

      const analyseTask = new Task({
        id: validTaskId5,
        stateId: constants.TASK_STATE_FINISHED,
        typeId: constants.TYPE_ANALYSIS,
        executionMinutesElapsed: 5,
        language: "en",
      });
      await analyseTask.save();
    });

    it("should retrieve 1 for each one but 2 for finished", (done) => {
      const application = proxyquire("../../app", {});

      chai
        .request(application)
        .get("/statistics/queue/composition")
        .set("Authorization", "Bearer " + validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.not.null;
          expect(res.body).to.be.an.array();
          expect(res.body).to.be.ofSize(4);
          expect(res.body[0].value).to.be.equals(1);
          expect(res.body[1].value).to.be.equals(2);
          expect(res.body[2].value).to.be.equals(1);
          expect(res.body[3].value).to.be.equals(1);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});
