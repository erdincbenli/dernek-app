const { membersRepo } = require("./members.repo");
const { financeRepo } = require("../finance/finance.repo");

const membersService = {
  list: () => membersRepo.list(),
  getById: (id) => membersRepo.getById(id),
  create: (data) => membersRepo.create(data),
  update: (id, data) => membersRepo.update(id, data),
  remove: (id) => membersRepo.remove(id),

  getDashboardStats: () => {
    const totalMembers = membersRepo.countAll();
    const activeMembers = membersRepo.countActive();
    const totals = financeRepo.totalsAllMembers();
    return { totalMembers, activeMembers, ...totals };
  }
};

module.exports = { membersService };
