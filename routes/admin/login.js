const User = require("../../model/schema/User");
const bcrypt = require("bcryptjs");
const tokenService = require("../../services/tokenService");
const config = require("../../config/config");
const logger = require("../../services/log/logService");

async function loginUser(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send({ message: "Sorry, email or password incorrect." });
      return;
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      res.status(401).send({ auth: false, token: null, message: "Sorry, email or password incorrect" });
    } else {
      const token = tokenService.createExpireToken(user.name, config.TOKEN_EXPIRATION_TIME_IN_HS);
      res.status(200).send({ auth: true, token: token });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: "There was an error with login." });
  }
}

module.exports = {
  loginUser,
};
