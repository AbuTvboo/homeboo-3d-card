/*! HomeBoo 3D Card | MIT License */
const HB_VERSION = '0.2.0';
const HB_THREE_DEFAULT = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
const hbThreeCache = new Map();
function hbLoadThree(url) {
  url = url || HB_THREE_DEFAULT;
  if (!hbThreeCache.has(url)) hbThreeCache.set(url, import(/* @vite-ignore */ url));
  return hbThreeCache.get(url);
}

/* ---------- Sprache ---------- */
let HB_LANG = (typeof navigator !== 'undefined' && /^de/i.test(navigator.language || '')) ? 'de' : 'en';
const T = (de, en) => (HB_LANG === 'de' ? de : en);
const N = arr => (HB_LANG === 'de' ? arr[0] : arr[1]);
function hbSetLang(l) { if (l) HB_LANG = /^de/i.test(l) ? 'de' : 'en'; }

/* ---------- Mathe ---------- */
const GRID = 0.05, TOL = 0.06, T_INT = 0.12, T_EXT = 0.26, T_RAIL = 0.1, DEG = Math.PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r2 = v => Math.round(v * 100) / 100;
const snapv = v => Math.round(v / GRID) * GRID;
const fx = v => (Math.round(v * 1000) / 1000).toString();
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const uid = p => p + Math.random().toString(36).slice(2, 8);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const len = a => Math.hypot(a[0], a[1]), dist = (a, b) => len(sub(a, b));
const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const fmtNum = (v, d = 2) => { const s = v.toFixed(d); return HB_LANG === 'de' ? s.replace('.', ',') : s; };
const fmtM = v => fmtNum(v) + ' m';
const fmtA = v => fmtNum(v, 1) + ' m²';
const parseNum = s => { const v = parseFloat(String(s).replace(',', '.')); return isFinite(v) ? v : null; };
function polyArea(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1]; } return a / 2; }
function centroid(p) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length], k = q[0] * r[1] - r[0] * q[1]; a += k; cx += (q[0] + r[0]) * k; cy += (q[1] + r[1]) * k; }
  if (Math.abs(a) < 1e-9) return p[0] ? p[0].slice() : [0, 0];
  a /= 2; return [cx / (6 * a), cy / (6 * a)];
}
function inPoly(p, x, y) {
  let ins = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins; }
  return ins;
}
function segDist(P, A, B) { const AB = sub(B, A), L2 = dot(AB, AB); const t = L2 ? clamp(dot(sub(P, A), AB) / L2, 0, 1) : 0; const Q = add(A, mul(AB, t)); return { d: dist(P, Q), t, Q }; }
function bbox(pts) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x0, y0, x1, y1 }; }

