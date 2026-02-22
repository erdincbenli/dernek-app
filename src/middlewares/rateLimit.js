const rateLimitLib = require("express-rate-limit");

function rateLimit() {
  return rateLimitLib({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  });
}

module.exports = { rateLimit };
