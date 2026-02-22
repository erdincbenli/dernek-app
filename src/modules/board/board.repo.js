const { db } = require("../../db/db");

const boardRepo = {
  listAll: () => db.prepare(
    "SELECT * FROM board_members ORDER BY is_active DESC, order_index ASC, id ASC"
  ).all(),

  listActive: () => db.prepare(
    "SELECT * FROM board_members WHERE is_active=1 ORDER BY order_index ASC, id ASC"
  ).all(),

  create: ({ title, full_name, order_index, is_active }) =>
    db.prepare("INSERT INTO board_members (title, full_name, order_index, is_active) VALUES (?,?,?,?)")
      .run(title, full_name, order_index, is_active ? 1 : 0),

  update: (id, { title, full_name, order_index, is_active }) =>
    db.prepare("UPDATE board_members SET title=?, full_name=?, order_index=?, is_active=? WHERE id=?")
      .run(title, full_name, order_index, is_active ? 1 : 0, id),

  remove: (id) => db.prepare("DELETE FROM board_members WHERE id=?").run(id),
};

module.exports = { boardRepo };
