const { settingsService } = require("./settings.service");

const settingsController = {
  form: (req, res) => {
    const s = settingsService.get();
    res.render("admin/site-settings", { s });
  },

  save: (req, res) => {
    settingsService.save(req.body);
    req.session.flash = { type: "success", message: "Site ayarlari kaydedildi." };
    res.redirect("/admin/site-settings");
  }
};

module.exports = { settingsController };
