function info(msg, meta) {
  console.log(`[info] ${msg}`, meta || "");
}
function warn(msg, meta) {
  console.warn(`[warn] ${msg}`, meta || "");
}
function error(msg, meta) {
  console.error(`[error] ${msg}`, meta || "");
}

module.exports = { info, warn, error };
