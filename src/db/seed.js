const { db } = require("./db");
const { hashPassword } = require("../utils/password");

const adminUser = db.prepare("SELECT id FROM users WHERE username = ?").get("admin");
if (!adminUser) {
  const password_hash = hashPassword("admin1234");
  db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?,?,?)")
    .run("admin", password_hash, "admin");
  console.log("[db] seeded admin user: admin/admin1234");
}

const tpl = db.prepare("SELECT id FROM receipt_templates WHERE name = ?").get("Default");
if (!tpl) {
  const html =
`<div class="paper">
  <h2>Makbuz</h2>
  <div><b>No:</b> {{receipt_no}}</div>
  <div><b>Tarih:</b> {{issued_at}}</div>
  <hr/>
  <div><b>Uye:</b> {{member_name}}</div>
  <div><b>Tutar:</b> {{amount}}</div>
  <div style="margin-top:24px;">Aciklama: {{description}}</div>
  <div class="sign">Imza / Kase</div>
  <div class="qr">{{qr}}</div>
</div>`;
  const css =
` :root{ --paper-w:148mm; --paper-h:210mm; --paper-pad:10mm; }
body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif}
.paper{width:var(--paper-w);min-height:var(--paper-h);margin:0 auto;padding:var(--paper-pad);box-sizing:border-box;position:relative}
.sign{margin-top:28mm;border-top:1px dashed #aaa;padding-top:6mm;font-size:12px;color:#666}
.qr{position:absolute;right:10mm;bottom:10mm;width:28mm;height:28mm}
.qr img,.qr canvas{width:100% !important;height:100% !important}
@media print{@page{size:A5 portrait;margin:0} }
`;
  db.prepare("INSERT INTO receipt_templates (name, html, css) VALUES (?,?,?)")
    .run("Default", html, css);
  console.log("[db] seeded default receipt template");
}

console.log("[db] seed ok");


// Site settings default
const st = db.prepare("SELECT id FROM site_settings WHERE id=1").get();
if (!st) {
  db.prepare(`INSERT INTO site_settings
    (id, app_name, app_short, primary_color, home_badge_text, about_text, board_json, contact_json, social_json, map_embed_url, iban_bank, iban_name, iban)
    VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(
      process.env.APP_NAME || "Yesilce Kultur ve Dayanisma Dernegi (YKDD)",
      process.env.APP_SHORT || "YKDD",
      process.env.APP_PRIMARY || "#2F5BEA",
      "YKDD • Yesilce",
      "Yesilce Kultur ve Dayanisma Dernegi (YKDD); mahallemizde dayanismayi guclendirmek, kultur-sanat etkinliklerini desteklemek ve hemserilerimizi bir araya getirmek icin calisir.",
      JSON.stringify([
        { role: "Baskan", name: "Ad Soyad" },
        { role: "Baskan Yardimcisi", name: "Ad Soyad" },
        { role: "Genel Sekreter", name: "Ad Soyad" },
        { role: "Sayman", name: "Ad Soyad" },
        { role: "Uye", name: "Ad Soyad" }
      ]),
      JSON.stringify({ address: "Yesilce Mah. (ornek)", phone: "0(5xx) xxx xx xx", email: "info@ykdd.org" }),
      JSON.stringify({ instagram: "", facebook: "", youtube: "" }),
      "https://www.openstreetmap.org/export/embed.html?bbox=29.0%2C41.0%2C29.1%2C41.1&layer=mapnik",
      "", "", ""
    );
  console.log("[db] seeded site_settings");
}


// Board members default (dynamic)
const bmCount = db.prepare("SELECT COUNT(1) as c FROM board_members").get().c;
if (bmCount === 0) {
  const rows = [
    { title: "Baskan", full_name: "Ad Soyad", order_index: 1 },
    { title: "Baskan Yardimcisi", full_name: "Ad Soyad", order_index: 2 },
    { title: "Genel Sekreter", full_name: "Ad Soyad", order_index: 3 },
    { title: "Sayman", full_name: "Ad Soyad", order_index: 4 },
    { title: "Uye", full_name: "Ad Soyad", order_index: 5 },
  ];
  const stmt = db.prepare("INSERT INTO board_members (title, full_name, order_index, is_active) VALUES (?,?,?,1)");
  const trx = db.transaction(() => rows.forEach(r => stmt.run(r.title, r.full_name, r.order_index)));
  trx();
  console.log("[db] seeded board members");
}
