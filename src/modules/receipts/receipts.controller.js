const { receiptsService } = require("./receipts.service");
const { membersService } = require("../members/members.service");
const { settingsService } = require("../settings/settings.service");

const receiptsController = {
  designerPage: (req, res) => {
    const tpl = receiptsService.getActiveTemplate();
    res.render("admin/receipt-designer", { tpl });
  },

  saveTemplate: (req, res) => {
    receiptsService.saveTemplate(req.body);
    req.session.flash = { type: "success", message: "Makbuz tasarimi kaydedildi." };
    res.redirect("/admin/receipt-designer");
  },

  createReceipt: (req, res) => {
    const memberId = Number(req.params.memberId);
    const member = membersService.getById(memberId);
    if (!member) return res.status(404).send("Member not found");

    const receiptId = receiptsService.createReceipt(member, req.body);
    req.session.flash = { type: "success", message: "Makbuz olusturuldu." };
    res.redirect(`/receipts/${receiptId}`);
  },

  viewReceipt: async (req, res) => {
    const user = req.session.user;
    const receipt = receiptsService.getReceipt(Number(req.params.id));
    if (!receipt) return res.status(404).send("Not found");

    if (user.role !== "admin" && user.member_id !== receipt.member_id) return res.status(403).send("Forbidden");

    const html = await receiptsService.renderReceiptHtml(receipt);
    res.send(html);
  }
  ,

  
  verifyReceipt: (req, res) => {
    const receipt = receiptsService.getReceipt(Number(req.params.id));
    if (!receipt) return res.status(404).send("Not found");

    const payload = JSON.parse(receipt.payload_json || "{}");

    const settings = settingsService.getSettings?.() || {};
    const orgName = settings.app_name || "Yesilce Kultur ve Dayanisma Dernegi";

    const issuedAt = receipt.issued_at ? new Date(receipt.issued_at) : new Date();
    const dateText = issuedAt.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const amountTry = (Number(receipt.amount_cents || 0) / 100);
    const amountText = new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amountTry);

    res.render("site/receipt-verify", {
      orgName,
      receipt: {
        id: receipt.id,
        receipt_no: receipt.receipt_no,
        dateText,
        amountText,
        member_name: payload.member_name || "",
        description: payload.description || "",
      },
    });
  }

};

module.exports = { receiptsController };
