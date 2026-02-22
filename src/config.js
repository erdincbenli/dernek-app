const path = require("path");

module.exports = {
  appName: process.env.APP_NAME || "Dernek Uygulamasi",
  appShort: process.env.APP_SHORT || "DERNEK",
  appPrimary: process.env.APP_PRIMARY || "#2F5BEA",
  port: Number(process.env.PORT || 3000),
  sessionSecret: process.env.SESSION_SECRET || "dev-secret",
  dbPath: process.env.DB_PATH || path.join(process.cwd(), "data", "app.sqlite"),
};