/* ---------- Kataloge ---------- */
const FLOORS = {
  oak: { n: ['Eiche dunkel', 'Dark oak'], c: '#6a4f3a' }, ash: { n: ['Eiche hell', 'Light oak'], c: '#8b745d' }, walnut: { n: ['Nussbaum', 'Walnut'], c: '#4a3526' },
  white: { n: ['Holz weiß', 'White wood'], c: '#b9b0a2' }, herring: { n: ['Fischgrät', 'Herringbone'], c: '#86664a' },
  tile: { n: ['Fliesen dunkel', 'Dark tiles'], c: '#394154' }, tileL: { n: ['Fliesen hell', 'Light tiles'], c: '#a9a6a0' }, marble: { n: ['Marmor', 'Marble'], c: '#cfccc6' },
  terracotta: { n: ['Terrakotta', 'Terracotta'], c: '#9a553a' }, slate: { n: ['Schiefer', 'Slate'], c: '#283042' }, concrete: { n: ['Beton', 'Concrete'], c: '#666a72' },
  carpet: { n: ['Teppich grau', 'Grey carpet'], c: '#4a4660' }, carpetL: { n: ['Teppich beige', 'Beige carpet'], c: '#9d9383' },
  deck: { n: ['Holzdeck', 'Decking'], c: '#74573d' }, stone: { n: ['Steinplatten', 'Paving'], c: '#6f6c66' }, grass: { n: ['Rasen', 'Grass'], c: '#3c6637' },
};
const WALLCOLORS = [['', ['Weiß', 'White']], ['#efe6d6', ['Creme', 'Cream']], ['#d6d3cd', ['Hellgrau', 'Light grey']], ['#9ca1a8', ['Grau', 'Grey']], ['#b7c4ad', ['Salbei', 'Sage']], ['#a7bacb', ['Taubenblau', 'Dove blue']], ['#d9c4a5', ['Sand', 'Sand']], ['#c98f74', ['Terrakotta', 'Terracotta']], ['#d9b2b0', ['Altrosa', 'Dusty pink']], ['#2f5d62', ['Petrol', 'Teal']], ['#40454e', ['Anthrazit', 'Anthracite']]];
const RTYPES = {
  wohnen: ['Wohnzimmer', 'Living room'], kueche: ['Küche', 'Kitchen'], essen: ['Essbereich', 'Dining'], schlafen: ['Schlafzimmer', 'Bedroom'], kind: ['Kinderzimmer', 'Kids room'],
  gast: ['Gästezimmer', 'Guest room'], buero: ['Büro', 'Office'], bad: ['Badezimmer', 'Bathroom'], wc: ['WC', 'Toilet'], flur: ['Flur', 'Hallway'], abstell: ['Abstellraum', 'Storage'],
  balkon: ['Balkon', 'Balcony'], terrasse: ['Terrasse', 'Terrace'], sonst: ['Sonstiges', 'Other'],
};
const RTYPE_FLOOR = { wohnen: 'oak', kueche: 'oak', essen: 'oak', schlafen: 'ash', kind: 'ash', gast: 'ash', buero: 'ash', bad: 'tile', wc: 'tile', flur: 'slate', abstell: 'tile', balkon: 'deck', terrasse: 'deck', sonst: 'ash' };
const OPDEF = { door: { n: ['Tür', 'Door'], w: 0.9, h: 2.08 }, window: { n: ['Fenster', 'Window'], w: 1.2, sill: 0.85, h: 1.4 }, gdoor: { n: ['Glastür', 'Glass door'], w: 1.8, h: 2.25 }, front: { n: ['Haustür', 'Front door'], w: 1.0, h: 2.12 } };
const CAT = {
  sofa: { n: ['Sofa', 'Sofa'], w: 2.2, d: 0.95, wall: 1, g: 0 }, armchair: { n: ['Sessel', 'Armchair'], w: 0.9, d: 0.86, g: 0 }, coffee: { n: ['Couchtisch', 'Coffee table'], w: 1.1, d: 0.6, g: 0 },
  tvunit: { n: ['TV-Board', 'TV unit'], w: 1.9, d: 0.42, wall: 1, g: 0, ent: 'media_player' }, rug: { n: ['Teppich', 'Rug'], w: 2.4, d: 1.7, g: 0 }, shelf: { n: ['Regal', 'Shelf'], w: 1.2, d: 0.35, wall: 1, g: 0 },
  plant: { n: ['Pflanze', 'Plant'], w: 0.5, d: 0.5, g: 0 }, round: { n: ['Runder Tisch', 'Round table'], w: 0.8, d: 0.8, g: 0 },
  bed: { n: ['Doppelbett', 'Double bed'], w: 1.8, d: 2.05, wall: 1, g: 1 }, bed1: { n: ['Einzelbett', 'Single bed'], w: 0.9, d: 2.0, wall: 1, g: 1 }, wardrobe: { n: ['Schrank', 'Wardrobe'], w: 2.0, d: 0.6, wall: 1, g: 1 }, nightstand: { n: ['Nachttisch', 'Nightstand'], w: 0.46, d: 0.4, wall: 1, g: 1 },
  counter: { n: ['Küchenzeile', 'Counter'], w: 2.4, d: 0.6, wall: 1, g: 2 }, fridge: { n: ['Kühlschrank', 'Fridge'], w: 0.7, d: 0.66, wall: 1, g: 2 }, dining: { n: ['Esstisch', 'Dining table'], w: 2.0, d: 0.95, g: 2 },
  chair: { n: ['Stuhl', 'Chair'], w: 0.45, d: 0.45, g: 2 }, stool: { n: ['Barhocker', 'Bar stool'], w: 0.38, d: 0.38, g: 2 },
  desk: { n: ['Schreibtisch', 'Desk'], w: 1.5, d: 0.7, wall: 1, g: 3 }, ochair: { n: ['Bürostuhl', 'Office chair'], w: 0.6, d: 0.6, g: 3 }, beanbag: { n: ['Sitzsack', 'Bean bag'], w: 0.85, d: 0.85, g: 3 },
  bathtub: { n: ['Badewanne', 'Bathtub'], w: 1.7, d: 0.75, wall: 1, g: 4 }, shower: { n: ['Dusche', 'Shower'], w: 0.9, d: 0.9, wall: 1, g: 4 }, toilet: { n: ['WC', 'Toilet'], w: 0.4, d: 0.6, wall: 1, g: 4 },
  vanity: { n: ['Waschtisch', 'Vanity'], w: 0.8, d: 0.48, wall: 1, g: 4 }, washer: { n: ['Waschmaschine', 'Washer'], w: 0.6, d: 0.6, wall: 1, g: 4, ent: 'switch' },
  lounger: { n: ['Liege', 'Lounger'], w: 0.68, d: 1.85, g: 5 },
  sectional: { n: ['Ecksofa', 'Corner sofa'], w: 2.6, d: 1.8, wall: 1, g: 0 }, sideboard: { n: ['Sideboard', 'Sideboard'], w: 1.8, d: 0.45, wall: 1, g: 0 },
  fireplace: { n: ['Kamin', 'Fireplace'], w: 1.2, d: 0.45, wall: 1, g: 0, ent: 'switch' }, piano: { n: ['Klavier', 'Piano'], w: 1.5, d: 0.6, wall: 1, g: 0 },
  dresser: { n: ['Kommode', 'Dresser'], w: 1.2, d: 0.5, wall: 1, g: 1 }, crib: { n: ['Kinderbett', 'Crib'], w: 0.76, d: 1.32, wall: 1, g: 1 },
  island: { n: ['Kochinsel', 'Kitchen island'], w: 1.8, d: 0.9, g: 2 }, tallunit: { n: ['Backofen-Schrank', 'Oven column'], w: 0.6, d: 0.62, wall: 1, g: 2 },
  cdesk: { n: ['Eckschreibtisch', 'Corner desk'], w: 1.6, d: 1.4, wall: 1, g: 3 },
  dvanity: { n: ['Doppelwaschtisch', 'Double vanity'], w: 1.4, d: 0.5, wall: 1, g: 4 }, dryer: { n: ['Trockner', 'Dryer'], w: 0.6, d: 0.6, wall: 1, g: 4, ent: 'switch' },
  parasol: { n: ['Sonnenschirm', 'Parasol'], w: 2.2, d: 2.2, g: 5 }, grill: { n: ['Grill', 'Barbecue'], w: 0.95, d: 0.55, g: 5 }, gardenset: { n: ['Gartentisch', 'Garden table'], w: 1.4, d: 0.8, g: 5 },
};
const CAT_GROUPS = [['Wohnen', 'Living'], ['Schlafen', 'Sleeping'], ['Küche & Essen', 'Kitchen & dining'], ['Arbeiten', 'Work'], ['Bad', 'Bath'], ['Draußen', 'Outdoor']];
const DEVDEF = {
  light: { n: ['Deckenleuchte', 'Ceiling light'], ent: 'light', h: 2.1 }, spot: { n: ['Spot', 'Spotlight'], ent: 'light' }, lamp: { n: ['Stehlampe', 'Floor lamp'], ent: 'light' },
  sensor: { n: ['Klimasensor', 'Climate sensor'], ent: 'sensor' }, motion: { n: ['Bewegungsmelder', 'Motion sensor'], ent: 'binary_sensor' },
};

