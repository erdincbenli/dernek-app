function errorHandler(err, req, res, next) {
  console.error("[error]", err);
  if (err.code === "EBADCSRFTOKEN") return res.status(403).send("CSRF token invalid.");
  res.status(500).send("Internal Server Error");
}

module.exports = { errorHandler };
