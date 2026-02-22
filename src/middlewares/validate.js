function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      req.session.flash = { type: "danger", message: parsed.error.issues.map(i => i.message).join(", ") };
      return res.redirect("back");
    }
    req.body = parsed.data;
    next();
  };
}

module.exports = { validate };
