const { boardRepo } = require("./board.repo");

const boardService = {
  listAll: () => boardRepo.listAll(),
  listActive: () => boardRepo.listActive(),

  create: (body) => {
    const title = (body.title || "").trim();
    const full_name = (body.full_name || "").trim();
    const order_index = Number(body.order_index || 0) || 0;
    const is_active = body.is_active === "1" || body.is_active === "on" || body.is_active === 1;
    if (!title || !full_name) return { ok: false, error: "Unvan ve isim zorunlu." };
    boardRepo.create({ title, full_name, order_index, is_active });
    return { ok: true };
  },

  update: (id, body) => {
    const title = (body.title || "").trim();
    const full_name = (body.full_name || "").trim();
    const order_index = Number(body.order_index || 0) || 0;
    const is_active = body.is_active === "1" || body.is_active === "on" || body.is_active === 1;
    if (!title || !full_name) return { ok: false, error: "Unvan ve isim zorunlu." };
    boardRepo.update(id, { title, full_name, order_index, is_active });
    return { ok: true };
  },

  remove: (id) => boardRepo.remove(id),
};

module.exports = { boardService };
