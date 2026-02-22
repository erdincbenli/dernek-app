const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { env } = require("../config/env");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const dbFile = path.resolve(env.DB_PATH);
ensureDir(path.dirname(dbFile));

const db = new Database(dbFile);

// Performance pragmas
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("foreign_keys = ON");
db.pragma("temp_store = MEMORY");
db.pragma("cache_size = -20000"); // ~20MB

module.exports = { db };
