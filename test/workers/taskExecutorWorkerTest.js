const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const MockQueue = require("./../mocks/MockQueue");
const constants = require("../../services/constants");
const config = require("../../config/config");

describe("Task Executor worker", async () => {
  it("should init the Queue processing", async () => {
    const mockThrong = async (options) => {
      expect(options.workers).to.be.equals(1);
      await options.start();
    };

    const mockStartWith = async (workQueue) => {
      expect(workQueue.name).to.be.equals(constants.PATENA_QUEUE_NAME);
      expect(workQueue.url).to.be.equals(config.REDIS_URL);
    };

    await proxyquire("../../workers/taskExecutorWorker", {
      throng: mockThrong,
      bull: MockQueue,
      "./taskExecutor": mockStartWith,
    });
  });
});
