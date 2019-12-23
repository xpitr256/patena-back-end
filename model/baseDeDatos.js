const mongoose = require('mongoose');
const config = require('../config/config.js');

async function conectarDB() {
    await mongoose.connect(config.MONGODB_URI, config.MONGODB_CONFIG).then(() => {
        console.log('MongoDB conectada!')
    }).catch(err => {
        console.log(err);
    })

}

module.exports = {
    conectarDB: async function() {
        await conectarDB();
    }
};