const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const constants = require("./../../services/constants");

describe("Design Service", () => {
  it("should create a design Task and return generated id", async () => {
    const taskServiceMock = {
      create: async function (id, taskData, typeId) {},
    };
    const designService = proxyquire("../../services/designService", {
      "./taskService": taskServiceMock,
    });
    const id = await designService.createDesign({});
    expect(id).not.to.be.undefined;
    expect(id).to.be.lengthOf(36);
  });

  it("should create a design Task and notify user mail in selected default (english) language if no language is specified", async () => {
    const taskServiceMock = {
      create: async function (id, taskData, typeId) {},
    };
    const mailServiceMock = {
      sendWorkInProgressMail: function (email, language, workType, workId) {
        expect(email).to.be.equals("test@test.com");
        expect(language).to.be.equals("en");
        expect(workType).to.be.equals(constants.TYPE_DESIGN);
      },
    };
    const designService = proxyquire("../../services/designService", {
      "./taskService": taskServiceMock,
      "./mail/mailService": mailServiceMock,
    });
    const id = await designService.createDesign({
      email: "test@test.com",
    });
    expect(id).not.to.be.undefined;
    expect(id).to.be.lengthOf(36);
  });

  it('should create a design Task and notify user mail in selected "es" (spanish) language', async () => {
    const taskServiceMock = {
      create: async function (id, taskData, typeId) {},
    };
    const mailServiceMock = {
      sendWorkInProgressMail: function (email, language, workType, workId) {
        expect(email).to.be.equals("test@test.com");
        expect(language).to.be.equals("es");
        expect(workType).to.be.equals(constants.TYPE_DESIGN);
      },
    };
    const designService = proxyquire("../../services/designService", {
      "./taskService": taskServiceMock,
      "./mail/mailService": mailServiceMock,
    });
    const id = await designService.createDesign({
      email: "test@test.com",
      language: "es",
    });
    expect(id).not.to.be.undefined;
    expect(id).to.be.lengthOf(36);
  });

  it("should fail if it is not possible to create a new design Task ", async () => {
    const taskServiceMock = {
      create: async function (id, taskData, typeId) {
        return new Promise((resolve, reject) => {
          reject("Failed on purpose");
        });
      },
    };
    const designService = proxyquire("../../services/designService", {
      "./taskService": taskServiceMock,
    });

    const result = await designService.createDesign({});
    expect(result).to.be.an("Error");
  });
});
