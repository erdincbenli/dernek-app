const express = require("express");
const { requireAdmin, requireAuth } = require("../../middlewares/auth");
const { contentController } = require("./content.controller");

const router = express.Router();

router.get("/news", contentController.newsPage);
router.get("/announcements", contentController.announcementsPage);
router.get("/gallery", contentController.galleryPage);
router.get("/classifieds", contentController.classifiedsPage);
router.get("/forum", contentController.forumPage);
router.get("/forum/:topicId", contentController.forumTopicPage);

router.post("/admin/news", requireAdmin, contentController.createNews);
router.post("/admin/announcements", requireAdmin, contentController.createAnnouncement);
router.post("/admin/gallery", requireAdmin, contentController.createGallery);
router.post("/admin/classifieds", requireAdmin, contentController.createClassified);

router.post("/forum/create", requireAuth, contentController.createForumTopic);
router.post("/forum/:topicId/post", requireAuth, contentController.createForumPost);

module.exports = { contentRoutes: router };
