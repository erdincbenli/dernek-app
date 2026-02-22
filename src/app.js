const config = require("./config");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

const { env } = require("./config/env");
const { errorHandler } = require("./middlewares/errorHandler");
const { rateLimit } = require("./middlewares/rateLimit");

const { authRoutes } = require("./modules/auth/auth.routes");
const { membersRoutes } = require("./modules/members/members.routes");
const { financeRoutes } = require("./modules/finance/finance.routes");
const { receiptsRoutes } = require("./modules/receipts/receipts.routes");
const { contentRoutes } = require("./modules/content/content.routes");
const { settingsRoutes } = require("./modules/settings/settings.routes");
const { boardRoutes } = require("./modules/board/board.routes");
const { paymentsRoutes } = require("./modules/payments/payments.routes");
const { settingsService } = require("./modules/settings/settings.service");
const { boardService } = require("./modules/board/board.service");

function createApp() {
  const app = express();

  

app.use((req, res, next) => {
  res.locals.appName = config.appName;
  res.locals.appShort = config.appShort;
  res.locals.appPrimary = config.appPrimary;
  next();
});
app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  // CSP is relaxed initially for GrapesJS; tighten later when stable
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(morgan("dev"));
  app.use(rateLimit());
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use(
    session({
      store: new SQLiteStore({ db: "sessions.sqlite", dir: path.join(__dirname, "..", "data") }),
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: "lax" }
    })
  );
  // CSRF for forms (admin+member), but skip public /pay (multipart/form-data)
  const csrfProtection = csurf({ cookie: false });
  app.use((req, res, next) => {
    if (req.method === "POST" && (req.path === "/pay" || req.path.startsWith("/pay"))) return next();
    return csrfProtection(req, res, next);
  });

  // globals for views
  app.use((req, res, next) => {
    // Load site settings (db) and expose to views
    const s = settingsService.get();
    if (s) {
      res.locals.site = s;
      // keep topbar/branding in sync
      res.locals.appName = s.app_name;
      res.locals.appShort = s.app_short;
      res.locals.appPrimary = s.primary_color;
    }
    res.locals.user = req.session.user || null;
    res.locals.csrfToken = (typeof req.csrfToken === "function") ? req.csrfToken() : "";
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
  });

  app.use("/public", express.static(path.join(__dirname, "public")));
  app.use("/uploads", express.static(path.join(__dirname, "..", "data", "uploads")));

  // Routes
  app.use(authRoutes);
  app.use(membersRoutes);
  app.use(financeRoutes);
  app.use(receiptsRoutes);
  app.use(contentRoutes);
  app.use(settingsRoutes);
  app.use(boardRoutes);
  app.use(paymentsRoutes);

  // Home
  app.get("/", (req, res) => {
    const s = settingsService.get();
    const board = boardService.listActive();
    res.render("site/home", { s, board });
  });

  // Not found
  app.use((req, res) => res.status(404).send("404 Not Found"));

  // Error handler
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
