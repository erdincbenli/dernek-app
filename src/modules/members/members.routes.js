const express = require("express");
const { requireAdmin, requireAuth } = require("../../middlewares/auth");
const { membersController } = require("./members.controller");

const router = express.Router();

router.get("/admin", requireAdmin, membersController.adminDashboard);

router.get("/admin/members", requireAdmin, membersController.list);
router.get("/admin/members/new", requireAdmin, membersController.newForm);
router.get("/admin/members/:id/edit", requireAdmin, membersController.editForm);
router.post("/admin/members", requireAdmin, membersController.create);
router.post("/admin/members/:id", requireAdmin, membersController.update);
router.post("/admin/members/:id/delete", requireAdmin, membersController.remove);

router.get("/member", requireAuth, membersController.memberPanel);

module.exports = { membersRoutes: router };
