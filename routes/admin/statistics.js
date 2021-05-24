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

async function getAverageProcessingTime(req, res) {
  try {
    const timeInMinutes = await statisticsService.getAverageProcessingTime();
    res.json({ avg_minutes: timeInMinutes });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

async function getFastestProcessingTime(req, res) {
  try {
    const timeInMinutes = await statisticsService.getFastestProcessingTime();
    res.json({ time_minutes: timeInMinutes });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

async function getSlowestProcessingTime(req, res) {
  try {
    const timeInMinutes = await statisticsService.getSlowestProcessingTime();
    res.json({ time_minutes: timeInMinutes });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

async function getQueueStatus(req, res) {
  try {
    const status = await statisticsService.getQueueStatus();
    res.json(status);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

async function getQueueDesignTaskComposition(req, res) {
  try {
    const status = await statisticsService.getQueueDesignTaskComposition();
    res.json(status);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}

module.exports = {
  getSuccessRate,
  getAverageProcessingTime,
  getFastestProcessingTime,
  getSlowestProcessingTime,
  getQueueStatus,
  getQueueDesignTaskComposition,
};
