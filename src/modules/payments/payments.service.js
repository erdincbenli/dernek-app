const { paymentsRepo } = require("./payments.repo");
const { membersRepo } = require("../members/members.repo");
const { financeRepo } = require("../finance/finance.repo");
const { receiptsService } = require("../receipts/receipts.service");

function toCents(v) {
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

const paymentsService = {
  createBankTransferRequest: (body, file) => {
    const member_id = Number(body.member_id || 0);
    const amount_cents = Math.abs(toCents(body.amount));
    if (!member_id || !amount_cents) return { ok: false, error: "Uye no ve tutar zorunlu." };

    const member = membersRepo.getById(member_id);
    if (!member) return { ok: false, error: "Uye bulunamadi." };

    const note = body.note || "";
    const receipt_path = file ? file.webPath : null;

    const id = paymentsRepo.createRequest({ member_id, amount_cents, note, receipt_path });
    return { ok: true, id };
  },

  adminList: (status) => paymentsRepo.listForAdmin(status),

  approve: (id, adminUserId) => {
    const pr = paymentsRepo.getById(Number(id));
    if (!pr) return { ok: false, error: "Kayit bulunamadi." };
    if (pr.status !== "pending") return { ok: false, error: "Bu kayit zaten islenmis." };

    const member = membersRepo.getById(pr.member_id);
    const receiptId = receiptsService.createReceipt(member, {
      amount: (pr.amount_cents / 100).toFixed(2),
      description: pr.note ? `Banka transferi - ${pr.note}` : "Banka transferi"
    });

    financeRepo.addLedger({
      member_id: pr.member_id,
      type: "payment",
      amount_cents: -Math.abs(pr.amount_cents),
      description: pr.note ? `Banka transferi - ${pr.note}` : "Banka transferi",
      ref_receipt_id: receiptId
    });

    paymentsRepo.updateStatus(Number(id), "approved", adminUserId, new Date().toISOString(), receiptId);
    return { ok: true, receiptId };
  },

  reject: (id, adminUserId) => {
    const pr = paymentsRepo.getById(Number(id));
    if (!pr) return { ok: false, error: "Kayit bulunamadi." };
    if (pr.status !== "pending") return { ok: false, error: "Bu kayit zaten islenmis." };
    paymentsRepo.updateStatus(Number(id), "rejected", adminUserId, new Date().toISOString(), null);
    return { ok: true };
  }
};

module.exports = { paymentsService };
