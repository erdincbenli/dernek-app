const express = require("express");
const { requireAdmin } = require("../../middlewares/auth");
const { boardController } = require("./board.controller");

const router = express.Router();

router.get("/admin/board", requireAdmin, boardController.page);
router.post("/admin/board", requireAdmin, boardController.create);
router.post("/admin/board/:id", requireAdmin, boardController.update);
router.post("/admin/board/:id/delete", requireAdmin, boardController.remove);

module.exports = { boardRoutes: router };
