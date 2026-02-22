const express = require("express");
const { requireAdmin } = require("../../middlewares/auth");
const { settingsController } = require("./settings.controller");

const router = express.Router();

router.get("/admin/site-settings", requireAdmin, settingsController.form);
router.post("/admin/site-settings", requireAdmin, settingsController.save);

module.exports = { settingsRoutes: router };
