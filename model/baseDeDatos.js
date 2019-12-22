const mongoose = require('mongoose');
const config = require('../config/config.js');

function conectarDB() {
    mongoose.connect(config.MONGODB_URI, config.MONGODB_CONFIG)

}

module.exports = {
    conectarDB: function() {
        conectarDB();
    }
};