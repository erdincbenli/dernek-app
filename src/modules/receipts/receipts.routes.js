const express = require("express");
const { requireAdmin, requireAuth } = require("../../middlewares/auth");
const { receiptsController } = require("./receipts.controller");

const router = express.Router();

router.get("/admin/receipt-designer", requireAdmin, receiptsController.designerPage);
router.post("/admin/receipt-template/save", requireAdmin, receiptsController.saveTemplate);

router.post("/admin/receipts/:memberId/create", requireAdmin, receiptsController.createReceipt);
router.get("/receipts/:id", requireAuth, receiptsController.viewReceipt);
router.get("/receipt/:id", receiptsController.verifyReceipt);

module.exports = { receiptsRoutes: router };
