const mongoose = require('mongoose');
const config = require('../config/config.js');
const logger = require('../services/log/logService');

module.exports = {
    connect: async function() {
        try {
            await mongoose.connect(config.MONGODB_URI, config.MONGODB_CONFIG);
            logger.log('Successfully connected to the DB');
        } catch (err) {
            logger.error('Error connecting to DB: ' + err);
        }
    }
};