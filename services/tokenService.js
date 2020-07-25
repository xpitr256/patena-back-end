const jwt = require("jwt-simple");
const config = require("./../config/config.js");

exports.createTokenFor = (subject) => {
  const payload = {
    sub: subject,
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};
