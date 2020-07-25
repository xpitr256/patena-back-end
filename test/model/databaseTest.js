const expect = require("chai").expect;
const proxyquire = require("proxyquire");

const DEBUG_MODE = false;
const genericErrorMessage = "FAILING ON PURPOSE";

function log(message) {
  if (DEBUG_MODE) {
    console.log(message);
  }
}

describe("Model Database", async () => {
  const mockLogger = {
    log: function () {},
    error: function () {},
  };

  it("should connect with valid credentials", async () => {
    const moongoseMock = {
      connect: async function (user, pass) {
        log("moongoseMock:: connect => OK");
      },
    };

    const database = proxyquire("../../model/database", {
      mongoose: moongoseMock,
      "../services/log/logService": mockLogger,
    });

    const result = await database.connect();
    expect(result).to.be.equals(undefined);
  });

  it("should not connect with invalid credentials", async () => {
    const moongoseMock = {
      connect: async function (user, pass) {
        log("moongoseMock:: connect => FAILED");
        return new Promise((resolve, reject) => {
          reject(genericErrorMessage);
        });
      },
    };

    const database = proxyquire("../../model/database", {
      mongoose: moongoseMock,
      "../services/log/logService": mockLogger,
    });

    const result = await database.connect();
    expect(result).to.be.equals(undefined);
  });

  it("should disconnect after being connected", async () => {
    const moongoseMock = {
      connect: async function (user, pass) {
        log("moongoseMock:: connect => OK");
      },
      disconnect: async function () {
        log("moongoseMock:: disconnect => OK");
      },
    };

    const database = proxyquire("../../model/database", {
      mongoose: moongoseMock,
      "../services/log/logService": mockLogger,
    });

    await database.connect();
    const result = await database.disconnect();
    expect(result).to.be.equals(undefined);
  });
});
