const { membersService } = require("./members.service");

const membersController = {
  adminDashboard: (req, res) => {
    const stats = membersService.getDashboardStats();
    res.render("admin/dashboard", { stats });
  },

  list: (req, res) => {
    const members = membersService.list();
    res.render("members/list", { members });
  },

  newForm: (req, res) => res.render("members/form", { member: null }),

  editForm: (req, res) => {
    const member = membersService.getById(Number(req.params.id));
    if (!member) return res.status(404).send("Not found");
    res.render("members/form", { member });
  },

  create: (req, res) => {
    membersService.create(req.body);
    req.session.flash = { type: "success", message: "Uye eklendi." };
    res.redirect("/admin/members");
  },

  update: (req, res) => {
    membersService.update(Number(req.params.id), req.body);
    req.session.flash = { type: "success", message: "Uye guncellendi." };
    res.redirect("/admin/members");
  },

  remove: (req, res) => {
    membersService.remove(Number(req.params.id));
    req.session.flash = { type: "success", message: "Uye silindi." };
    res.redirect("/admin/members");
  },

  memberPanel: (req, res) => {
    res.redirect(`/member/finance`);
  }
};

module.exports = { membersController };
