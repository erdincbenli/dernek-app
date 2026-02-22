const { financeRepo } = require("./finance.repo");

function toCents(v) {
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

const financeService = {
  addDebt: (memberId, body) => {
    financeRepo.addLedger({
      member_id: memberId,
      type: "debt",
      amount_cents: Math.abs(toCents(body.amount)),
      description: body.description || "Aidat/Borc"
    });
  },

  addPayment: (memberId, body) => {
    financeRepo.addLedger({
      member_id: memberId,
      type: "payment",
      amount_cents: -Math.abs(toCents(body.amount)),
      description: body.description || "Odeme"
    });
  },

  getMemberFinance: (memberId) => {
    const sum = financeRepo.sumForMember(memberId);
    return {
      balance_cents: sum,
      balance_label: sum > 0 ? "Borclu" : (sum < 0 ? "Alacakli" : "Sifir"),
      ledger: financeRepo.listForMember(memberId)
    };
  },

  listMembersBalances: () => financeRepo.listMembersBalances(),

  totalsAllMembers: () => financeRepo.totalsAllMembers()
};

module.exports = { financeService };
