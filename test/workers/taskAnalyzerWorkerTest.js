const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const MockLogger = require("./../mocks/MockLogger");
const MockQueue = require("./../mocks/MockQueue");
const config = require("../../config/config");

describe("Task Analyzer worker", async () => {
  const mockLogger = MockLogger.buildLogger(false);

  it("should finished ok for a success task run", async () => {
    const mockSuccessTaskRun = function () {
      return new Promise((resolve) => {
        resolve();
      });
    };

    const mock = {
      getQueue: () => {
        return new MockQueue(config.PATENA_QUEUE_NAME, config.REDIS_URL);
      },
    };

    const mockWorkerFunctions = {
      exit: function (error) {
        expect(error).to.be.equals(undefined);
      },
    };

    await proxyquire("../../workers/taskAnalyzerWorker", {
      "./taskAnalyzer": mockSuccessTaskRun,
      "./workerFunctions": mockWorkerFunctions,
      "./../services/log/logService": mockLogger,
      "../model/Queue": mock,
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

    const mock = {
      getQueue: () => {
        return new MockQueue(config.PATENA_QUEUE_NAME, config.REDIS_URL);
      },
    };

    await proxyquire("../../workers/taskAnalyzerWorker", {
      "./taskAnalyzer": mockFailingTaskRun,
      "./workerFunctions": mockWorkerFunctions,
      "./../services/log/logService": mockLogger,
      "../model/Queue": mock,
    });
  });
});
