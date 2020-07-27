module.exports = {
  MONGODB_URI: process.env.MONGO_URI || "mongodb://localhost/test",
  MONGODB_CONFIG: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  CONTACT_MAIL: process.env.CONTACT_MAIL || "nachoquique@gmail.com",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FRONT_END_BASE_URL: process.env.FRONT_END_BASE_URL,
  FRONT_END_NAME: process.env.FRONT_END_NAME || "test-patena-front-end",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "test-patena-secret-token",
};
