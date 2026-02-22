const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { requireAdmin } = require("../../middlewares/auth");
const { paymentsController } = require("./payments.controller");
const { DATA_DIR } = require("../../db/db");

const router = express.Router();

// uploads dir (db ile aynı data klasöründe olsun)
const uploadDir = path.join(DATA_DIR, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = String(file.originalname || "dekont")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(-80);
    cb(null, `${Date.now()}_${safe}`);
  }
});

const upload = multer({ storage });

// Public (no login required)
router.get("/pay", paymentsController.publicForm);
router.post("/pay", upload.single("receipt"), paymentsController.publicSubmit);

// Admin
router.get("/admin/payments", requireAdmin, paymentsController.adminList);
router.post("/admin/payments/:id/approve", requireAdmin, paymentsController.approve);
router.post("/admin/payments/:id/reject", requireAdmin, paymentsController.reject);

module.exports = { paymentsRoutes: router };