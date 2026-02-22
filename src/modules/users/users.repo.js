const { db } = require("../../db/db");

const usersRepo = {
  findByUsername: (username) =>
    db.prepare("SELECT * FROM users WHERE username = ?").get(username),

  findById: (id) =>
    db.prepare("SELECT * FROM users WHERE id = ?").get(id)
};

module.exports = { usersRepo };
