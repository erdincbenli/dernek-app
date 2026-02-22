const express = require("express");
const { authController } = require("./auth.controller");

const router = express.Router();

router.get("/login", authController.loginPage);
router.post("/login", authController.login);

// Backward-compatible admin login URLs
router.get("/admin/login", authController.loginPage);
router.post("/admin/login", authController.login);
router.post("/logout", authController.logout);
router.post("/admin/logout", authController.logout);

module.exports = { authRoutes: router };
