const fs = require("fs");
const path = require("path");
const { db } = require("./db");

const schemaPath = path.join(__dirname, "schema.sql");
const sql = fs.readFileSync(schemaPath, "utf-8");

db.exec(sql);

console.log("[db] migrated schema ok");
