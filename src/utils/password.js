const bcrypt = require("bcryptjs");

function hashPassword(pw) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pw, salt);
}

function verifyPassword(pw, hash) {
  return bcrypt.compareSync(pw, hash);
}

module.exports = { hashPassword, verifyPassword };
