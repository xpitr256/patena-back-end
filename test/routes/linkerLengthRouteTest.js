const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const application = require("../../app");

describe("/GET linker length route", () => {
  it("should return a 400 error for no distance value", (done) => {
    chai
      .request(application)
      .get("/linkerLength")
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return a 400 error for invalid distance value", (done) => {
    chai
      .request(application)
      .get("/linkerLength?distance=invalid")
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return a 400 error for negative distance value", (done) => {
    chai
      .request(application)
      .get("/linkerLength?distance=-3")
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return a 200 status for valid distance value", (done) => {
    chai
      .request(application)
      .get("/linkerLength?distance=3")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.equals(1);
        done();
      });
  });

  it("should return a 200 and length = 0 for distance value bigger than 100", (done) => {
    chai
      .request(application)
      .get("/linkerLength?distance=101")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.equals(0);
        done();
      });
  });
});
