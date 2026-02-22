const { contentRepo } = require("./content.repo");

const contentService = {
  listNews: () => contentRepo.list("news"),
  listAnnouncements: () => contentRepo.list("announcements"),
  listGallery: () => contentRepo.list("gallery"),
  listClassifieds: () => contentRepo.list("classifieds"),

  createNews: (b) => contentRepo.create("news", b),
  createAnnouncement: (b) => contentRepo.create("announcements", b),
  createGallery: (b) => contentRepo.create("gallery", b),
  createClassified: (b) => contentRepo.create("classifieds", b),

  listForumTopics: () => contentRepo.listForumTopics(),
  getForumTopic: (id) => contentRepo.getForumTopic(id),
  listForumPosts: (topicId) => contentRepo.listForumPosts(topicId),
  createForumTopic: (userId, b) => contentRepo.createForumTopic(userId, b),
  createForumPost: (topicId, userId, b) => contentRepo.createForumPost(topicId, userId, b)
};

module.exports = { contentService };
