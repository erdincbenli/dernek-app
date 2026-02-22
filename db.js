// src/db/db.js
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// DATA klasörünü tek bir yere sabitleyelim (root/data)
const DATA_DIR =
  process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");

fs.mkdirSync(DATA_DIR, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(DATA_DIR, "app.db");
const db = new Database(dbPath);

// ---- schema upgrade (ucretsiz Render icin pratik migration) ----
function ensureColumn(table, column, ddl) {
  const cols = db
    .prepare(`PRAGMA table_info(${table})`)
    .all()
    .map((c) => c.name);
  if (!cols.includes(column)) db.prepare(ddl).run();
}

function ensureSchema() {
  // members tablosu mevcut varsayiliyor
  ensureColumn(
    "members",
    "password_hash",
    "ALTER TABLE members ADD COLUMN password_hash TEXT"
  );
  ensureColumn(
    "members",
    "must_reset",
    "ALTER TABLE members ADD COLUMN must_reset INTEGER DEFAULT 1"
  );
}

ensureSchema();

module.exports = { db, dbPath, DATA_DIR };