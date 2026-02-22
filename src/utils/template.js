// mini mustache: {{key}} replace
function renderTemplate(str, data) {
  return String(str).replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = data[k];
    return v === undefined || v === null ? "" : String(v);
  });
}

module.exports = { renderTemplate };
