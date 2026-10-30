
/* =====================================================================
   SYMBOLE
   ===================================================================== */
const hbIc = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const HB_ICON = {
  home: hbIc('M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-5h4v5'),
  wohnen: hbIc('M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11M3 12.5a2 2 0 0 1 4 0V15h10v-2.5a2 2 0 0 1 4 0V18H3zM5 18v2M19 18v2'),
  kueche: hbIc('M4 10h16v5.5A4.5 4.5 0 0 1 15.5 20h-7A4.5 4.5 0 0 1 4 15.5zM2 10h2M20 10h2M9 6.5c0-1 1-1.2 1-2.5M14 6.5c0-1 1-1.2 1-2.5'),
  essen: hbIc('M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11M17 3c-2 1.2-3 3.4-3 6.5V13h3M17 3v18'),
  schlafen: hbIc('M3 19V6M3 14h18v5M21 14v-1.5A3.5 3.5 0 0 0 17.5 9H11v5M7 11.5a1.5 1.5 0 1 0 0-.01'),
  kind: hbIc('M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z'),
  gast: hbIc('M4 8h16v11H4zM9 8V5.5h6V8M4 13h16'),
  buero: hbIc('M3 4.5h18v11H3zM8 20h8M12 15.5V20'),
  bad: hbIc('M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V5.5a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2'),
  wc: hbIc('M7 3h10v6H7zM5 9h14l-2 6H7zM9 15l-1 6h8l-1-6'),
  flur: hbIc('M6 3h11v18H6zM3 21h18M14 12h.01'),
  abstell: hbIc('M5 3h14v18H5zM5 7h14M12 10.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7'),
  balkon: hbIc('M12 21v-8M12 13c0-4 3-7 7-7 0 4-3 7-7 7zM12 15.5c0-3-2-5-6-5 0 3 2 5 6 5zM8 21h8'),
  terrasse: hbIc('M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'),
  sonst: hbIc('M4 4h16v16H4zM4 12h16M12 4v16'),
  moon: hbIc('M20 14.5A8 8 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5z'),
  sun: hbIc('M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'),
  auto: hbIc('M12 3a9 9 0 1 0 0 18zM12 3a9 9 0 0 1 0 18'),
  walls: hbIc('M3 20h18M5 20V8h6v12M14 20v-7h5v7'),
  bulb: hbIc('M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.5.8 1.2.8 2V16h6v-.4c0-.8.2-1.5.8-2A6 6 0 0 0 12 3z'),
  blinds: hbIc('M3 4h18M5 4v12h14V4M5 8h14M5 12h14M12 16v4'),
  tv: hbIc('M3 7h18v11H3zM8 3.5l4 3.5 4-3.5M7 21h10'),
  lock: hbIc('M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2'),
  unlock: hbIc('M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 6.8-1.2M12 15v2'),
  fan: hbIc('M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 10.5C11.5 6 13.5 3.5 16 4.5s.5 5.5-2.6 6.4M13.4 12.6c3.9 2.1 4.8 5 2.8 6.5s-4.7-2.2-3.8-5.6M10.6 12.6c-3.9 2.2-6.8 1.4-7-1.1s4.6-2.6 7.2-.2'),
  thermo: hbIc('M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z'),
  drop: hbIc('M12 3.5s6 6.3 6 10.5a6 6 0 0 1-12 0c0-4.2 6-10.5 6-10.5z'),
  power: hbIc('M12 3v8M6.3 7a8 8 0 1 0 11.4 0'),
  scene: hbIc('M5 3l1.5 3.5L10 8 6.5 9.5 5 13 3.5 9.5 0 8l3.5-1.5zM16 9l1 2.3 2.3 1-2.3 1L16 15.6l-1-2.3-2.3-1 2.3-1zM10 15l.8 1.8 1.8.8-1.8.8L10 20.2l-.8-1.8-1.8-.8 1.8-.8z'),
  chevL: hbIc('M15 5l-7 7 7 7'), minus: hbIc('M5 12h14'), plus: hbIc('M12 5v14M5 12h14'), up: hbIc('M6 15l6-6 6 6'), down: hbIc('M6 9l6 6 6-6'), stop: hbIc('M7 7h10v10H7z'),
  sensor: hbIc('M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10'),
};
const HB_GHOST = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5a7.5 7.5 0 0 0-7.5 7.5v10.6c0 .5.6.8 1 .5l1.9-1.4 2 1.5c.3.2.7.2 1 0l1.6-1.3 1.6 1.3c.3.2.7.2 1 0l2-1.5 1.9 1.4c.4.3 1 0 1-.5V10A7.5 7.5 0 0 0 12 2.5z"/><circle cx="9.3" cy="10.3" r="1.35" fill="#04171c"/><circle cx="14.7" cy="10.3" r="1.35" fill="#04171c"/></svg>';
Object.assign(HB_ICON, {
  motion: hbIc('M13 4.5a1.5 1.5 0 1 0 0-.01M9.5 21l2-5.5 2.5 2.5V21M8 12.5l2-4 3 .5 2.5 3 2.5.5M10 8.5 9 13l2.5 2.5M6 9.5l3-1'),
  contact: hbIc('M5 21V4h10v17M15 6l4-1.5V21M3 21h18M11.5 12.5h.01'),
  eye: hbIc('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'),
  eyeOff: hbIc('M3 3l18 18M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.8M6.3 7.3A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.4-1.1M9.9 10a2.5 2.5 0 0 0 3.6 3.5'),
  close: hbIc('M6 6l12 12M18 6 6 18'), play: hbIc('M8 5.5v13l10.5-6.5z'), pause: hbIc('M8 5.5v13M16 5.5v13'), prev: hbIc('M18 6v12l-8.5-6zM6 6v12'), next: hbIc('M6 6v12l8.5-6zM18 6v12'),
  allOff: hbIc('M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.5.8 1.2.8 2V16h6v-.4c0-.8.2-1.5.8-2A6 6 0 0 0 12 3zM3 3l18 18'),
  fire: hbIc('M12 21a6 6 0 0 0 6-6c0-3.5-2.5-5.5-3.5-8.5-1 2-2 3-3 3.5C11.5 7.5 10 5 9.5 3 8 6 6 9 6 15a6 6 0 0 0 6 6zM12 21a2.5 2.5 0 0 1-2.5-2.5c0-1.6 1.3-2.6 2.5-4 1.2 1.4 2.5 2.4 2.5 4A2.5 2.5 0 0 1 12 21z'),
});
const HB_OFF = new Set(['off', 'unavailable', 'unknown', 'standby', 'idle', 'closed', 'locked']);

