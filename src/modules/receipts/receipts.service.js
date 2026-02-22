const { receiptsRepo } = require("./receipts.repo");
const QRCode = require("qrcode");
const { renderTemplate } = require("../../utils/template");

function toCents(v) {
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function money(cents) {
  const v = (cents / 100).toFixed(2);
  return `${v} TL`;
}

function makeReceiptNo(id) {
  const year = new Date().getFullYear();
  return `MK-${year}-${String(id).padStart(6, "0")}`;
}

const receiptsService = {
  getActiveTemplate: () => receiptsRepo.getTemplate(),

  saveTemplate: (body) => {
    receiptsRepo.saveTemplate({
      name: "Default",
      html: body.html || "",
      css: body.css || ""
    });
  },

  createReceipt: (member, body) => {
    const amount_cents = Math.abs(toCents(body.amount));
    const description = body.description || "Odeme makbuzu";

    const id = receiptsRepo.createReceiptRow({
      member_id: member.id,
      receipt_no: "TEMP",
      amount_cents,
      payload_json: JSON.stringify({
        member_name: member.full_name,
        description
      })
    });

    const receipt_no = makeReceiptNo(id);
    receiptsRepo.updateReceiptNo(id, receipt_no);
    return id;
  },

  getReceipt: (id) => receiptsRepo.getReceipt(id),

  renderReceiptHtml: async (receipt) => {
    const tpl = receiptsRepo.getTemplate();
    const payload = JSON.parse(receipt.payload_json || "{}");

    const qr_path = `/receipt/${receipt.id}`;
    const data = {
      receipt_no: receipt.receipt_no,
      issued_at: receipt.issued_at,
      member_name: payload.member_name || "",
      amount: money(receipt.amount_cents),
      description: payload.description || "",
      qr_url: qr_path,
      // Embed QR as data URL (no external CDN required)
      qr: (() => "")(),
    };

    // Build absolute URL for verification
    const origin = process.env.APP_ORIGIN || "";
    const verifyUrl = (origin ? origin.replace(/\/$/, "") : "") + qr_path;

    let qrDataUrl = "";
    try {
      qrDataUrl = await QRCode.toDataURL(verifyUrl || qr_path, { margin: 0, width: 256 });
    } catch (e) {
      qrDataUrl = "";
    }
    data.qr = qrDataUrl
      ? `<div class="qr-wrap"><img alt="QR" src="${qrDataUrl}"/></div>`
      : `<div class="qr-wrap"><span style="font-size:12px;color:#888">QR olusturulamadi</span></div>`;


    const bodyHtml = renderTemplate(tpl.html, data);
    const css = tpl.css || "";

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Makbuz ${receipt.receipt_no}</title>
<style>${css}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
  }
};

module.exports = { receiptsService };
