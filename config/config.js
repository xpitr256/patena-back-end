module.exports = {
  MONGODB_URI: process.env.MONGO_URI || "mongodb://localhost/test",
  MONGODB_CONFIG: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  CONTACT_MAIL: process.env.CONTACT_MAIL || "nachoquique@gmail.com",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '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',
  FRONT_END_BASE_URL: process.env.FRONT_END_BASE_URL || "http://localhost:3000/",
  FRONT_END_NAME: process.env.FRONT_END_NAME || "patena-web-front-end",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "patena-secret-token-value",
};
