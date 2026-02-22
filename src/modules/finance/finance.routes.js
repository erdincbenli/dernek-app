const express = require("express");
const { requireAdmin, requireAuth } = require("../../middlewares/auth");
const { financeController } = require("./finance.controller");

const router = express.Router();

router.get("/admin/finance", requireAdmin, financeController.adminOverview);
router.post("/admin/finance/:memberId/debt", requireAdmin, financeController.addDebt);
router.post("/admin/finance/:memberId/payment", requireAdmin, financeController.addPayment);

router.get("/member/finance", requireAuth, financeController.memberOverview);

module.exports = { financeRoutes: router };