/* ---------- Geräte aus Home Assistant einem Raum zuordnen ---------- */
const HB_DOMAINS = ['light', 'switch', 'input_boolean', 'fan', 'cover', 'media_player', 'lock', 'climate'];
const HB_MOTION_DC = ['motion', 'occupancy', 'presence'], HB_CONTACT_DC = ['door', 'window', 'opening', 'garage_door'];
function hbAreaId(room, hass) {
  if (!room.area || !hass?.areas) return null;
  const A = hass.areas; if (A[room.area]) return room.area;
  const want = room.area.trim().toLowerCase();
  const hit = Object.values(A).find(a => (a.name || '').toLowerCase() === want || (a.area_id || '').toLowerCase() === want);
  return hit ? hit.area_id : null;
}
function hbAreaEntities(room, hass) {
  const id = hbAreaId(room, hass); if (!id || !hass?.entities) return [];
  const out = [];
  for (const e of Object.values(hass.entities)) {
    if (e.hidden || e.entity_category) continue;
    const a = e.area_id || (e.device_id && hass.devices?.[e.device_id]?.area_id);
    if (a === id && hass.states[e.entity_id]) out.push(e.entity_id);
  }
  return out;
}
/* Was die Karte mit einer Entität anfangen kann: ctl (schaltbar), temp, hum, motion, contact, value */
function hbEntKind(hass, eid) {
  const d = eid.split('.')[0], s = hass?.states?.[eid];
  if (HB_DOMAINS.includes(d)) return 'ctl';
  if (!s) return null;
  const dc = s.attributes?.device_class, unit = s.attributes?.unit_of_measurement || '';
  if (d === 'sensor') { if (dc === 'temperature' || /°/.test(unit)) return 'temp'; if (dc === 'humidity' || (unit === '%' && /hum|feucht/i.test(eid))) return 'hum'; return null; }
  if (d === 'binary_sensor') { if (HB_MOTION_DC.includes(dc)) return 'motion'; if (HB_CONTACT_DC.includes(dc)) return 'contact'; }
  return null;
}
/* Alle Entitäten eines Raums – aus dem Plan, von Hand hinzugefügt und aus dem Bereich (ohne Ausblenden) */
function hbRoomEntities(plan, room, hass) {
  const out = [], seen = new Set();
  const push = (eid, src, force) => {
    if (!eid || seen.has(eid) || !hass?.states?.[eid]) return;
    let k = hbEntKind(hass, eid); const d = eid.split('.')[0];
    if (!k && src !== 'area') k = d === 'binary_sensor' ? (force || 'contact') : d === 'sensor' ? 'value' : null;
    if (!k) return; seen.add(eid); out.push({ eid, d, kind: k, src });
  };
  for (const dv of plan.devices) if (dv.entity && inPoly(room.pts, dv.x, dv.y)) push(dv.entity, 'dev', dv.kind === 'motion' ? 'motion' : null);
  for (const it of plan.items) if (it.entity && inPoly(room.pts, it.x, it.y)) push(it.entity, 'item');
  for (const o of plan.openings) if (o.room === room.id) { if (o.entity) push(o.entity, 'op'); if (o.contact) push(o.contact, 'op', 'contact'); }
  for (const e of room.add || []) push(e, 'add');
  for (const e of hbAreaEntities(room, hass)) push(e, 'area');
  return out;
}

