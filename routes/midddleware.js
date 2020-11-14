const jwt = require("jwt-simple");
const config = require("./../config/config.js");

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "There is no authorization headers" });
  }

  const token = req.headers.authorization.split(" ")[1];
  const payload = jwt.decode(token, config.TOKEN_SECRET);

  if (payload.sub !== config.FRONT_END_NAME) {
    return res.status(401).send({ message: "invalid token" });
  }

  next();
};

exports.errorHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};
