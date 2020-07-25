const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const constants = require("./../../../services/constants");

const DEBUG_MODE = false;
const genericErrorMessage = "FAILING ON PURPOSE";
const validTestMail = "valid@test.com";
const invalidTestMail = "WRONG-EMAIL";

function log(message) {
  if (DEBUG_MODE) {
    console.log(message);
  }
}

function setApiKey(key) {
  log("mailSenderMock:: setApiKey => OK");
}

describe("Mail Service", async () => {
  describe("sendContactMail", async () => {
    it("should send contact email notification for valid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => OK");
        expect(data).to.be.a("Object");
        expect(data.from).to.be.equals(validTestMail);
        expect(data.subject).to.be.equals("PATENA - New message");
        cb();
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      const result = await service.sendContactMail(
        validTestMail,
        "Name",
        "MessageContent"
      );
      expect(result).to.be.equals(undefined);
    });

    it("should fail sending contact email notification for invalid email", async () => {
      const invalidTestMail = "WRONG-EMAIL";

      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => FAILED");
        expect(data).to.be.a("Object");
        expect(data.from).to.be.equals(invalidTestMail);
        expect(data.subject).to.be.equals("PATENA - New message");
        cb(new Error(genericErrorMessage));
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      try {
        await service.sendContactMail(
          invalidTestMail,
          "Name",
          "MessageContent"
        );
      } catch (e) {
        expect(e.message).to.be.equals(genericErrorMessage);
      }
    });
  });

  describe("sendWorkInProgressMail", async () => {
    it("should send work in progress email notification for valid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => OK");
        expect(data).to.be.a("Object");
        expect(data.to).to.be.equals(validTestMail);
        expect(data.from).to.be.equals("no-reply@patena.herokuapp.com");
        expect(data.subject).to.be.equals("PATENA - New Linker Design job");
        cb();
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      const result = await service.sendWorkInProgressMail(
        validTestMail,
        "en",
        constants.TYPE_DESIGN,
        12345
      );
      expect(result).to.be.equals(undefined);
    });

    it("should fail sending work in progress email  notification for invalid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => FAILED");
        expect(data).to.be.a("Object");
        expect(data.to).to.be.equals(invalidTestMail);
        expect(data.from).to.be.equals("no-reply@patena.herokuapp.com");
        expect(data.subject).to.be.equals("PATENA - New Linker Analysis job");
        cb(new Error(genericErrorMessage));
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      try {
        await service.sendWorkInProgressMail(
          invalidTestMail,
          "en",
          constants.TYPE_ANALYSIS,
          12345
        );
      } catch (e) {
        expect(e.message).to.be.equals(genericErrorMessage);
      }
    });
  });

  describe("sendWorkSuccessMail", async () => {
    it("should send work success email notification for valid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => OK");
        expect(data).to.be.a("Object");
        expect(data.to).to.be.equals(validTestMail);
        expect(data.from).to.be.equals("no-reply@patena.herokuapp.com");
        expect(data.subject).to.be.equals(
          "PATENA - Linker Analysis job finished!"
        );
        cb();
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      const result = await service.sendWorkSuccessMail(
        validTestMail,
        "en",
        constants.TYPE_ANALYSIS,
        12345
      );
      expect(result).to.be.equals(undefined);
    });

    it("should fail sending work success email notification for invalid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => FAILED");
        expect(data).to.be.a("Object");
        expect(data.to).to.be.equals(invalidTestMail);
        expect(data.from).to.be.equals("no-reply@patena.herokuapp.com");
        expect(data.subject).to.be.equals(
          "PATENA - Linker Design job finished!"
        );
        cb(new Error(genericErrorMessage));
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      try {
        await service.sendWorkSuccessMail(
          invalidTestMail,
          "en",
          constants.TYPE_DESIGN,
          12345
        );
      } catch (e) {
        expect(e.message).to.be.equals(genericErrorMessage);
      }
    });
  });

  describe("sendWorkErrorMail", async () => {
    it("should send work error email notification for valid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => OK");
        expect(data).to.be.a("Object");
        expect(data.to).to.be.equals(validTestMail);
        expect(data.from).to.be.equals("no-reply@patena.herokuapp.com");
        expect(data.subject).to.be.equals("PATENA - Linker Design error");
        cb();
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      const result = await service.sendWorkErrorMail(
        validTestMail,
        "en",
        constants.TYPE_DESIGN,
        12345
      );
      expect(result).to.be.equals(undefined);
    });

    it("should fail sending work error email notification for invalid email", async () => {
      let mailSenderMock = {
        setApiKey: setApiKey,
      };

      mailSenderMock.send = function (data, cb) {
        log("mailSenderMock:: send => FAILED");
        expect(data).to.be.a("Object");
        expect(data.to).to.be.equals(invalidTestMail);
        expect(data.from).to.be.equals("no-reply@patena.herokuapp.com");
        expect(data.subject).to.be.equals("PATENA - Linker Analysis error");
        cb(new Error(genericErrorMessage));
      };

      const service = proxyquire("../../../services/mail/mailService", {
        "@sendgrid/mail": mailSenderMock,
      });

      try {
        await service.sendWorkErrorMail(
          invalidTestMail,
          "en",
          constants.TYPE_ANALYSIS,
          12345
        );
      } catch (e) {
        expect(e.message).to.be.equals(genericErrorMessage);
      }
    });
  });
});
