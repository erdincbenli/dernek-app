/**
 * Deletes local SQLite files so you can start from scratch.
 * Safe to run multiple times.
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const files = [
  "data/app.sqlite",
  "data/app.sqlite-wal",
  "data/app.sqlite-shm",
  "data/sessions.sqlite",
  "data/sessions.sqlite-wal",
  "data/sessions.sqlite-shm",
];

let deleted = 0;

for (const rel of files) {
  const full = path.join(projectRoot, rel);
  try {
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
      deleted++;
      console.log("Deleted:", rel);
    }
  } catch (err) {
    console.warn("Could not delete:", rel, "-", err.message);
  }
}

if (deleted === 0) {
  console.log("Nothing to delete. DB already clean.");
} else {
  console.log("Done. Deleted", deleted, "file(s).");
}