const HB_BASE_CSS = `
:host{display:block;--hb-bg:#080a13;--hb-glass:rgba(15,19,35,.74);--hb-glass2:rgba(17,21,39,.92);--hb-line:rgba(150,172,255,.14);--hb-line2:rgba(150,172,255,.28);--hb-fg:#e8ecff;--hb-muted:#9097ba;--hb-faint:#5d648a;--hb-accent:#7ef0ff;--hb-accent-ink:#04171c;--hb-accent-soft:rgba(126,240,255,.12);--hb-lamp:#ffc98a;--hb-ok:#74e3a8;--hb-warn:#ffb25c;--hb-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,"Figtree",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif));--hb-mono:ui-monospace,"JetBrains Mono","SFMono-Regular",Menlo,Consolas,monospace}
*{box-sizing:border-box}
[hidden]{display:none!important}
button,input,select,textarea{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--hb-accent);outline-offset:2px}
`;
const HB_VIEW_CSS = HB_BASE_CSS + `
ha-card,.card{display:block;overflow:hidden;border-radius:var(--ha-card-border-radius,16px);background:var(--hb-bg)}
.hb{position:relative;height:var(--hb-h,600px);min-height:360px;color:var(--hb-fg);font-family:var(--hb-font);background:radial-gradient(120% 90% at 60% 40%,#10152a 0%,var(--hb-bg) 62%);overflow:hidden;-webkit-font-smoothing:antialiased}
canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none}
.labels{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.lbl{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 9px 4px 8px;border-radius:999px;background:rgba(9,12,24,.72);border:1px solid var(--hb-line);color:var(--hb-fg);font:600 11px/1.2 var(--hb-font);letter-spacing:.02em;white-space:nowrap;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:border-color .2s,color .2s,box-shadow .2s,opacity .25s}
.lbl::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--hb-faint)}
.lbl.lit::before{background:var(--hb-lamp);box-shadow:0 0 8px var(--hb-lamp)}
.lbl.move::before{background:#b48cff;box-shadow:0 0 9px #b48cff;animation:hbpulse 1.6s ease-in-out infinite}
.lbl.warn{border-color:rgba(255,178,92,.55)}
.lbl.warn::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--hb-warn);box-shadow:0 0 8px var(--hb-warn)}
@keyframes hbpulse{50%{opacity:.35;transform:scale(.7)}}
.lbl.hot,.lbl:hover{border-color:var(--hb-accent);color:var(--hb-accent);box-shadow:0 0 16px rgba(126,240,255,.28)}
.lbl.off{opacity:0;pointer-events:none}
.ui{position:absolute;inset:0;pointer-events:none;display:flex;flex-direction:column;gap:12px;padding:14px}
.top{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"brand nav tools";align-items:center;gap:12px}
.top>*{pointer-events:auto}
.brand{grid-area:brand;display:flex;align-items:center;gap:10px;padding:5px 14px 5px 5px;border-radius:999px;background:var(--hb-glass);border:1px solid var(--hb-line);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);min-width:0}
.ghost{width:34px;height:34px;flex:none;border-radius:50%;display:grid;place-items:center;color:var(--hb-accent);background:radial-gradient(circle at 50% 40%,rgba(126,240,255,.3),rgba(126,240,255,.05) 70%);filter:drop-shadow(0 0 10px rgba(126,240,255,.45))}
.ghost svg{width:21px;height:21px}
.brand b{display:block;font-weight:700;font-size:14px;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand span{display:block;font-size:11px;color:var(--hb-muted)}
.rooms{grid-area:nav;justify-self:center;max-width:100%;display:flex;gap:3px;padding:5px;border-radius:999px;background:var(--hb-glass);border:1px solid var(--hb-line);overflow-x:auto;scrollbar-width:none;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.rooms::-webkit-scrollbar{display:none}
.nb{position:relative;flex:0 0 auto;display:flex;align-items:center;gap:7px;height:36px;padding:0 10px;border:0;border-radius:999px;background:transparent;color:var(--hb-muted);font-weight:600;font-size:12.5px;white-space:nowrap;cursor:pointer;transition:background .2s,color .2s,box-shadow .2s}
.nb svg{width:18px;height:18px;flex:none}
.nb .t{display:none}
.nb:hover{color:var(--hb-fg);background:rgba(255,255,255,.05)}
.nb[aria-current="true"]{color:var(--hb-accent);background:var(--hb-accent-soft);box-shadow:inset 0 0 0 1px rgba(126,240,255,.34),0 0 18px rgba(126,240,255,.16)}
.nb[aria-current="true"] .t{display:inline}
.nb.lit::after{content:"";position:absolute;top:7px;right:6px;width:5px;height:5px;border-radius:50%;background:var(--hb-lamp);box-shadow:0 0 6px var(--hb-lamp)}
.tools{grid-area:tools;display:flex;gap:6px}
.tool{display:flex;align-items:center;gap:7px;height:42px;padding:0 13px;border-radius:999px;background:var(--hb-glass);border:1px solid var(--hb-line);font-weight:600;font-size:12px;cursor:pointer;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.tool svg{width:17px;height:17px;flex:none}
.tool:hover{border-color:var(--hb-line2)}
.stage{position:relative;flex:1;min-height:0;display:flex;align-items:flex-start;pointer-events:none}
.panel{pointer-events:auto;width:340px;max-width:100%;max-height:100%;overflow:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:12px;padding:14px;border-radius:18px;background:var(--hb-glass2);border:1px solid var(--hb-line);box-shadow:0 24px 70px rgba(0,0,0,.45);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);scrollbar-width:thin;scrollbar-color:var(--hb-line2) transparent}
.panel.min{gap:0}.panel.min>:not(.ph){display:none}
.ph{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:11px}
.ph-ic{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:var(--hb-accent-soft);color:var(--hb-accent);box-shadow:inset 0 0 0 1px rgba(126,240,255,.25)}
.ph-ic svg{width:21px;height:21px}
.ph h2{margin:0;font-weight:700;font-size:17px;line-height:1.15;letter-spacing:-.01em;overflow-wrap:anywhere}
.ph p{margin:3px 0 0;font-size:12px;color:var(--hb-muted)}
.icb{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;border:1px solid var(--hb-line);background:rgba(255,255,255,.03);color:var(--hb-muted);cursor:pointer;padding:0}
.icb:hover{color:var(--hb-fg);border-color:var(--hb-line2)}
.icb svg{width:17px;height:17px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.045);border:1px solid var(--hb-line);font:500 12px var(--hb-mono);font-variant-numeric:tabular-nums}
.chip svg{width:14px;height:14px;color:var(--hb-muted)}
.chip.lamp{color:var(--hb-lamp)}
.chip.move{color:#c9b2ff;border-color:rgba(180,140,255,.4)}.chip.move svg{color:#b48cff}
.chip.warn{color:var(--hb-warn);border-color:rgba(255,178,92,.45)}.chip.warn svg{color:var(--hb-warn)}
.sect{display:flex;flex-direction:column;gap:8px}
.sect h3{margin:0;font-weight:600;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--hb-faint)}
.devs{display:flex;flex-direction:column;gap:8px}
.dev{display:flex;flex-direction:column;gap:10px;padding:12px;border-radius:14px;background:rgba(255,255,255,.028);border:1px solid var(--hb-line);transition:border-color .25s,background .25s}
.dev.on{border-color:rgba(126,240,255,.3);background:linear-gradient(180deg,rgba(126,240,255,.07),rgba(255,255,255,.02))}
.dev.on.light{border-color:rgba(255,201,138,.34);background:linear-gradient(180deg,rgba(255,201,138,.09),rgba(255,255,255,.02))}
.dev.na{opacity:.55}
.dh{display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:11px}
.di{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.05);color:var(--hb-muted);transition:color .25s,background .25s,box-shadow .25s}
.di svg{width:20px;height:20px}
.dev.on .di{color:var(--hb-accent);background:var(--hb-accent-soft)}
.dev.on.light .di{color:var(--hb-lamp);background:rgba(255,201,138,.13);box-shadow:0 0 22px rgba(255,201,138,.22)}
.di.pic,.ai.pic{background:rgba(255,255,255,.06)!important;overflow:hidden;box-shadow:none!important}
.di img,.ai img{width:86%;height:86%;object-fit:contain;transition:filter .3s,opacity .3s}
.dev:not(.on) .di img{filter:grayscale(.75) brightness(.7);opacity:.8}
.dev.on.light .di img,.actr.light .ai img{filter:drop-shadow(0 0 5px rgba(255,201,138,.85))}
.dev.spin .di svg{animation:spin 1.2s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.dt{min-width:0}
.dt b{display:block;font-weight:600;font-size:14px;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dt small{display:block;margin-top:2px;font-size:12px;color:var(--hb-muted)}
.sw{position:relative;width:48px;height:28px;flex:none;border:0;border-radius:999px;background:#272d4a;cursor:pointer;transition:background .2s,box-shadow .2s;padding:0}
.sw::after{content:"";position:absolute;top:4px;left:4px;width:20px;height:20px;border-radius:50%;background:#c6cbe6;transition:transform .22s cubic-bezier(.3,.7,.4,1),background .2s}
.sw[aria-checked="true"]{background:var(--hb-accent);box-shadow:0 0 16px rgba(126,240,255,.45)}
.sw[aria-checked="true"]::after{transform:translateX(20px);background:var(--hb-accent-ink)}
.sw:disabled{opacity:.4;cursor:default}
.rng{display:grid;grid-template-columns:minmax(0,1fr) 46px;align-items:center;gap:10px}
.rng output{font:500 12px var(--hb-mono);color:var(--hb-muted);text-align:right;font-variant-numeric:tabular-nums}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;margin:8px 0;border-radius:99px;background:linear-gradient(90deg,var(--hb-accent) var(--p,50%),rgba(255,255,255,.1) var(--p,50%));cursor:pointer}
.light input[type=range]{background:linear-gradient(90deg,var(--hb-lamp) var(--p,50%),rgba(255,255,255,.1) var(--p,50%))}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#f4f6ff;border:0;box-shadow:0 0 0 4px rgba(126,240,255,.18),0 2px 6px rgba(0,0,0,.4)}
input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#f4f6ff;border:0}
.sws{display:flex;gap:8px;flex-wrap:wrap}
.swatch{width:26px;height:26px;border-radius:50%;border:2px solid transparent;background:var(--c);cursor:pointer;padding:0;box-shadow:0 0 12px color-mix(in srgb,var(--c) 50%,transparent)}
.seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.seg button,.btn{height:34px;border-radius:10px;border:1px solid var(--hb-line);background:rgba(255,255,255,.035);font-weight:600;font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px}
.seg button svg{width:16px;height:16px}
.seg button:hover,.btn:hover{border-color:var(--hb-line2)}
.btn.wide{width:100%}.btn.ok{color:var(--hb-ok)}.btn.warn{color:var(--hb-warn)}
.clim{display:grid;grid-template-columns:34px minmax(0,1fr) 34px;align-items:center;gap:8px}
.clim strong{text-align:center;font:500 20px var(--hb-mono);font-variant-numeric:tabular-nums}
.clim strong small{font-size:12px;color:var(--hb-muted)}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{display:flex;flex-direction:column;gap:4px;padding:11px 12px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid var(--hb-line)}
.stat span{font-weight:600;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--hb-faint)}
.stat b{font:500 19px var(--hb-mono);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.stat b small{font-size:12px;color:var(--hb-muted);margin-left:2px}
.stat.ok b{color:var(--hb-ok)}.stat.warn b{color:var(--hb-warn)}.stat.lamp b{color:var(--hb-lamp)}
.scenes{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.scene{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:12px;border:1px solid var(--hb-line);background:rgba(255,255,255,.03);font-weight:600;font-size:13px;text-align:left;cursor:pointer;min-width:0}
.scene span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.scene svg{width:17px;height:17px;color:var(--hb-accent);flex:none}
.scene:hover{border-color:rgba(126,240,255,.45)}
.rlist{display:flex;flex-direction:column;gap:2px}
.rr{display:grid;grid-template-columns:28px minmax(0,1fr) auto 10px;align-items:center;gap:10px;padding:8px;border:0;border-radius:10px;background:transparent;text-align:left;cursor:pointer}
.rr:hover{background:rgba(255,255,255,.045)}
.rr svg{width:18px;height:18px;color:var(--hb-muted)}
.rr b{font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr span{display:flex;align-items:center;gap:5px;font:500 12px var(--hb-mono);color:var(--hb-muted)}
.rr span em{display:grid;place-items:center}.rr span em svg{width:14px;height:14px}
.rr span em.w svg{color:var(--hb-warn)}.rr span em.m svg{color:#b48cff;animation:hbpulse 1.6s ease-in-out infinite}
.rr i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.12)}
.rr i.lit{background:var(--hb-lamp);box-shadow:0 0 8px var(--hb-lamp)}
.note{margin:0;padding:10px 12px;border-radius:12px;border:1px dashed var(--hb-line2);font-size:12px;line-height:1.5;color:var(--hb-muted)}
.note b{color:var(--hb-fg)}
.msg{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:var(--hb-muted);font-size:13.5px;line-height:1.5;background:var(--hb-bg)}
.msg div{max-width:420px;display:flex;flex-direction:column;align-items:center;gap:12px}
.msg .ghost{width:58px;height:58px}.msg .ghost svg{width:34px;height:34px}
.msg b{color:var(--hb-fg)}
.swap>*{animation:rise .42s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*45ms)}
@keyframes rise{from{opacity:0;transform:translateX(-14px)}}
button.stat{font:inherit;color:inherit;text-align:left;cursor:pointer;transition:border-color .2s,background .2s}
button.stat:hover{border-color:var(--hb-line2);background:rgba(255,255,255,.05)}
.tool.on{color:var(--hb-accent);border-color:rgba(126,240,255,.45);background:var(--hb-accent-soft)}
.lbl.heat::before{background:var(--heat);box-shadow:0 0 9px var(--heat)}
.sect h3 em{font-style:normal;margin-left:6px;padding:1px 7px;border-radius:99px;background:rgba(255,201,138,.14);color:var(--hb-lamp);letter-spacing:0}
.sect h3 em.w{background:rgba(255,178,92,.14);color:var(--hb-warn)}
.acts{display:flex;flex-direction:column;gap:4px}
.actr{display:grid;grid-template-columns:32px minmax(0,1fr) auto;align-items:center;gap:10px;padding:6px 8px 6px 6px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid var(--hb-line)}
.actr .ai{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--hb-accent-soft);color:var(--hb-accent)}
.actr.light .ai{background:rgba(255,201,138,.13);color:var(--hb-lamp)}
.actr .ai svg{width:17px;height:17px}
.at{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:1px;border:0;background:none;padding:0;text-align:left;cursor:pointer}
.at b{max-width:100%;font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.at small{max-width:100%;font-size:11.5px;color:var(--hb-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.actb{display:flex;gap:6px;flex-wrap:wrap}.actb .btn{flex:1}
.btn svg{width:16px;height:16px;flex:none}
.btn.lampb{color:var(--hb-lamp);border-color:rgba(255,201,138,.35)}
.roomall{height:38px}
.rr.warn svg{color:var(--hb-warn)}.rr.warn span{color:var(--hb-warn)}
.dev.warn{border-color:rgba(255,178,92,.4)}.dev.warn .di{color:var(--hb-warn);background:rgba(255,178,92,.12)}
.dev.move{border-color:rgba(180,140,255,.4)}.dev.move .di{color:#b48cff;background:rgba(180,140,255,.12)}
.mctl{display:flex;align-items:center;justify-content:center;gap:10px}
.mctl .icb.big{width:46px;height:46px;border-radius:50%;color:var(--hb-accent-ink);background:var(--hb-accent);border-color:var(--hb-accent)}
.mctl .icb.big svg{width:20px;height:20px}
.tip{position:absolute;left:0;top:0;z-index:5;pointer-events:none;display:flex;flex-direction:column;gap:1px;max-width:240px;padding:8px 11px;border-radius:12px;background:rgba(9,12,24,.9);border:1px solid var(--hb-line2);box-shadow:0 10px 30px rgba(0,0,0,.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.tip b{font-size:13px;font-weight:600}.tip span{font:500 12px var(--hb-mono);color:var(--hb-accent)}.tip small{margin-top:3px;font-size:10.5px;color:var(--hb-faint)}
.pop{position:absolute;z-index:6;width:300px;max-width:calc(100% - 16px);display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:16px;background:var(--hb-glass2);border:1px solid var(--hb-line2);box-shadow:0 24px 60px rgba(0,0,0,.5);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);animation:popin .18s ease-out}
@keyframes popin{from{opacity:0;transform:scale(.96)}}
.poph{display:flex;align-items:center;justify-content:space-between;gap:8px}
.poph .icb{width:30px;height:30px}
.lnk{display:inline-flex;align-items:center;gap:6px;border:0;background:none;padding:2px 4px;color:var(--hb-muted);font-weight:600;font-size:12px;cursor:pointer}
.lnk svg{width:15px;height:15px}.lnk:hover{color:var(--hb-accent)}
.toast{position:absolute;left:50%;bottom:16px;z-index:7;transform:translateX(-50%);display:flex;align-items:center;gap:12px;max-width:calc(100% - 24px);padding:8px 8px 8px 14px;border-radius:14px;background:#1a2040;border:1px solid var(--hb-line2);box-shadow:0 12px 34px rgba(0,0,0,.45);font-size:13px;white-space:nowrap;animation:popin .2s ease-out}
.toast span{overflow:hidden;text-overflow:ellipsis}
.toast button{height:32px;padding:0 12px;border-radius:10px;border:1px solid rgba(126,240,255,.4);background:var(--hb-accent-soft);color:var(--hb-accent);font-weight:700;font-size:12.5px;cursor:pointer}
.legend{position:absolute;right:16px;bottom:16px;z-index:3;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:var(--hb-glass);border:1px solid var(--hb-line);font:500 11px var(--hb-mono);color:var(--hb-muted);pointer-events:none}
.legend i{width:90px;height:6px;border-radius:99px;background:linear-gradient(90deg,rgb(70,130,255),rgb(40,205,235) 30%,rgb(80,220,130) 50%,rgb(250,205,40) 70%,rgb(245,80,70))}
.narrow .legend{bottom:auto;top:112px;right:12px}
.narrow .toast{bottom:auto;top:110px}
.narrow .top{grid-template-areas:"brand . tools" "nav nav nav";grid-template-columns:auto minmax(0,1fr) auto;gap:8px}
.narrow .rooms{justify-self:stretch}
.narrow .tool .t,.narrow .brand span{display:none}
.narrow .tool{padding:0 11px}
.narrow .stage{align-items:flex-end}
.narrow .panel{width:100%;max-height:48%}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* =====================================================================
   ANSICHT
   ===================================================================== */
class HBViewer {
  constructor(root) {
    this.root = root; this.config = {}; this.plan = null; this.hass = null; this.sc = null;
    this.focus = null; this.hover = null; this.nightMode = null; this.wallsMode = 'auto'; this.viewMode = 'normal'; this.panelMin = false; this.interact = 0; this.pop = null; this.showAllActive = false;
    this.sig = ''; this.panelSig = ''; this.buildSig = ''; this.running = false; this.visible = true; this.connected = false;
    root.innerHTML = `<style>${HB_VIEW_CSS}</style><ha-card class="card"><div class="hb"><canvas></canvas><div class="labels"></div>
      <div class="ui"><header class="top"><div class="brand"><span class="ghost">${HB_GHOST}</span><div><b class="ttl"></b><span class="sub"></span></div></div><nav class="rooms"></nav>
      <div class="tools"><button class="tool" data-t="view" type="button"></button><button class="tool" data-t="night" type="button"></button><button class="tool" data-t="walls" type="button"></button></div></header>
      <div class="stage"><aside class="panel" aria-live="polite"></aside></div></div>
      <div class="legend" hidden><span>16°</span><i></i><span>26°</span></div><div class="tip" hidden></div><div class="pop" role="dialog" hidden></div><div class="toast" role="status" hidden></div>
      <div class="msg" hidden></div></div></ha-card>`;
    const q = s => root.querySelector(s);
    this.el = { hb: q('.hb'), canvas: q('canvas'), labels: q('.labels'), nav: q('.rooms'), panel: q('.panel'), top: q('.top'), msg: q('.msg'), ttl: q('.ttl'), sub: q('.sub'), night: q('[data-t=night]'), walls: q('[data-t=walls]'), view: q('[data-t=view]'), tip: q('.tip'), pop: q('.pop'), toast: q('.toast'), legend: q('.legend') };
    this.el.nav.addEventListener('click', e => { const b = e.target.closest('.nb'); if (b) this.go(b.dataset.room || null); });
    this.el.night.addEventListener('click', () => { const order = [null, 'night', 'day']; this.nightMode = order[(order.indexOf(this.nightMode) + 1) % 3]; this.applyNight(); this.syncChrome(); });
    this.el.walls.addEventListener('click', () => { this.wallsMode = { auto: 'hoch', hoch: 'niedrig', niedrig: 'auto' }[this.wallsMode]; this.applyWalls(); this.syncChrome(); if (this.focus) this.viewRoom(this.focus, 0.8); });
    this.el.view.addEventListener('click', () => { this.viewMode = this.viewMode === 'temp' ? 'normal' : 'temp'; this.applyHeat(); this.renderNav(); this.syncChrome(); });
    for (const box of [this.el.panel, this.el.pop]) {
      box.addEventListener('click', e => this.onPanelClick(e));
      box.addEventListener('input', e => { const t = e.target; if (t.type !== 'range') return; this.interact = Date.now(); t.style.setProperty('--p', t.value + '%'); t.nextElementSibling.textContent = t.value + ' %'; });
      box.addEventListener('change', e => this.onPanelChange(e));
      box.addEventListener('pointerdown', () => { this.interact = Date.now(); });
    }
    this.el.toast.addEventListener('click', e => { if (e.target.closest('[data-act=undo]')) { const u = this._undo; this.hideToast(); u?.(); } });
    this.el.hb.addEventListener('keydown', e => { if (e.key === 'Escape' && this.pop) { e.stopPropagation(); this.closePop(); } });
    /* Antippen im Modell: kurz = schalten oder Raum öffnen, lang oder Rechtsklick = Steuerung am Gerät */
    const cv = this.el.canvas; let down = null, lp = null, hoverT = 0;
    cv.addEventListener('pointerdown', e => {
      clearTimeout(lp); this.hideTip();
      down = { x: e.clientX, y: e.clientY, b: e.button, long: false };
      if (e.button === 0) lp = setTimeout(() => { if (!down || down.moved) return; down.long = true; this.objTap(down.x, down.y, true); }, 520);
    });
    cv.addEventListener('pointermove', e => {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down.moved = true; clearTimeout(lp); }
      if (e.pointerType !== 'mouse' || e.buttons || !this.sc) return;
      const now = performance.now(); if (now - hoverT < 50) return; hoverT = now;
      const hit = this.sc.pickAt(e.clientX, e.clientY), x = hit?.key ? this.target(hit.key) : null;
      if (x) { this.hover = null; cv.style.cursor = 'pointer'; this.showTip(x, e.clientX, e.clientY); return; }
      this.hideTip(); const id = hit?.room || null; if (id !== this.hover) this.hover = id; cv.style.cursor = id ? 'pointer' : 'grab';
    });
    cv.addEventListener('pointerup', e => {
      clearTimeout(lp); if (!down) return; const d = down; down = null;
      if (d.long || d.moved || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6 || !this.sc) return;
      this.objTap(e.clientX, e.clientY, d.b === 2);
    });
    cv.addEventListener('pointercancel', () => { clearTimeout(lp); down = null; });
    cv.addEventListener('pointerleave', () => { this.hover = null; this.hideTip(); });
    this.ro = new ResizeObserver(() => this.layout()); this.ro.observe(this.el.hb);
    if ('IntersectionObserver' in window) { this.io = new IntersectionObserver(es => { this.visible = es.some(x => x.isIntersecting); if (this.visible) this.start(); }); this.io.observe(this.el.hb); }
  }
  setConfig(cfg) {
    if ((cfg.panel || 'open') !== (this.config.panel || 'open')) this.panelMin = cfg.panel === 'collapsed';
    this.config = cfg;
    const h = cfg.height === 'full' ? 'calc(100vh - var(--header-height, 56px) - 16px)' : (cfg.height || '600px');
    this.el.hb.style.setProperty('--hb-h', h);
    if (cfg.accent) this.root.host?.style.setProperty('--hb-accent', cfg.accent);
    this.plan = normalizePlan(cfg.plan);
    const shape = this.plan.rooms.map(r => r.pts.flat().join(',')).join('|');
    if (shape !== this.shapeKey) { this.shapeKey = shape; this.placed = false; }
    if (this.focus && !this.plan.rooms.some(r => r.id === this.focus)) this.focus = null;
    this.buildSig = ''; this.panelSig = '';
    this.render();
  }
  setHass(h) {
    const first = !this.hass; this.hass = h; hbSetLang(h?.language);
    if (first) this.render(); else this.update();
  }
  connectedCallback() { this.connected = true; this.start(); }
  disconnectedCallback() { this.connected = false; }
  async ensureScene() {
    if (this.sc) return this.sc;
    if (this.loading) return this.loading;
    this.loading = hbLoadThree(this.config.three_url).then(THREE => { this.sc = hbMakeScene(THREE, this.el.canvas); this.layout(); return this.sc; })
      .catch(err => { console.error('HomeBoo 3D: three.js konnte nicht geladen werden', err); this.showMsg(T('Die 3D-Bibliothek konnte nicht geladen werden. Prüfe die Internetverbindung oder trage unter <b>three_url</b> eine lokale Kopie ein.', 'The 3D library could not be loaded. Check the internet connection or set <b>three_url</b> to a local copy.')); this.loading = null; throw err; });
    return this.loading;
  }
  showMsg(html) { const m = this.el.msg; if (!html) { m.hidden = true; return; } m.hidden = false; m.innerHTML = `<div><span class="ghost">${HB_GHOST}</span><div>${html}</div></div>`; }
  render() {
    this.el.ttl.textContent = this.config.title || this.plan?.name || 'HomeBoo 3D';
    this.el.sub.textContent = T('Zuhause · 3D', 'Home · 3D');
    if (!this.plan?.rooms.length) { this.showMsg(T('<b>Noch kein Grundriss.</b><br>Bearbeite das Dashboard, öffne diese Karte und klicke auf „Grundriss-Editor öffnen“.', '<b>No floor plan yet.</b><br>Edit the dashboard, open this card and click “Open floor plan editor”.')); return; }
    this.showMsg(null);
    this.renderNav(); this.renderPanel(false); this.syncChrome();
    this.ensureScene().then(() => { this.rebuildIfNeeded(true); this.start(); }).catch(() => {});
  }
  /* ---------- Daten aus Home Assistant ---------- */
  cache() {
    const h = this.hass || {}, C = this._cc;
    if (C && C.h === h && C.plan === this.plan) return C;
    const n = h.states ? Object.keys(h.states).length : 0;
    if (!C || C.plan !== this.plan || C.e !== h.entities || C.a !== h.areas || C.d !== h.devices || C.n !== n || Date.now() - C.t > 60000) this._cc = { plan: this.plan, e: h.entities, a: h.areas, d: h.devices, n, t: Date.now(), vis: new Map(), h };
    else C.h = h;
    return this._cc;
  }
  /* Alle sichtbaren Entitäten eines Raums (im Editor ausgeblendete fehlen) */
  ents(room) {
    if (!this.hass) return [];
    const C = this.cache(); if (C.vis.has(room.id)) return C.vis.get(room.id);
    const hide = new Set(room.hide || []), out = hbRoomEntities(this.plan, room, this.hass).filter(c => !hide.has(c.eid));
    C.vis.set(room.id, out); return out;
  }
  controls(room) { return this.ents(room).filter(c => c.kind === 'ctl'); }
  roomSensors(room) {
    const h = this.hass; if (!h) return {};
    const out = { vals: [] };
    for (const c of this.ents(room)) {
      const s = h.states[c.eid]; if (!s) continue; const v = parseFloat(s.state);
      if (c.kind === 'temp') { if (!out.temp && !isNaN(v)) out.temp = { v, u: s.attributes.unit_of_measurement || '°C' }; }
      else if (c.kind === 'hum') { if (!out.hum && !isNaN(v)) out.hum = { v, u: '%' }; }
      else if (c.kind === 'value' && s.state !== 'unavailable' && s.state !== 'unknown') out.vals.push({ eid: c.eid, s });
    }
    return out;
  }
  roomLit(room) { const h = this.hass; return this.controls(room).some(c => c.d === 'light' && h.states[c.eid]?.state === 'on'); }
  roomMotion(room) { const h = this.hass; return this.ents(room).some(c => c.kind === 'motion' && h.states[c.eid]?.state === 'on'); }
  roomOpen(room) { const h = this.hass; return this.ents(room).filter(c => c.kind === 'contact' && h.states[c.eid]?.state === 'on'); }
  /* ---------- 3D aufbauen und mit Zuständen füttern ---------- */
  buildOptions() {
    const p = this.plan, devEnt = new Set(p.devices.map(d => d.entity).filter(Boolean)), roomLights = [], shutters = new Set();
    for (const r of p.rooms) {
      const ctl = this.controls(r);
      if (ctl.some(c => c.d === 'light' && !devEnt.has(c.eid))) roomLights.push(r.id);
      const freeCovers = ctl.filter(c => c.d === 'cover' && !p.openings.some(o => o.entity === c.eid));
      if (freeCovers.length) for (const o of p.openings) if (o.room === r.id && !o.entity && (o.type === 'window' || o.type === 'gdoor')) shutters.add(o.id);
    }
    return { roomLights, shutters };
  }
  rebuildIfNeeded(force) {
    if (!this.sc) return;
    const bo = this.buildOptions(), sig = JSON.stringify([this.config.plan ? this.plan.rooms.length : 0, bo.roomLights, [...bo.shutters]]);
    if (!force && sig === this.buildSig) return;
    this.buildSig = sig; this.bo = bo;
    this.sc.build(this.plan, bo);
    if (!this.placed) { this.placed = true; const r = this.sc.reg(); this.sc.jumpTo(null, Math.min(this.sc.orbit.maxR, this.overviewDist(0.3, -0.5) * 1.5), 0.3, -0.5); this.viewOverview(2.2); }
    this.applyStates(); this.applyNight(); this.applyWalls();
  }
  applyStates() {
    const reg = this.sc?.reg(), h = this.hass; if (!reg || !h) return;
    const p = this.plan, S = id => h.states[id];
    const lightLevel = s => { if (!s) return 0; if (s.entity_id?.startsWith('light.')) return s.state === 'on' ? (s.attributes.brightness != null ? clamp(s.attributes.brightness / 255, 0.08, 1) : 1) : 0; return s.state === 'on' ? 1 : 0; };
    const lightColor = s => { const c = s?.attributes?.rgb_color; return Array.isArray(c) ? `rgb(${c[0]},${c[1]},${c[2]})` : '#ffc78a'; };
    for (const d of p.devices) { const L = reg.lights.get('dev:' + d.id); if (!L) continue; const s = S(d.entity); L.target = d.entity ? lightLevel(s) : 0; L.color.set(lightColor(s)); }
    const devEnt = new Set(p.devices.map(d => d.entity).filter(Boolean));
    for (const r of p.rooms) {
      const L = reg.lights.get('room:' + r.id); const ctl = this.controls(r);
      if (L) { let best = 0, col = '#ffc78a'; for (const c of ctl) if (c.d === 'light' && !devEnt.has(c.eid)) { const v = lightLevel(S(c.eid)); if (v > best) { best = v; col = lightColor(S(c.eid)); } } L.target = best; L.color.set(col); }
      const free = ctl.filter(c => c.d === 'cover' && !p.openings.some(o => o.entity === c.eid));
      if (free.length) { const pos = this.coverPos(S(free[0].eid)); for (const o of p.openings) if (o.room === r.id && !o.entity) for (const s of reg.shutters.get(o.id) || []) s.target = 1 - pos / 100; }
    }
    for (const o of p.openings) {
      if (o.contact) { const open = S(o.contact)?.state === 'on'; const c = reg.contacts?.get(o.id); if (c) c.target = open ? 1 : 0; const dd = reg.doors?.get(o.id); if (dd) dd.target = open ? 1 : 0; }
      if (!o.entity) continue; const s = S(o.entity);
      if (o.entity.startsWith('cover.')) for (const sh of reg.shutters.get(o.id) || []) sh.target = 1 - this.coverPos(s) / 100;
      if (o.entity.startsWith('lock.')) { const L = reg.locks.get(o.id); if (L) L.target = s?.state === 'locked' ? 1 : s?.state === 'unlocked' || s?.state === 'open' ? 0 : 0.5; }
    }
    for (const it of p.items) {
      if (!it.entity) continue; const s = S(it.entity), on = !!s && !['off', 'unavailable', 'unknown', 'standby'].includes(s.state);
      const sc = reg.screens.get(it.id); if (sc) { sc.target = on ? 1 : 0; if (it.entity.startsWith('media_player.')) { const pic = on && (s.state === 'playing' || s.state === 'paused') ? s.attributes.entity_picture : null; this.sc.loadPicture(it.id, pic ? (this.hass.hassUrl ? this.hass.hassUrl(pic) : pic) : null); } }
      const dr = reg.drums.get(it.id); if (dr) dr.target = on ? 1 : 0;
      const fi = reg.fires?.get(it.id); if (fi) fi.target = on && s.state !== 'off' ? 1 : 0;
    }
    for (const r of p.rooms) { const m = reg.rooms.get(r.id)?.motion; if (m) m.target = this.roomMotion(r) ? 1 : 0; }
    for (const d of p.devices) { if (d.kind !== 'motion') continue; const m = reg.motionDevs?.get(d.id); if (m) m.target = S(d.entity)?.state === 'on' ? 1 : 0; }
    this.applyHeat();
  }
  coverPos(s) { if (!s) return 100; if (s.attributes.current_position != null) return s.attributes.current_position; return s.state === 'closed' ? 0 : 100; }
  isOn(s) { return !!s && !['off', 'unavailable', 'unknown', 'standby', 'idle', 'closed'].includes(s.state); }
  /* Kurzer Zustandstext, z. B. „An · 70 %“ */
  stateLabel(eid, kind) {
    const s = this.hass?.states[eid]; if (!s) return ''; const d = eid.split('.')[0], a = s.attributes || {};
    if (s.state === 'unavailable') return T('Nicht verfügbar', 'Unavailable');
    if (d === 'light') return s.state === 'on' ? (a.brightness != null ? `${T('An', 'On')} · ${Math.round(a.brightness / 2.55)} %` : T('An', 'On')) : T('Aus', 'Off');
    if (d === 'cover') { const p = this.coverPos(s); return p === 0 ? T('Geschlossen', 'Closed') : p === 100 ? T('Offen', 'Open') : `${p} % ${T('offen', 'open')}`; }
    if (d === 'lock') return s.state === 'locked' ? T('Verriegelt', 'Locked') : s.state === 'unlocked' ? T('Entriegelt', 'Unlocked') : s.state;
    if (d === 'media_player') return this.isOn(s) ? (a.media_title || (s.state === 'playing' ? T('Spielt', 'Playing') : T('An', 'On'))) : T('Aus', 'Off');
    if (d === 'climate') return a.current_temperature != null ? `${fmtNum(+a.current_temperature, 1)} °C` : s.state;
    if (d === 'sensor') { const v = parseFloat(s.state); return (isNaN(v) ? s.state : fmtNum(v, Number.isInteger(v) ? 0 : 1)) + (a.unit_of_measurement ? ' ' + a.unit_of_measurement : ''); }
    if (d === 'binary_sensor') { const k = kind || hbEntKind(this.hass, eid); return k === 'motion' ? (s.state === 'on' ? T('Bewegung', 'Motion') : T('Ruhig', 'Clear')) : (s.state === 'on' ? T('Offen', 'Open') : T('Zu', 'Closed')); }
    return s.state === 'on' ? T('An', 'On') : s.state === 'off' ? T('Aus', 'Off') : s.state;
  }
  /* Was hinter einem angetippten Objekt im Modell steckt */
  target(key) {
    const [t, id] = key.split(':'), p = this.plan; let eid = '', of = '';
    if (t === 'dev') { const d = p.devices.find(x => x.id === id); eid = d?.entity; of = d?.kind; }
    else if (t === 'item') { const it = p.items.find(x => x.id === id); eid = it?.entity; of = it?.kind; }
    else if (t === 'op') { const o = p.openings.find(x => x.id === id); eid = o?.entity || o?.contact; of = o?.type; }
    if (!eid || !this.hass?.states[eid]) return null;
    const d = eid.split('.')[0];
    return { key, t, id, eid, d, of, kind: hbEntKind(this.hass, eid) || (d === 'binary_sensor' ? (of === 'motion' ? 'motion' : 'contact') : d === 'sensor' ? 'value' : 'ctl') };
  }
  /* Direkt schalten nur, wo ein versehentliches Tippen nichts anrichtet */
  canToggle(x) {
    if (this.config.tap_action === 'details') return false;
    if (['light', 'media_player', 'fan', 'input_boolean', 'cover'].includes(x.d)) return true;
    return x.d === 'switch' && ((x.t === 'dev' && x.of !== 'sensor' && x.of !== 'motion') || (x.t === 'item' && x.of === 'fireplace'));
  }
  objTap(cx, cy, details) {
    const hit = this.sc?.pickAt(cx, cy), x = hit?.key ? this.target(hit.key) : null;
    if (x) { if (details || !this.canToggle(x)) this.openPop(x, cx, cy); else this.quickToggle(x, hit.point); return; }
    if (this.pop) { this.closePop(); return; }
    if (hit?.room) this.go(hit.room);
  }
  quickToggle(x, point) {
    const s = this.hass.states[x.eid], data = { entity_id: x.eid }, nm = this.name(x.eid);
    let svc = 'toggle', back = 'toggle', msg;
    if (x.d === 'cover') { const open = this.coverPos(s) > 0; svc = open ? 'close_cover' : 'open_cover'; back = open ? 'open_cover' : 'close_cover'; msg = open ? T(`${nm} fährt zu`, `${nm} closing`) : T(`${nm} fährt auf`, `${nm} opening`); }
    else { const on = this.isOn(s); if (x.d === 'media_player') { svc = on ? 'turn_off' : 'turn_on'; back = on ? 'turn_on' : 'turn_off'; } msg = on ? `${nm} ${T('aus', 'off')}` : `${nm} ${T('an', 'on')}`; }
    this.call(x.d, svc, data); this.sc.ping(point, x.d === 'light' || x.of === 'fireplace' ? '#ffc98a' : '#7ef0ff');
    this.toastMsg(msg, () => this.call(x.d, back, data));
  }
  openPop(x, cx, cy) { const r = this.el.hb.getBoundingClientRect(); this.pop = { x, cx: cx - r.left, cy: cy - r.top }; this.hideTip(); this.renderPop(); }
  closePop() { this.pop = null; this.el.pop.hidden = true; this.el.pop.innerHTML = ''; }
  renderPop() {
    const P = this.el.pop, p = this.pop; if (!p) return;
    const room = this.plan.rooms.find(r => this.ents(r).some(c => c.eid === p.x.eid));
    P.innerHTML = `<div class="poph">${room ? `<button type="button" class="lnk" data-act="room" data-room="${room.id}">${HB_ICON[room.type] || HB_ICON.sonst}${esc(room.name)}</button>` : '<span></span>'}<button type="button" class="icb" data-act="popclose" aria-label="${T('Schließen', 'Close')}">${HB_ICON.close}</button></div>${this.card({ eid: p.x.eid, d: p.x.d, kind: p.x.kind }, true)}`;
    P.hidden = false;
    const W = this.el.hb.clientWidth, H = this.el.hb.clientHeight, pw = P.offsetWidth, ph = P.offsetHeight;
    let left = p.cx + 16, top = p.cy - ph / 2; if (left + pw > W - 8) left = p.cx - pw - 16;
    P.style.left = clamp(left, 8, Math.max(8, W - pw - 8)) + 'px'; P.style.top = clamp(top, 8, Math.max(8, H - ph - 8)) + 'px';
  }
  showTip(x, cx, cy) {
    const r = this.el.hb.getBoundingClientRect(), el = this.el.tip;
    el.innerHTML = `<b>${esc(this.name(x.eid))}</b><span>${esc(this.stateLabel(x.eid, x.kind))}</span><small>${this.canToggle(x) ? T('Tippen schaltet · Rechtsklick: mehr', 'Click toggles · right-click: more') : T('Klicken für Steuerung', 'Click for controls')}</small>`;
    el.hidden = false; el.style.transform = `translate(${Math.round(cx - r.left + 14)}px,${Math.round(cy - r.top + 14)}px)`;
  }
  hideTip() { if (!this.el.tip.hidden) this.el.tip.hidden = true; }
  toastMsg(msg, undo) {
    const el = this.el.toast; el.innerHTML = `<span>${esc(msg)}</span>${undo ? `<button type="button" data-act="undo">${T('Rückgängig', 'Undo')}</button>` : ''}`;
    el.hidden = false; this._undo = undo; clearTimeout(this._tt); this._tt = setTimeout(() => this.hideToast(), 4500);
  }
  hideToast() { clearTimeout(this._tt); this.el.toast.hidden = true; this._undo = null; }
  /* Temperatur-Ansicht: Böden nach Raumtemperatur einfärben */
  applyHeat() {
    const reg = this.sc?.reg(), on = this.viewMode === 'temp'; this.el.legend.hidden = !on; if (!reg) return;
    for (const r of this.plan.rooms) { const info = reg.rooms.get(r.id)?.heat; if (!info) continue; const t = on && this.hass ? this.roomSensors(r).temp : null; info.target = t ? 1 : 0; if (t) info.mat.color.set(hbHeatColor(t.v)); }
  }
  applyNight() {
    if (!this.sc) return;
    let n; if (this.nightMode === 'night') n = 1; else if (this.nightMode === 'day') n = 0;
    else { const cfg = this.config.night; if (cfg === 'night') n = 1; else if (cfg === 'day') n = 0; else { const s = this.hass?.states['sun.sun']; n = s ? (s.state === 'below_horizon' ? 1 : 0) : 1; } }
    this.sc.setNight(n);
  }
  wallsLow() { return this.wallsMode === 'niedrig' || (this.wallsMode === 'auto' && !!this.focus); }
  applyWalls() { this.sc?.setWallsLow(this.wallsLow()); }
  update() {
    if (!this.plan?.rooms.length) return;
    this.rebuildIfNeeded(false); this.applyStates(); this.applyNight();
    const sig = this.stateSig();
    if (sig !== this.panelSig && Date.now() - this.interact > 1200) { this.panelSig = sig; this.renderPanel(false); this.renderNav(); if (this.pop) this.renderPop(); }
  }
  stateSig() {
    const h = this.hass; if (!h) return '';
    const ids = new Set(); for (const r of this.plan.rooms) for (const c of this.ents(r)) ids.add(c.eid);
    if (!this.focus) Object.keys(h.states).filter(e => e.startsWith('scene.')).slice(0, 6).forEach(e => ids.add(e));
    let s = this.focus || '-'; for (const id of ids) { const st = h.states[id]; s += '|' + id + ':' + (st ? st.last_updated + st.state : ''); }
    for (const r of this.plan.rooms) { const x = this.roomSensors(r); s += '|' + (x.temp?.v ?? '') + (x.hum?.v ?? ''); }
    return s;
  }
  /* ---------- Kamera & Layout ---------- */
  layout() {
    if (!this.sc) return;
    const ar = this.el.hb.getBoundingClientRect(), W = ar.width, H = ar.height; if (!W || !H) return;
    const narrow = W < 720; this.el.hb.classList.toggle('narrow', narrow);
    const pr = this.el.panel.getBoundingClientRect(), tr = this.el.top.getBoundingClientRect(), topB = tr.bottom - ar.top;
    let ox = 0, oy = 0, aw = W, ah = H, rect;
    if (!narrow) { const right = pr.right - ar.left; ox = -right / 2; aw = W - right; oy = -topB / 2; ah = H - topB; rect = { x0: right, x1: W, y0: topB, y1: H }; }
    else { const bottom = pr.top - ar.top; oy = H / 2 - (topB + bottom) / 2; ah = Math.max(120, bottom - topB); rect = { x0: 0, x1: W, y0: topB, y1: topB + ah }; }
    this.view = { aw, ah, H, W, rect };
    this.sc.resize(W, H, ox, oy);
    // Größe hat sich geändert (z. B. Home Assistant ordnet das Dashboard neu an): Übersicht neu einpassen
    const lf = this.lastFit;
    if (this.placed && !this.focus && lf && (Math.abs(lf[0] - aw) > 30 || Math.abs(lf[1] - ah) > 30) && performance.now() - (this.sc.lastUser?.() || 0) > 4000) this.viewOverview(this.sc.isFlying() ? 1.4 : 0.6);
  }
  fit(r) { const v = this.view || { aw: 800, ah: 500, H: 600 }; return this.sc.fitDistance(r, v.aw, v.ah, v.H); }
  overviewDist(phi, theta) { const reg = this.sc.reg(); return this.sc.fitView?.(phi, theta, this.view?.rect) || this.fit(reg.radius * 0.82); }
  viewOverview(dur) { const reg = this.sc?.reg(); if (!reg) return; this.lastFit = [this.view?.aw || 0, this.view?.ah || 0]; this.sc.flyTo(null, this.overviewDist(0.78, 0.3), 0.78, 0.3, dur); }
  viewRoom(id, dur) { const info = this.sc?.reg()?.rooms.get(id); if (!info) return; this.sc.flyTo(info.center, Math.max(4.6, this.fit(Math.max(1.9, info.radius * 1.12))), this.wallsLow() ? 0.66 : 0.5, null, dur); }
  go(id) {
    this.closePop();
    if (id === this.focus && id) return;
    this.focus = id; this.applyWalls();
    if (id) this.viewRoom(id); else this.viewOverview();
    this.renderPanel(true); this.syncChrome();
  }
  start() {
    if (this.running || !this.sc || !this.connected) return;
    this.running = true;
    const tick = () => {
      if (!this.connected || !this.visible || !this.sc) { this.running = false; return; }
      const reg = this.sc.reg();
      if (reg) for (const [id, r] of reg.rooms) r.target = this.focus === id ? 1 : this.hover === id ? 0.55 : 0;
      this.sc.frame(); this.placeLabels();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  placeLabels() {
    const reg = this.sc.reg(); if (!reg || !this.labels) return;
    for (const r of this.plan.rooms) {
      const el = this.labels[r.id], info = reg.rooms.get(r.id); if (!el || !info) continue;
      const p = this.sc.project(info.center[0], info.center[1]), vis = !this.focus && p.vis;
      el.classList.toggle('off', !vis); el.classList.toggle('hot', this.hover === r.id);
      if (vis) el.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) translate(-50%,-50%)`;
    }
  }
  /* ---------- Oberfläche ---------- */
  renderNav() {
    const rooms = this.plan.rooms;
    this.el.nav.innerHTML = `<button class="nb" type="button" data-room="" aria-label="${T('Übersicht', 'Overview')}" title="${T('Übersicht', 'Overview')}">${HB_ICON.home}<span class="t">${T('Übersicht', 'Overview')}</span></button>` +
      rooms.map(r => `<button class="nb${this.hass && this.roomLit(r) ? ' lit' : ''}" type="button" data-room="${r.id}" aria-label="${esc(r.name)}" title="${esc(r.name)}">${HB_ICON[r.type] || HB_ICON.sonst}<span class="t">${esc(r.name)}</span></button>`).join('');
    const box = this.el.labels; box.innerHTML = ''; this.labels = {};
    for (const r of rooms) {
      const b = document.createElement('button'); b.type = 'button'; const tt = this.viewMode === 'temp' && this.hass ? this.roomSensors(r).temp : null;
      b.textContent = tt ? `${r.name} · ${fmtNum(tt.v, 1)}°` : r.name; if (tt) b.style.setProperty('--heat', hbHeatColor(tt.v));
      b.className = 'lbl off' + (this.hass && this.roomLit(r) ? ' lit' : '') + (this.hass && this.roomMotion(r) ? ' move' : '') + (this.hass && this.roomOpen(r).length ? ' warn' : '') + (tt ? ' heat' : '');
      b.addEventListener('click', () => this.go(r.id)); b.addEventListener('pointerenter', () => { this.hover = r.id; }); b.addEventListener('pointerleave', () => { if (this.hover === r.id) this.hover = null; });
      box.appendChild(b); this.labels[r.id] = b;
    }
    this.syncChrome();
  }
  syncChrome() {
    this.el.nav.querySelectorAll('.nb').forEach(b => b.setAttribute('aria-current', String((b.dataset.room || null) === this.focus)));
    const nm = this.nightMode, ni = nm === 'night' ? HB_ICON.moon : nm === 'day' ? HB_ICON.sun : HB_ICON.auto;
    const nl = nm === 'night' ? T('Nacht', 'Night') : nm === 'day' ? T('Tag', 'Day') : T('Auto', 'Auto');
    this.el.night.innerHTML = `${ni}<span class="t">${nl}</span>`; this.el.night.setAttribute('aria-label', T('Tag/Nacht: ', 'Day/night: ') + nl);
    const wl = { auto: T('Auto', 'Auto'), hoch: T('Hoch', 'High'), niedrig: T('Niedrig', 'Low') }[this.wallsMode];
    this.el.walls.innerHTML = `${HB_ICON.walls}<span class="t">${T('Wände', 'Walls')}: ${wl}</span>`; this.el.walls.setAttribute('aria-label', T('Wandhöhe: ', 'Wall height: ') + wl);
    const vt = this.viewMode === 'temp'; this.el.view.classList.toggle('on', vt); this.el.view.setAttribute('aria-pressed', String(vt));
    this.el.view.innerHTML = `${HB_ICON.thermo}<span class="t">${vt ? T('Temperatur', 'Temperature') : T('Ansicht', 'View')}</span>`; this.el.view.setAttribute('aria-label', T('Temperatur-Ansicht', 'Temperature view'));
  }
  /* Eigenes Bild eines Geräts (im Editor hochgeladen) */
  img(eid) { const u = hbIconSrc(this.plan, this.hass, eid, this.config.auto_icons !== 'off'); return u ? `<img src="${esc(u)}" alt="" draggable="false">` : ''; }
  name(eid) { return this.hass?.states[eid]?.attributes.friendly_name || eid; }
  card(c) {
    const s = this.hass.states[c.eid], d = c.d, na = !s || s.state === 'unavailable';
    const nm = esc(this.name(c.eid)); let on = false, sub = '', ctl = '', body = '', icon = HB_ICON.power, cls = '';
    const sw = (checked) => `<button type="button" class="sw" role="switch" aria-checked="${checked}" aria-label="${nm}" data-act="toggle" data-e="${c.eid}" ${na ? 'disabled' : ''}></button>`;
    const rng = (key, v, label) => `<div class="rng"><input type="range" min="0" max="100" step="1" value="${v}" style="--p:${v}%" data-e="${c.eid}" data-k="${key}" aria-label="${label} ${nm}"><output>${v} %</output></div>`;
    if (d === 'light') {
      cls = 'light'; icon = HB_ICON.bulb; on = s?.state === 'on';
      const modes = s?.attributes.supported_color_modes || [], dim = modes.some(m => m !== 'onoff'), rgb = modes.some(m => ['rgb', 'rgbw', 'rgbww', 'hs', 'xy'].includes(m));
      const pct = s?.attributes.brightness != null ? Math.round(s.attributes.brightness / 2.55) : (on ? 100 : 0);
      sub = on ? (dim ? `${T('An', 'On')} · ${pct} %` : T('An', 'On')) : T('Aus', 'Off'); ctl = sw(on);
      if (on && dim) body = rng('brightness', pct, T('Helligkeit', 'Brightness'));
      if (on && rgb) body += `<div class="sws">${['#ffc78a', '#ffffff', '#7ef0ff', '#b48cff', '#ff6fb5', '#74e3a8'].map(col => `<button type="button" class="swatch" style="--c:${col}" aria-label="${T('Farbe', 'Colour')} ${col}" data-act="color" data-e="${c.eid}" data-c="${col}"></button>`).join('')}</div>`;
    } else if (d === 'cover') {
      icon = HB_ICON.blinds; const pos = this.coverPos(s); on = pos > 0;
      sub = s?.attributes.current_position != null ? (pos === 0 ? T('Geschlossen', 'Closed') : pos === 100 ? T('Offen', 'Open') : `${pos} % ${T('offen', 'open')}`) : (s?.state === 'closed' ? T('Geschlossen', 'Closed') : T('Offen', 'Open'));
      if (s?.attributes.current_position != null) body = rng('position', pos, T('Position', 'Position'));
      body += `<div class="seg"><button type="button" data-act="cover" data-s="close_cover" data-e="${c.eid}">${HB_ICON.down}${T('Zu', 'Close')}</button><button type="button" data-act="cover" data-s="stop_cover" data-e="${c.eid}">${HB_ICON.stop}Stop</button><button type="button" data-act="cover" data-s="open_cover" data-e="${c.eid}">${HB_ICON.up}${T('Auf', 'Open')}</button></div>`;
    } else if (d === 'lock') {
      const locked = s?.state === 'locked'; on = locked; icon = locked ? HB_ICON.lock : HB_ICON.unlock;
      sub = locked ? T('Verriegelt', 'Locked') : s?.state === 'unlocked' ? T('Entriegelt', 'Unlocked') : (s?.state || '');
      body = `<button type="button" class="btn wide ${locked ? 'warn' : 'ok'}" data-act="lock" data-s="${locked ? 'unlock' : 'lock'}" data-e="${c.eid}" ${na ? 'disabled' : ''}>${locked ? T('Entriegeln', 'Unlock') : T('Verriegeln', 'Lock')}</button>`;
    } else if (d === 'climate') {
      icon = HB_ICON.thermo; const cur = s?.attributes.current_temperature, tg = s?.attributes.temperature; on = s?.attributes.hvac_action === 'heating';
      sub = `${cur != null ? fmtNum(+cur, 1) + ' °C' : ''}${s?.attributes.hvac_action ? ' · ' + s.attributes.hvac_action : ''}`;
      if (tg != null) body = `<div class="clim"><button type="button" class="icb" data-act="temp" data-d="-0.5" data-e="${c.eid}" aria-label="${T('Kälter', 'Cooler')}">${HB_ICON.minus}</button><strong>${fmtNum(+tg, 1)}<small> °C</small></strong><button type="button" class="icb" data-act="temp" data-d="0.5" data-e="${c.eid}" aria-label="${T('Wärmer', 'Warmer')}">${HB_ICON.plus}</button></div>`;
    } else {
      icon = d === 'media_player' ? HB_ICON.tv : d === 'fan' ? HB_ICON.fan : HB_ICON.power;
      if (d === 'sensor' || d === 'binary_sensor') {
        const k = c.kind || hbEntKind(this.hass, c.eid); icon = k === 'temp' ? HB_ICON.thermo : k === 'hum' ? HB_ICON.drop : k === 'motion' ? HB_ICON.motion : k === 'contact' ? HB_ICON.contact : HB_ICON.sensor;
        on = d === 'binary_sensor' && s?.state === 'on'; if (on) cls = k === 'contact' ? 'warn' : 'move'; sub = esc(this.stateLabel(c.eid, k));
      } else {
        on = !!s && !['off', 'unavailable', 'unknown', 'standby'].includes(s.state);
        sub = d === 'media_player' && on ? (s.attributes.media_title ? esc(s.attributes.media_title) : esc(s.state)) : on ? T('An', 'On') : T('Aus', 'Off');
        ctl = sw(on); if (d === 'fan' && on) cls += ' spin';
        if (d === 'media_player' && on && s) {
          const sf = s.attributes.supported_features ?? 0xffff, playing = s.state === 'playing';
          const mb = (svc, ic, lab, cls2 = '') => `<button type="button" class="icb ${cls2}" data-act="media" data-s="${svc}" data-e="${c.eid}" aria-label="${lab}">${ic}</button>`;
          body = `<div class="mctl">${sf & 16 ? mb('media_previous_track', HB_ICON.prev, T('Zurück', 'Previous')) : ''}${mb('media_play_pause', playing ? HB_ICON.pause : HB_ICON.play, playing ? T('Pause', 'Pause') : T('Abspielen', 'Play'), 'big')}${sf & 32 ? mb('media_next_track', HB_ICON.next, T('Weiter', 'Next')) : ''}</div>`;
          if (s.attributes.volume_level != null && (sf & 4)) body += rng('volume', Math.round(s.attributes.volume_level * 100), T('Lautstärke', 'Volume'));
        }
      }
    }
    if (na) sub = T('Nicht verfügbar', 'Unavailable');
    const img = this.img(c.eid);
    return `<div class="dev ${cls}${on ? ' on' : ''}${na ? ' na' : ''}"><div class="dh"><span class="di${img ? ' pic' : ''}">${img || icon}</span><div class="dt"><b>${nm}</b><small>${sub}</small></div>${ctl}</div>${body}</div>`;
  }
  renderPanel(animate) {
    const P = this.el.panel, h = this.hass, rooms = this.plan.rooms; let html = '';
    const head = (icon, title, sub, back) => `<div class="ph">${back ? `<button type="button" class="icb" data-act="overview" aria-label="${T('Zur Übersicht', 'Back to overview')}">${HB_ICON.chevL}</button>` : `<span class="ph-ic">${icon}</span>`}<div><h2>${esc(title)}</h2><p>${sub}</p></div><button type="button" class="icb" data-act="min" aria-label="${this.panelMin ? T('Aufklappen', 'Expand') : T('Einklappen', 'Collapse')}">${this.panelMin ? HB_ICON.down : HB_ICON.up}</button></div>`;
    if (!this.focus) {
      const all = h ? rooms.flatMap(r => this.controls(r)) : [], lights = all.filter(c => c.d === 'light'), on = lights.filter(c => h.states[c.eid]?.state === 'on').length;
      const temps = rooms.filter(r => !r.outdoor).map(r => this.roomSensors(r).temp?.v).filter(v => v != null);
      const lock = all.find(c => c.d === 'lock'), ls = lock && h.states[lock.eid];
      const area = rooms.filter(r => !r.outdoor).reduce((s, r) => s + Math.abs(polyArea(r.pts)), 0);
      const contacts = h ? rooms.flatMap(r => this.ents(r).filter(c => c.kind === 'contact')) : [], openN = new Set(contacts.filter(c => h.states[c.eid]?.state === 'on').map(c => c.eid)).size;
      html += head(HB_ICON.home, this.config.title || this.plan.name, `${rooms.length} ${T('Räume', 'rooms')} · ≈ ${Math.round(area)} m²`);
      const st = [`<button type="button" class="stat lamp" data-act="jump" data-to="sActive"><span>${T('Lichter an', 'Lights on')}</span><b>${on}<small>/ ${lights.length}</small></b></button>`];
      st.push(temps.length ? `<button type="button" class="stat" data-act="heat"><span>${T('Innen Ø', 'Inside avg')}</span><b>${fmtNum(temps.reduce((a, b) => a + b, 0) / temps.length, 1)}<small>°C</small></b></button>` : `<div class="stat"><span>${T('Geräte', 'Devices')}</span><b>${all.length}</b></div>`);
      if (ls) st.push(`<button type="button" class="stat ${ls.state === 'locked' ? 'ok' : 'warn'}" data-act="room" data-room="${rooms.find(r => this.controls(r).some(c => c.eid === lock.eid))?.id || ''}"><span>${esc(this.name(lock.eid))}</span><b>${ls.state === 'locked' ? T('Zu', 'Locked') : T('Offen', 'Open')}</b></button>`);
      if (contacts.length) st.push(`<button type="button" class="stat ${openN ? 'warn' : 'ok'}" data-act="jump" data-to="sOpen"><span>${T('Fenster & Türen', 'Windows & doors')}</span><b>${openN ? `${openN} ${T('offen', 'open')}` : T('Alle zu', 'All shut')}</b></button>`);
      const sun = h?.states['sun.sun']; if (sun) st.push(`<div class="stat"><span>${T('Sonne', 'Sun')}</span><b>${sun.state === 'above_horizon' ? T('Tag', 'Day') : T('Nacht', 'Night')}</b></div>`);
      html += `<div class="stats">${st.slice(0, 4).join('')}</div>`;
      /* Was gerade an ist */
      if (h) {
        const act = [], seen = new Set();
        for (const r of rooms) for (const c of this.controls(r)) { if (seen.has(c.eid) || !['light', 'switch', 'input_boolean', 'fan', 'media_player'].includes(c.d)) continue; const s = h.states[c.eid]; const isOn = c.d === 'media_player' ? this.isOn(s) : s?.state === 'on'; if (isOn) { seen.add(c.eid); act.push({ c, r }); } }
        const litIds = act.filter(a => a.c.d === 'light').map(a => a.c.eid), max = this.showAllActive ? 99 : 5;
        html += `<div class="sect" id="sActive"><h3>${T('Gerade an', 'On right now')}${act.length ? ` <em>${act.length}</em>` : ''}</h3>`;
        html += act.length ? `<div class="acts">${act.slice(0, max).map(({ c, r }) => `<div class="actr${c.d === 'light' ? ' light' : ''}"><span class="ai${this.img(c.eid) ? ' pic' : ''}">${this.img(c.eid) || (c.d === 'light' ? HB_ICON.bulb : c.d === 'media_player' ? HB_ICON.tv : c.d === 'fan' ? HB_ICON.fan : HB_ICON.power)}</span><button type="button" class="at" data-act="room" data-room="${r.id}"><b>${esc(this.name(c.eid))}</b><small>${esc(r.name)} · ${esc(this.stateLabel(c.eid))}</small></button><button type="button" class="sw" role="switch" aria-checked="true" aria-label="${esc(this.name(c.eid))}" data-act="toggle" data-e="${c.eid}"></button></div>`).join('')}</div>` +
          `<div class="actb">${act.length > max ? `<button type="button" class="btn" data-act="more">+ ${act.length - max} ${T('weitere', 'more')}</button>` : ''}${litIds.length ? `<button type="button" class="btn lampb" data-act="alloff" data-ids="${litIds.join(',')}">${HB_ICON.allOff}${T('Alle Lichter aus', 'All lights off')}</button>` : ''}</div>`
          : `<p class="note">${T('Alles aus – gerade läuft nichts.', 'Everything is off right now.')}</p>`;
        html += `</div>`;
        const openL = []; const so = new Set(); for (const r of rooms) for (const c of this.roomOpen(r)) if (!so.has(c.eid)) { so.add(c.eid); openL.push({ c, r }); }
        if (openL.length) html += `<div class="sect" id="sOpen"><h3>${T('Offen', 'Open')} <em class="w">${openL.length}</em></h3><div class="rlist">${openL.map(({ c, r }) => `<button type="button" class="rr warn" data-act="room" data-room="${r.id}">${HB_ICON.contact}<b>${esc(this.name(c.eid))}</b><span>${esc(r.name)}</span><i></i></button>`).join('')}</div></div>`;
      }
      const scenes = h ? Object.keys(h.states).filter(e => e.startsWith('scene.')).slice(0, 6) : [];
      if (scenes.length) html += `<div class="sect"><h3>${T('Szenen', 'Scenes')}</h3><div class="scenes">${scenes.map(e => `<button type="button" class="scene" data-act="scene" data-e="${e}">${HB_ICON.scene}<span>${esc(this.name(e))}</span></button>`).join('')}</div></div>`;
      html += `<div class="sect"><h3>${T('Räume', 'Rooms')}</h3><div class="rlist">${rooms.map(r => { const t = h ? this.roomSensors(r).temp : null, mv = h && this.roomMotion(r), op = h ? this.roomOpen(r).length : 0; return `<button type="button" class="rr" data-act="room" data-room="${r.id}">${HB_ICON[r.type] || HB_ICON.sonst}<b>${esc(r.name)}</b><span>${op ? `<em class="w" title="${T('Offen', 'Open')}">${HB_ICON.contact}</em>` : ''}${mv ? `<em class="m" title="${T('Bewegung', 'Motion')}">${HB_ICON.motion}</em>` : ''}${t ? fmtNum(t.v, 1) + ' °C' : ''}</span><i class="${h && this.roomLit(r) ? 'lit' : ''}"></i></button>`; }).join('')}</div></div>`;
    } else {
      const r = rooms.find(x => x.id === this.focus); if (!r) { this.focus = null; return this.renderPanel(animate); }
      const ctl = h ? this.controls(r) : [], s = h ? this.roomSensors(r) : {};
      html += head(HB_ICON[r.type] || HB_ICON.sonst, r.name, `≈ ${Math.round(Math.abs(polyArea(r.pts)))} m² · ${ctl.length} ${ctl.length === 1 ? T('Gerät', 'device') : T('Geräte', 'devices')}`, true);
      const open = h ? this.roomOpen(r) : [];
      const chips = [s.temp ? `<span class="chip">${HB_ICON.thermo}${fmtNum(s.temp.v, 1)} ${esc(s.temp.u)}</span>` : '', s.hum ? `<span class="chip">${HB_ICON.drop}${Math.round(s.hum.v)} %</span>` : '',
        ...(s.vals || []).map(x => { const v = parseFloat(x.s.state), u = x.s.attributes.unit_of_measurement || ''; return `<span class="chip" title="${esc(this.name(x.eid))}">${HB_ICON.sensor}${isNaN(v) ? esc(x.s.state) : esc(fmtNum(v, Number.isInteger(v) ? 0 : 1).replace(/[.,]0$/, ''))}${u ? ' ' + esc(u) : ''}</span>`; }),
        h && this.roomLit(r) ? `<span class="chip lamp">${HB_ICON.bulb}${T('Licht an', 'Lights on')}</span>` : '',
        h && this.roomMotion(r) ? `<span class="chip move">${HB_ICON.motion}${T('Bewegung', 'Motion')}</span>` : '',
        open.length ? `<span class="chip warn">${HB_ICON.contact}${open.length === 1 ? esc(this.name(open[0].eid)) + ' ' + T('offen', 'open') : open.length + ' ' + T('offen', 'open')}</span>` : ''].join('');
      if (chips) html += `<div class="chips">${chips}</div>`;
      const rl = ctl.filter(c => c.d === 'light');
      if (rl.length >= 2) { const anyOn = rl.some(c => h.states[c.eid]?.state === 'on'); html += `<button type="button" class="btn wide roomall${anyOn ? ' lampb' : ''}" data-act="roomlights" data-s="${anyOn ? 'turn_off' : 'turn_on'}" data-ids="${rl.map(c => c.eid).join(',')}">${anyOn ? HB_ICON.allOff : HB_ICON.bulb}${anyOn ? T('Alle Lichter im Raum aus', 'All lights in this room off') : T('Alle Lichter im Raum an', 'All lights in this room on')}</button>`; }
      html += ctl.length ? `<div class="devs">${ctl.map(c => this.card(c)).join('')}</div>` : `<p class="note">${T('Diesem Raum sind noch keine Geräte zugeordnet. Verknüpfe ihn im Grundriss-Editor mit einem <b>Bereich</b> aus Home Assistant oder setze Lampen mit Entität.', 'No devices in this room yet. Link it to a Home Assistant <b>area</b> in the floor plan editor or place lights with an entity.')}</p>`;
    }
    P.innerHTML = html; P.classList.toggle('min', this.panelMin);
    if (animate && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { P.classList.remove('swap'); void P.offsetWidth; P.classList.add('swap'); [...P.children].forEach((c, i) => c.style.setProperty('--i', i)); } else P.classList.remove('swap');
    this.panelSig = this.stateSig();
    requestAnimationFrame(() => this.layout());
  }
  call(domain, service, data) { if (!this.hass) return; this.interact = 0; try { navigator.vibrate?.(8); } catch (e) {} this.hass.callService(domain, service, data); }
  onPanelClick(e) {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act, eid = b.dataset.e, dom = eid ? eid.split('.')[0] : '';
    if (act === 'overview') return this.go(null);
    if (act === 'room') return b.dataset.room ? this.go(b.dataset.room) : undefined;
    if (act === 'min') { this.panelMin = !this.panelMin; return this.renderPanel(false); }
    if (act === 'popclose') return this.closePop();
    if (act === 'more') { this.showAllActive = true; return this.renderPanel(false); }
    if (act === 'jump') { if (this.panelMin) { this.panelMin = false; this.renderPanel(false); } return this.el.panel.querySelector('#' + b.dataset.to)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    if (act === 'heat') { this.viewMode = 'temp'; this.applyHeat(); this.renderNav(); return this.syncChrome(); }
    if (act === 'alloff' || act === 'roomlights') {
      const ids = (b.dataset.ids || '').split(',').filter(Boolean), svc = act === 'alloff' ? 'turn_off' : b.dataset.s; if (!ids.length) return;
      const was = ids.filter(i => this.hass.states[i]?.state === 'on');
      this.call('light', svc, { entity_id: ids });
      if (svc === 'turn_off' && was.length) this.toastMsg(T(`${was.length} ${was.length === 1 ? 'Licht' : 'Lichter'} aus`, `${was.length} light${was.length === 1 ? '' : 's'} off`), () => this.call('light', 'turn_on', { entity_id: was }));
      else if (svc === 'turn_on') this.toastMsg(T('Lichter an', 'Lights on'), () => this.call('light', 'turn_off', { entity_id: ids.filter(i => !was.includes(i)) }));
      return;
    }
    if (act === 'media') return this.call('media_player', b.dataset.s, { entity_id: eid });
    if (act === 'scene') return this.call('scene', 'turn_on', { entity_id: eid });
    if (act === 'toggle') { const on = b.getAttribute('aria-checked') === 'true'; b.setAttribute('aria-checked', String(!on)); const svc = dom === 'media_player' || dom === 'fan' || dom === 'light' || dom === 'switch' || dom === 'input_boolean' ? (on ? 'turn_off' : 'turn_on') : 'toggle'; return this.call(dom, svc, { entity_id: eid }); }
    if (act === 'color') { const hx = b.dataset.c, rgb = [1, 3, 5].map(i => parseInt(hx.slice(i, i + 2), 16)); return this.call('light', 'turn_on', { entity_id: eid, rgb_color: rgb }); }
    if (act === 'cover') return this.call('cover', b.dataset.s, { entity_id: eid });
    if (act === 'lock') return this.call('lock', b.dataset.s, { entity_id: eid });
    if (act === 'temp') { const s = this.hass.states[eid]; const t0 = +s.attributes.temperature || 20; return this.call('climate', 'set_temperature', { entity_id: eid, temperature: Math.round((t0 + +b.dataset.d) * 2) / 2 }); }
  }
  onPanelChange(e) {
    const t = e.target; if (t.type !== 'range') return;
    const eid = t.dataset.e, v = +t.value;
    if (t.dataset.k === 'brightness') this.call('light', v > 0 ? 'turn_on' : 'turn_off', v > 0 ? { entity_id: eid, brightness_pct: v } : { entity_id: eid });
    if (t.dataset.k === 'position') this.call('cover', 'set_cover_position', { entity_id: eid, position: v });
    if (t.dataset.k === 'volume') this.call('media_player', 'volume_set', { entity_id: eid, volume_level: v / 100 });
  }
}
