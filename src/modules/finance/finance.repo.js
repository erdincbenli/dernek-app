const { db } = require("../../db/db");

const financeRepo = {
  addLedger: (row) =>
    db.prepare(
      "INSERT INTO ledger (member_id, type, amount_cents, description, ref_receipt_id) VALUES (?,?,?,?,?)"
    ).run(row.member_id, row.type, row.amount_cents, row.description || null, row.ref_receipt_id || null),

  sumForMember: (memberId) => {
    const r = db.prepare("SELECT COALESCE(SUM(amount_cents),0) AS s FROM ledger WHERE member_id=?")
      .get(memberId);
    return r.s;
  },

  listForMember: (memberId) =>
    db.prepare("SELECT * FROM ledger WHERE member_id=? ORDER BY created_at DESC, id DESC").all(memberId),

  listMembersBalances: () =>
    db.prepare(`
      SELECT m.*,
        COALESCE(SUM(l.amount_cents),0) AS balance_cents
      FROM members m
      LEFT JOIN ledger l ON l.member_id = m.id
      GROUP BY m.id
      ORDER BY m.id DESC
    `).all(),

  totalsAllMembers: () => {
    const r = db.prepare(`
      SELECT
        SUM(CASE WHEN balance_cents > 0 THEN balance_cents ELSE 0 END) AS total_debt_cents,
        SUM(CASE WHEN balance_cents < 0 THEN -balance_cents ELSE 0 END) AS total_credit_cents
      FROM (
        SELECT m.id, COALESCE(SUM(l.amount_cents),0) AS balance_cents
        FROM members m
        LEFT JOIN ledger l ON l.member_id = m.id
        GROUP BY m.id
      )
    `).get();
    return {
      total_debt_cents: r.total_debt_cents || 0,
      total_credit_cents: r.total_credit_cents || 0
    };
  }
};

module.exports = { financeRepo };
