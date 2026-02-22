const dotenv = require("dotenv");
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  SESSION_SECRET: process.env.SESSION_SECRET || "dev_secret",
  DB_PATH: process.env.DB_PATH || "./data/app.sqlite",
  APP_NAME: process.env.APP_NAME || "Dernek Yonetim Sistemi"
};

module.exports = { env };
