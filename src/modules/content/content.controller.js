const { contentService } = require("./content.service");

const contentController = {
  newsPage: (req, res) => {
    const items = contentService.listNews();
    res.render("site/news", { items });
  },
  announcementsPage: (req, res) => {
    const items = contentService.listAnnouncements();
    res.render("site/announcements", { items });
  },
  galleryPage: (req, res) => {
    const items = contentService.listGallery();
    res.render("site/gallery", { items });
  },
  classifiedsPage: (req, res) => {
    const items = contentService.listClassifieds();
    res.render("site/classifieds", { items });
  },
  forumPage: (req, res) => {
    const topics = contentService.listForumTopics();
    res.render("site/forum", { topics });
  },
  forumTopicPage: (req, res) => {
    const topicId = Number(req.params.topicId);
    const topic = contentService.getForumTopic(topicId);
    if (!topic) return res.status(404).send("Not found");
    const posts = contentService.listForumPosts(topicId);
    res.render("site/forum", { topic, posts, topics: null });
  },

  createNews: (req, res) => {
    contentService.createNews(req.body);
    req.session.flash = { type: "success", message: "Haber eklendi." };
    res.redirect("/news");
  },
  createAnnouncement: (req, res) => {
    contentService.createAnnouncement(req.body);
    req.session.flash = { type: "success", message: "Duyuru eklendi." };
    res.redirect("/announcements");
  },
  createGallery: (req, res) => {
    contentService.createGallery(req.body);
    req.session.flash = { type: "success", message: "Galeri eklendi." };
    res.redirect("/gallery");
  },
  createClassified: (req, res) => {
    contentService.createClassified(req.body);
    req.session.flash = { type: "success", message: "Ilan eklendi." };
    res.redirect("/classifieds");
  },

  createForumTopic: (req, res) => {
    const id = contentService.createForumTopic(req.session.user.id, req.body);
    res.redirect(`/forum/${id}`);
  },
  createForumPost: (req, res) => {
    contentService.createForumPost(Number(req.params.topicId), req.session.user.id, req.body);
    res.redirect(`/forum/${req.params.topicId}`);
  }
};

module.exports = { contentController };
