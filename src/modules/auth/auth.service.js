const { usersRepo } = require("../users/users.repo");
const { verifyPassword } = require("../../utils/password");

const authService = {
  login: (username, password) => {
    const u = usersRepo.findByUsername(username);
    if (!u) return null;
    if (!verifyPassword(password, u.password_hash)) return null;
    return { id: u.id, username: u.username, role: u.role, member_id: u.member_id || null };
  }
};

module.exports = { authService };
