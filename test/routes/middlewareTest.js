const middleware = require("../../routes/midddleware");
const expect = require("chai").expect;

describe("middleware.ErrorHandler", () => {
  let req;
  let res;
  const next = function () {};
  beforeEach(() => {
    req = {
      params: {},
      body: {},
      app: {
        get: (key) => {
          return this[key];
        },
        env: "development",
      },
    };

    res = {
      data: null,
      code: null,
      locals: {},
      status(status) {
        this.code = status;
        return this;
      },
      render(payload) {
        this.data = payload;
      },
    };
  });

  it("should handle error", () => {
    middleware.errorHandler(new Error("Test error"), req, res, next);
    expect(res.code).to.be.equals(500);
    expect(res.locals.message).to.be.equals("Test error");
    expect(res.data).to.be.equals("error");
  });
});
