const service = require('../services/linkerLengthService');
const mongoose = require('mongoose');
const config = require('../config/config');

async function run() {

    await mongoose.connect(config.MONGODB_URI, config.MONGODB_CONFIG).then(() => {
        console.log('MongoDB conectada!')
    }).catch(err => {
        console.log(err);
    })

    await mongoose.connection.dropDatabase();

    await service.generateLength();
}

run().then(function() {
    console.log("Las longitudes fueron calculadas ha sido cargado");
    process.exit();
}).catch(error => console.error(error));

module.exports={
    run : async function () {
        return run();
    }
}