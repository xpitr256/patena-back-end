const mongoose = require('mongoose');
const config = require('../config/config.js');

module.exports = {
    connect: async function() {
        try {
            await mongoose.connect(config.MONGODB_URI, config.MONGODB_CONFIG);
            console.log('Successfully connected to Mongoose!');
        } catch (err) {
            console.error('Error connecting to Mongoose: ' + err);
        }
    }
};