const { authService } = require("./auth.service");

const authController = {
  loginPage: (req, res) => res.render("auth/login"),
  login: (req, res) => {
    const { username, password } = req.body;
    const user = authService.login(username, password);
    if (!user) {
      req.session.flash = { type: "danger", message: "Hatali kullanici adi veya sifre." };
      return res.redirect("/login");
    }
    req.session.user = user;
    return res.redirect(user.role === "admin" ? "/admin" : "/member");
  },
  logout: (req, res) => {
    req.session.destroy(() => res.redirect("/"));
  }
};

module.exports = { authController };
