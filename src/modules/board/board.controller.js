const { boardService } = require("./board.service");

const boardController = {
  page: (req, res) => {
    const rows = boardService.listAll();
    res.render("admin/board", { rows });
  },

  create: (req, res) => {
    const r = boardService.create(req.body);
    req.session.flash = r.ok
      ? { type: "success", message: "Yonetim kurulu uyesi eklendi." }
      : { type: "danger", message: r.error || "Kayit eklenemedi." };
    res.redirect("/admin/board");
  },

  update: (req, res) => {
    const id = Number(req.params.id);
    const r = boardService.update(id, req.body);
    req.session.flash = r.ok
      ? { type: "success", message: "Guncellendi." }
      : { type: "danger", message: r.error || "Guncellenemedi." };
    res.redirect("/admin/board");
  },

  remove: (req, res) => {
    const id = Number(req.params.id);
    boardService.remove(id);
    req.session.flash = { type: "success", message: "Silindi." };
    res.redirect("/admin/board");
  }
};

module.exports = { boardController };
