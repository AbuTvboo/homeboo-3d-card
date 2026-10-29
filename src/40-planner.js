
/* =====================================================================
   GRUNDRISS-EDITOR (läuft als Vollbild-Dialog über Home Assistant)
   ===================================================================== */
const HB_PLAN_CSS = HB_BASE_CSS + `
.app{position:fixed;inset:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;padding:10px max(14px,env(safe-area-inset-right,0px)) 10px max(14px,env(safe-area-inset-left,0px));background:#080a13;color:var(--hb-fg);font:14px/1.4 var(--hb-font);-webkit-font-smoothing:antialiased}
.bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}
.brand{display:flex;align-items:center;gap:9px;margin-right:4px}
.ghost{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:var(--hb-accent);background:radial-gradient(circle at 50% 40%,rgba(126,240,255,.28),rgba(126,240,255,.04) 70%);filter:drop-shadow(0 0 10px rgba(126,240,255,.4))}
.ghost svg{width:21px;height:21px}
.brand b{font-weight:700;font-size:14px;white-space:nowrap}
.pname{width:170px;max-width:36vw;height:36px;padding:0 12px;border-radius:10px;border:1px solid var(--hb-line);background:#0f1324;font-weight:600}
.pname:focus{border-color:var(--hb-accent);outline:none}
.grp{display:flex;gap:6px}.sp{flex:1}
.btn{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 12px;border-radius:10px;border:1px solid var(--hb-line);background:#0f1324;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap}
.btn:hover{border-color:var(--hb-line2)}.btn:disabled{opacity:.4;cursor:default}
.btn svg{width:17px;height:17px;flex:none}
.btn.icon{width:36px;padding:0;justify-content:center}
.btn.pri{background:var(--hb-accent);color:var(--hb-accent-ink);border-color:var(--hb-accent)}
.btn.on{color:var(--hb-accent);border-color:rgba(126,240,255,.5);background:var(--hb-accent-soft)}
.btn.danger{color:#ff7a8a}.btn.small{height:30px;padding:0 10px;font-size:12px}
.seg{display:flex;padding:3px;border-radius:11px;background:#0f1324;border:1px solid var(--hb-line)}
.seg button{height:30px;padding:0 11px;border:0;border-radius:8px;background:transparent;color:var(--hb-muted);font-weight:600;font-size:12.5px;cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--hb-accent-soft);color:var(--hb-accent);box-shadow:inset 0 0 0 1px rgba(126,240,255,.35)}
.main{display:grid;grid-template-columns:232px minmax(0,1fr) 286px;gap:10px;min-height:0}
.card{background:#0f1324;border:1px solid var(--hb-line);border-radius:16px;min-height:0;min-width:0}
.left,.right{overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--hb-line2) transparent}
.left{padding:12px;display:flex;flex-direction:column;gap:14px}.right{padding:14px;display:flex;flex-direction:column;gap:14px}
.sec{display:flex;flex-direction:column;gap:8px}
.sec h3{margin:0;font-weight:600;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--hb-faint)}
.tools{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tb{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px 6px;border-radius:10px;border:1px solid var(--hb-line);background:#141a2e;font-weight:600;font-size:10.5px;color:var(--hb-muted);cursor:pointer}
.tb svg{width:20px;height:20px}.tb:hover{color:var(--hb-fg)}
.tb[aria-pressed="true"]{color:var(--hb-accent);border-color:rgba(126,240,255,.5);background:var(--hb-accent-soft)}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.tile{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px 5px;border-radius:10px;border:1px solid var(--hb-line);background:#141a2e;font-weight:600;font-size:10.5px;line-height:1.15;color:var(--hb-muted);text-align:center;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}
.tile:hover{color:var(--hb-fg);border-color:rgba(126,240,255,.4)}
.tile svg{width:40px;height:34px}
.tile span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 2px}
.views{display:grid;gap:10px;min-height:0;min-width:0}
.views.m-split{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.views.m-2d .v3d,.views.m-3d .v2d{display:none}
.vbox{position:relative;border-radius:16px;overflow:hidden;background:#0a0d19;border:1px solid var(--hb-line);min-height:0;min-width:0}
svg.plan{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;user-select:none;-webkit-user-select:none}
svg.t-rect,svg.t-poly,svg.t-measure{cursor:crosshair}svg.t-bgmove{cursor:move}svg.panning{cursor:grabbing}
.floor{cursor:move}.floor:hover{filter:brightness(1.18)}.it{cursor:move}.it:hover{filter:brightness(1.15)}.op{cursor:ew-resize}.dv{cursor:move}
.c3{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.hintbar{position:absolute;left:12px;top:12px;right:12px;display:flex;pointer-events:none}
.hint{padding:7px 12px;border-radius:10px;background:rgba(10,13,25,.84);border:1px solid var(--hb-line);font-size:12px;color:var(--hb-muted);max-width:100%}
.hint b{color:var(--hb-fg);font-weight:600}
.status{position:absolute;left:12px;right:12px;bottom:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;pointer-events:none}
.status>*{pointer-events:auto}
.chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:9px;background:rgba(10,13,25,.86);border:1px solid var(--hb-line);font:500 11.5px var(--hb-mono);color:var(--hb-muted);font-variant-numeric:tabular-nums}
button.chip{cursor:pointer}button.chip:hover{color:var(--hb-fg)}button.chip[aria-pressed="true"]{color:var(--hb-accent)}
.chip svg{width:15px;height:15px}
.v3bar{position:absolute;right:12px;top:12px;display:flex;gap:6px}
.v3msg{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:var(--hb-muted);font-size:13px;pointer-events:none}
.rn{font:600 12px var(--hb-font);fill:#f2f4ff;text-anchor:middle;paint-order:stroke;stroke:rgba(8,10,19,.75);stroke-width:3px;pointer-events:none}
.ra{font:500 10.5px var(--hb-mono);fill:#aeb5d6;text-anchor:middle;paint-order:stroke;stroke:rgba(8,10,19,.75);stroke-width:3px;pointer-events:none}
.el{font:500 10.5px var(--hb-mono);fill:var(--hb-accent);text-anchor:middle;dominant-baseline:middle;paint-order:stroke;stroke:rgba(8,10,19,.9);stroke-width:3px;pointer-events:none}
.hv{fill:#0a0d19;stroke:var(--hb-accent);stroke-width:2;cursor:grab}.hv.on{fill:var(--hb-accent)}
.he{fill:var(--hb-accent);stroke:#0a0d19;stroke-width:1.5;cursor:grab}
.ha{fill:#0a0d19;stroke:rgba(126,240,255,.7);stroke-width:1.5;cursor:copy}.ha-p{stroke:var(--hb-accent);stroke-width:1.6;pointer-events:none}
.hr{fill:#0a0d19;stroke:var(--hb-lamp);stroke-width:2;cursor:grab}.hs{fill:var(--hb-lamp);stroke:#0a0d19;stroke-width:1.5;cursor:nwse-resize}
.ph{display:flex;align-items:center;gap:10px}
.ph h2{margin:0;font-weight:700;font-size:16px;line-height:1.2;min-width:0;overflow-wrap:anywhere}
.ph .tag{margin-left:auto;font-weight:600;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--hb-faint)}
.fld{display:flex;flex-direction:column;gap:5px}
.fld label{font-weight:600;font-size:11.5px;color:var(--hb-muted)}
.inp{height:34px;padding:0 10px;border-radius:9px;border:1px solid var(--hb-line);background:#141a2e;min-width:0;width:100%}
.inp:focus{outline:none;border-color:var(--hb-accent)}
textarea.inp{height:150px;padding:10px;font:400 11px/1.45 var(--hb-mono);resize:vertical}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.chk{display:flex;align-items:center;gap:9px;font-weight:600;font-size:13px;cursor:pointer}
.chk input{width:16px;height:16px;accent-color:var(--hb-accent)}
.stat{display:flex;justify-content:space-between;align-items:baseline;padding:10px 12px;border-radius:12px;background:#141a2e;border:1px solid var(--hb-line)}
.stat span{font-size:12px;color:var(--hb-muted)}.stat b{font:500 16px var(--hb-mono);font-variant-numeric:tabular-nums}
.wl{display:flex;flex-direction:column;gap:4px}
.wr{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:6px 6px 6px 10px;border-radius:9px;background:#141a2e;font-size:12.5px}
.wr span{font-family:var(--hb-mono);color:var(--hb-muted)}.wr span b{color:var(--hb-fg);font-family:var(--hb-font);font-weight:600;margin-right:6px}
.tog{height:26px;padding:0 9px;border-radius:7px;border:1px solid var(--hb-line);background:transparent;font-weight:600;font-size:11px;cursor:pointer}
.tog.open{color:var(--hb-warn);border-color:rgba(255,178,92,.45)}
.rlist{display:flex;flex-direction:column;gap:3px}
.rli{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:9px;align-items:center;padding:7px 8px;border-radius:9px;border:0;background:transparent;text-align:left;cursor:pointer;font-size:13px}
.rli:hover{background:#141a2e}.rli i{width:12px;height:12px;border-radius:4px}.rli span{font:500 11.5px var(--hb-mono);color:var(--hb-muted)}
.note{margin:0;padding:10px 12px;border-radius:12px;border:1px dashed var(--hb-line2);font-size:12px;line-height:1.5;color:var(--hb-muted)}
.note b{color:var(--hb-fg)}
.keys{display:grid;grid-template-columns:auto 1fr;gap:5px 10px;font-size:12px;color:var(--hb-muted)}
.keys kbd{font:500 11px var(--hb-mono);padding:2px 6px;border-radius:6px;border:1px solid var(--hb-line2);color:var(--hb-fg);justify-self:start}
.acts{display:flex;flex-wrap:wrap;gap:6px}
.ghostDrag{position:fixed;left:0;top:0;z-index:30;pointer-events:none;padding:6px 10px;border-radius:10px;background:var(--hb-accent);color:var(--hb-accent-ink);font-weight:700;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:40;max-width:min(520px,calc(100% - 32px));padding:10px 14px;border-radius:12px;background:#1b2140;border:1px solid var(--hb-line2);font-size:13px;box-shadow:0 12px 30px rgba(0,0,0,.45)}
.modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:rgba(4,6,12,.66)}
.dlg{width:min(560px,100%);max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:18px;background:#0f1324;border:1px solid var(--hb-line2)}
.dlg h2{margin:0;font-weight:700;font-size:17px}.dlg p{margin:0;color:var(--hb-muted);font-size:13px}
[hidden]{display:none!important}
@media (max-width:1180px){.main{grid-template-columns:210px minmax(0,1fr) 256px}.views.m-split{grid-template-columns:1fr;grid-template-rows:1fr 1fr}}
@media (max-width:899px){
  .app{overflow:auto;grid-template-rows:auto auto}
  .main{grid-template-columns:minmax(0,1fr);grid-template-rows:auto 62vh auto}
  .left{flex-direction:row;overflow-x:auto;overflow-y:hidden;gap:14px;padding:10px}
  .left .sec{flex:none}.left .tiles{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:64px}.left .tools{grid-template-columns:repeat(4,58px)}
  .views.m-split{grid-template-columns:1fr;grid-template-rows:1fr 1fr}.hide-s{display:none}.pname{width:120px}
}
`;
const HB_PIC = {
  undo: hbIc('M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11'), redo: hbIc('M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13'),
  select: hbIc('M5 3l13 8-6 1.5L9 19z'), rect: hbIc('M4 6h16v12H4zM4 6l3-2M20 6l-3-2'), poly: hbIc('M5 18 4 7l9-4 7 7-4 9z'),
  measure: hbIc('M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2'), image: hbIc('M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4M15 9h.01'), file: hbIc('M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7'),
  magnet: hbIc('M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4zM6 8h4M14 8h4'), check: hbIc('M5 12l5 5 9-10'), x: hbIc('M6 6l12 12M18 6 6 18'),
};
const HB_OPICON = {
  door: `<svg viewBox="-0.2 -1.2 1.4 1.4" aria-hidden="true"><line x1="-0.2" y1="0" x2="1.2" y2="0" stroke="#e6e8ef" stroke-width="0.14"/><line x1="0" y1="0" x2="0" y2="-1" stroke="#e6e8ef" stroke-width="0.05"/><path d="M1 0A1 1 0 0 0 0 -1" fill="none" stroke="#e6e8ef" stroke-width="0.025" stroke-dasharray="0.08 0.06"/></svg>`,
  window: `<svg viewBox="-0.2 -0.7 1.4 1.4" aria-hidden="true"><line x1="-0.2" y1="0" x2="0" y2="0" stroke="#e6e8ef" stroke-width="0.2"/><line x1="1" y1="0" x2="1.2" y2="0" stroke="#e6e8ef" stroke-width="0.2"/><line x1="0" y1="-0.05" x2="1" y2="-0.05" stroke="#8fdcff" stroke-width="0.04"/><line x1="0" y1="0.05" x2="1" y2="0.05" stroke="#8fdcff" stroke-width="0.04"/></svg>`,
  gdoor: `<svg viewBox="-0.2 -0.7 1.4 1.4" aria-hidden="true"><line x1="-0.2" y1="0" x2="0" y2="0" stroke="#e6e8ef" stroke-width="0.2"/><line x1="1" y1="0" x2="1.2" y2="0" stroke="#e6e8ef" stroke-width="0.2"/><line x1="0" y1="-0.05" x2="1" y2="-0.05" stroke="#8fdcff" stroke-width="0.04"/><line x1="0" y1="0.05" x2="1" y2="0.05" stroke="#8fdcff" stroke-width="0.04"/><line x1="0.5" y1="-0.2" x2="0.5" y2="0.2" stroke="#8fdcff" stroke-width="0.03"/></svg>`,
  front: `<svg viewBox="-0.2 -1.2 1.4 1.4" aria-hidden="true"><line x1="-0.2" y1="0" x2="1.2" y2="0" stroke="#e6e8ef" stroke-width="0.14"/><line x1="0" y1="0" x2="0" y2="-1" stroke="#7ef0ff" stroke-width="0.06"/><path d="M1 0A1 1 0 0 0 0 -1" fill="none" stroke="#7ef0ff" stroke-width="0.025" stroke-dasharray="0.08 0.06"/></svg>`,
};
const C2 = { fab: '#8d7b84', fab3: '#a99b8b', wood: '#9a7354', woodD: '#5f4532', woodL: '#b8946b', white: '#d8dbe3', cer: '#eef0f4', dark: '#2a2f3d', green: '#4f8a4a', green2: '#6aa257', rug: '#3e4560', steel: '#aab1bd', ink: 'rgba(5,7,14,.55)' };
const svgLine = (a, b, col, w, extra = '') => `<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" stroke="${col}" stroke-width="${w}" ${extra}/>`;
function hbItemShape(kind, w, d, it = {}) {
  const hw = w / 2, hd = d / 2, k = 'stroke="' + C2.ink + '" stroke-width="0.015"';
  const R = (x, y, ww, hh, fill, rx = 0.03, ex = '') => `<rect x="${fx(x)}" y="${fx(y)}" width="${fx(Math.max(0, ww))}" height="${fx(Math.max(0, hh))}" rx="${fx(rx)}" fill="${fill}" ${k} ${ex}/>`;
  const Ci = (x, y, r, fill, ex = '') => `<circle cx="${fx(x)}" cy="${fx(y)}" r="${fx(r)}" fill="${fill}" ${k} ${ex}/>`;
  switch (kind) {
    case 'sofa': case 'armchair': { const fab = kind === 'sofa' ? C2.fab : C2.fab3, n = w > 1.7 ? 3 : w > 1.15 ? 2 : 1, cw = (w - 0.34) / n; let s = R(-hw, -hd, w, d, fab, 0.08) + R(-hw, -hd, w, 0.22, '#6f6068', 0.06) + R(-hw, -hd, 0.17, d, '#7b6b73', 0.06) + R(hw - 0.17, -hd, 0.17, d, '#7b6b73', 0.06); for (let i = 1; i < n; i++) s += svgLine([-hw + 0.17 + cw * i, -hd + 0.25], [-hw + 0.17 + cw * i, hd - 0.04], C2.ink, 0.012); return s; }
    case 'coffee': return R(-hw, -hd, w, d, C2.wood, 0.03);
    case 'round': return Ci(0, 0, Math.min(hw, hd), C2.woodL);
    case 'tvunit': return R(-hw, -hd, w, d, C2.woodD, 0.02) + svgLine([-Math.min(0.7, hw * 0.8), -hd + 0.05], [Math.min(0.7, hw * 0.8), -hd + 0.05], '#0b0d14', 0.06);
    case 'rug': return R(-hw, -hd, w, d, C2.rug, 0.02, 'opacity=".9"') + `<rect x="${fx(-hw + 0.12)}" y="${fx(-hd + 0.12)}" width="${fx(Math.max(0, w - 0.24))}" height="${fx(Math.max(0, d - 0.24))}" fill="none" stroke="#7e8aa8" stroke-width="0.03" opacity=".7"/>`;
    case 'shelf': { let s = R(-hw, -hd, w, d, C2.wood, 0.01); const n = Math.max(1, Math.round(w / 0.4)); for (let i = 1; i < n; i++) s += svgLine([-hw + i * w / n, -hd], [-hw + i * w / n, hd], C2.ink, 0.012); return s; }
    case 'plant': return Ci(0, 0, Math.min(hw, hd), C2.green) + Ci(-0.06 * w, -0.06 * w, Math.min(hw, hd) * 0.55, C2.green2, 'stroke="none"');
    case 'bed': case 'bed1': { const n = w > 1.2 ? 2 : 1, pw = (w - 0.2) / n; let s = R(-hw, -hd, w, d, C2.woodD, 0.04) + R(-hw + 0.04, -hd + 0.08, w - 0.08, d - 0.12, C2.white, 0.05); for (let i = 0; i < n; i++) s += R(-hw + 0.1 + pw * i + 0.03, -hd + 0.16, pw - 0.06, 0.4, '#f4f4f6', 0.06); return s + R(-hw + 0.02, -hd + 0.68, w - 0.04, d - 0.72, kind === 'bed1' ? '#b9806a' : '#7b8fae', 0.04) + R(-hw + 0.01, hd - 0.48, w - 0.02, 0.36, '#b9806a', 0.03); }
    case 'wardrobe': { let s = R(-hw, -hd, w, d, C2.white, 0.01); const n = Math.max(2, Math.round(w / 0.6)); for (let i = 1; i < n; i++) s += svgLine([-hw + i * w / n, -hd], [-hw + i * w / n, hd], C2.ink, 0.012); return s + svgLine([-hw, hd - 0.02], [hw, hd - 0.02], '#7ef0ff', 0.02, 'opacity=".5"'); }
    case 'nightstand': return R(-hw, -hd, w, d, C2.wood, 0.02) + Ci(0, 0, Math.min(hw, hd) * 0.45, '#f3e6cf');
    case 'dining': { let s = ''; const n = Math.max(1, Math.floor((w - 0.2) / 0.65)); for (let i = 0; i < n; i++) { const x = -hw + w * (i + 0.5) / n; s += R(x - 0.22, -hd - 0.5, 0.44, 0.42, C2.fab3, 0.06) + R(x - 0.22, hd + 0.08, 0.44, 0.42, C2.fab3, 0.06); } if (w > 1.4) s += R(-hw - 0.5, -0.22, 0.42, 0.44, C2.fab3, 0.06) + R(hw + 0.08, -0.22, 0.42, 0.44, C2.fab3, 0.06); return s + R(-hw, -hd, w, d, C2.woodD, 0.03); }
    case 'counter': { let s = R(-hw, -hd, w, d, C2.dark, 0.01) + R(-hw, -hd, w, d, 'none', 0.01, 'stroke="#cfd2da" stroke-width="0.02"'); const sx = it.hob ? -w / 4 : 0, hx = it.sink ? w / 4 : 0; if (it.sink) s += R(sx - 0.28, -hd + 0.1, 0.56, 0.4, C2.steel, 0.04); if (it.hob) { s += R(hx - 0.3, -hd + 0.06, 0.6, 0.5, '#0b0d14', 0.02); for (const [x, y] of [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]]) s += `<circle cx="${fx(hx + x)}" cy="${fx(y)}" r="0.08" fill="none" stroke="#5d648a" stroke-width="0.012"/>`; } return s; }
    case 'fridge': return R(-hw, -hd, w, d, C2.steel, 0.03) + svgLine([-hw + 0.06, hd - 0.05], [hw - 0.06, hd - 0.05], C2.ink, 0.02);
    case 'chair': return R(-hw, -hd, w, d, C2.fab3, 0.06) + svgLine([-hw + 0.03, -hd + 0.04], [hw - 0.03, -hd + 0.04], '#5f4f45', 0.05);
    case 'stool': return Ci(0, 0, Math.min(hw, hd), '#3a3d46');
    case 'desk': return R(-hw, -hd, w, d, C2.woodL, 0.02) + (it.pc ? svgLine([-Math.min(0.62, hw * 0.8), -hd + 0.16], [Math.min(0.62, hw * 0.8), -hd + 0.16], '#0b0d14', 0.04) : '');
    case 'ochair': return Ci(0, 0.03, Math.min(hw, hd) * 0.8, '#3a3d46') + `<path d="M${fx(-hw * 0.7)} ${fx(-hd * 0.55)} Q0 ${fx(-hd * 1.05)} ${fx(hw * 0.7)} ${fx(-hd * 0.55)}" fill="none" stroke="#5a5f6e" stroke-width="0.07" stroke-linecap="round"/>`;
    case 'beanbag': return Ci(0, 0, Math.min(hw, hd), '#e2d8c8');
    case 'bathtub': return R(-hw, -hd, w, d, C2.cer, 0.14) + R(-hw + 0.08, -hd + 0.08, w - 0.16, d - 0.16, '#a6d8e8', 0.12);
    case 'shower': return R(-hw, -hd, w, d, C2.cer, 0.02) + svgLine([-hw, -hd], [hw, hd], '#9aa7c0', 0.01) + svgLine([hw, -hd], [-hw, hd], '#9aa7c0', 0.01);
    case 'toilet': return R(-hw, -hd, w, 0.18, C2.cer, 0.04) + `<ellipse cx="0" cy="${fx(-hd + 0.18 + (d - 0.18) / 2)}" rx="${fx(hw * 0.92)}" ry="${fx(Math.max(0.01, (d - 0.18) / 2))}" fill="${C2.cer}" ${k}/>`;
    case 'vanity': return R(-hw, -hd, w, d, C2.wood, 0.02) + `<ellipse cx="0" cy="0" rx="${fx(hw * 0.55)}" ry="${fx(hd * 0.6)}" fill="${C2.cer}" ${k}/>`;
    case 'washer': return R(-hw, -hd, w, d, C2.cer, 0.04) + Ci(0, 0.03, Math.min(hw, hd) * 0.55, '#8fa0bf');
    case 'lounger': return R(-hw, -hd, w, d, '#9a6b44', 0.04) + R(-hw + 0.04, -hd + 0.06, w - 0.08, d - 0.12, '#e6dccd', 0.05);
    default: return R(-hw, -hd, w, d, C2.fab, 0.03);
  }
}
function hbDeviceSVG(d) {
  const col = d.kind === 'sensor' ? '#7ef0ff' : '#ffc98a';
  let g = `<g class="dv" data-dv="${d.id}" transform="translate(${fx(d.x)} ${fx(d.y)})">`;
  if (d.kind !== 'sensor') g += `<circle r="0.42" fill="url(#devGlow)"/>`;
  g += `<circle r="0.15" fill="#121628" stroke="${col}" stroke-width="0.03"/>`;
  if (d.kind === 'light') { g += `<circle r="0.055" fill="${col}"/>`; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; g += svgLine([Math.cos(a) * 0.08, Math.sin(a) * 0.08], [Math.cos(a) * 0.12, Math.sin(a) * 0.12], col, 0.02); } }
  else if (d.kind === 'lamp') g += `<circle r="0.07" fill="none" stroke="${col}" stroke-width="0.025"/><circle r="0.03" fill="${col}"/>`;
  else g += `<rect x="-0.06" y="-0.06" width="0.12" height="0.12" rx="0.02" fill="none" stroke="${col}" stroke-width="0.022"/>`;
  return g + '</g>';
}

