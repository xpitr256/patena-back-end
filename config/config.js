module.exports = {
  MONGODB_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/patena",
  MONGODB_CONFIG: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  CONTACT_MAIL: process.env.CONTACT_MAIL || "nachoquique@gmail.com",
  SEND_EMAILS: process.env.SEND_EMAILS === "true",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FRONT_END_BASE_URL: process.env.FRONT_END_BASE_URL || "http://localhost:3000/",
  FRONT_END_NAME: process.env.FRONT_END_NAME || "patena-web-front-end",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "patena-secret-token-value",
  TOKEN_EXPIRATION_TIME_IN_HS: process.env.TOKEN_EXPIRATION_TIME_IN_HS || 2,
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  WEB_CONCURRENCY: process.env.WEB_CONCURRENCY || 1,
  JOB_CONCURRENCY: process.env.JOB_CONCURRENCY || 5,
  MAX_JOB_EXECUTION_TIME_IN_MS_SECONDS: process.env.MAX_JOB_EXECUTION_TIME_IN_MS_SECONDS || 172800000, // 2 days
  PATENA_QUEUE_NAME: process.env.PATENA_QUEUE_NAME || "patena-v2",
};
