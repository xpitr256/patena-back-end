const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const application = require("../../app");
const proxyquire = require("proxyquire");
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

describe("/POST analyze route", () => {
  const validEmail = "valid@test.com";
  const validSequenceName = "TestName";
  const validSequenceValue = "AACCCCCCC";

  it("should return a 403 error for no token", (done) => {
    chai
      .request(application)
      .post("/analyze")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
  const invalidToken = tokenService.createTokenFor("fake");

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .post("/analyze")
      .set("Authorization", "Bearer " + invalidToken)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  const validToken = tokenService.createTokenFor(config.FRONT_END_NAME);

  it("should return a 400 error for no information", (done) => {
    chai
      .request(application)
      .post("/analyze")
      .set("Authorization", "Bearer " + validToken)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return a 400 error for invalid mail", (done) => {
    chai
      .request(application)
      .post("/analyze")
      .set("Authorization", "Bearer " + validToken)
      .send({
        email: "invalid",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return a 400 error for empty sequence", (done) => {
    chai
      .request(application)
      .post("/analyze")
      .set("Authorization", "Bearer " + validToken)

      .send({
        email: validEmail,
        sequence: {},
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return a 400 error for empty sequence value", (done) => {
    chai
      .request(application)
      .post("/analyze")
      .set("Authorization", "Bearer " + validToken)
      .send({
        email: validEmail,
        sequence: {
          name: validSequenceName,
          value: "",
        },
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return a 400 error for invalid sequence value. (It has "J" a non existent amino acid)', (done) => {
    chai
      .request(application)
      .post("/analyze")
      .set("Authorization", "Bearer " + validToken)
      .send({
        email: validEmail,
        sequence: {
          name: validSequenceName,
          value: "ABJ",
        },
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  describe("with valid analyze data ", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
    });

    it("should save the analyze task", (done) => {
      const emailServiceMock = {
        sendWorkInProgressMail: async function (email, language, workType, workId) {
          expect(email).to.be.equals(validEmail);
          expect(language).to.be.equals("en");
        },
      };

      const analyzeServiceWithMockedEmailService = proxyquire("../../services/analyzeService", {
        "./mail/mailService": emailServiceMock,
      });

      const analyzeWithMockedAnalyzeService = proxyquire("../../routes/analyze", {
        "../services/analyzeService": analyzeServiceWithMockedEmailService,
      });

      const application = proxyquire("../../app", {
        "./routes/analyze": analyzeWithMockedAnalyzeService,
      });

      chai
        .request(application)
        .post("/analyze")
        .set("Authorization", "Bearer " + validToken)
        .send({
          email: validEmail,
          sequence: {
            name: validSequenceName,
            value: validSequenceValue,
          },
        })
        .end(async (err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.orderNumber).to.be.lengthOf(36);
          const createdTasks = await Task.countDocuments();
          expect(createdTasks).to.be.equals(1);
          done();
        });
    });

    it("should not save the analyze task if createAnalysis from analyze service fails", (done) => {
      const analyzeServiceMock = {
        createAnalysis: async function (email, sequence) {
          return new Promise((resolve, reject) => {
            reject("Failing on purpose");
          });
        },
      };

      const analyzeWithFailingMockedAnalyzeService = proxyquire("../../routes/analyze", {
        "../services/analyzeService": analyzeServiceMock,
      });

      const application = proxyquire("../../app", {
        "./routes/analyze": analyzeWithFailingMockedAnalyzeService,
      });

      chai
        .request(application)
        .post("/analyze")
        .set("Authorization", "Bearer " + validToken)
        .send({
          email: validEmail,
          sequence: {
            name: validSequenceName,
            value: validSequenceValue,
          },
        })
        .end(async (err, res) => {
          expect(res).to.have.status(500);
          const createdTasks = await Task.countDocuments();
          expect(createdTasks).to.be.equals(0);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});
