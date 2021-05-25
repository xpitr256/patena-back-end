const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const application = require("../../app");
const proxyquire = require("proxyquire");
const bcrypt = require("bcryptjs");

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

const User = require("../../model/schema/User");

const testName = "testName";
const testEmail = "tes@tes.com";
const testPassword = "123456";

describe("/login route", () => {
  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });

  it("should return a 404 for empty request body", (done) => {
    chai
      .request(application)
      .post("/login")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message").to.be.equal("Sorry, that user does not appear to exist.");
        done();
      });
  });

  describe("With existent created User", (done) => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
      const user = new User({
        name: testName,
        email: testEmail,
        password: bcrypt.hashSync(testPassword, 8),
      });
      await user.save();
    });

    it("should return 401 not authorized for invalid password", (done) => {
      chai
        .request(application)
        .post("/login")
        .send({
          name: testName,
          email: testEmail,
          password: "wrongPassword",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("auth").to.be.equal(false);
          expect(res.body).to.have.property("token").to.be.equal(null);
          done();
        });
    });

    it("should return 200 for valid user login ", (done) => {
      chai
        .request(application)
        .post("/login")
        .send({
          name: testName,
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("auth").to.be.equal(true);
          expect(res.body).to.have.property("token").to.be.not.equal(null);
          done();
        });
    });

    it("should return 500 for internal error", (done) => {
      const userMock = {
        findOne: async function (orderNumber) {
          return new Promise((resolve, reject) => {
            reject("findOne: Failing on purpose");
          });
        },
      };
      const loginWithMockedUser = proxyquire("../../routes/admin/login", {
        "../../model/schema/User": userMock,
        "../../services/log/logService": mockLogger,
      });

      const application = proxyquire("../../app", {
        "./routes/admin/login": loginWithMockedUser,
      });

      chai
        .request(application)
        .post("/login")
        .send({
          name: testName,
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });
});