function hbCreatePlanner(root, opts) {
  const $ = s => root.querySelector(s);
  const hass = opts.hass;
  root.innerHTML = `<style>${HB_PLAN_CSS}</style><div class="app">
    <header class="bar">
      <div class="brand"><span class="ghost">${HB_GHOST}</span><b class="hide-s">${T('Grundriss-Editor', 'Floor plan editor')}</b></div>
      <input class="pname" id="planName" aria-label="${T('Name des Plans', 'Plan name')}">
      <div class="grp"><button class="btn icon" id="btnUndo" type="button" aria-label="${T('Rückgängig', 'Undo')}" title="${T('Rückgängig (Strg+Z)', 'Undo (Ctrl+Z)')}">${HB_PIC.undo}</button><button class="btn icon" id="btnRedo" type="button" aria-label="${T('Wiederholen', 'Redo')}" title="${T('Wiederholen (Strg+Y)', 'Redo (Ctrl+Y)')}">${HB_PIC.redo}</button></div>
      <div class="seg" id="modeSeg" role="group"><button type="button" data-mode="2d">2D</button><button type="button" data-mode="split">${T('Geteilt', 'Split')}</button><button type="button" data-mode="3d">3D</button></div>
      <span class="sp"></span>
      <button class="btn" id="btnBg" type="button">${HB_PIC.image}<span class="hide-s">${T('Vorlage', 'Template')}</span></button>
      <button class="btn" id="btnFile" type="button">${HB_PIC.file}<span class="hide-s">${T('Import/Export', 'Import/Export')}</span></button>
      <button class="btn" id="btnCancel" type="button">${HB_PIC.x}<span class="hide-s">${T('Abbrechen', 'Cancel')}</span></button>
      <button class="btn pri" id="btnApply" type="button">${HB_PIC.check}${T('Übernehmen', 'Apply')}</button>
    </header>
    <div class="main">
      <aside class="card left" id="left"></aside>
      <section class="views" id="views">
        <div class="vbox v2d"><svg class="plan t-select" id="svg">
          <defs><pattern id="gMinor" patternUnits="userSpaceOnUse" width="0.5" height="0.5"><path id="gMinorP" d="M0.5 0V0.5H0" fill="none" stroke="rgba(126,240,255,.06)"/></pattern>
          <pattern id="gMajor" patternUnits="userSpaceOnUse" width="1" height="1"><path id="gMajorP" d="M1 0V1H0" fill="none" stroke="rgba(126,240,255,.13)"/></pattern>
          <radialGradient id="devGlow"><stop offset="0" stop-color="#ffc98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffc98a" stop-opacity="0"/></radialGradient></defs>
          <g id="world"><rect id="gridMinor" x="-300" y="-300" width="600" height="600" fill="url(#gMinor)"/><rect x="-300" y="-300" width="600" height="600" fill="url(#gMajor)"/><image id="bgImg" preserveAspectRatio="none" style="pointer-events:none"/><g id="content"></g></g>
          <g id="over"></g></svg>
          <div class="hintbar"><div class="hint" id="hint"></div></div>
          <div class="status"><span class="chip" id="coords">x 0 · y 0</span><button class="chip" id="btnSnap" type="button" aria-pressed="true"></button><span class="sp"></span><button class="chip" id="zOut" type="button" aria-label="${T('Verkleinern', 'Zoom out')}">−</button><button class="chip" id="zFit" type="button">${T('Einpassen', 'Fit')}</button><button class="chip" id="zIn" type="button" aria-label="${T('Vergrößern', 'Zoom in')}">+</button></div>
        </div>
        <div class="vbox v3d" id="v3d"><canvas class="c3" id="c3d"></canvas><div class="v3msg" id="v3msg">${T('3D-Vorschau wird geladen …', 'Loading 3D preview …')}</div>
          <div class="v3bar"><button class="chip" id="b3Night" type="button" aria-pressed="false">${T('Nacht', 'Night')}</button><button class="chip" id="b3Walls" type="button" aria-pressed="false">${T('Wände niedrig', 'Low walls')}</button><button class="chip" id="b3Fit" type="button">${T('Zentrieren', 'Center')}</button></div></div>
      </section>
      <aside class="card right" id="right" aria-live="polite"></aside>
    </div>
    <div class="ghostDrag" id="ghostDrag" hidden></div><div class="modal" id="modal" hidden></div><div class="toast" id="toast" hidden></div>
    <input type="file" id="fileImg" accept="image/*" hidden><input type="file" id="fileJson" accept=".json,application/json,text/plain" hidden>
  </div>`;

  /* ---------- Zustand ---------- */
  let plan = normalizePlan(JSON.parse(JSON.stringify(opts.plan || emptyPlan())));
  plan.bg = { x: 0, y: 0, mpp: 0.02, opacity: 0.5, show: true };
  const LS_BG = 'homeboo3d-planner-bg';
  let bgData = { src: null, nw: 0, nh: 0 };
  try { const b = localStorage.getItem(LS_BG); if (b) { const o = JSON.parse(b); bgData = o.data || bgData; if (o.bg) plan.bg = o.bg; } } catch (e) {}
  const view = { s: 40, tx: 0, ty: 0 };
  let tool = 'select', sel = null, drag = null, pal = null, guides = [], polyPts = [], measure = null, hoverEdge = null, dropPrev = null, cursorW = [0, 0];
  let snapOn = true, wallCache = null, hist = [], hi = -1, dirty = false;
  const keys = { shift: false, alt: false, space: false };
  let mode = window.innerWidth < 900 ? '2d' : 'split';
  const RM = id => plan.rooms.find(r => r.id === id), OP = id => plan.openings.find(o => o.id === id), IT = id => plan.items.find(i => i.id === id), DV = id => plan.devices.find(d => d.id === id);
  const walls = () => (wallCache ||= computeWalls(plan));
  const nearest = (p, o) => nearestEdge(plan, p, o);
  const opPos = o => openingPos(plan, o);
  const listeners = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn, o]); };

  /* ---------- Verlauf ---------- */
  function snapshot() { const { bg, ...rest } = plan; return JSON.stringify(rest); }
  function saveBg() { try { if (bgData.src) localStorage.setItem(LS_BG, JSON.stringify({ data: bgData, bg: plan.bg })); else localStorage.removeItem(LS_BG); } catch (e) { toast(T('Das Bild ist zu groß zum Merken. Es bleibt bis zum Schließen.', 'The image is too large to keep. It stays until you close the editor.')); } }
  function resetHistory() { hist = [snapshot()]; hi = 0; updUndo(); }
  function commit(panelToo = false) {
    wallCache = null; dirty = true;
    hist = hist.slice(0, hi + 1); hist.push(snapshot()); if (hist.length > 150) hist.shift(); hi = hist.length - 1;
    updUndo(); schedule3D(); if (bgData.src) saveBg(); req(2 | 4 | (panelToo ? 8 : 0));
  }
  function restore(i) { hi = i; const bg = plan.bg; plan = JSON.parse(hist[hi]); plan.bg = bg; wallCache = null; validateSel(); updUndo(); schedule3D(); req(2 | 4 | 8); $('#planName').value = plan.name; }
  const undo = () => { if (hi > 0) restore(hi - 1); }, redo = () => { if (hi < hist.length - 1) restore(hi + 1); };
  function revert() { const bg = plan.bg; plan = JSON.parse(hist[hi]); plan.bg = bg; wallCache = null; }
  function validateSel() { if (!sel) return; const ok = sel.type === 'room' ? RM(sel.id) : sel.type === 'opening' ? OP(sel.id) : sel.type === 'item' ? IT(sel.id) : sel.type === 'device' ? DV(sel.id) : true; if (!ok) sel = null; if (sel?.type === 'room' && sel.vi != null && sel.vi >= RM(sel.id).pts.length) sel.vi = null; }
  function updUndo() { $('#btnUndo').disabled = hi <= 0; $('#btnRedo').disabled = hi >= hist.length - 1; }

  /* ---------- Geometrie-Helfer mit Bezug auf den Plan ---------- */
  function captureOpenings() { const m = new Map(); for (const o of plan.openings) { const op = opPos(o); if (op) m.set(o.id, op.c); } return m; }
  function rebind(pos) {
    for (const o of plan.openings) {
      const P = pos.get(o.id); if (!P) continue;
      let b = RM(o.room) ? nearest(P, { room: o.room }) : null;
      if (!b || b.d > 0.15) b = nearest(P);
      if (!b || b.d > 0.25 || b.L < o.w * 0.6) { o._x = 1; continue; }
      o.room = b.room; o.edge = b.edge; o.t = b.t;
    }
    plan.openings = plan.openings.filter(o => !o._x);
  }
  function linkedAt(pt) { const out = []; for (const r of plan.rooms) r.pts.forEach((q, i) => { if (dist(q, pt) < 0.012) out.push([r.id, i]); }); return out; }
  function setLinked(list, p) { for (const [rid, i] of list) { const r = RM(rid); if (r) r.pts[i] = [p[0], p[1]]; } }
  function insertVertex(r, i) { const pos = captureOpenings(), { A, B } = edgeOf(r, i); r.pts.splice(i + 1, 0, [r2((A[0] + B[0]) / 2), r2((A[1] + B[1]) / 2)]); r.open = (r.open || []).flatMap(k => k > i ? [k + 1] : (k === i ? [i, i + 1] : [k])); rebind(pos); }
  function deleteVertex(r, v) {
    const n = r.pts.length; if (n <= 3) { toast(T('Ein Raum braucht mindestens drei Ecken.', 'A room needs at least three corners.')); return false; }
    const pos = captureOpenings(), op = new Set(r.open || []), prev = (v - 1 + n) % n, newOpen = [];
    for (let j = 0; j < n - 1; j++) { const s = j < v ? j : j + 1; if (s === prev) { if (op.has(prev) && op.has(v)) newOpen.push(j); } else if (op.has(s)) newOpen.push(j); }
    r.pts = r.pts.filter((_, k) => k !== v); r.open = newOpen; rebind(pos); return true;
  }

  /* ---------- 2D-Darstellung ---------- */
  const svg = $('#svg'), content = $('#content'), over = $('#over'), world = $('#world');
  const W2S = p => [p[0] * view.s + view.tx, p[1] * view.s + view.ty];
  const ptsStr = pts => pts.map(p => fx(p[0]) + ',' + fx(p[1])).join(' ');
  function wallSVG(p) {
    const col = p.kind === 'rail' ? '#8f9bbf' : '#e6e8ef', t = p.t;
    const ops = p.ops.map(x => [clamp(x.c - x.w / 2, 0, p.L), clamp(x.c + x.w / 2, 0, p.L)]).sort((a, b) => a[0] - b[0]);
    let cur = -t / 2, h = ''; const seg = (s0, s1) => { if (s1 - s0 < 0.005) return; h += svgLine(add(p.a, mul(p.u, s0)), add(p.a, mul(p.u, s1)), col, t); };
    for (const [s0, s1] of ops) { seg(cur, s0); cur = Math.max(cur, s1); }
    seg(cur, p.L + t / 2); return h;
  }
  function openingSVG(o, Wc) {
    const op = opPos(o); if (!op) return '';
    const piece = Wc.byOp.get(o.id), t = piece ? piece.t : T_INT, { u, c, n } = op, w = o.w, ns = o.flipSide ? mul(n, -1) : n;
    const a = sub(c, mul(u, w / 2)), b = add(c, mul(u, w / 2));
    let h = `<g class="op" data-o="${o.id}">` + svgLine(a, b, 'rgba(0,0,0,0)', t + 0.3);
    const jamb = q => svgLine(add(q, mul(n, -t / 2)), add(q, mul(n, t / 2)), '#e6e8ef', 0.03);
    if (o.type === 'window' || o.type === 'gdoor') { const kk = t * 0.24; for (const s of [-1, 1]) h += svgLine(add(a, mul(n, s * kk)), add(b, mul(n, s * kk)), '#8fdcff', 0.025); if (o.type === 'gdoor') h += svgLine(a, b, '#8fdcff', 0.012); h += jamb(a) + jamb(b); }
    else { const H = o.flipHinge ? b : a, cd = o.flipHinge ? mul(u, -1) : u, E = add(H, mul(ns, w)), C = add(H, mul(cd, w)), sweep = cross(cd, ns) > 0 ? 1 : 0, col = o.type === 'front' ? '#7ef0ff' : '#e6e8ef'; h += svgLine(H, E, col, 0.04) + `<path d="M${fx(C[0])} ${fx(C[1])} A${fx(w)} ${fx(w)} 0 0 ${sweep} ${fx(E[0])} ${fx(E[1])}" fill="none" stroke="${col}" stroke-width="0.012" stroke-dasharray="0.06 0.05" opacity=".75"/>` + jamb(a) + jamb(b); }
    return h + '</g>';
  }
  function renderView() {
    world.setAttribute('transform', `matrix(${view.s} 0 0 ${view.s} ${view.tx} ${view.ty})`);
    $('#gMinorP').setAttribute('stroke-width', fx(1 / view.s)); $('#gMajorP').setAttribute('stroke-width', fx(1.2 / view.s));
    $('#gridMinor').style.display = view.s > 34 ? '' : 'none';
    const im = $('#bgImg');
    if (bgData.src && plan.bg.show) { if (im.getAttribute('href') !== bgData.src) im.setAttribute('href', bgData.src); im.setAttribute('x', plan.bg.x); im.setAttribute('y', plan.bg.y); im.setAttribute('width', bgData.nw * plan.bg.mpp); im.setAttribute('height', bgData.nh * plan.bg.mpp); im.setAttribute('opacity', plan.bg.opacity); im.style.display = ''; }
    else im.style.display = 'none';
  }
  function renderContent() {
    const Wc = walls(); let h = '';
    for (const r of plan.rooms) h += `<polygon class="floor" data-r="${r.id}" points="${ptsStr(r.pts)}" fill="${(FLOORS[r.floor] || FLOORS.ash).c}"/>`;
    for (const it of [...plan.items].sort((a, b) => (a.kind === 'rug' ? 0 : 1) - (b.kind === 'rug' ? 0 : 1))) h += `<g class="it" data-it="${it.id}" transform="translate(${fx(it.x)} ${fx(it.y)}) rotate(${fx(it.rot)})">${hbItemShape(it.kind, it.w, it.d, it)}</g>`;
    for (const p of Wc.pieces) h += wallSVG(p);
    for (const o of plan.openings) h += openingSVG(o, Wc);
    for (const d of plan.devices) h += hbDeviceSVG(d);
    content.innerHTML = h;
  }
  function itemCorners(it) { const c = Math.cos(it.rot * DEG), s = Math.sin(it.rot * DEG), L = (x, y) => [it.x + x * c - y * s, it.y + x * s + y * c]; return { L, pts: [L(-it.w / 2, -it.d / 2), L(it.w / 2, -it.d / 2), L(it.w / 2, it.d / 2), L(-it.w / 2, it.d / 2)] }; }
  function renderOverlay() {
    let h = ''; const sp = p => W2S(p).map(v => fx(v)).join(',');
    for (const r of plan.rooms) { const c = W2S(centroid(r.pts)), A = Math.abs(polyArea(r.pts)); if (A * view.s * view.s < 1800) continue; h += `<g transform="translate(${fx(c[0])} ${fx(c[1])})"><text class="rn" y="-3">${esc(r.name)}</text><text class="ra" y="11">${fmtA(A)}</text></g>`; }
    if (hoverEdge) { const r = RM(hoverEdge.room); if (r && hoverEdge.i < r.pts.length) { const e = edgeOf(r, hoverEdge.i), a = W2S(e.A), b = W2S(e.B); h += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#ffb25c" stroke-width="5" stroke-linecap="round" opacity=".85" pointer-events="none"/>`; } }
    if (sel?.type === 'room') {
      const r = RM(sel.id);
      if (r) {
        h += `<polygon points="${r.pts.map(sp).join(' ')}" fill="rgba(126,240,255,.07)" stroke="#7ef0ff" stroke-width="2" pointer-events="none"/>`;
        for (let i = 0; i < r.pts.length; i++) {
          const e = edgeOf(r, i), nn = inwardN(r, i), M = W2S(mul(add(e.A, e.B), 0.5)), lab = add(M, mul(nn, 15)), plus = add(M, mul(nn, -22)), open = (r.open || []).includes(i);
          if (e.L * view.s > 46) { h += `<text class="el" x="${fx(lab[0])}" y="${fx(lab[1])}">${fmtM(e.L)}${open ? ' · ' + T('offen', 'open') : ''}</text>`; h += `<g data-h="add" data-i="${i}"><circle class="ha" cx="${fx(plus[0])}" cy="${fx(plus[1])}" r="8"/><path class="ha-p" d="M${fx(plus[0] - 4)} ${fx(plus[1])}H${fx(plus[0] + 4)}M${fx(plus[0])} ${fx(plus[1] - 4)}V${fx(plus[1] + 4)}"/></g>`; }
          if (e.L * view.s > 24) h += `<rect class="he" data-h="e" data-i="${i}" x="-10" y="-4" width="20" height="8" rx="4" transform="translate(${fx(M[0])} ${fx(M[1])}) rotate(${fx(Math.atan2(e.u[1], e.u[0]) / DEG)})"/>`;
        }
        r.pts.forEach((q, i) => { const Q = W2S(q); h += `<circle class="hv${sel.vi === i ? ' on' : ''}" data-h="v" data-i="${i}" cx="${fx(Q[0])}" cy="${fx(Q[1])}" r="7"/>`; });
      }
    }
    if (sel?.type === 'opening') { const o = OP(sel.id), op = o && opPos(o); if (op) { const a = W2S(sub(op.c, mul(op.u, o.w / 2))), b = W2S(add(op.c, mul(op.u, o.w / 2))), lab = add(W2S(op.c), mul(op.n, -20)); h += `<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" stroke="#7ef0ff" stroke-width="4" stroke-linecap="round" pointer-events="none"/><circle class="hv" data-h="ow" data-side="0" cx="${fx(a[0])}" cy="${fx(a[1])}" r="7"/><circle class="hv" data-h="ow" data-side="1" cx="${fx(b[0])}" cy="${fx(b[1])}" r="7"/><text class="el" x="${fx(lab[0])}" y="${fx(lab[1])}">${fmtM(o.w)}</text>`; } }
    if (sel?.type === 'item') { const it = IT(sel.id); if (it) { const { L, pts } = itemCorners(it), back = W2S(L(0, -it.d / 2)), dir = [Math.sin(it.rot * DEG), -Math.cos(it.rot * DEG)], rh = add(back, mul(dir, 28)), cr = W2S(L(it.w / 2, it.d / 2)), lab = W2S(L(0, it.d / 2)); h += `<polygon points="${pts.map(sp).join(' ')}" fill="none" stroke="#ffc98a" stroke-width="2" stroke-dasharray="6 4" pointer-events="none"/><line x1="${fx(back[0])}" y1="${fx(back[1])}" x2="${fx(rh[0])}" y2="${fx(rh[1])}" stroke="#ffc98a" stroke-width="1.5" pointer-events="none"/><circle class="hr" data-h="rot" cx="${fx(rh[0])}" cy="${fx(rh[1])}" r="8"/><rect class="hs" data-h="rs" x="${fx(cr[0] - 6)}" y="${fx(cr[1] - 6)}" width="12" height="12" rx="3"/><text class="el" x="${fx(lab[0])}" y="${fx(lab[1] + 16)}" style="fill:#ffc98a">${fmtNum(it.w)} × ${fmtNum(it.d)} m</text>`; } }
    if (sel?.type === 'device') { const d = DV(sel.id); if (d) { const c = W2S([d.x, d.y]); h += `<circle cx="${fx(c[0])}" cy="${fx(c[1])}" r="${fx(Math.max(12, 0.24 * view.s))}" fill="none" stroke="#7ef0ff" stroke-width="2" pointer-events="none"/>`; } }
    const H = svg.clientHeight, Wd = svg.clientWidth;
    for (const [ax, v] of guides) { const s = ax === 'v' ? W2S([v, 0])[0] : W2S([0, v])[1]; h += ax === 'v' ? `<line x1="${fx(s)}" y1="0" x2="${fx(s)}" y2="${H}" stroke="#7ef0ff" stroke-dasharray="4 5" opacity=".55" pointer-events="none"/>` : `<line x1="0" y1="${fx(s)}" x2="${Wd}" y2="${fx(s)}" stroke="#7ef0ff" stroke-dasharray="4 5" opacity=".55" pointer-events="none"/>`; }
    if (drag?.kind === 'rect') { const a = drag.a, b = drag.b, q = [a, [b[0], a[1]], b, [a[0], b[1]]], c = W2S(mul(add(a, b), 0.5)); h += `<polygon points="${q.map(sp).join(' ')}" fill="rgba(126,240,255,.12)" stroke="#7ef0ff" stroke-width="2" pointer-events="none"/><text class="el" x="${fx(c[0])}" y="${fx(c[1])}">${fmtNum(Math.abs(b[0] - a[0]))} × ${fmtNum(Math.abs(b[1] - a[1]))} m</text>`; }
    if (tool === 'poly' && polyPts.length) { const all = [...polyPts, snap(cursorW).p], p0 = W2S(polyPts[0]); h += `<polyline points="${all.map(sp).join(' ')}" fill="rgba(126,240,255,.08)" stroke="#7ef0ff" stroke-width="2" pointer-events="none"/><circle cx="${fx(p0[0])}" cy="${fx(p0[1])}" r="9" fill="none" stroke="#7ef0ff" stroke-width="2" pointer-events="none"/>`; polyPts.forEach(q => { const Q = W2S(q); h += `<circle cx="${fx(Q[0])}" cy="${fx(Q[1])}" r="4" fill="#7ef0ff" pointer-events="none"/>`; }); }
    const m = drag?.kind === 'measure' ? drag : measure;
    if (m) { const a = W2S(m.a), b = W2S(m.b), c = mul(add(a, b), 0.5); h += `<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" stroke="#ffb25c" stroke-width="3" stroke-linecap="round" pointer-events="none"/><circle cx="${fx(a[0])}" cy="${fx(a[1])}" r="5" fill="#ffb25c"/><circle cx="${fx(b[0])}" cy="${fx(b[1])}" r="5" fill="#ffb25c"/><text class="el" style="fill:#ffb25c" x="${fx(c[0])}" y="${fx(c[1] - 14)}">${fmtM(dist(m.a, m.b))}</text>`; }
    if (dropPrev) h += dropPreviewSVG(dropPrev);
    over.innerHTML = h;
  }
  function dropPreviewSVG({ kind, p }) {
    const [t, k] = kind.split(':');
    if (t === 'op') { const b = nearest(p); if (!b || b.d > 1.2) return ''; const r = RM(b.room), e = edgeOf(r, b.edge), w = OPDEF[k].w, s = clamp(b.t * e.L, w / 2, e.L - w / 2), c = add(e.A, mul(e.u, s)), a = W2S(sub(c, mul(e.u, w / 2))), bb = W2S(add(c, mul(e.u, w / 2))); return `<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(bb[0])}" y2="${fx(bb[1])}" stroke="#7ef0ff" stroke-width="7" stroke-linecap="round" opacity=".8" pointer-events="none"/>`; }
    if (t === 'it') { const it = { x: snapv(p[0]), y: snapv(p[1]), rot: 0, w: CAT[k].w, d: CAT[k].d, kind: k }; if (CAT[k].wall && !keys.alt) wallSnapItem(it); const { pts } = itemCorners(it); return `<polygon points="${pts.map(q => W2S(q).map(fx).join(',')).join(' ')}" fill="rgba(255,201,138,.18)" stroke="#ffc98a" stroke-width="2" stroke-dasharray="6 4" pointer-events="none"/>`; }
    const c = W2S(p); return `<circle cx="${fx(c[0])}" cy="${fx(c[1])}" r="12" fill="rgba(255,201,138,.25)" stroke="#ffc98a" stroke-width="2" pointer-events="none"/>`;
  }
  let rq = 0;
  function req(m) { if (!rq) requestAnimationFrame(flush); rq |= m; }
  function flush() { const m = rq; rq = 0; if (destroyed) return; if (m & 2) wallCache = null; if (m & 1) renderView(); if (m & 2) renderContent(); if (m & 4) renderOverlay(); if (m & 8) renderPanel(); }

  /* ---------- Fangen ---------- */
  function snap(p, opt = {}) {
    if (!snapOn || keys.shift) return { p, guides: [] };
    const R = 11 / view.s, skip = new Set((opt.skip || []).map(([r, i]) => r + ':' + i)); let best = null;
    for (const r of plan.rooms) r.pts.forEach((v, i) => { if (skip.has(r.id + ':' + i)) return; const d = dist(p, v); if (d < R && (!best || d < best.d)) best = { d, v }; });
    if (best) return { p: [best.v[0], best.v[1]], guides: [] };
    let x = snapv(p[0]), y = snapv(p[1]), bx = null, by = null, dx = R * 0.7, dy = R * 0.7;
    for (const r of plan.rooms) r.pts.forEach((v, i) => { if (skip.has(r.id + ':' + i)) return; if (Math.abs(p[0] - v[0]) < dx) { dx = Math.abs(p[0] - v[0]); bx = v[0]; } if (Math.abs(p[1] - v[1]) < dy) { dy = Math.abs(p[1] - v[1]); by = v[1]; } });
    const g = []; if (bx != null) { x = bx; g.push(['v', bx]); } if (by != null) { y = by; g.push(['h', by]); }
    return { p: [r2(x), r2(y)], guides: g };
  }
  function wallSnapItem(it) {
    const P = [it.x, it.y]; let best = null;
    for (const pc of walls().pieces) { if (pc.kind === 'rail') continue; const sd = segDist(P, pc.a, pc.b); if (!best || sd.d < best.sd.d) best = { pc, sd }; }
    if (!best || best.sd.d > it.d / 2 + 0.35) return false;
    const { pc, sd } = best; let n = [-pc.u[1], pc.u[0]]; if (dot(sub(P, pc.a), n) < 0) n = mul(n, -1);
    const pos = add(sd.Q, mul(n, pc.t / 2 + it.d / 2 + 0.01)); it.x = r2(pos[0]); it.y = r2(pos[1]);
    it.rot = ((Math.round(Math.atan2(-n[0], n[1]) / DEG * 10) / 10) + 360) % 360; return true;
  }

  /* ---------- Zeiger ---------- */
  function S2W(e) { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left - view.tx) / view.s, (e.clientY - r.top - view.ty) / view.s]; }
  const pointers = new Map(); let pinch = null;
  on(svg, 'contextmenu', e => e.preventDefault());
  on(svg, 'pointerdown', e => {
    if (e.button === 2) return;
    svg.setPointerCapture(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 2) { if (drag?.moved) { revert(); req(2 | 4); } drag = null; const [a, b] = [...pointers.values()]; pinch = { d0: dist(a, b), s0: view.s, m0: mul(add(a, b), 0.5), tx: view.tx, ty: view.ty }; return; }
    const p = S2W(e); cursorW = p; const base = { p0: p, x0: e.clientX, y0: e.clientY, moved: false };
    if (e.button === 1 || keys.space) { drag = { ...base, kind: 'pan', tx: view.tx, ty: view.ty }; svg.classList.add('panning'); return; }
    if (tool === 'rect') { const a = snap(p).p; drag = { ...base, kind: 'rect', a, b: a }; return; }
    if (tool === 'measure') { const a = snap(p).p; drag = { ...base, kind: 'measure', a, b: a }; measure = null; return; }
    if (tool === 'poly') { polyClick(p); return; }
    if (tool === 'bgmove') { drag = { ...base, kind: 'bg', bx: plan.bg.x, by: plan.bg.y }; return; }
    const t = e.target.closest('[data-h],[data-o],[data-it],[data-dv],[data-r]');
    if (t?.dataset.h && sel) {
      const h = t.dataset.h, i = +t.dataset.i;
      if (h === 'v') { const r = RM(sel.id); sel.vi = i; drag = { ...base, kind: 'vertex', linked: linkedAt(r.pts[i]) }; req(4 | 8); return; }
      if (h === 'e') { const r = RM(sel.id), e2 = edgeOf(r, i); drag = { ...base, kind: 'edge', A0: e2.A.slice(), B0: e2.B.slice(), la: linkedAt(e2.A), lb: linkedAt(e2.B), n: [-e2.u[1], e2.u[0]] }; return; }
      if (h === 'add') { const r = RM(sel.id); insertVertex(r, i); sel.vi = i + 1; drag = { ...base, kind: 'vertex', linked: linkedAt(r.pts[i + 1]), moved: true }; req(2 | 4 | 8); return; }
      if (h === 'rot') { drag = { ...base, kind: 'rot' }; return; }
      if (h === 'rs') { drag = { ...base, kind: 'resize' }; return; }
      if (h === 'ow') { drag = { ...base, kind: 'owidth', side: +t.dataset.side }; return; }
    }
    if (t?.dataset.o) { setSel({ type: 'opening', id: t.dataset.o }); drag = { ...base, kind: 'opening' }; return; }
    if (t?.dataset.it) { const it = IT(t.dataset.it); setSel({ type: 'item', id: it.id }); drag = { ...base, kind: 'item', x: it.x, y: it.y }; return; }
    if (t?.dataset.dv) { const d = DV(t.dataset.dv); setSel({ type: 'device', id: d.id }); drag = { ...base, kind: 'device', x: d.x, y: d.y }; return; }
    if (t?.dataset.r) { const r = RM(t.dataset.r); setSel({ type: 'room', id: r.id, vi: null }); drag = { ...base, kind: 'room', orig: r.pts.map(q => q.slice()), carry: [...plan.items, ...plan.devices].filter(o => inPoly(r.pts, o.x, o.y)).map(o => ({ ref: o, x: o.x, y: o.y })) }; return; }
    drag = { ...base, kind: 'pan', tx: view.tx, ty: view.ty, deselect: true };
  });
  on(window, 'pointermove', e => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pal) { palMove(e); return; }
    if (pinch) { if (pointers.size < 2) return; const [a, b] = [...pointers.values()], r = svg.getBoundingClientRect(), s = clamp(pinch.s0 * dist(a, b) / pinch.d0, 6, 500), m = mul(add(a, b), 0.5), wx = (pinch.m0[0] - r.left - pinch.tx) / pinch.s0, wy = (pinch.m0[1] - r.top - pinch.ty) / pinch.s0; view.s = s; view.tx = m[0] - r.left - wx * s; view.ty = m[1] - r.top - wy * s; req(1 | 4); return; }
    if (e.composedPath && e.composedPath().includes(svg)) { const p = S2W(e); cursorW = p; $('#coords').textContent = `x ${fmtNum(p[0])} · y ${fmtNum(p[1])} m`; if (tool === 'poly' && polyPts.length && !drag) req(4); }
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4) return;
    if (!drag.moved && drag.kind === 'pan') svg.classList.add('panning');
    drag.moved = true; applyDrag(S2W(e), e);
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pal) { palEnd(); return; }
    if (pinch) { if (pointers.size < 2) pinch = null; return; }
    if (!drag) return;
    const d = drag; drag = null; guides = []; svg.classList.remove('panning');
    if (d.kind === 'pan') { if (!d.moved && d.deselect) setSel(null); req(4); return; }
    if (d.kind === 'rect') { const w = Math.abs(d.b[0] - d.a[0]), h = Math.abs(d.b[1] - d.a[1]); if (w >= 0.5 && h >= 0.5) { const x0 = Math.min(d.a[0], d.b[0]), x1 = Math.max(d.a[0], d.b[0]), y0 = Math.min(d.a[1], d.b[1]), y1 = Math.max(d.a[1], d.b[1]); createRoom([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); } else if (d.moved) toast(T('Zieh das Rechteck etwas größer auf – mindestens 50 × 50 cm.', 'Drag a slightly larger rectangle – at least 50 × 50 cm.')); req(4); return; }
    if (d.kind === 'measure') { if (dist(d.a, d.b) > 0.1) { measure = { a: d.a, b: d.b }; setTool('select'); setSel({ type: 'measure' }); } req(4); return; }
    if (d.moved) commit(true); else req(4 | 8);
  }
  on(window, 'pointerup', endPointer);
  on(window, 'pointercancel', e => { if (drag?.moved && drag.kind !== 'pan') { revert(); req(2 | 4 | 8); drag = null; } endPointer(e); });
  function applyDrag(p, e) {
    const d = drag;
    switch (d.kind) {
      case 'pan': view.tx = d.tx + (e.clientX - d.x0); view.ty = d.ty + (e.clientY - d.y0); req(1 | 4); break;
      case 'bg': plan.bg.x = d.bx + (p[0] - d.p0[0]); plan.bg.y = d.by + (p[1] - d.p0[1]); req(1); break;
      case 'rect': { const s = snap(p); d.b = s.p; guides = s.guides; req(4); break; }
      case 'measure': d.b = snap(p).p; req(4); break;
      case 'vertex': { const s = snap(p, { skip: d.linked }); guides = s.guides; setLinked(d.linked, s.p); req(2 | 4); break; }
      case 'edge': { let k = dot(sub(p, d.p0), d.n); if (snapOn && !keys.shift) k = snapv(k); const dv = mul(d.n, k); setLinked(d.la, add(d.A0, dv).map(r2)); setLinked(d.lb, add(d.B0, dv).map(r2)); req(2 | 4); break; }
      case 'room': {
        const r = RM(sel.id); let dv = sub(p, d.p0);
        if (snapOn && !keys.shift) { const R = 11 / view.s; let corr = null; for (const q of d.orig) { const v = add(q, dv); for (const o of plan.rooms) { if (o.id === r.id) continue; for (const w of o.pts) { const c = sub(w, v); if (len(c) < R && (!corr || len(c) < len(corr))) corr = c; } } } dv = corr ? add(dv, corr) : [snapv(dv[0]), snapv(dv[1])]; }
        r.pts = d.orig.map(q => add(q, dv).map(r2)); for (const c of d.carry) { c.ref.x = r2(c.x + dv[0]); c.ref.y = r2(c.y + dv[1]); } req(2 | 4); break;
      }
      case 'item': { const it = IT(sel.id); let x = d.x + p[0] - d.p0[0], y = d.y + p[1] - d.p0[1]; if (snapOn && !keys.shift) { x = snapv(x); y = snapv(y); } it.x = r2(x); it.y = r2(y); if (CAT[it.kind]?.wall && !keys.alt) wallSnapItem(it); req(2 | 4); break; }
      case 'device': { const dv = DV(sel.id); let x = d.x + p[0] - d.p0[0], y = d.y + p[1] - d.p0[1]; if (snapOn && !keys.shift) { x = snapv(x); y = snapv(y); } dv.x = r2(x); dv.y = r2(y); req(2 | 4); break; }
      case 'rot': { const it = IT(sel.id), v = sub(p, [it.x, it.y]); let a = Math.atan2(v[0], -v[1]) / DEG; if (!keys.shift) a = Math.round(a / 15) * 15; it.rot = (a + 360) % 360; req(2 | 4); break; }
      case 'resize': { const it = IT(sel.id), v = sub(p, [it.x, it.y]), c = Math.cos(-it.rot * DEG), s = Math.sin(-it.rot * DEG), lx = v[0] * c - v[1] * s, ly = v[0] * s + v[1] * c; let w = Math.max(0.2, 2 * Math.abs(lx)), dd = Math.max(0.2, 2 * Math.abs(ly)); if (!keys.shift) { w = snapv(w); dd = snapv(dd); } it.w = r2(w); it.d = r2(dd); req(2 | 4); break; }
      case 'opening': { const o = OP(sel.id); let b = nearest(p, { room: o.room }); if (!b || b.d > 0.45) b = nearest(p); if (!b || b.d > 1.2 || b.L < o.w + 0.1) break; let s = b.t * b.L; if (snapOn && !keys.shift) s = snapv(s); s = clamp(s, o.w / 2 + 0.05, b.L - o.w / 2 - 0.05); Object.assign(o, { room: b.room, edge: b.edge, t: s / b.L }); req(2 | 4); break; }
      case 'owidth': { const o = OP(sel.id), op = opPos(o); if (!op) break; const s = dot(sub(p, op.A), op.u), c = o.t * op.L; let s0 = c - o.w / 2, s1 = c + o.w / 2; const sv = snapOn && !keys.shift ? snapv(s) : s; if (d.side === 0) s0 = clamp(sv, 0.05, s1 - 0.4); else s1 = clamp(sv, s0 + 0.4, op.L - 0.05); o.w = r2(s1 - s0); o.t = ((s0 + s1) / 2) / op.L; req(2 | 4); break; }
    }
  }
  on(svg, 'wheel', e => { e.preventDefault(); const r = svg.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))); }, { passive: false });
  function zoomAt(mx, my, k) { const s = clamp(view.s * k, 6, 500), wx = (mx - view.tx) / view.s, wy = (my - view.ty) / view.s; view.s = s; view.tx = mx - wx * s; view.ty = my - wy * s; req(1 | 4); }
  on(svg, 'dblclick', e => { if (tool === 'poly') { finishPoly(); return; } const t = e.target.closest('[data-o]'); if (t) { const o = OP(t.dataset.o); if (o && (o.type === 'door' || o.type === 'front')) { o.flipSide = !o.flipSide; commit(true); } } });
  function fitView() {
    const pts = plan.rooms.flatMap(r => r.pts);
    if (bgData.src && plan.bg.show) pts.push([plan.bg.x, plan.bg.y], [plan.bg.x + bgData.nw * plan.bg.mpp, plan.bg.y + bgData.nh * plan.bg.mpp]);
    const W = svg.clientWidth || 600, H = svg.clientHeight || 400;
    if (!pts.length) { view.s = 40; view.tx = W / 2 - 5 * 40; view.ty = H / 2 - 4 * 40; req(1 | 4); return; }
    const b = bbox(pts), bw = Math.max(2, b.x1 - b.x0), bh = Math.max(2, b.y1 - b.y0);
    view.s = clamp(Math.min((W - 80) / bw, (H - 140) / bh), 6, 500); view.tx = W / 2 - (b.x0 + bw / 2) * view.s; view.ty = H / 2 - (b.y0 + bh / 2) * view.s + 4; req(1 | 4);
  }
  function createRoom(pts) {
    const r = { id: uid('r'), name: `${T('Raum', 'Room')} ${plan.rooms.length + 1}`, type: 'sonst', floor: 'ash', outdoor: false, area: '', open: [], pts: pts.map(p => p.map(r2)) };
    plan.rooms.push(r); setTool('select'); setSel({ type: 'room', id: r.id, vi: null }); commit(true);
    toast(T('Raum angelegt. Ecken und Wände kannst du jetzt direkt ziehen.', 'Room created. You can now drag its corners and walls.'));
  }
  function polyClick(p) { const s = snap(p).p; if (polyPts.length >= 3 && dist(W2S(s), W2S(polyPts[0])) < 12) { finishPoly(); return; } if (polyPts.length && dist(s, polyPts[polyPts.length - 1]) < 0.02) return; polyPts.push(s); req(4); }
  function finishPoly() { const pts = polyPts.slice(); polyPts = []; if (pts.length >= 3 && Math.abs(polyArea(pts)) > 0.25) createRoom(pts); else { toast(T('Für einen Raum brauchst du mindestens drei Ecken.', 'A room needs at least three corners.')); req(4); } }

  /* ---------- Palette ---------- */
  const ghostDrag = $('#ghostDrag');
  function palMove(e) {
    if (!pal.moved && Math.hypot(e.clientX - pal.x0, e.clientY - pal.y0) < 6) return;
    pal.moved = true; ghostDrag.hidden = false; ghostDrag.textContent = pal.label; ghostDrag.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 12}px)`;
    const r = svg.getBoundingClientRect(), inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && mode !== '3d';
    dropPrev = inside ? { kind: pal.kind, p: S2W(e) } : null; req(4);
  }
  function palEnd() { const P = pal; pal = null; ghostDrag.hidden = true; const had = dropPrev; dropPrev = null; if (!P.moved) addAt(P.kind, null); else if (had) addAt(P.kind, had.p); req(4); }
  function viewCenterW() { const W = svg.clientWidth || 600, H = svg.clientHeight || 400; return [(W / 2 - view.tx) / view.s, (H / 2 - view.ty) / view.s]; }
  function addAt(kind, p) {
    const [t, k] = kind.split(':'); if (mode === '3d') setMode('split');
    if (t === 'op') {
      let b = null;
      if (p) b = nearest(p);
      else if (sel?.type === 'room') { const r = RM(sel.id); let best = -1; r.pts.forEach((_, i) => { const L = edgeOf(r, i).L; if (L > best && !(r.open || []).includes(i)) { best = L; b = { room: r.id, edge: i, t: 0.5, d: 0, L }; } }); }
      else b = nearest(viewCenterW());
      if (!b || b.d > 1.2) { toast(T('Türen und Fenster gehören auf eine Wand. Lass sie direkt auf einer Wand los.', 'Doors and windows belong on a wall. Drop them right onto a wall.')); return; }
      const D = OPDEF[k]; if (b.L < D.w + 0.1) { toast(T('Diese Wand ist zu kurz dafür.', 'This wall is too short for that.')); return; }
      const s = clamp(b.t * b.L, D.w / 2 + 0.05, b.L - D.w / 2 - 0.05);
      const o = { id: uid('o'), type: k, room: b.room, edge: b.edge, t: s / b.L, w: D.w, sill: D.sill ?? 0, h: D.h, flipHinge: false, flipSide: false, entity: '' };
      plan.openings.push(o); setSel({ type: 'opening', id: o.id }); commit(true); return;
    }
    const c = p || (sel?.type === 'room' ? centroid(RM(sel.id).pts) : viewCenterW());
    if (t === 'it') { const it = { id: uid('i'), kind: k, x: snapv(c[0]), y: snapv(c[1]), rot: 0, w: CAT[k].w, d: CAT[k].d }; if (CAT[k].wall && !keys.alt) wallSnapItem(it); plan.items.push(it); setSel({ type: 'item', id: it.id }); commit(true); return; }
    if (t === 'dv') { const dv = { id: uid('d'), kind: k, x: r2(snapv(c[0])), y: r2(snapv(c[1])), name: N(DEVDEF[k].n), entity: '', h: k === 'light' ? 2.1 : undefined }; plan.devices.push(dv); setSel({ type: 'device', id: dv.id }); commit(true); }
  }

  /* ---------- Auswahl ---------- */
  function setSel(s) { sel = s; if (s?.type !== 'measure') measure = null; hoverEdge = null; req(4 | 8); }
  function deleteSel() {
    if (!sel) return;
    if (sel.type === 'room') { const r = RM(sel.id); if (!r) return; if (sel.vi != null) { if (deleteVertex(r, sel.vi)) { sel.vi = null; commit(true); } return; } const pos = captureOpenings(); plan.rooms = plan.rooms.filter(x => x !== r); rebind(pos); }
    else if (sel.type === 'opening') plan.openings = plan.openings.filter(o => o.id !== sel.id);
    else if (sel.type === 'item') plan.items = plan.items.filter(o => o.id !== sel.id);
    else if (sel.type === 'device') plan.devices = plan.devices.filter(o => o.id !== sel.id);
    else return;
    sel = null; commit(true);
  }
  function duplicateSel() {
    const cl = o => JSON.parse(JSON.stringify(o));
    if (sel?.type === 'room') { const r = RM(sel.id), c = { ...cl(r), id: uid('r'), name: r.name + ' (' + T('Kopie', 'copy') + ')', pts: r.pts.map(q => [r2(q[0] + 0.5), r2(q[1] + 0.5)]) }; plan.rooms.push(c); setSel({ type: 'room', id: c.id, vi: null }); commit(true); }
    else if (sel?.type === 'item') { const it = IT(sel.id), c = { ...cl(it), id: uid('i'), x: r2(it.x + 0.3), y: r2(it.y + 0.3) }; plan.items.push(c); setSel({ type: 'item', id: c.id }); commit(true); }
    else if (sel?.type === 'device') { const d = DV(sel.id), c = { ...cl(d), id: uid('d'), x: r2(d.x + 0.4), y: r2(d.y + 0.4) }; plan.devices.push(c); setSel({ type: 'device', id: c.id }); commit(true); }
  }
  function nudge(dx, dy) {
    if (!sel) return;
    if (sel.type === 'item') { const it = IT(sel.id); it.x = r2(it.x + dx); it.y = r2(it.y + dy); }
    else if (sel.type === 'device') { const d = DV(sel.id); d.x = r2(d.x + dx); d.y = r2(d.y + dy); }
    else if (sel.type === 'room') { const r = RM(sel.id); if (sel.vi != null) setLinked(linkedAt(r.pts[sel.vi]), [r2(r.pts[sel.vi][0] + dx), r2(r.pts[sel.vi][1] + dy)]); else r.pts = r.pts.map(q => [r2(q[0] + dx), r2(q[1] + dy)]); }
    else return;
    commit(true);
  }

  /* ---------- Werkzeuge & Tasten ---------- */
  const HINTS = {
    select: T('<b>Ziehen</b> verschiebt · <b>Ecken und Wandgriffe</b> ändern die Form · <b>+</b> fügt eine Ecke ein · Bauteile links <b>auf den Plan ziehen</b>', '<b>Drag</b> to move · <b>corners and wall handles</b> reshape · <b>+</b> adds a corner · drag parts from the left <b>onto the plan</b>'),
    rect: T('<b>Raum aufziehen:</b> Ziehe ein Rechteck.', '<b>Draw a room:</b> drag a rectangle.'),
    poly: T('<b>Freie Form:</b> Ecken anklicken, mit Klick auf den ersten Punkt oder Doppelklick abschließen.', '<b>Free shape:</b> click the corners, finish by clicking the first point or double-clicking.'),
    measure: T('<b>Maßstab:</b> Ziehe eine Linie über eine Strecke, deren echte Länge du kennst.', '<b>Scale:</b> drag a line over a distance whose real length you know.'),
    bgmove: T('<b>Vorlage verschieben:</b> Ziehe das Bild an die richtige Stelle.', '<b>Move template:</b> drag the image into place.'),
  };
  function setTool(t) { tool = t; if (t !== 'poly') polyPts = []; svg.setAttribute('class', 'plan t-' + t); root.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === t))); $('#hint').innerHTML = HINTS[t] || ''; req(4); }
  on(window, 'keydown', e => {
    if (e.key === 'Shift') keys.shift = true; if (e.key === 'Alt') keys.alt = true;
    const ae = root.activeElement; if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) return;
    if (!$('#modal').hidden) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); $('#modal').hidden = true; } return; }
    const tileEl = ae?.closest?.('[data-add]');
    if (tileEl && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); addAt(tileEl.dataset.add, null); return; }
    if (ae && ae.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
    if (!e.ctrlKey && !e.metaKey && e.key.length === 1) e.stopPropagation();
    if (['Escape', 'Delete', 'Backspace', 'Enter'].includes(e.key) || e.key.startsWith('Arrow')) e.stopPropagation();
    if (e.code === 'Space') { keys.space = true; e.preventDefault(); return; }
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (mod && k === 'd') { e.preventDefault(); duplicateSel(); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSel(); return; }
    if (e.key === 'Escape') { e.preventDefault(); if (tool === 'poly' && polyPts.length) { polyPts = []; req(4); } else if (tool !== 'select') setTool('select'); else setSel(null); return; }
    if (e.key === 'Enter' && tool === 'poly') { finishPoly(); return; }
    const step = e.shiftKey ? 0.5 : GRID;
    if (e.key.startsWith('Arrow')) { e.preventDefault(); nudge(e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0, e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0); return; }
    if (mod) return;
    if (k === 'v') setTool('select'); if (k === 'r') setTool('rect'); if (k === 'p') setTool('poly'); if (k === 'm') setTool('measure');
    if (k === 'q' && sel?.type === 'item') { const it = IT(sel.id); it.rot = (it.rot + 90) % 360; commit(true); }
  }, true);
  on(window, 'keyup', e => { if (e.key === 'Shift') keys.shift = false; if (e.key === 'Alt') keys.alt = false; if (e.code === 'Space') keys.space = false; });
  on(window, 'blur', () => { keys.shift = keys.alt = keys.space = false; });

  /* ---------- Linke Leiste ---------- */
  function itemIcon(kind) { const c = CAT[kind], m = Math.max(c.w, c.d) / 2 * (kind === 'dining' ? 1.75 : 1.12); return `<svg viewBox="${fx(-m)} ${fx(-m)} ${fx(2 * m)} ${fx(2 * m)}" aria-hidden="true">${hbItemShape(kind, c.w, c.d, { kind })}</svg>`; }
  function devIcon(kind) { return `<svg viewBox="-0.45 -0.45 0.9 0.9" aria-hidden="true"><defs><radialGradient id="dg_${kind}"><stop offset="0" stop-color="#ffc98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffc98a" stop-opacity="0"/></radialGradient></defs>${hbDeviceSVG({ id: '', kind, x: 0, y: 0 }).replace(/data-dv="[^"]*"/, '').replace('url(#devGlow)', `url(#dg_${kind})`)}</svg>`; }
  function renderLeft() {
    const tools = [['select', T('Auswählen', 'Select'), HB_PIC.select], ['rect', T('Raum', 'Room'), HB_PIC.rect], ['poly', T('Freie Form', 'Free shape'), HB_PIC.poly], ['measure', T('Maßstab', 'Scale'), HB_PIC.measure]];
    let h = `<div class="sec"><h3>${T('Werkzeuge', 'Tools')}</h3><div class="tools">${tools.map(([k, n, i]) => `<button type="button" class="tb" data-tool="${k}" aria-pressed="${tool === k}" title="${n}">${i}${n}</button>`).join('')}</div></div>`;
    h += `<div class="sec"><h3>${T('Türen & Fenster', 'Doors & windows')}</h3><div class="tiles">${Object.entries(OPDEF).map(([k, d]) => `<div class="tile" role="button" tabindex="0" data-add="op:${k}" data-label="${N(d.n)}" title="${N(d.n)}">${HB_OPICON[k]}<span>${N(d.n)}</span></div>`).join('')}</div></div>`;
    CAT_GROUPS.forEach((g, gi) => { const ks = Object.keys(CAT).filter(k => CAT[k].g === gi); h += `<div class="sec"><h3>${N(g)}</h3><div class="tiles">${ks.map(k => `<div class="tile" role="button" tabindex="0" data-add="it:${k}" data-label="${N(CAT[k].n)}" title="${N(CAT[k].n)}">${itemIcon(k)}<span>${N(CAT[k].n)}</span></div>`).join('')}</div></div>`; });
    h += `<div class="sec"><h3>${T('Geräte', 'Devices')}</h3><div class="tiles">${Object.entries(DEVDEF).map(([k, d]) => `<div class="tile" role="button" tabindex="0" data-add="dv:${k}" data-label="${N(d.n)}" title="${N(d.n)}">${devIcon(k)}<span>${N(d.n)}</span></div>`).join('')}</div></div>`;
    $('#left').innerHTML = h;
  }
  on($('#left'), 'click', e => { const b = e.target.closest('[data-tool]'); if (b) setTool(b.dataset.tool); });
  on($('#left'), 'pointerdown', e => { const t = e.target.closest('[data-add]'); if (!t || e.button !== 0) return; e.preventDefault(); t.setPointerCapture?.(e.pointerId); pal = { kind: t.dataset.add, label: t.dataset.label, x0: e.clientX, y0: e.clientY, moved: false }; });

  /* ---------- Eigenschaften ---------- */
  const right = $('#right');
  const entList = dom => hass ? Object.keys(hass.states).filter(e => !dom || dom.split('|').includes(e.split('.')[0])).sort() : [];
  const dl = (id, dom) => `<datalist id="${id}">${entList(dom).slice(0, 400).map(e => `<option value="${e}">${esc(hass.states[e]?.attributes?.friendly_name || '')}</option>`).join('')}</datalist>`;
  const sel3 = (name, opts, val, label, id) => `<div class="fld"><label for="${id}">${label}</label><select class="inp" id="${id}" data-f="${name}">${Object.entries(opts).map(([k, v]) => `<option value="${esc(k)}" ${k === val ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
  const inp = (name, val, label, id, type = 'text', extra = '') => `<div class="fld"><label for="${id}">${label}</label><input class="inp" id="${id}" data-f="${name}" type="${type}" value="${esc(val ?? '')}" ${extra}></div>`;
  const nInp = (name, val, label, id) => inp(name, fmtNum(+val || 0), label, id, 'text', 'inputmode="decimal" data-num="1"');
  function renderPanel() {
    let h = '';
    if (!sel) {
      const area = plan.rooms.filter(r => !r.outdoor).reduce((s, r) => s + Math.abs(polyArea(r.pts)), 0);
      h += `<div class="ph"><h2>${esc(plan.name)}</h2></div><div class="row2"><div class="stat"><span>${T('Räume', 'Rooms')}</span><b>${plan.rooms.length}</b></div><div class="stat"><span>${T('Fläche', 'Area')}</span><b>${area.toFixed(0)} m²</b></div></div>`;
      h += `<div class="sec"><h3>${T('Räume', 'Rooms')}</h3><div class="rlist">${plan.rooms.map(r => `<button type="button" class="rli" data-act="selroom" data-id="${r.id}"><i style="background:${(FLOORS[r.floor] || FLOORS.ash).c}"></i>${esc(r.name)}<span>${fmtA(Math.abs(polyArea(r.pts)))}</span></button>`).join('') || `<p class="note">${T('Noch keine Räume. Nimm links <b>Raum</b> und zieh ein Rechteck auf.', 'No rooms yet. Pick <b>Room</b> on the left and drag a rectangle.')}</p>`}</div></div>`;
      h += `<div class="sec"><h3>${T('So geht’s', 'How it works')}</h3><div class="keys"><kbd>R</kbd><span>${T('Raum aufziehen', 'Draw a room')}</span><kbd>P</kbd><span>${T('Freie Form mit Ecken', 'Free shape with corners')}</span><kbd>${T('Ziehen', 'Drag')}</kbd><span>${T('Bauteil aus der Leiste auf den Plan', 'Part from the bar onto the plan')}</span><kbd>Q</kbd><span>${T('Möbel um 90° drehen', 'Rotate furniture by 90°')}</span><kbd>${T('Entf', 'Del')}</kbd><span>${T('Auswahl oder Ecke löschen', 'Delete selection or corner')}</span><kbd>${T('Strg+Z', 'Ctrl+Z')}</kbd><span>${T('Rückgängig', 'Undo')}</span><kbd>${T('Umschalt', 'Shift')}</kbd><span>${T('ohne Einrasten ziehen', 'drag without snapping')}</span><kbd>Alt</kbd><span>${T('Möbel nicht an die Wand heften', 'don’t stick furniture to walls')}</span><kbd>${T('Leertaste', 'Space')}</kbd><span>${T('halten und ziehen: Ansicht verschieben', 'hold and drag: pan')}</span></div></div>`;
      h += `<p class="note">${T('<b>Wände entstehen automatisch</b> aus den Raumgrenzen. Wo zwei Räume ohne Wand ineinander übergehen, stellst du die Kante im Raum auf <b>offen</b>.', '<b>Walls are created automatically</b> from room edges. Where two rooms flow into each other, set that edge to <b>open</b> in the room.')}</p>`;
    } else if (sel.type === 'room') {
      const r = RM(sel.id), A = Math.abs(polyArea(r.pts));
      h += `<div class="ph"><h2>${esc(r.name)}</h2><span class="tag">${T('Raum', 'Room')}</span></div>` + inp('name', r.name, T('Name', 'Name'), 'f_rname');
      h += `<div class="row2">${sel3('type', Object.fromEntries(Object.entries(RTYPES).map(([k, v]) => [k, N(v)])), r.type, T('Raumart', 'Room type'), 'f_rtype')}${sel3('floor', Object.fromEntries(Object.entries(FLOORS).map(([k, v]) => [k, N(v.n)])), r.floor, T('Boden', 'Floor'), 'f_rfloor')}</div>`;
      h += `<label class="chk"><input type="checkbox" data-f="outdoor" ${r.outdoor ? 'checked' : ''}> ${T('Außenbereich (Geländer statt Wände)', 'Outdoor (railing instead of walls)')}</label>`;
      if (hass?.areas && Object.keys(hass.areas).length) h += sel3('area', { '': T('– kein Bereich –', '– no area –'), ...Object.fromEntries(Object.values(hass.areas).map(a => [a.area_id, a.name])) }, r.area || '', T('Bereich in Home Assistant', 'Home Assistant area'), 'f_rarea');
      else h += inp('area', r.area, T('Bereich in Home Assistant', 'Home Assistant area'), 'f_rarea', 'text', `placeholder="${T('z. B. wohnzimmer', 'e.g. living_room')}"`);
      h += `<p class="note">${T('Alle Lichter, Schalter, Rollläden und Sensoren dieses Bereichs erscheinen automatisch im Raum.', 'All lights, switches, covers and sensors of this area appear in the room automatically.')}</p>`;
      h += `<div class="stat"><span>${T('Fläche', 'Area')}</span><b>${fmtA(A)}</b></div>`;
      if (sel.vi != null && r.pts[sel.vi]) { const v = r.pts[sel.vi]; h += `<div class="sec"><h3>${T('Ecke', 'Corner')} ${sel.vi + 1}</h3><div class="row2">${nInp('vx', v[0], 'X (m)', 'f_vx')}${nInp('vy', v[1], 'Y (m)', 'f_vy')}</div><div class="acts"><button type="button" class="btn small danger" data-act="vdel">${T('Ecke löschen', 'Delete corner')}</button></div></div>`; }
      h += `<div class="sec"><h3>${T('Wände', 'Walls')}</h3><div class="wl">${r.pts.map((_, i) => { const e = edgeOf(r, i), op = (r.open || []).includes(i); return `<div class="wr" data-edge="${i}"><span><b>${T('Wand', 'Wall')} ${i + 1}</b>${fmtM(e.L)}</span><button type="button" class="tog ${op ? 'open' : ''}" data-act="edgeopen" data-i="${i}" aria-pressed="${op}">${op ? T('Offen', 'Open') : T('Wand', 'Wall')}</button></div>`; }).join('')}</div></div>`;
      h += `<div class="acts"><button type="button" class="btn small" data-act="dup">${T('Duplizieren', 'Duplicate')}</button><button type="button" class="btn small danger" data-act="del">${T('Raum löschen', 'Delete room')}</button></div>`;
    } else if (sel.type === 'opening') {
      const o = OP(sel.id), isWin = o.type === 'window' || o.type === 'gdoor', isDoor = o.type === 'door' || o.type === 'front';
      h += `<div class="ph"><h2>${N(OPDEF[o.type].n)}</h2><span class="tag">${T('Öffnung', 'Opening')}</span></div>` + sel3('type', Object.fromEntries(Object.entries(OPDEF).map(([k, v]) => [k, N(v.n)])), o.type, T('Art', 'Type'), 'f_otype');
      h += `<div class="row3">${nInp('w', o.w, T('Breite (m)', 'Width (m)'), 'f_ow')}${o.type === 'window' ? nInp('sill', o.sill, T('Brüstung (m)', 'Sill (m)'), 'f_osill') : ''}${nInp('h', o.h, T('Höhe (m)', 'Height (m)'), 'f_oh')}</div>`;
      if (isDoor) h += `<div class="acts"><button type="button" class="btn small" data-act="flipHinge">${T('Anschlag wechseln', 'Flip hinge')}</button><button type="button" class="btn small" data-act="flipSide">${T('Aufschlagrichtung', 'Flip swing')}</button></div>`;
      if (isWin) h += inp('entity', o.entity, T('Rollladen (Entität)', 'Cover (entity)'), 'f_oent', 'text', 'placeholder="cover.…" list="dl_cover"') + dl('dl_cover', 'cover');
      if (o.type === 'front') h += inp('entity', o.entity, T('Türschloss (Entität)', 'Lock (entity)'), 'f_oent', 'text', 'placeholder="lock.…" list="dl_lock"') + dl('dl_lock', 'lock');
      h += `<p class="note">${T('Ziehen verschiebt entlang der Wand oder auf eine andere Wand. Die Griffe an den Enden ändern die Breite.', 'Drag to move along the wall or onto another wall. The end handles change the width.')}</p><div class="acts"><button type="button" class="btn small danger" data-act="del">${T('Löschen', 'Delete')}</button></div>`;
    } else if (sel.type === 'item') {
      const it = IT(sel.id), c = CAT[it.kind];
      h += `<div class="ph"><h2>${N(c.n)}</h2><span class="tag">${T('Möbel', 'Furniture')}</span></div><div class="row3">${nInp('w', it.w, T('Breite (m)', 'Width (m)'), 'f_iw')}${nInp('d', it.d, T('Tiefe (m)', 'Depth (m)'), 'f_id')}${nInp('rot', it.rot, T('Drehung (°)', 'Rotation (°)'), 'f_irot')}</div>`;
      h += `<div class="acts"><button type="button" class="btn small" data-act="rot" data-d="-90">↺ 90°</button><button type="button" class="btn small" data-act="rot" data-d="90">↻ 90°</button>${c.wall ? `<button type="button" class="btn small" data-act="towall">${T('An Wand setzen', 'Snap to wall')}</button>` : ''}</div>`;
      if (it.kind === 'counter') h += `<label class="chk"><input type="checkbox" data-f="sink" ${it.sink ? 'checked' : ''}> ${T('Spüle', 'Sink')}</label><label class="chk"><input type="checkbox" data-f="hob" ${it.hob ? 'checked' : ''}> ${T('Kochfeld', 'Hob')}</label>`;
      if (it.kind === 'desk') h += `<label class="chk"><input type="checkbox" data-f="pc" ${it.pc ? 'checked' : ''}> ${T('Mit Bildschirmen', 'With monitors')}</label>`;
      if (c.ent || it.kind === 'desk' || it.entity) h += inp('entity', it.entity, T('Gerät in Home Assistant (Entität)', 'Home Assistant entity'), 'f_ient', 'text', `placeholder="${c.ent || 'switch'}.…" list="dl_item"`) + dl('dl_item', 'media_player|switch|input_boolean');
      h += `<div class="acts"><button type="button" class="btn small" data-act="dup">${T('Duplizieren', 'Duplicate')}</button><button type="button" class="btn small danger" data-act="del">${T('Löschen', 'Delete')}</button></div>`;
    } else if (sel.type === 'device') {
      const d = DV(sel.id), dom = DEVDEF[d.kind].ent;
      h += `<div class="ph"><h2>${esc(d.name || N(DEVDEF[d.kind].n))}</h2><span class="tag">${T('Gerät', 'Device')}</span></div>` + sel3('kind', Object.fromEntries(Object.entries(DEVDEF).map(([k, v]) => [k, N(v.n)])), d.kind, T('Art', 'Type'), 'f_dkind') + inp('name', d.name, T('Name', 'Name'), 'f_dname');
      h += inp('entity', d.entity, T('Entität in Home Assistant', 'Home Assistant entity'), 'f_dent', 'text', `placeholder="${dom}.…" list="dl_dev"`) + dl('dl_dev', dom === 'light' ? 'light|switch' : 'sensor');
      if (d.kind === 'light') h += nInp('h', d.h ?? 2.1, T('Höhe der Leuchte (m)', 'Light height (m)'), 'f_dh');
      h += `<div class="acts"><button type="button" class="btn small" data-act="dup">${T('Duplizieren', 'Duplicate')}</button><button type="button" class="btn small danger" data-act="del">${T('Löschen', 'Delete')}</button></div>`;
    } else if (sel.type === 'bg') {
      h += `<div class="ph"><h2>${T('Grundriss-Vorlage', 'Floor plan template')}</h2></div><p class="note">${T('Lade einen Grundriss als Bild, setze den <b>Maßstab</b> über eine bekannte Strecke und zeichne die Räume darüber nach. Das Bild bleibt nur in diesem Browser.', 'Load a floor plan image, set the <b>scale</b> using a known distance and trace the rooms on top. The image stays in this browser only.')}</p>`;
      h += `<div class="acts"><button type="button" class="btn small pri" data-act="bgload">${bgData.src ? T('Anderes Bild laden', 'Load another image') : T('Bild laden', 'Load image')}</button>${bgData.src ? `<button type="button" class="btn small" data-act="bgmeasure">${T('Maßstab setzen', 'Set scale')}</button>` : ''}</div>`;
      if (bgData.src) h += `<div class="fld"><label for="f_bgop">${T('Deckkraft', 'Opacity')}</label><input id="f_bgop" type="range" min="0.1" max="1" step="0.05" value="${plan.bg.opacity}" data-f="bgop"></div><label class="chk"><input type="checkbox" data-f="bgshow" ${plan.bg.show ? 'checked' : ''}> ${T('Bild anzeigen', 'Show image')}</label><div class="acts"><button type="button" class="btn small ${tool === 'bgmove' ? 'on' : ''}" data-act="bgmove">${tool === 'bgmove' ? T('Verschieben beenden', 'Stop moving') : T('Bild verschieben', 'Move image')}</button><button type="button" class="btn small danger" data-act="bgremove">${T('Bild entfernen', 'Remove image')}</button></div>`;
    } else if (sel.type === 'measure' && measure) {
      const L = dist(measure.a, measure.b);
      h += `<div class="ph"><h2>${T('Maßstab', 'Scale')}</h2></div><div class="stat"><span>${T('Gemessen im Plan', 'Measured in plan')}</span><b>${fmtM(L)}</b></div>` + nInp('real', L, T('Echte Länge dieser Strecke (m)', 'Real length of this distance (m)'), 'f_real');
      h += `<div class="acts"><button type="button" class="btn small pri" data-act="mplan">${T('Ganzen Plan anpassen', 'Scale whole plan')}</button>${bgData.src ? `<button type="button" class="btn small" data-act="mbg">${T('Nur Bild anpassen', 'Scale image only')}</button>` : ''}</div><p class="note">${T('<b>Ganzen Plan anpassen</b> skaliert Räume, Möbelpositionen und Bild gemeinsam. <b>Nur Bild anpassen</b> nutzt du vor dem Nachzeichnen.', '<b>Scale whole plan</b> scales rooms, furniture positions and image together. Use <b>Scale image only</b> before tracing.')}</p>`;
    }
    right.innerHTML = h;
  }
  const selObj = () => !sel ? null : sel.type === 'room' ? RM(sel.id) : sel.type === 'opening' ? OP(sel.id) : sel.type === 'item' ? IT(sel.id) : sel.type === 'device' ? DV(sel.id) : null;
  function applyField(el, final) {
    const f = el.dataset.f, o = selObj(); let v = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.num) { v = parseNum(v); if (v == null) return; }
    if (f === 'bgop') { plan.bg.opacity = +v; req(1); if (final) saveBg(); return; }
    if (f === 'bgshow') { plan.bg.show = v; req(1); saveBg(); return; }
    if (f === 'real' || !o) return;
    if (sel.type === 'room') {
      if (f === 'vx' || f === 'vy') { if (!final) return; const q = o.pts[sel.vi]; setLinked(linkedAt(q), f === 'vx' ? [r2(v), q[1]] : [q[0], r2(v)]); commit(true); return; }
      if (f === 'type') { const old = N(RTYPES[o.type]); o.type = v; if (/^(Raum|Room) \d+$/.test(o.name) || o.name === old) o.name = N(RTYPES[v]); o.floor = RTYPE_FLOOR[v]; o.outdoor = v === 'balkon' || v === 'terrasse'; commit(true); return; }
      o[f] = v; if (f === 'name') { req(4); if (final) { commit(); const h2 = right.querySelector('.ph h2'); if (h2) h2.textContent = v; } return; }
      commit(f === 'outdoor' || f === 'floor'); return;
    }
    if (sel.type === 'opening') {
      if (f === 'type') { o.type = v; const D = OPDEF[v]; o.w = D.w; o.h = D.h; o.sill = D.sill ?? 0; commit(true); return; }
      if (f === 'w') { if (!final) return; const op = opPos(o); o.w = clamp(r2(v), 0.4, op ? op.L - 0.1 : v); commit(true); return; }
      if (f === 'sill' || f === 'h') { if (!final) return; o[f] = clamp(r2(v), 0, plan.wallHeight); commit(); return; }
      o[f] = v; if (final) commit(); return;
    }
    if (sel.type === 'item') {
      if (f === 'w' || f === 'd') { if (!final) return; o[f] = clamp(r2(v), 0.15, 8); commit(); return; }
      if (f === 'rot') { if (!final) return; o.rot = ((v % 360) + 360) % 360; commit(); return; }
      o[f] = v; if (final || el.type === 'checkbox') commit(); return;
    }
    if (sel.type === 'device') {
      if (f === 'kind') { o.kind = v; if (!o.name || Object.values(DEVDEF).some(x => x.n.includes(o.name))) o.name = N(DEVDEF[v].n); if (v === 'light' && !o.h) o.h = 2.1; commit(true); return; }
      if (f === 'h') { if (!final) return; o.h = clamp(r2(v), 0.3, plan.wallHeight); commit(); return; }
      o[f] = v; if (final) commit(f === 'name');
    }
  }
  on(right, 'input', e => { if (e.target.dataset.f && (e.target.type === 'range' || e.target.dataset.f === 'name')) applyField(e.target, false); });
  on(right, 'change', e => { if (e.target.dataset.f) applyField(e.target, true); });
  on(right, 'pointerover', e => { const w = e.target.closest('[data-edge]'), nh = w && sel?.type === 'room' ? { room: sel.id, i: +w.dataset.edge } : null; if (JSON.stringify(nh) !== JSON.stringify(hoverEdge)) { hoverEdge = nh; req(4); } });
  on(right, 'pointerleave', () => { if (hoverEdge) { hoverEdge = null; req(4); } });
  on(right, 'click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act, o = selObj();
    if (act === 'selroom') return setSel({ type: 'room', id: b.dataset.id, vi: null });
    if (act === 'del') return deleteSel();
    if (act === 'dup') return duplicateSel();
    if (act === 'vdel') { if (deleteVertex(o, sel.vi)) { sel.vi = null; commit(true); } return; }
    if (act === 'edgeopen') { const i = +b.dataset.i, s = new Set(o.open || []); s.has(i) ? s.delete(i) : s.add(i); o.open = [...s].sort((a, c) => a - c); commit(true); return; }
    if (act === 'flipHinge') { o.flipHinge = !o.flipHinge; commit(); return; }
    if (act === 'flipSide') { o.flipSide = !o.flipSide; commit(); return; }
    if (act === 'rot') { o.rot = ((o.rot + +b.dataset.d) % 360 + 360) % 360; commit(true); return; }
    if (act === 'towall') { if (wallSnapItem(o)) commit(true); else toast(T('Keine Wand in der Nähe.', 'No wall nearby.')); return; }
    if (act === 'bgload') return $('#fileImg').click();
    if (act === 'bgmeasure') return setTool('measure');
    if (act === 'bgmove') { setTool(tool === 'bgmove' ? 'select' : 'bgmove'); req(8); return; }
    if (act === 'bgremove') { bgData = { src: null, nw: 0, nh: 0 }; saveBg(); if (tool === 'bgmove') setTool('select'); req(1 | 8); return; }
    if (act === 'mplan' || act === 'mbg') {
      const real = parseNum($('#f_real').value), L = dist(measure.a, measure.b);
      if (!real || real <= 0) { toast(T('Bitte eine echte Länge in Metern eingeben.', 'Please enter a real length in metres.')); return; }
      const k = real / L, O = measure.a, sc = q => add(O, mul(sub(q, O), k)).map(r2);
      if (act === 'mplan') { for (const r of plan.rooms) r.pts = r.pts.map(sc); for (const x of [...plan.items, ...plan.devices]) { const q = sc([x.x, x.y]); x.x = q[0]; x.y = q[1]; } }
      const bq = add(O, mul(sub([plan.bg.x, plan.bg.y], O), k)); plan.bg.x = bq[0]; plan.bg.y = bq[1]; plan.bg.mpp *= k;
      measure = null; sel = null; commit(true); saveBg(); req(1); fitView();
      toast(act === 'mplan' ? T('Plan angepasst.', 'Plan scaled.') : T('Die Vorlage hat jetzt den richtigen Maßstab.', 'The template now has the right scale.'));
    }
  });

  /* ---------- Kopfzeile, Dateien ---------- */
  function setMode(m) { mode = m; $('#views').className = 'views m-' + m; root.querySelectorAll('#modeSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m))); if (m !== '2d') ensure3D().then(() => { schedule3D(0); start3D(); }).catch(() => {}); requestAnimationFrame(() => { renderOverlay(); resize3D(); }); }
  on($('#modeSeg'), 'click', e => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
  on($('#btnUndo'), 'click', undo); on($('#btnRedo'), 'click', redo);
  on($('#btnBg'), 'click', () => setSel({ type: 'bg' }));
  on($('#planName'), 'change', e => { plan.name = e.target.value.trim() || T('Mein Zuhause', 'My home'); commit(true); });
  on($('#btnSnap'), 'click', () => { snapOn = !snapOn; updSnap(); });
  function updSnap() { const b = $('#btnSnap'); b.setAttribute('aria-pressed', String(snapOn)); b.innerHTML = HB_PIC.magnet + (snapOn ? T('Einrasten an', 'Snapping on') : T('Einrasten aus', 'Snapping off')); }
  on($('#zIn'), 'click', () => zoomAt(svg.clientWidth / 2, svg.clientHeight / 2, 1.25));
  on($('#zOut'), 'click', () => zoomAt(svg.clientWidth / 2, svg.clientHeight / 2, 0.8));
  on($('#zFit'), 'click', fitView);
  on($('#btnApply'), 'click', () => { const { bg, ...out } = plan; opts.onApply?.(out); });
  on($('#btnCancel'), 'click', () => { if (dirty && !$('#btnCancel').dataset.sure) { $('#btnCancel').dataset.sure = '1'; $('#btnCancel').lastChild.textContent = T('Wirklich verwerfen?', 'Discard changes?'); setTimeout(() => { const b = $('#btnCancel'); if (b) { delete b.dataset.sure; b.lastChild.textContent = T('Abbrechen', 'Cancel'); } }, 3000); return; } opts.onCancel?.(); });
  on($('#fileImg'), 'change', e => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => {
      let src = fr.result, nw = img.naturalWidth, nh = img.naturalHeight;
      if (Math.max(nw, nh) > 2400) { const k = 2400 / Math.max(nw, nh), c = document.createElement('canvas'); c.width = Math.round(nw * k); c.height = Math.round(nh * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); src = c.toDataURL('image/jpeg', 0.85); nw = c.width; nh = c.height; }
      bgData = { src, nw, nh }; const ctr = viewCenterW(), span = (svg.clientWidth / view.s) * 0.8; plan.bg.mpp = span / nw; plan.bg.x = r2(ctr[0] - nw * plan.bg.mpp / 2); plan.bg.y = r2(ctr[1] - nh * plan.bg.mpp / 2); plan.bg.show = true;
      saveBg(); req(1 | 8); setSel({ type: 'bg' }); toast(T('Bild geladen. Jetzt den Maßstab setzen.', 'Image loaded. Now set the scale.'));
    }; img.src = fr.result; };
    fr.readAsDataURL(file);
  });
  const modal = $('#modal');
  function openFile() {
    const { bg, ...out } = plan;
    modal.innerHTML = `<div class="dlg" role="dialog" aria-modal="true"><h2>${T('Import & Export', 'Import & export')}</h2><p>${T('Kopiere den Plan als Text, um ihn zu sichern oder weiterzugeben. Genau dieser Text steht in der Kartenkonfiguration.', 'Copy the plan as text to back it up or share it. This is exactly what is stored in the card configuration.')}</p>
      <div class="fld"><label for="dlgOut">${T('Dein Plan', 'Your plan')}</label><textarea class="inp" id="dlgOut" readonly>${esc(JSON.stringify(out, null, 1))}</textarea></div>
      <div class="acts"><button type="button" class="btn small pri" data-m="copy">${T('In Zwischenablage kopieren', 'Copy to clipboard')}</button></div>
      <div class="fld"><label for="dlgIn">${T('Plan einfügen', 'Paste a plan')}</label><textarea class="inp" id="dlgIn" placeholder="{ … }"></textarea></div>
      <div class="acts"><button type="button" class="btn small" data-m="paste">${T('Eingefügten Plan laden', 'Load pasted plan')}</button><button type="button" class="btn small" data-m="file">${T('Datei öffnen …', 'Open file …')}</button></div>
      <div class="acts"><button type="button" class="btn small" data-m="demo">${T('Beispielwohnung laden', 'Load sample apartment')}</button><button type="button" class="btn small" data-m="empty">${T('Leeren Plan starten', 'Start empty plan')}</button><span class="sp"></span><button type="button" class="btn small" data-m="close">${T('Schließen', 'Close')}</button></div>
      <p>${T('Laden ersetzt den aktuellen Plan. Mit Rückgängig holst du ihn zurück.', 'Loading replaces the current plan. Undo brings it back.')}</p></div>`;
    modal.hidden = false;
  }
  function loadPlan(p, msg) { if (!p || !Array.isArray(p.rooms)) { toast(T('Das ist kein HomeBoo-Plan.', 'That is not a HomeBoo plan.')); return; } const bg = plan.bg; plan = normalizePlan(p); plan.bg = bg; sel = null; commit(true); $('#planName').value = plan.name; fitView(); modal.hidden = true; modal.innerHTML = ''; toast(msg); }
  on($('#btnFile'), 'click', openFile);
  on(modal, 'click', e => {
    if (e.target === modal) { modal.hidden = true; return; }
    const b = e.target.closest('[data-m]'); if (!b) return; const m = b.dataset.m;
    if (m === 'close') { modal.hidden = true; modal.innerHTML = ''; }
    if (m === 'copy') { const ta = $('#dlgOut'); const done = () => toast(T('Plan kopiert.', 'Plan copied.')); const fail = () => { ta.focus(); ta.select(); toast(T('Kopieren blockiert – der Text ist markiert, mit Strg+C kopieren.', 'Copy was blocked – the text is selected, press Ctrl+C.')); }; try { navigator.clipboard.writeText(ta.value).then(done, fail); } catch (err) { fail(); } }
    if (m === 'paste') { try { loadPlan(JSON.parse($('#dlgIn').value), T('Plan geladen.', 'Plan loaded.')); } catch (err) { toast(T('Der Text ist kein gültiger Plan.', 'The text is not a valid plan.')); } }
    if (m === 'file') $('#fileJson').click();
    if (m === 'demo') loadPlan(demoPlan(), T('Beispielwohnung geladen.', 'Sample apartment loaded.'));
    if (m === 'empty') loadPlan(emptyPlan(), T('Leerer Plan. Nimm links „Raum“ und zieh den ersten Raum auf.', 'Empty plan. Pick “Room” on the left and draw the first room.'));
  });
  on($('#fileJson'), 'change', e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; file.text().then(t => { try { loadPlan(JSON.parse(t), T('Plan geladen.', 'Plan loaded.')); } catch (err) { toast(T('Die Datei enthält keinen gültigen Plan.', 'The file does not contain a valid plan.')); } }); });
  let toastT = null;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 3800); }

  /* ---------- 3D-Vorschau ---------- */
  let sc = null, scP = null, t3 = null, running3 = false, placed3 = false, night3 = false, destroyed = false;
  function ensure3D() {
    if (sc) return Promise.resolve(sc);
    if (!scP) scP = hbLoadThree(opts.threeUrl).then(T3 => { sc = hbMakeScene(T3, $('#c3d')); $('#v3msg').hidden = true; resize3D(); return sc; }).catch(err => { $('#v3msg').textContent = T('Die 3D-Vorschau konnte nicht geladen werden. Der 2D-Editor funktioniert trotzdem.', 'The 3D preview could not be loaded. The 2D editor still works.'); scP = null; throw err; });
    return scP;
  }
  function resize3D() { if (!sc) return; const b = $('#v3d'); sc.resize(b.clientWidth, b.clientHeight, 0, 0); }
  function schedule3D(ms = 140) { if (mode === '2d') return; clearTimeout(t3); t3 = setTimeout(() => { if (!sc || destroyed) return; sc.build(plan, {}); if (!placed3) { fit3D(); placed3 = true; } }, ms); }
  function fit3D() { const reg = sc?.reg(); if (!reg) return; const b = $('#v3d'); sc.jumpTo(null, sc.fitDistance(reg.radius, b.clientWidth, b.clientHeight, b.clientHeight || 1), 0.85, 0.35); }
  function start3D() {
    if (running3 || !sc) return; running3 = true;
    const tick = () => { if (destroyed || mode === '2d') { running3 = false; return; } const reg = sc.reg(); if (reg) { for (const L of reg.lights.values()) L.target = night3 ? 0.85 : 0; for (const [id, r] of reg.rooms) r.target = sel?.type === 'room' && sel.id === id ? 1 : 0; } sc.frame(); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  on($('#b3Night'), 'click', e => { night3 = !night3; sc?.setNight(night3 ? 1 : 0); e.currentTarget.setAttribute('aria-pressed', String(night3)); });
  on($('#b3Walls'), 'click', e => { const low = !sc?.wallsLow(); sc?.setWallsLow(low); e.currentTarget.setAttribute('aria-pressed', String(low)); });
  on($('#b3Fit'), 'click', fit3D);
  { let down = null; const c = $('#c3d'); on(c, 'pointerdown', e => { down = [e.clientX, e.clientY]; }); on(c, 'pointerup', e => { if (!down || !sc) return; const m = Math.hypot(e.clientX - down[0], e.clientY - down[1]); down = null; if (m > 5) return; const id = sc.pick(e.clientX, e.clientY); if (id) setSel({ type: 'room', id, vi: null }); }); }

  /* ---------- Start ---------- */
  const ro = new ResizeObserver(() => { req(4); resize3D(); }); ro.observe(svg); ro.observe($('#v3d'));
  $('#planName').value = plan.name; renderLeft(); updSnap(); setTool('select'); resetHistory(); setMode(mode);
  requestAnimationFrame(() => { fitView(); req(1 | 2 | 4 | 8); });
  return {
    destroy() { destroyed = true; ro.disconnect(); for (const [t, ev, fn, o] of listeners) t.removeEventListener(ev, fn, o); sc?.dispose(); },
    getPlan() { const { bg, ...out } = plan; return out; },
    _test: { get plan() { return plan; }, set plan(v) { plan = v; }, computeWalls: () => walls(), addAt, applyDrag, undo, redo, commit, setSel, get sel() { return sel; }, set drag(v) { drag = v; }, insertVertex, deleteVertex, createRoom, deleteSel, loadPlan, renderPanel, renderContent, renderOverlay, get hi() { return hi; } },
  };
}
