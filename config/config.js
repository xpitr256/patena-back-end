var config = {
    MONGODB_URI: process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost/test",
    MONGODB_CONFIG: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

module.exports = config;