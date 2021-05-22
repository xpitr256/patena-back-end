const logger = require("../../services/log/logService");
const statisticsService = require("../../services/statisticsService");

async function getSuccessRate(req, res) {
  try {
    const rate = await statisticsService.getSuccessRate();
    res.json({ success_rate: rate });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

module.exports = {
  getSuccessRate,
};
