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
