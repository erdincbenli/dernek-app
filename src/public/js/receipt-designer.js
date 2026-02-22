// Receipt Designer Pro (A5 + grid/snap + keyboard nudge + lock)
(function(){
  const DEFAULT_HTML = `
  <div class="paper">
    <div class="title">Makbuz</div>
    <div class="row">
      <div class="kv"><span class="k">Makbuz No:</span> <span class="v">{{receipt_no}}</span></div>
      <div class="kv"><span class="k">Tarih:</span> <span class="v">{{issued_at}}</span></div>
    </div>
    <div class="kv"><span class="k">Uye:</span> <span class="v">{{member_name}}</span></div>
    <div class="kv"><span class="k">Tutar:</span> <span class="v">{{amount}}</span></div>
    <div class="kv"><span class="k">Aciklama:</span> <span class="v">{{description}}</span></div>
    <div class="qr">{{qr}}</div>
  </div>`;

  const DEFAULT_CSS = `
  :root{ --paper-w:148mm; --paper-h:210mm; --paper-pad:10mm; }
  body{ margin:0; background:#f6f7fb; font-family: Arial, Helvetica, sans-serif; }
  .paper{
    width:var(--paper-w);
    height:var(--paper-h);
    background:#fff;
    margin:16px auto;
    padding:var(--paper-pad);
    box-shadow:0 10px 25px rgba(0,0,0,.08);
    border-radius:10px;
    box-sizing:border-box;
    position:relative;
    overflow:hidden;
  }
  .paper.grid-on{
    background-image:
      linear-gradient(to right, rgba(47,91,234,.12) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(47,91,234,.12) 1px, transparent 1px);
    background-size: 10mm 10mm;
  }
  .title{ font-size:18px; font-weight:700; margin-bottom:10px; }
  .row{ display:flex; gap:12px; justify-content:space-between; }
  .kv{ font-size:12px; margin:6px 0; }
  .k{ color:#666; }
  .v{ font-weight:600; }
  .qr{ position:absolute; right:10mm; bottom:10mm; width:28mm; height:28mm; }
  .qr img, .qr canvas{ width:100% !important; height:100% !important; }
  @media print{
    body{ background:#fff; }
    .paper{ margin:0; box-shadow:none; border-radius:0; }
    @page{ size: A5 portrait; margin: 0; }
  }`;

  const editor = grapesjs.init({
    container: "#gjs",
    height: "72vh",
    fromElement: false,
    storageManager: false,
    panels: { defaults: [] },
    selectorManager: { componentFirst: true }
  });

  // Panels / buttons
  editor.Panels.addPanel({
    id: "topbar",
    el: ".gjs-pn-panels",
    buttons: []
  });

  const btn = (id, label, command, opts={}) => ({
    id, label,
    command,
    attributes: { title: opts.title || label },
    active: opts.active || false
  });

  let gridOn = false;
  let snapOn = true;

  editor.Commands.add("toggle-grid", {
    run(ed){
      gridOn = !gridOn;
      const w = ed.getWrapper();
      const paper = w.find(".paper")[0];
      if (paper) {
        const cls = paper.getClasses();
        if (gridOn) paper.addClass("grid-on");
        else paper.removeClass("grid-on");
      }
    }
  });

  editor.Commands.add("toggle-snap", {
    run(ed){
      snapOn = !snapOn;
      const pn = ed.Panels.getButton("options", "snap");
      if (pn) pn.set("active", snapOn);
    }
  });

  editor.Commands.add("a5-preset", {
    run(ed){
      // ensure paper exists and has correct size vars
      const css = ed.getCss() || "";
      if (!css.includes("--paper-w:148mm")) {
        ed.setStyle(DEFAULT_CSS + "\n" + css);
      }
    }
  });

  editor.Commands.add("toggle-lock", {
    run(ed){
      const sel = ed.getSelected();
      if (!sel) return;
      const locked = !!sel.get("locked");
      sel.set("locked", !locked);
      sel.set("draggable", locked); // unlock -> draggable true; lock -> false
      sel.set("editable", locked);
      sel.set("selectable", true);
    }
  });

  // Add options panel
  editor.Panels.addPanel({ id: "options", buttons: [
    btn("grid", "Grid", "toggle-grid", { title:"Izgara ac/kapat" }),
    btn("snap", "Snap", "toggle-snap", { title:"Hizalama yapisma ac/kapat", active:true }),
    btn("lock", "Lock", "toggle-lock", { title:"Secili ogeyi kilitle/serbest birak" }),
    btn("a5", "A5", "a5-preset", { title:"A5 baski ayarlari" }),
  ]});

  // Default template
  editor.setComponents(window.__TPL_HTML__ || DEFAULT_HTML);
  editor.setStyle(window.__TPL_CSS__ || DEFAULT_CSS);

  // Basic blocks for receipt
  const bm = editor.BlockManager;
  bm.add("txt", { label:"Text", content:"<div class='kv' style='position:absolute;left:10mm;top:10mm'>Metin</div>" });
  bm.add("box", { label:"Box", content:"<div style='position:absolute;left:10mm;top:20mm;width:60mm;height:20mm;border:1px solid #ddd'></div>" });
  bm.add("qr",  { label:"QR", content:"<div class='qr'>{{qr}}</div>" });

  // Keyboard nudge
  document.addEventListener("keydown", (e) => {
    if (!editor || !editor.getSelected) return;
    const sel = editor.getSelected();
    if (!sel) return;

    const key = e.key;
    const arrows = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
    if (!arrows.includes(key)) return;

    // prevent scrolling
    e.preventDefault();

    // if locked, ignore
    if (sel.get("locked")) return;

    const step = e.shiftKey ? 10 : 1;
    const st = { ...(sel.getStyle() || {}) };

    const parsePx = (v) => {
      if (v == null) return 0;
      const s = String(v).trim();
      if (s.endsWith("px")) return parseFloat(s) || 0;
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    // Only nudge absolute positioned items
    if ((st.position || "").toLowerCase() !== "absolute") {
      st.position = "absolute";
      if (st.left == null) st.left = "0px";
      if (st.top == null) st.top = "0px";
    }

    let left = parsePx(st.left);
    let top  = parsePx(st.top);

    if (key === "ArrowUp") top -= step;
    if (key === "ArrowDown") top += step;
    if (key === "ArrowLeft") left -= step;
    if (key === "ArrowRight") left += step;

    st.left = `${left}px`;
    st.top  = `${top}px`;
    sel.setStyle(st);
  });

  // Snap to 5px grid after drag/resize
  const snapTo = (comp) => {
    if (!snapOn || !comp) return;
    if (comp.get("locked")) return;
    const st = { ...(comp.getStyle() || {}) };
    if ((st.position || "").toLowerCase() !== "absolute") return;
    const round5 = (v) => Math.round(v / 5) * 5;
    const px = (v) => {
      if (v == null) return null;
      const n = parseFloat(String(v).replace("px",""));
      return Number.isFinite(n) ? n : null;
    };
    const l = px(st.left), t = px(st.top), w = px(st.width), h = px(st.height);
    if (l != null) st.left = `${round5(l)}px`;
    if (t != null) st.top  = `${round5(t)}px`;
    if (w != null) st.width = `${round5(w)}px`;
    if (h != null) st.height= `${round5(h)}px`;
    comp.setStyle(st);
  };

  ["component:drag:end","component:drag:stop","component:resize:end","component:resize:stop"].forEach(ev => {
    editor.on(ev, (m) => snapTo(m));
  });

  // Form save
  const form = document.getElementById("tplForm");
  form.addEventListener("submit", () => {
    document.getElementById("tplHtml").value = editor.getHtml();
    document.getElementById("tplCss").value = editor.getCss();
  });

  // Apply A5 preset once
  editor.runCommand("a5-preset");
})();
