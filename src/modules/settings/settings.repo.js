const { db } = require("../../db/db");

const settingsRepo = {
  get: () => db.prepare("SELECT * FROM site_settings WHERE id=1").get(),
  upsert: (row) => {
    db.prepare(`UPDATE site_settings SET
      app_name=?,
      app_short=?,
      primary_color=?,
      about_text=?,
      board_json=?,
      contact_json=?,
      social_json=?,
      map_embed_url=?,
      iban_bank=?,
      iban_name=?,
      iban=?,
      updated_at=datetime('now')
      WHERE id=1`)
      .run(
        row.app_name,
        row.app_short,
        row.primary_color,
        row.about_text,
        row.board_json,
        row.contact_json,
        row.social_json,
        row.map_embed_url,
        row.iban_bank,
        row.iban_name,
        row.iban
      );
  }
};

module.exports = { settingsRepo };