/* ---------- Plan ---------- */
function emptyPlan() { return { format: 'homeboo-plan', version: 1, name: T('Mein Zuhause', 'My home'), wallHeight: 2.55, rooms: [], openings: [], items: [], devices: [] }; }
function normalizePlan(p) {
  const e = emptyPlan();
  if (!p || typeof p !== 'object') return e;
  const out = { ...e, ...p };
  const strs = a => Array.isArray(a) ? [...new Set(a.filter(x => typeof x === 'string' && x.includes('.')))] : [];
  out.rooms = (Array.isArray(p.rooms) ? p.rooms : []).filter(r => Array.isArray(r.pts) && r.pts.length >= 3).map(r => ({ id: r.id || uid('r'), name: r.name || '', type: r.type || 'sonst', floor: FLOORS[r.floor] ? r.floor : 'ash', outdoor: !!r.outdoor, area: r.area || '', wall: /^#[0-9a-f]{6}$/i.test(r.wall || '') ? r.wall : '', hide: strs(r.hide), add: strs(r.add), open: Array.isArray(r.open) ? r.open : [], pts: r.pts.map(q => [+q[0], +q[1]]) }));
  out.openings = (Array.isArray(p.openings) ? p.openings : []).filter(o => OPDEF[o.type]).map(o => ({ id: o.id || uid('o'), flipHinge: false, flipSide: false, entity: '', contact: '', sill: OPDEF[o.type].sill ?? 0, h: OPDEF[o.type].h, w: OPDEF[o.type].w, ...o }));
  out.items = (Array.isArray(p.items) ? p.items : []).filter(i => CAT[i.kind]).map(i => ({ id: i.id || uid('i'), rot: 0, w: CAT[i.kind].w, d: CAT[i.kind].d, ...i }));
  out.devices = (Array.isArray(p.devices) ? p.devices : []).filter(d => DEVDEF[d.kind]).map(d => ({ id: d.id || uid('d'), name: '', entity: '', ...d }));
  out.wallHeight = clamp(+out.wallHeight || 2.55, 2, 4);
  delete out.bg;
  return out;
}
function edgeOf(r, i) { const n = r.pts.length; const A = r.pts[i % n], B = r.pts[(i + 1) % n]; return { A, B, L: dist(A, B), u: norm(sub(B, A)) }; }
function inwardN(r, i) {
  const { A, B, u } = edgeOf(r, i); let n = [-u[1], u[0]];
  const m = mul(add(A, B), 0.5);
  if (!inPoly(r.pts, m[0] + n[0] * 0.03, m[1] + n[1] * 0.03)) n = mul(n, -1);
  return n;
}
function nearestEdge(plan, p, opts = {}) {
  let best = null;
  for (const r of plan.rooms) {
    if (opts.room && r.id !== opts.room) continue;
    for (let i = 0; i < r.pts.length; i++) {
      const { A, B, L } = edgeOf(r, i); if (L < 0.05) continue;
      const sd = segDist(p, A, B);
      if (!best || sd.d < best.d - 1e-6) best = { room: r.id, edge: i, t: sd.t, d: sd.d, L };
    }
  }
  return best;
}
function openingPos(plan, o) {
  const r = plan.rooms.find(x => x.id === o.room); if (!r || o.edge >= r.pts.length) return null;
  const e = edgeOf(r, o.edge), c = add(e.A, mul(sub(e.B, e.A), o.t));
  return { ...e, c, n: inwardN(r, o.edge), r };
}
function computeWalls(plan) {
  const rooms = plan.rooms, raw = [];
  rooms.forEach((r, ri) => {
    const n = r.pts.length, ro = new Set(r.open || []);
    for (let ei = 0; ei < n; ei++) {
      const { A, L, u } = edgeOf(r, ei); if (L < 0.02) continue;
      const ov = [];
      rooms.forEach((q, rj) => {
        if (rj === ri) return;
        const qo = new Set(q.open || []);
        for (let ej = 0; ej < q.pts.length; ej++) {
          const C = q.pts[ej], D = q.pts[(ej + 1) % q.pts.length];
          if (Math.abs(cross(u, sub(C, A))) > TOL || Math.abs(cross(u, sub(D, A))) > TOL) continue;
          let s0 = dot(u, sub(C, A)), s1 = dot(u, sub(D, A)); if (s0 > s1) [s0, s1] = [s1, s0];
          s0 = Math.max(0, s0); s1 = Math.min(L, s1);
          if (s1 - s0 > 0.02) ov.push({ s0, s1, rj, open: qo.has(ej) });
        }
      });
      const bp = [0, L, ...ov.flatMap(o => [o.s0, o.s1])].sort((a, b) => a - b);
      for (let k = 0; k < bp.length - 1; k++) {
        const a = bp[k], b = bp[k + 1]; if (b - a < 0.02) continue;
        const mid = (a + b) / 2, o = ov.find(x => x.s0 <= mid && mid <= x.s1);
        let kind;
        if (o) {
          if (o.rj < ri || ro.has(ei) || o.open) continue;
          const oa = !!r.outdoor, ob = !!rooms[o.rj].outdoor;
          if (oa && ob) continue;
          kind = oa !== ob ? 'ext' : 'int';
        } else { if (ro.has(ei)) continue; kind = r.outdoor ? 'rail' : 'ext'; }
        raw.push({ a: add(A, mul(u, a)), b: add(A, mul(u, b)), kind });
      }
    }
  });
  let ps = raw;
  for (let guard = 0; guard < 500; guard++) {
    let hit = false;
    outer: for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
      const P = ps[i], Q = ps[j]; if (P.kind !== Q.kind) continue;
      const u = norm(sub(P.b, P.a));
      if (Math.abs(cross(u, sub(Q.a, P.a))) > 0.01 || Math.abs(cross(u, sub(Q.b, P.a))) > 0.01) continue;
      if (![P.a, P.b].some(x => [Q.a, Q.b].some(y => dist(x, y) < 0.015))) continue;
      const all = [P.a, P.b, Q.a, Q.b].map(x => ({ x, s: dot(u, sub(x, P.a)) })).sort((m, k) => m.s - k.s);
      ps = ps.filter((_, k) => k !== i && k !== j); ps.push({ a: all[0].x, b: all[3].x, kind: P.kind });
      hit = true; break outer;
    }
    if (!hit) break;
  }
  const pieces = ps.map(p => ({ ...p, L: dist(p.a, p.b), u: norm(sub(p.b, p.a)), t: p.kind === 'int' ? T_INT : p.kind === 'ext' ? T_EXT : T_RAIL, ops: [] }));
  const byOp = new Map();
  for (const o of plan.openings) {
    const op = openingPos(plan, o); if (!op) continue;
    for (const p of pieces) {
      if (Math.abs(cross(p.u, op.u)) > 0.05 || Math.abs(cross(p.u, sub(op.c, p.a))) > 0.1) continue;
      const s = dot(p.u, sub(op.c, p.a)); if (s < -0.05 || s > p.L + 0.05) continue;
      p.ops.push({ o, c: s, w: o.w }); byOp.set(o.id, p); break;
    }
  }
  return { pieces, byOp };
}
function roomOfPoint(plan, x, y) { return plan.rooms.find(r => inPoly(r.pts, x, y)) || null; }

/* ---------- Beispielwohnung für neue Karten ---------- */
function demoPlan() {
  const R = (id, type, floor, pts, extra = {}) => ({ id, name: N(RTYPES[type]), type, floor, outdoor: false, area: '', wall: '', hide: [], add: [], open: [], pts, ...extra });
  const p = emptyPlan();
  p.name = T('Beispielwohnung', 'Sample apartment');
  p.rooms = [
    R('wohnen', 'wohnen', 'herring', [[0, 0], [6, 0], [6, 4.5], [0, 4.5]], { area: 'living_room', wall: '#b7c4ad' }),
    R('schlafen', 'schlafen', 'ash', [[6, 0], [10, 0], [10, 4.5], [6, 4.5]], { area: 'bedroom', wall: '#a7bacb' }),
    R('buero', 'buero', 'walnut', [[0, 4.5], [3, 4.5], [3, 8], [0, 8]], { area: 'office' }),
    R('flur', 'flur', 'concrete', [[3, 4.5], [7, 4.5], [7, 8], [3, 8]], { area: 'hallway' }),
    R('bad', 'bad', 'tileL', [[7, 4.5], [10, 4.5], [10, 8], [7, 8]], { area: 'bathroom' }),
    R('balkon', 'balkon', 'deck', [[1.5, -1.6], [4.5, -1.6], [4.5, 0], [1.5, 0]], { outdoor: true }),
  ];
  const op = (type, room, at, w, extra = {}) => { const b = nearestEdge(p, at, { room }); p.openings.push({ id: uid('o'), type, room: b.room, edge: b.edge, t: b.t, w: w ?? OPDEF[type].w, sill: OPDEF[type].sill ?? 0, h: OPDEF[type].h, flipHinge: false, flipSide: false, entity: '', ...extra }); };
  op('gdoor', 'wohnen', [3, 0], 1.8, { entity: 'cover.living_room' });
  op('window', 'wohnen', [0, 3.6], 1.2);
  op('window', 'schlafen', [8, 0], 1.6, { entity: 'cover.bedroom' });
  op('window', 'schlafen', [10, 2.2], 1.2);
  op('window', 'buero', [0, 6.2], 1.4);
  op('window', 'bad', [10, 6.2], 0.9, { sill: 1.2, h: 1.0 });
  op('door', 'wohnen', [4.6, 4.5], 0.9);
  op('door', 'schlafen', [6.5, 4.5], 0.85);
  op('door', 'buero', [3, 6.2], 0.85);
  op('door', 'bad', [7, 6.4], 0.85);
  op('front', 'flur', [5, 8], 1.0, { entity: 'lock.front_door' });
  const it = (kind, x, y, rot = 0, w, d, extra = {}) => p.items.push({ id: uid('i'), kind, x, y, rot, w: w ?? CAT[kind].w, d: d ?? CAT[kind].d, ...extra });
  it('tvunit', 0.34, 2.2, 270, 1.9, 0.42, { entity: 'media_player.living_room_tv' }); it('rug', 1.6, 2.2, 90, 2.6, 2.0); it('coffee', 1.45, 2.2, 90); it('sofa', 2.7, 2.2, 90, 2.4, 0.95);
  it('counter', 5.64, 1.45, 90, 2.4, 0.6, { sink: true, hob: true }); it('fridge', 5.61, 3.05, 90); it('dining', 4.1, 3.4, 0, 1.8, 0.9); it('plant', 0.45, 0.45);
  it('bed', 8, 1.2, 0); it('nightstand', 6.82, 0.36, 0); it('nightstand', 9.18, 0.36, 0); it('wardrobe', 6.36, 3.05, 270, 1.8, 0.6);
  it('desk', 0.48, 6.2, 270, 1.4, 0.7, { pc: true }); it('ochair', 1.15, 6.2, 90); it('shelf', 1.5, 7.69, 180, 1.4, 0.35); it('plant', 2.6, 7.55);
  it('shelf', 3.36, 5.6, 270, 1.2, 0.35); it('plant', 6.6, 7.5); it('rug', 5, 6.6, 0, 1.0, 1.8);
  it('bathtub', 8.5, 7.5, 180); it('toilet', 9.57, 5.3, 90); it('vanity', 8.4, 4.8, 0);
  it('lounger', 2.55, -0.8, 90); it('plant', 4.15, -1.25);
  const dv = (kind, x, y, name, entity) => p.devices.push({ id: uid('d'), kind, x, y, name, entity, h: kind === 'light' ? 2.1 : undefined });
  dv('light', 1.8, 2.2, T('Deckenleuchte', 'Ceiling light'), 'light.living_room'); dv('light', 4.1, 3.4, T('Esstisch', 'Dining table'), 'light.dining_table');
  dv('light', 8, 2.6, T('Deckenleuchte', 'Ceiling light'), 'light.bedroom'); dv('light', 1.6, 6.2, T('Deckenleuchte', 'Ceiling light'), 'light.office');
  dv('light', 5, 6.4, T('Flurlicht', 'Hallway light'), 'light.hallway'); dv('light', 8.5, 6.2, T('Deckenleuchte', 'Ceiling light'), 'light.bathroom');
  dv('light', 3, -0.9, T('Lichterkette', 'String lights'), 'light.balcony'); dv('sensor', 0.3, 4.2, T('Klima', 'Climate'), 'sensor.living_room_temperature');
  return p;
}
