const { db } = require("../../db/db");

const membersRepo = {
  list: () =>
    db.prepare("SELECT * FROM members ORDER BY id DESC").all(),

  getById: (id) =>
    db.prepare("SELECT * FROM members WHERE id = ?").get(id),

  create: (m) =>
    db.prepare(
      "INSERT INTO members (full_name, phone, email, address, is_active) VALUES (?,?,?,?,?)"
    ).run(
      m.full_name,
      m.phone || null,
      m.email || null,
      m.address || null,
      m.is_active ? 1 : 0
    ),

  update: (id, m) =>
    db.prepare(
      "UPDATE members SET full_name=?, phone=?, email=?, address=?, is_active=? WHERE id=?"
    ).run(
      m.full_name,
      m.phone || null,
      m.email || null,
      m.address || null,
      m.is_active ? 1 : 0,
      id
    ),

  remove: (id) =>
    db.prepare("DELETE FROM members WHERE id = ?").run(id),

  countAll: () =>
    db.prepare("SELECT COUNT(*) as c FROM members").get().c,

  countActive: () =>
    db.prepare("SELECT COUNT(*) as c FROM members WHERE is_active = 1").get().c
};

module.exports = { membersRepo };
