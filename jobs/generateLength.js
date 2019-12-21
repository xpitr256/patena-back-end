const service = require('../services/linkerLengthService');
const mongoose = require('mongoose');
const config = require('../config/config');

async function run() {

    await mongoose.connect(config.MONGODB_URI, config.MONGODB_CONFIG);

    await mongoose.connection.dropDatabase();

    await service.generateLength();
}

run().then(function() {
    console.log("El reporte ha sido cargado");
    process.exit();
}).catch(error => console.error(error));