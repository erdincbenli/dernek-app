const { db } = require("../../db/db");

const receiptsRepo = {
  getTemplate: () => {
    const t = db.prepare("SELECT * FROM receipt_templates WHERE name=? ORDER BY id DESC LIMIT 1")
      .get("Default");
    return t || { name: "Default", html: "", css: "" };
  },

  saveTemplate: (t) => {
    db.prepare("INSERT INTO receipt_templates (name, html, css, updated_at) VALUES (?,?,?,datetime('now'))")
      .run(t.name, t.html, t.css);
  },

  createReceiptRow: (r) => {
    const info = db.prepare(
      "INSERT INTO receipts (member_id, receipt_no, amount_cents, payload_json) VALUES (?,?,?,?)"
    ).run(r.member_id, r.receipt_no, r.amount_cents, r.payload_json);
    return Number(info.lastInsertRowid);
  },

  updateReceiptNo: (id, receipt_no) =>
    db.prepare("UPDATE receipts SET receipt_no=? WHERE id=?").run(receipt_no, id),

  getReceipt: (id) =>
    db.prepare("SELECT * FROM receipts WHERE id=?").get(id)
};

module.exports = { receiptsRepo };
