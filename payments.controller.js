const { paymentsService } = require("./payments.service");
const { settingsService } = require("../settings/settings.service");

const paymentsController = {
  publicForm: (req, res) => {
    const s = settingsService.get();
    res.render("site/pay", { s, errors: null });
  },

  publicSubmit: (req, res) => {
    const r = paymentsService.createBankTransferRequest(req.body, req.file || null);
    if (!r.ok) {
      const s = settingsService.get();
      return res.status(400).render("site/pay", { s, errors: r.error });
    }
    req.session.flash = { type: "success", message: "Odeme bildiriminiz alindi. Admin onayindan sonra bakiyenize yansir." };
    res.redirect("/");
  },

  adminList: (req, res) => {
    const pending = paymentsService.adminList("pending");
    const approved = paymentsService.adminList("approved");
    const rejected = paymentsService.adminList("rejected");
    res.render("admin/payment-requests", { pending, approved, rejected });
  },

  approve: (req, res) => {
    const r = paymentsService.approve(req.params.id, req.session.user.id);
    if (!r.ok) {
      req.session.flash = { type: "danger", message: r.error };
      return res.redirect("/admin/payments");
    }
    req.session.flash = { type: "success", message: "Odeme onaylandi ve makbuz olusturuldu." };
    res.redirect("/admin/payments");
  },

  reject: (req, res) => {
    const r = paymentsService.reject(req.params.id, req.session.user.id);
    if (!r.ok) {
      req.session.flash = { type: "danger", message: r.error };
      return res.redirect("/admin/payments");
    }
    req.session.flash = { type: "success", message: "Odeme reddedildi." };
    res.redirect("/admin/payments");
  }
};

module.exports = { paymentsController };
