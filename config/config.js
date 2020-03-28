module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/test",
    MONGODB_CONFIG: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    CONTACT_MAIL: process.env.CONTACT_MAIL || 'nachoquique@gmail.com',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    FRONT_END_BASE_URL: process.env.FRONT_END_BASE_URL
};