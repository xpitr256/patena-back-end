const expect = require("chai").expect;
const proxyquire = require("proxyquire");

describe("Task worker", async () => {
  const mockLogger = {
    log: function () {},
    error: function () {},
  };

  it("should finished ok for a success task run", async () => {
    const mockSuccessTaskRun = function () {
      return new Promise((resolve) => {
        resolve();
      });
    };

    const mockWorkerFunctions = {
      exit: function (error) {
        expect(error).to.be.equals(undefined);
      },
    };

    await proxyquire("../../workers/taskWorker", {
      "./taskAnalyzer": mockSuccessTaskRun,
      "./workerFunctions": mockWorkerFunctions,
      "./../services/log/logService": mockLogger,
    });
  });

  it("should fail for a failing task run", async () => {
    const mockFailingTaskRun = function () {
      return new Promise((resolve, reject) => {
        reject("Failing task");
      });
    };

    const mockWorkerFunctions = {
      exit: function (error) {
        expect(error).to.be.equals(1);
      },
    };

    await proxyquire("../../workers/taskWorker", {
      "./taskAnalyzer": mockFailingTaskRun,
      "./workerFunctions": mockWorkerFunctions,
      "./../services/log/logService": mockLogger,
    });
  });
});
