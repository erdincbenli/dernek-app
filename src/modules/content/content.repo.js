const { db } = require("../../db/db");

const contentRepo = {
  list: (table) => db.prepare(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 100`).all(),

  create: (table, b) => {
    if (table === "gallery") {
      return db.prepare("INSERT INTO gallery (title, image_url) VALUES (?,?)")
        .run(b.title || "", b.image_url || "");
    }
    return db.prepare(`INSERT INTO ${table} (title, body) VALUES (?,?)`)
      .run(b.title || "", b.body || "");
  },

  listForumTopics: () =>
    db.prepare("SELECT * FROM forum_topics ORDER BY id DESC LIMIT 100").all(),

  getForumTopic: (id) =>
    db.prepare("SELECT * FROM forum_topics WHERE id=?").get(id),

  listForumPosts: (topicId) =>
    db.prepare("SELECT * FROM forum_posts WHERE topic_id=? ORDER BY id ASC").all(topicId),

  createForumTopic: (userId, b) => {
    const info = db.prepare("INSERT INTO forum_topics (title, body, created_by_user_id) VALUES (?,?,?)")
      .run(b.title || "", b.body || "", userId);
    return Number(info.lastInsertRowid);
  },

  createForumPost: (topicId, userId, b) =>
    db.prepare("INSERT INTO forum_posts (topic_id, body, created_by_user_id) VALUES (?,?,?)")
      .run(topicId, b.body || "", userId)
};

module.exports = { contentRepo };
