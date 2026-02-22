const { settingsRepo } = require("./settings.repo");

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

const settingsService = {
  get: () => {
    const s = settingsRepo.get();
    if (!s) return null;
    return {
      ...s,
      board: safeJsonParse(s.board_json, []),
      contact: safeJsonParse(s.contact_json, {}),
      social: safeJsonParse(s.social_json, {})
    };
  },

  save: (body) => {
    const board = [];

    const contact = {
      address: body.contact_address || "",
      phone: body.contact_phone || "",
      email: body.contact_email || ""
    };

    const social = {
      instagram: body.social_instagram || "",
      facebook: body.social_facebook || "",
      youtube: body.social_youtube || ""
    };

    settingsRepo.upsert({
      app_name: body.app_name || "Dernek",
      app_short: body.app_short || "DERNEK",
      primary_color: body.primary_color || "#2F5BEA",
      home_badge_text: body.home_badge_text || "YKDD • Yesilce",
      about_text: body.about_text || "",
      board_json: JSON.stringify(board),
      contact_json: JSON.stringify(contact),
      social_json: JSON.stringify(social),
      map_embed_url: body.map_embed_url || "",
      iban_bank: body.iban_bank || "",
      iban_name: body.iban_name || "",
      iban: body.iban || ""
    });
  }
};

module.exports = { settingsService };
