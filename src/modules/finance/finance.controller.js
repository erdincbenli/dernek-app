const { financeService } = require("./finance.service");
const { membersService } = require("../members/members.service");

const financeController = {
  adminOverview: (req, res) => {
    const rows = financeService.listMembersBalances();
    res.render("finance/overview", { rows, mode: "admin" });
  },

  addDebt: (req, res) => {
    financeService.addDebt(Number(req.params.memberId), req.body);
    req.session.flash = { type: "success", message: "Borc eklendi." };
    res.redirect("/admin/finance");
  },

  addPayment: (req, res) => {
    financeService.addPayment(Number(req.params.memberId), req.body);
    req.session.flash = { type: "success", message: "Odeme eklendi." };
    res.redirect("/admin/finance");
  },

  memberOverview: (req, res) => {
    const user = req.session.user;
    if (!user.member_id) return res.status(400).send("Bu kullanici bir uye ile iliskili degil.");

    const member = membersService.getById(user.member_id);
    const data = financeService.getMemberFinance(user.member_id);
    res.render("finance/overview", { rows: [ { member, ...data } ], mode: "member" });
  }
};

module.exports = { financeController };
