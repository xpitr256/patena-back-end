const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const MockQueue = require("./../mocks/MockQueue");
const config = require("../../config/config");
const MockLogger = require("./../mocks/MockLogger");
const mockLogger = MockLogger.buildLogger(false);

describe("Task Executor worker", async () => {
  it("should init the Queue processing", async () => {
    const mockThrong = async (options) => {
      expect(options.workers).to.be.equals(1);
      await options.start();
    };

    const mockStartWith = async (workQueue) => {
      expect(workQueue.name).to.be.equals(config.PATENA_QUEUE_NAME);
      expect(workQueue.url).to.be.equals(config.REDIS_URL);
    };

    const mock = {
      getQueue: () => {
        return new MockQueue(config.PATENA_QUEUE_NAME, config.REDIS_URL);
      },
    };

    await proxyquire("../../workers/taskExecutorWorker", {
      throng: mockThrong,
      "../model/Queue": mock,
      "./taskExecutor": mockStartWith,
      "../services/log/logService": mockLogger,
    });
  }).timeout(10000);
});
