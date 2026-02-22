const { db } = require("../../db/db");

const paymentsRepo = {
  createRequest: (row) =>
    db.prepare(`INSERT INTO payment_requests (member_id, amount_cents, note, receipt_path)
      VALUES (?,?,?,?)`).run(row.member_id, row.amount_cents, row.note || null, row.receipt_path || null).lastInsertRowid,

  listForAdmin: (status) => db.prepare(`
    SELECT pr.*, m.full_name
    FROM payment_requests pr
    JOIN members m ON m.id = pr.member_id
    WHERE pr.status = ?
    ORDER BY pr.created_at DESC, pr.id DESC
  `).all(status),

  getById: (id) => db.prepare(`
    SELECT pr.*, m.full_name
    FROM payment_requests pr
    JOIN members m ON m.id = pr.member_id
    WHERE pr.id = ?
  `).get(id),

  updateStatus: (id, status, processed_by_user_id, processed_at, ref_receipt_id) =>
    db.prepare(`UPDATE payment_requests
      SET status=?, processed_by_user_id=?, processed_at=?, ref_receipt_id=?
      WHERE id=?`).run(status, processed_by_user_id || null, processed_at || null, ref_receipt_id || null, id)
};

module.exports = { paymentsRepo };
