/*! HomeBoo 3D Card | MIT License */
const HB_VERSION = '0.3.1';
const HB_SUPPORT_URL = 'https://paypal.me/sebagueven';
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
  return hbSortEnts(out, room.order);
}
/* Eigene Reihenfolge aus dem Editor; nicht einsortierte Geräte folgen in ihrer natürlichen Reihenfolge */
function hbSortEnts(list, order) {
  if (!order?.length) return list;
  const ix = new Map(order.map((e, i) => [e, i]));
  return list.map((c, i) => [c, ix.has(c.eid) ? ix.get(c.eid) : 1e6 + i]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
}
/* Farbskala für die Temperatur-Ansicht */
const HB_HEAT = [[16, [70, 130, 255]], [19, [40, 205, 235]], [21, [80, 220, 130]], [23, [250, 205, 40]], [26, [245, 80, 70]]];
function hbHeatColor(t) {
  if (t <= HB_HEAT[0][0]) return `rgb(${HB_HEAT[0][1].join(',')})`;
  for (let i = 0; i < HB_HEAT.length - 1; i++) { const [t0, c0] = HB_HEAT[i], [t1, c1] = HB_HEAT[i + 1]; if (t <= t1) { const f = (t - t0) / (t1 - t0); return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(',')})`; } }
  return `rgb(${HB_HEAT[HB_HEAT.length - 1][1].join(',')})`;
}

/* ---------- Plan ---------- */
function emptyPlan() { return { format: 'homeboo-plan', version: 1, name: T('Mein Zuhause', 'My home'), wallHeight: 2.55, rooms: [], openings: [], items: [], devices: [] }; }
function normalizePlan(p) {
  const e = emptyPlan();
  if (!p || typeof p !== 'object') return e;
  const out = { ...e, ...p };
  const strs = a => Array.isArray(a) ? [...new Set(a.filter(x => typeof x === 'string' && x.includes('.')))] : [];
  out.rooms = (Array.isArray(p.rooms) ? p.rooms : []).filter(r => Array.isArray(r.pts) && r.pts.length >= 3).map(r => ({ id: r.id || uid('r'), name: r.name || '', type: r.type || 'sonst', floor: FLOORS[r.floor] ? r.floor : 'ash', outdoor: !!r.outdoor, area: r.area || '', wall: /^#[0-9a-f]{6}$/i.test(r.wall || '') ? r.wall : '', hide: strs(r.hide), add: strs(r.add), order: strs(r.order), open: Array.isArray(r.open) ? r.open : [], pts: r.pts.map(q => [+q[0], +q[1]]) }));
  out.openings = (Array.isArray(p.openings) ? p.openings : []).filter(o => OPDEF[o.type]).map(o => ({ id: o.id || uid('o'), flipHinge: false, flipSide: false, entity: '', contact: '', sill: OPDEF[o.type].sill ?? 0, h: OPDEF[o.type].h, w: OPDEF[o.type].w, ...o }));
  out.items = (Array.isArray(p.items) ? p.items : []).filter(i => CAT[i.kind]).map(i => ({ id: i.id || uid('i'), rot: 0, w: CAT[i.kind].w, d: CAT[i.kind].d, ...i }));
  out.devices = (Array.isArray(p.devices) ? p.devices : []).filter(d => DEVDEF[d.kind]).map(d => ({ id: d.id || uid('d'), name: '', entity: '', ...d }));
  out.icons = Object.fromEntries(Object.entries(p.icons && typeof p.icons === 'object' ? p.icons : {}).filter(([k, v]) => k.includes('.') && typeof v === 'string' && v.length < 400000 && /^(data:image\/(png|jpeg|webp|gif|svg\+xml)[;,]|\/|https?:\/\/)/.test(v)));
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

/* =====================================================================
   3D-SZENE (braucht nur three.module.js – keine Zusatzmodule)
   ===================================================================== */
function hbMakeScene(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const BG = new THREE.Color('#080a13');
  scene.background = BG;
  scene.fog = new THREE.Fog(BG, 45, 110);

  /* Umgebungslicht aus einer kleinen Verlaufskugel */
  const pmrem = new THREE.PMREMGenerator(renderer);
  {
    const envS = new THREE.Scene(), g = new THREE.SphereGeometry(40, 24, 12), pa = g.attributes.position, cols = [];
    const lo = new THREE.Color('#1b2033'), hi = new THREE.Color('#e3e9f6');
    for (let i = 0; i < pa.count; i++) { const c = lo.clone().lerp(hi, clamp((pa.getY(i) / 40 + 0.3) / 1.3, 0, 1)); cols.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    envS.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(28, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 3), side: THREE.DoubleSide }));
    panel.position.set(-6, 34, 8); panel.lookAt(0, 0, 0); envS.add(panel);
    scene.environment = pmrem.fromScene(envS, 0.04).texture;
  }
  scene.environmentIntensity = 0.45;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 260);
  const hemi = new THREE.HemisphereLight('#d6e4ff', '#2a2340', 0.6); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff3e2', 2.2);
  sun.position.set(-10, 20, 12); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 });
  sun.shadow.camera.updateProjectionMatrix(); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025;
  scene.add(sun, sun.target);
  const root = new THREE.Group(); scene.add(root);

  /* Boden mit Raster und Leuchtring */
  const mkCanvasTex = (size, draw, meters, srgb = true) => {
    const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (meters) t.repeat.set(1 / meters, 1 / meters);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t;
  };
  const radial = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.55)'); g.addColorStop(0.7, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const gridTex = mkCanvasTex(512, (c, s) => { c.fillStyle = '#0b0e1b'; c.fillRect(0, 0, s, s); c.fillStyle = 'rgba(126,240,255,.07)'; for (let i = 0; i < 8; i++) { c.fillRect(i * s / 8, 0, 1.5, s); c.fillRect(0, i * s / 8, s, 1.5); } c.fillStyle = 'rgba(126,240,255,.14)'; c.fillRect(0, 0, 2.5, s); c.fillRect(0, 0, s, 2.5); }, 8);
  gridTex.repeat.set(30, 30);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, map: gridTex }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.3; ground.receiveShadow = true; scene.add(ground);
  const halo = new THREE.Mesh(new THREE.CircleGeometry(16, 64), new THREE.MeshBasicMaterial({ map: radial, color: '#3fd6ff', transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.rotation.x = -Math.PI / 2; halo.position.y = -0.29; scene.add(halo);

  /* Texturen & Materialien */
  let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  /* Eigener Zufall für Texturen, damit Möbel bei jedem Aufbau gleich aussehen */
  let tseed = 7; const trnd = () => { tseed = (tseed * 16807) % 2147483647; return (tseed - 1) / 2147483646; };
  function planks(ctx, s, { h, sat, light, vary = 7, rows = 8, gapA = 0.32 }) {
    const rh = s / rows;
    for (let r = 0; r < rows; r++) {
      let x = trnd() * s; const st = x;
      while (x < st + s) {
        const ln = s * (0.32 + trnd() * 0.42), col = `hsl(${h + (trnd() - .5) * 6},${sat + (trnd() - .5) * 6}%,${light + (trnd() - .5) * vary}%)`;
        for (const ox of [0, -s]) {
          ctx.fillStyle = col; ctx.fillRect(x + ox, r * rh, ln, rh);
          for (let k = 0; k < 8; k++) { ctx.strokeStyle = `rgba(30,16,6,${0.03 + trnd() * 0.06})`; ctx.lineWidth = 0.6 + trnd(); ctx.beginPath(); const y0 = r * rh + trnd() * rh; ctx.moveTo(x + ox, y0); ctx.bezierCurveTo(x + ox + ln * .3, y0 + (trnd() - .5) * rh * .3, x + ox + ln * .7, y0 + (trnd() - .5) * rh * .3, x + ox + ln, y0 + (trnd() - .5) * rh * .2); ctx.stroke(); }
          ctx.fillStyle = `rgba(20,10,4,${gapA})`; ctx.fillRect(x + ox, r * rh, 2, rh);
        }
        x += ln;
      }
      ctx.fillStyle = `rgba(20,10,4,${gapA})`; ctx.fillRect(0, r * rh, s, 2);
    }
  }
  function tiles(ctx, s, { n, h, sat, light, grout }) { const ts = s / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { ctx.fillStyle = `hsl(${h},${sat}%,${light + (trnd() - .5) * 4}%)`; ctx.fillRect(i * ts, j * ts, ts, ts); for (let k = 0; k < ts; k++) { ctx.fillStyle = `rgba(255,255,255,${0.04 * trnd()})`; ctx.fillRect(i * ts + trnd() * ts, j * ts + trnd() * ts, 1.5, 1.5); } } ctx.fillStyle = grout; for (let i = 0; i <= n; i++) { ctx.fillRect(i * ts - 1.5, 0, 3, s); ctx.fillRect(0, i * ts - 1.5, s, 3); } }
  function herring(ctx, s, { h, sat, light }) {
    const cols = 8, cw = s / cols, ph = cw / 2;
    ctx.strokeStyle = 'rgba(20,10,4,.34)'; ctx.lineWidth = 1.5;
    for (let c = 0; c < cols; c++) {
      const x0 = c * cw, dy = c % 2 ? cw : -cw;
      for (let k = -4; k < s / ph + 4; k++) {
        const y = k * ph; ctx.fillStyle = `hsl(${h + (trnd() - .5) * 6},${sat + (trnd() - .5) * 6}%,${light + (trnd() - .5) * 8}%)`;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + cw, y + dy); ctx.lineTo(x0 + cw, y + dy + ph); ctx.lineTo(x0, y + ph); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    }
  }
  function speckle(ctx, s, base, n, a) { ctx.fillStyle = base; ctx.fillRect(0, 0, s, s); for (let i = 0; i < n; i++) { ctx.fillStyle = `rgba(${trnd() > .5 ? '255,255,255' : '0,0,0'},${a * (0.4 + trnd())})`; const z = 1 + trnd() * 2; ctx.fillRect(trnd() * s, trnd() * s, z, z); } }
  const std = (color, roughness = 0.8, metalness = 0, ex = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...ex });
  const tex = (size, draw, m) => ({ map: mkCanvasTex(size, draw, m) });
  const FLOORDEF = {
    oak: () => std('#fff', 0.72, 0, tex(1024, (c, s) => planks(c, s, { h: 28, sat: 42, light: 42 }), 2.4)),
    ash: () => std('#fff', 0.72, 0, tex(1024, (c, s) => planks(c, s, { h: 32, sat: 30, light: 56, vary: 6 }), 2.4)),
    walnut: () => std('#fff', 0.66, 0, tex(1024, (c, s) => planks(c, s, { h: 22, sat: 34, light: 27, vary: 6 }), 2.4)),
    white: () => std('#fff', 0.74, 0, tex(1024, (c, s) => planks(c, s, { h: 36, sat: 14, light: 76, vary: 5, gapA: 0.2 }), 2.4)),
    herring: () => std('#fff', 0.68, 0, tex(1024, (c, s) => herring(c, s, { h: 30, sat: 40, light: 44 }), 2.0)),
    deck: () => std('#fff', 0.8, 0, tex(512, (c, s) => planks(c, s, { h: 26, sat: 36, light: 47, rows: 6, gapA: 0.6 }), 1.6)),
    slate: () => std('#fff', 0.55, 0, tex(512, (c, s) => tiles(c, s, { n: 2, h: 222, sat: 10, light: 17, grout: 'rgba(160,170,200,.12)' }), 1.2)),
    tile: () => std('#fff', 0.4, 0, tex(512, (c, s) => tiles(c, s, { n: 4, h: 220, sat: 8, light: 24, grout: 'rgba(210,215,230,.16)' }), 1.0)),
    tileL: () => std('#fff', 0.35, 0, tex(512, (c, s) => tiles(c, s, { n: 2, h: 40, sat: 6, light: 78, grout: 'rgba(110,110,115,.35)' }), 1.2)),
    marble: () => std('#fff', 0.22, 0, tex(1024, (c, s) => { tiles(c, s, { n: 2, h: 40, sat: 5, light: 87, grout: 'rgba(120,115,110,.3)' }); for (let i = 0; i < 30; i++) { c.strokeStyle = `rgba(105,100,112,${0.07 + trnd() * 0.16})`; c.lineWidth = 0.6 + trnd() * 2; c.beginPath(); let x = trnd() * s, y = trnd() * s; c.moveTo(x, y); for (let k = 0; k < 7; k++) { x += (trnd() - .3) * s * .16; y += (trnd() - .5) * s * .12; c.lineTo(x, y); } c.stroke(); } }, 1.6)),
    terracotta: () => std('#fff', 0.8, 0, tex(512, (c, s) => tiles(c, s, { n: 4, h: 18, sat: 46, light: 42, grout: 'rgba(225,212,195,.4)' }), 1.2)),
    concrete: () => std('#fff', 0.85, 0, tex(512, (c, s) => { speckle(c, s, '#80838a', 9000, 0.05); for (let i = 0; i < 14; i++) { const x = trnd() * s, y = trnd() * s, g = c.createRadialGradient(x, y, 0, x, y, s * (0.1 + trnd() * 0.2)); g.addColorStop(0, `rgba(${trnd() > .5 ? '255,255,255' : '20,20,25'},.07)`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, s, s); } }, 2.6)),
    carpet: () => std('#5a566e', 1),
    carpetL: () => std('#fff', 1, 0, tex(256, (c, s) => speckle(c, s, '#b9ae9c', 6000, 0.06), 0.6)),
    stone: () => std('#fff', 0.9, 0, tex(512, (c, s) => tiles(c, s, { n: 3, h: 35, sat: 5, light: 50, grout: 'rgba(25,25,25,.5)' }), 1.8)),
    grass: () => std('#fff', 1, 0, tex(512, (c, s) => { c.fillStyle = '#3f6b34'; c.fillRect(0, 0, s, s); for (let i = 0; i < 8000; i++) { c.strokeStyle = `rgba(${40 + trnd() * 40},${90 + trnd() * 70},${30 + trnd() * 30},.75)`; c.lineWidth = 1; const x = trnd() * s, y = trnd() * s; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (trnd() - .5) * 4, y - 3 - trnd() * 5); c.stroke(); } }, 1.4)),
  };
  const floorCache = new Map();
  const floorMat = k => { if (!FLOORDEF[k]) k = 'ash'; if (!floorCache.has(k)) floorCache.set(k, FLOORDEF[k]()); return floorCache.get(k); };
  const M = {
    wall: std('#ecebe7', 0.92), wallTop: std('#1c2032', 0.75), slab: std('#141a2c', 0.9),
    glass: std('#cde9ff', 0.05, 0.1, { transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }),
    frame: std('#2a2f3d', 0.5, 0.3), shutter: std('#394054', 0.55, 0.35), door: std('#efede8', 0.6), front: std('#3c2a20', 0.55), steel: std('#c3c8d0', 0.32, 0.75), black: std('#1a1c22', 0.45), white: std('#f1f0ec', 0.5), ceramic: std('#f8f8f6', 0.16),
    cabinet: std('#2c3140', 0.5), stone: std('#d9d6cf', 0.35), oak: std('#b88a5e', 0.65), walnut: std('#6a4a33', 0.6), oakL: std('#cba57a', 0.6),
    rose: std('#9d7c79', 0.97), slate: std('#55617f', 0.97), sand: std('#c4b3a1', 0.97), charcoal: std('#3a3d46', 0.97), cushion: std('#e6dccd', 0.98), linen: std('#eeeae3', 0.95), throwA: std('#7b8fae', 0.98), throwB: std('#b9806a', 0.98),
    leaf: std('#4c8546', 0.75, 0, { flatShading: true }), leaf2: std('#6aa257', 0.75, 0, { flatShading: true }), pot: std('#d8d2c8', 0.8), terracotta: std('#b46c4b', 0.85), mirror: std('#d9e6f2', 0.03, 0.95), water: std('#9fd7e8', 0.08, 0, { transparent: true, opacity: 0.75 }), teak: std('#9a6b44', 0.7), seam: std('#151821', 0.6), rug: std('#3e4560', 1),
    books: ['#a85b4f', '#3f6c8a', '#c8a256', '#55745a', '#7a5c8f', '#d9d2c4'].map(c => std(c, 0.8)),
    sensor: std('#1b2033', 0.4, 0, { emissive: '#7ef0ff', emissiveIntensity: 1.2 }),
    gloss: std('#0d0e12', 0.18, 0.1), canvas: std('#e8dcc6', 0.95, 0, { side: THREE.DoubleSide }),
  };
  const WALLM = [M.wall, M.wall, M.wallTop, M.wall, M.wall, M.wall];
  /* Wandfarben: Innenseite pro Raum */
  const wallMats = new Map(), wallArrs = new Map();
  const wallMat = c => { if (!c) return M.wall; if (!wallMats.has(c)) wallMats.set(c, std(c, 0.92)); return wallMats.get(c); };
  const wallArr = (a, b) => { const k = a.uuid + b.uuid; if (!wallArrs.has(k)) wallArrs.set(k, [M.wall, M.wall, M.wallTop, M.wall, a, b]); return wallArrs.get(k); };
  const FIRETEX = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 9; i++) { const cx = 30 + i * 25 + Math.sin(i * 7) * 8, hg = 62 + (i % 3) * 20, g = x.createRadialGradient(cx, 120, 2, cx, 120 - hg * 0.4, hg * 0.75); g.addColorStop(0, 'rgba(255,240,180,1)'); g.addColorStop(0.35, 'rgba(255,150,40,.9)'); g.addColorStop(1, 'rgba(255,60,0,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(cx - 18, 126); x.quadraticCurveTo(cx - 14, 120 - hg * 0.5, cx, 120 - hg); x.quadraticCurveTo(cx + 14, 120 - hg * 0.5, cx + 18, 126); x.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const own = m => { m.userData.own = true; return m; };
  /* Unsichtbare Trefferflächen, damit kleine Geräte gut anzutippen sind */
  const HITM = new THREE.MeshBasicMaterial({ visible: false });
  const hitProxy = (geo, key) => { const m = new THREE.Mesh(geo, HITM); m.userData.hitKey = key; return m; };
  const RINGTEX = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.strokeStyle = '#fff'; x.shadowColor = '#fff'; x.shadowBlur = 14; x.lineWidth = 7; x.beginPath(); x.arc(64, 64, 46, 0, Math.PI * 2); x.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const pings = [];

  /* Abgerundete Quader (eigene Umsetzung, Geometrien werden geteilt) */
  const rbCache = new Map();
  function rbGeo(w, h, d, r) {
    r = Math.max(0.002, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
    const key = [w, h, d, r].map(v => v.toFixed(3)).join('|');
    if (rbCache.has(key)) return rbCache.get(key);
    const n = 7, g = new THREE.BoxGeometry(1, 1, 1, n, n, n), pos = g.attributes.position, nor = g.attributes.normal;
    const half = [w / 2 - r, h / 2 - r, d / 2 - r], inner = 0.5 / n, p = [0, 0, 0], c = [0, 0, 0];
    for (let i = 0; i < pos.count; i++) {
      const v = [pos.getX(i), pos.getY(i), pos.getZ(i)];
      for (let k = 0; k < 3; k++) {
        const s = v[k] < 0 ? -1 : 1, a = Math.abs(v[k]);
        if (a <= inner + 1e-6) { p[k] = (v[k] / inner) * half[k]; c[k] = p[k]; }
        else { const f = (a - inner) / (0.5 - inner); p[k] = s * (half[k] + f * r); c[k] = s * half[k]; }
      }
      const dx = p[0] - c[0], dy = p[1] - c[1], dz = p[2] - c[2], L = Math.hypot(dx, dy, dz) || 1, k2 = r / L;
      pos.setXYZ(i, c[0] + dx * k2, c[1] + dy * k2, c[2] + dz * k2); nor.setXYZ(i, dx / L, dy / L, dz / L);
    }
    g.computeBoundingSphere(); g.userData.shared = true; rbCache.set(key, g); return g;
  }
  const sh = m => { m.castShadow = true; m.receiveShadow = true; return m; };
  const rb = (w, h, d, mat, r = 0.025) => sh(new THREE.Mesh(rbGeo(Math.max(w, 0.01), Math.max(h, 0.01), Math.max(d, 0.01), r), mat));
  const bx = (w, h, d, mat) => sh(new THREE.Mesh(new THREE.BoxGeometry(Math.max(w, 0.001), Math.max(h, 0.001), Math.max(d, 0.001)), mat));
  const cyl = (a, b, h, mat, seg = 18) => sh(new THREE.Mesh(new THREE.CylinderGeometry(a, b, h, seg), mat));
  const sph = (r, mat, a = 18, b = 12) => sh(new THREE.Mesh(new THREE.SphereGeometry(r, a, b), mat));
  const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); if (ry) o.rotation.y = ry; return o; };
  const grp = (...k) => { const g = new THREE.Group(); k.forEach(c => g.add(c)); return g; };

  /* Möbel – Vorderseite zeigt in lokale +z-Richtung */
  function sofa(w, d, mat) {
    const g = grp(at(rb(w, 0.22, d, mat, 0.04), 0, 0.2, 0)); const n = w > 1.7 ? 3 : w > 1.15 ? 2 : 1, cw = (w - 0.34) / n;
    for (let i = 0; i < n; i++) g.add(at(rb(cw - 0.02, 0.14, d - 0.26, mat, 0.05), -w / 2 + 0.17 + cw * (i + 0.5), 0.38, 0.08));
    g.add(at(rb(w, 0.44, 0.22, mat, 0.06), 0, 0.53, -d / 2 + 0.11), at(rb(0.17, 0.32, d, mat, 0.06), -w / 2 + 0.085, 0.42, 0), at(rb(0.17, 0.32, d, mat, 0.06), w / 2 - 0.085, 0.42, 0));
    if (w > 1.2) for (const sx of [-1, 1]) { const p = at(rb(0.42, 0.36, 0.12, M.cushion, 0.05), sx * (w / 2 - 0.45), 0.62, -d / 2 + 0.3); p.rotation.x = -0.25; g.add(p); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(cyl(0.025, 0.02, 0.1, M.black, 8), sx * (w / 2 - 0.08), 0.05, sz * (d / 2 - 0.08)));
    return g;
  }
  const rectTable = (l, w, h, top) => { const g = grp(at(rb(l, 0.045, w, top, 0.01), 0, h, 0)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(bx(0.05, h, 0.05, M.black), sx * (l / 2 - 0.08), h / 2, sz * (w / 2 - 0.08))); return g; };
  const roundTable = (r, h) => grp(at(cyl(r, r, 0.04, M.oakL, 36), 0, h, 0), at(cyl(0.04, 0.05, h, M.black, 12), 0, h / 2, 0), at(cyl(0.22, 0.24, 0.02, M.black, 24), 0, 0.01, 0));
  function chair(mat = M.sand) { const g = grp(at(rb(0.44, 0.05, 0.44, mat, 0.02), 0, 0.46, 0)); const b = at(rb(0.44, 0.38, 0.035, mat, 0.015), 0, 0.7, -0.2); b.rotation.x = -0.1; g.add(b); for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(cyl(0.014, 0.014, 0.45, M.black, 6), sx * 0.19, 0.225, sz * 0.19)); return g; }
  function bed(w, l, duvet) { const g = grp(at(rb(w + 0.08, 0.28, l + 0.06, M.walnut, 0.03), 0, 0.14, 0), at(rb(w, 0.2, l, M.linen, 0.06), 0, 0.38, 0), at(rb(w + 0.06, 0.08, l * 0.66, duvet, 0.04), 0, 0.5, l * 0.17), at(rb(w + 0.1, 0.085, 0.42, M.throwB, 0.03), 0, 0.53, l / 2 - 0.34)); const n = w > 1.2 ? 2 : 1; for (let i = 0; i < n; i++) g.add(at(rb(w / n - 0.14, 0.13, 0.44, M.linen, 0.06), -w / 2 + (w / n) * (i + 0.5), 0.55, -l / 2 + 0.32)); g.add(at(rb(w + 0.22, 0.95, 0.09, M.slate, 0.04), 0, 0.6, -l / 2 - 0.045)); return g; }
  function wardrobe(w, d) { const g = grp(at(rb(w, 2.15, d, M.white, 0.015), 0, 1.075, 0)); const n = Math.max(2, Math.round(w / 0.6)); for (let i = 1; i < n; i++) g.add(at(bx(0.008, 2.05, 0.01, M.seam), -w / 2 + i * w / n, 1.075, d / 2 + 0.002)); for (let i = 0; i < n; i++) g.add(at(bx(0.015, 0.3, 0.025, M.steel), -w / 2 + (i + (i % 2 ? 0.12 : 0.88)) * w / n, 1.05, d / 2 + 0.012)); return g; }
  function shelf(w, h, d) { const g = new THREE.Group(); for (const sx of [-1, 1]) g.add(at(bx(0.025, h, d, M.oak), sx * (w / 2 - 0.0125), h / 2, 0)); const n = Math.max(2, Math.round(h / 0.4)); for (let i = 0; i <= n; i++) { const y = 0.02 + i * (h - 0.04) / n; g.add(at(bx(w, 0.025, d, M.oak), 0, y, 0)); if (i < n) { let x = -w / 2 + 0.05; while (x < w / 2 - 0.12) { const bw = 0.03 + rnd() * 0.04, bh = 0.18 + rnd() * 0.12; if (rnd() > 0.2) g.add(at(bx(bw, bh, d * 0.75, M.books[Math.floor(rnd() * M.books.length)]), x + bw / 2, y + 0.0125 + bh / 2, 0)); x += bw + 0.005 + (rnd() > 0.85 ? 0.08 : 0); } } } return g; }
  function kitchenRun(len, d, sink, hob) {
    const g = grp(at(rb(len, 0.82, d, M.cabinet, 0.01), 0, 0.47, 0), at(bx(len + 0.02, 0.04, d + 0.03, M.stone), 0, 0.9, 0.01));
    const n = Math.max(1, Math.round(len / 0.6)); for (let i = 1; i < n; i++) g.add(at(bx(0.006, 0.76, 0.006, M.seam), -len / 2 + i * len / n, 0.48, d / 2 + 0.002));
    if (sink) g.add(at(bx(0.56, 0.012, 0.42, M.steel), hob ? -len / 4 : 0, 0.922, 0.02), at(cyl(0.015, 0.015, 0.3, M.steel, 8), hob ? -len / 4 : 0, 1.07, -d / 2 + 0.1));
    if (hob) { const hx = sink ? len / 4 : 0; g.add(at(bx(0.6, 0.008, 0.52, M.black), hx, 0.924, 0.01)); for (const [ox, oz] of [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.004, 6, 28), M.seam); ring.rotation.x = Math.PI / 2; ring.position.set(hx + ox, 0.93, 0.01 + oz); g.add(ring); } }
    return g;
  }
  function plant(s, big) { const g = grp(at(cyl(0.17 * s, 0.13 * s, 0.34 * s, big ? M.terracotta : M.pot, 16), 0, 0.17 * s, 0)); const n = big ? 10 : 7; for (let i = 0; i < n; i++) { const m = sh(new THREE.Mesh(new THREE.IcosahedronGeometry(0.17 * s, 0), i % 2 ? M.leaf : M.leaf2)); const a = rnd() * Math.PI * 2, rr = rnd() * 0.17 * s; m.position.set(Math.cos(a) * rr, (0.45 + rnd() * (big ? 0.85 : 0.45)) * s, Math.sin(a) * rr); m.scale.set(1, 1.7 + rnd(), 1); m.rotation.set(rnd() * .6, rnd() * 3, rnd() * .6); g.add(m); } return g; }
  function rug(w, d) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M.rug); m.rotation.x = -Math.PI / 2; m.position.y = 0.008; m.receiveShadow = true; return grp(m); }
  function desk(w, d, pc, screenMat) { const g = grp(at(rb(w, 0.04, d, M.oakL, 0.01), 0, 0.74, 0)); for (const sx of [-1, 1]) g.add(at(bx(0.04, 0.72, d - 0.06, M.black), sx * (w / 2 - 0.05), 0.36, 0)); if (pc) for (const x of [-0.32, 0.32]) { g.add(at(bx(0.6, 0.36, 0.03, M.black), x, 1.08, -d / 2 + 0.16)); if (screenMat) { const s = new THREE.Mesh(new THREE.PlaneGeometry(0.57, 0.33), screenMat); s.position.set(x, 1.08, -d / 2 + 0.176); g.add(s); } } return g; }
  function officeChair() { const g = grp(at(rb(0.5, 0.08, 0.48, M.charcoal, 0.03), 0, 0.48, 0), at(rb(0.46, 0.56, 0.06, M.charcoal, 0.03), 0, 0.84, -0.22), at(cyl(0.025, 0.025, 0.36, M.steel, 8), 0, 0.27, 0)); for (let i = 0; i < 5; i++) { const s = bx(0.3, 0.03, 0.04, M.black); s.geometry.translate(0.15, 0, 0); s.position.y = 0.05; s.rotation.y = i * Math.PI * 0.4; g.add(s); } return g; }
  function bathtub(l, w) { return grp(at(rb(l, 0.55, w, M.ceramic, 0.09), 0, 0.275, 0), at(rb(l - 0.16, 0.02, w - 0.16, M.water, 0.008), 0, 0.5, 0)); }
  function shower(w, d) { return grp(at(rb(w, 0.05, d, M.ceramic, 0.02), 0, 0.025, 0), at(new THREE.Mesh(new THREE.BoxGeometry(w, 1.95, 0.012), M.glass), 0, 1.0, d / 2), at(new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.95, d), M.glass), -w / 2, 1.0, 0), at(cyl(0.11, 0.11, 0.015, M.steel, 20), w / 4, 2.05, -d / 4)); }
  const toilet = () => grp(at(rb(0.38, 0.38, 0.52, M.ceramic, 0.12), 0, 0.2, 0.06), at(rb(0.38, 0.34, 0.16, M.ceramic, 0.04), 0, 0.55, -0.2), at(rb(0.37, 0.03, 0.44, M.white, 0.012), 0, 0.405, 0.08));
  const vanity = (w, d) => grp(at(rb(w, 0.42, d, M.oak, 0.015), 0, 0.64, 0), at(rb(w * 0.6, 0.11, d * 0.8, M.ceramic, 0.04), 0, 0.9, 0.01), at(cyl(0.012, 0.012, 0.18, M.steel, 8), 0, 1.02, -d / 2 + 0.05), at(bx(w * 0.92, 0.72, 0.02, M.mirror), 0, 1.5, -d / 2 + 0.01));
  function lounger(w, l) { const g = grp(at(rb(w, 0.1, l, M.teak, 0.02), 0, 0.3, 0), at(rb(w - 0.06, 0.08, l * 0.65, M.cushion, 0.03), 0, 0.39, l * 0.15)); const b = at(rb(w - 0.06, 0.08, l * 0.33, M.cushion, 0.03), 0, 0.58, -l * 0.36); b.rotation.x = 0.8; g.add(b); for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(bx(0.04, 0.26, 0.04, M.teak), sx * (w / 2 - 0.05), 0.13, sz * (l / 2 - 0.1))); return g; }
  function dining(w, d) { const g = grp(rectTable(w, d, 0.75, M.walnut)); const n = Math.max(1, Math.floor((w - 0.2) / 0.65)); for (let i = 0; i < n; i++) { const x = -w / 2 + w * (i + 0.5) / n; g.add(at(chair(), x, 0, -d / 2 - 0.28), at(chair(), x, 0, d / 2 + 0.28, Math.PI)); } if (w > 1.4) g.add(at(chair(), -w / 2 - 0.3, 0, 0, Math.PI / 2), at(chair(), w / 2 + 0.3, 0, 0, -Math.PI / 2)); return g; }
  function sectional(w, d, mat) {
    const sd = 0.95, g = new THREE.Group(), main = sofa(w, sd, mat); main.position.z = -d / 2 + sd / 2; g.add(main);
    const cl = d - sd + 0.02, cx = w / 2 - sd / 2, cz = -d / 2 + sd + cl / 2 - 0.02;
    g.add(at(rb(sd, 0.22, cl, mat, 0.04), cx, 0.2, cz), at(rb(sd - 0.2, 0.14, cl - 0.04, mat, 0.05), cx - 0.08, 0.38, cz), at(rb(0.17, 0.32, cl, mat, 0.06), w / 2 - 0.085, 0.42, cz));
    for (const sz of [-1, 1]) g.add(at(cyl(0.025, 0.02, 0.1, M.black, 8), w / 2 - 0.08, 0.05, cz + sz * (cl / 2 - 0.08)), at(cyl(0.025, 0.02, 0.1, M.black, 8), w / 2 - sd + 0.08, 0.05, cz + sz * (cl / 2 - 0.08)));
    return g;
  }
  function sideboard(w, d) {
    const g = grp(at(rb(w, 0.62, d, M.walnut, 0.015), 0, 0.47, 0)); const n = Math.max(2, Math.round(w / 0.45));
    for (let i = 1; i < n; i++) g.add(at(bx(0.006, 0.56, 0.006, M.seam), -w / 2 + i * w / n, 0.47, d / 2 + 0.002));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(cyl(0.015, 0.012, 0.16, M.black, 6), sx * (w / 2 - 0.06), 0.08, sz * (d / 2 - 0.06)));
    g.add(at(cyl(0.06, 0.08, 0.28, M.terracotta, 14), w * 0.3, 0.92, 0), at(bx(Math.min(0.5, w * 0.3), 0.34, 0.02, M.black), -w * 0.22, 0.95, -d / 2 + 0.05));
    return g;
  }
  function fireplace(w, d, fm) {
    const g = grp(at(rb(w, 1.05, d, M.stone, 0.02), 0, 0.525, 0), at(rb(w + 0.1, 0.05, d + 0.06, M.stone, 0.01), 0, 1.075, 0.02));
    const fw = w * 0.62, fh = 0.5; g.add(at(bx(fw, fh, 0.02, M.black), 0, 0.42, d / 2 - 0.004));
    const flame = new THREE.Mesh(new THREE.PlaneGeometry(fw - 0.08, fh - 0.1), fm); flame.position.set(0, 0.41, d / 2 + 0.012); g.add(flame);
    for (let i = 0; i < 3; i++) { const lg = cyl(0.035, 0.035, fw * 0.5, M.walnut, 8); lg.rotation.z = Math.PI / 2; lg.position.set((i - 1) * 0.06, 0.21 + (i % 2) * 0.05, d / 2 + 0.03); g.add(lg); }
    return g;
  }
  function piano(w, d) {
    const g = grp(at(rb(w, 1.25, d * 0.55, M.gloss, 0.02), 0, 0.625, -d / 2 + d * 0.275), at(rb(w, 0.08, d * 0.45, M.gloss, 0.01), 0, 0.72, d / 2 - d * 0.225), at(bx(w - 0.12, 0.015, d * 0.3, M.white), 0, 0.77, d / 2 - d * 0.2));
    const nk = Math.floor((w - 0.14) / 0.045); for (let i = 0; i < nk; i++) if ([1, 2, 4, 5, 6].includes(i % 7)) g.add(at(bx(0.012, 0.012, d * 0.16, M.gloss), -w / 2 + 0.07 + i * 0.045, 0.783, d / 2 - d * 0.27));
    for (const sx of [-1, 1]) g.add(at(bx(0.06, 0.68, 0.06, M.gloss), sx * (w / 2 - 0.05), 0.34, d / 2 - 0.05));
    g.add(at(rb(0.8, 0.06, 0.34, M.gloss, 0.015), 0, 0.48, d / 2 + 0.32)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(bx(0.04, 0.45, 0.04, M.gloss), sx * 0.34, 0.225, d / 2 + 0.32 + sz * 0.13));
    return g;
  }
  function dresser(w, d) {
    const g = grp(at(rb(w, 0.82, d, M.white, 0.015), 0, 0.49, 0));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(cyl(0.015, 0.012, 0.08, M.oak, 6), sx * (w / 2 - 0.06), 0.04, sz * (d / 2 - 0.06)));
    for (let i = 1; i < 3; i++) g.add(at(bx(w - 0.04, 0.006, 0.006, M.seam), 0, 0.08 + i * 0.27, d / 2 + 0.002));
    for (let i = 0; i < 3; i++) g.add(at(bx(0.16, 0.018, 0.02, M.steel), 0, 0.22 + i * 0.27, d / 2 + 0.012));
    g.add(at(cyl(0.05, 0.07, 0.2, M.white, 12), -w * 0.3, 1.0, 0), at(cyl(0.1, 0.13, 0.15, M.linen, 18), -w * 0.3, 1.17, 0), at(sph(0.08, M.leaf2, 8, 6), w * 0.28, 0.97, 0));
    return g;
  }
  function crib(w, l) {
    const H = 0.9, g = grp(at(rb(w - 0.06, 0.12, l - 0.06, M.linen, 0.04), 0, 0.36, 0), at(rb(w - 0.1, 0.03, l * 0.5, M.throwA, 0.015), 0, 0.435, l * 0.15));
    for (const y of [0.3, H]) { for (const sx of [-1, 1]) g.add(at(bx(0.04, 0.04, l, M.white), sx * (w / 2 - 0.02), y, 0)); for (const sz of [-1, 1]) g.add(at(bx(w, 0.04, 0.04, M.white), 0, y, sz * (l / 2 - 0.02))); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(at(bx(0.05, H + 0.02, 0.05, M.white), sx * (w / 2 - 0.025), (H + 0.02) / 2, sz * (l / 2 - 0.025)));
    const nb = Math.round(l / 0.1), nw = Math.round(w / 0.1), bh = H - 0.3;
    for (let i = 1; i < nb; i++) for (const sx of [-1, 1]) g.add(at(cyl(0.008, 0.008, bh, M.white, 5), sx * (w / 2 - 0.02), 0.3 + bh / 2, -l / 2 + i * l / nb));
    for (let i = 1; i < nw; i++) for (const sz of [-1, 1]) g.add(at(cyl(0.008, 0.008, bh, M.white, 5), -w / 2 + i * w / nw, 0.3 + bh / 2, sz * (l / 2 - 0.02)));
    return g;
  }
  function island(w, d) {
    const g = grp(at(rb(w, 0.84, d, M.cabinet, 0.01), 0, 0.46, 0), at(bx(w + 0.08, 0.045, d + 0.1, M.stone), 0, 0.905, 0));
    const n = Math.max(1, Math.round(w / 0.6)); for (let i = 1; i < n; i++) for (const sz of [-1, 1]) g.add(at(bx(0.006, 0.76, 0.006, M.seam), -w / 2 + i * w / n, 0.48, sz * (d / 2 + 0.002)));
    g.add(at(cyl(0.14, 0.09, 0.07, M.white, 18), -w * 0.22, 0.962, 0)); for (let i = 0; i < 4; i++) g.add(at(sph(0.04, i % 2 ? M.terracotta : M.leaf2, 10, 8), -w * 0.22 + Math.cos(i * 1.6) * 0.06, 1.0, Math.sin(i * 1.6) * 0.06));
    return g;
  }
  function tallunit(w, d) {
    const glow = own(std('#20130c', 0.2, 0, { emissive: '#ff8a3a', emissiveIntensity: 0.18 }));
    const g = grp(at(rb(w, 2.1, d, M.cabinet, 0.01), 0, 1.05, 0), at(bx(w - 0.06, 0.58, 0.02, M.black), 0, 1.0, d / 2 + 0.002), at(bx(w - 0.18, 0.3, 0.01, glow), 0, 0.97, d / 2 + 0.013), at(bx(w - 0.12, 0.02, 0.03, M.steel), 0, 1.24, d / 2 + 0.03), at(bx(w - 0.06, 0.36, 0.02, M.black), 0, 1.55, d / 2 + 0.002));
    for (const y of [0.62, 1.8]) g.add(at(bx(w - 0.04, 0.006, 0.006, M.seam), 0, y, d / 2 + 0.002));
    return g;
  }
  function cdesk(w, d, pc, screenMat) {
    const dp = 0.7, g = grp(at(rb(w, 0.04, dp, M.oakL, 0.01), 0, 0.74, -d / 2 + dp / 2), at(rb(dp, 0.04, d - dp + 0.02, M.oakL, 0.01), -w / 2 + dp / 2, 0.74, dp / 2 - 0.01));
    g.add(at(bx(0.04, 0.72, dp - 0.06, M.black), w / 2 - 0.05, 0.36, -d / 2 + dp / 2), at(bx(dp - 0.06, 0.72, 0.04, M.black), -w / 2 + dp / 2, 0.36, d / 2 - 0.05), at(bx(0.05, 0.72, 0.05, M.black), -w / 2 + 0.06, 0.36, -d / 2 + 0.06));
    if (pc) for (const [x, z, ry] of [[-w / 2 + dp + Math.max(0.3, (w - dp) * 0.35), -d / 2 + 0.16, 0], [-w / 2 + 0.16, -d / 2 + dp + Math.max(0.3, (d - dp) * 0.35), Math.PI / 2]]) {
      const m = grp(at(bx(0.6, 0.36, 0.03, M.black), 0, 1.08, 0)); if (screenMat) { const s = new THREE.Mesh(new THREE.PlaneGeometry(0.57, 0.33), screenMat); s.position.set(0, 1.08, 0.016); m.add(s); }
      m.position.set(x, 0, z); m.rotation.y = ry; g.add(m);
    }
    return g;
  }
  function dvanity(w, d) {
    const g = grp(at(rb(w, 0.42, d, M.oak, 0.015), 0, 0.64, 0), at(bx(w * 0.95, 0.72, 0.02, M.mirror), 0, 1.5, -d / 2 + 0.01));
    for (const sx of [-1, 1]) g.add(at(rb(Math.min(0.5, w * 0.32), 0.11, d * 0.75, M.ceramic, 0.04), sx * w / 4, 0.9, 0.01), at(cyl(0.012, 0.012, 0.18, M.steel, 8), sx * w / 4, 1.02, -d / 2 + 0.05));
    return g;
  }
  function appliance(it, dryer) {
    const w = it.w, d = it.d, o = grp(at(rb(w, 0.84, d, M.white, 0.03), 0, 0.42, 0));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(Math.min(w, 0.6) * 0.28, 0.025, 10, 32), dryer ? M.charcoal : M.steel); ring.position.set(0, 0.42, d / 2 + 0.005); o.add(ring);
    const dm = own(std('#111', 0.4, 0, { emissive: dryer ? '#ffc98a' : '#7ef0ff', emissiveIntensity: 0 })), drum = new THREE.Mesh(new THREE.TorusGeometry(Math.min(w, 0.6) * 0.18, 0.008, 6, 28, Math.PI * 1.4), dm);
    drum.position.set(0, 0.42, d / 2 + 0.01); o.add(drum); reg.drums.set(it.id, { mat: dm, drum, cur: 0, target: 0 }); return o;
  }
  function parasol(w) {
    const g = grp(at(cyl(0.025, 0.025, 2.35, M.steel, 10), 0, 1.175, 0), at(cyl(0.28, 0.32, 0.08, M.charcoal, 20), 0, 0.04, 0));
    const cone = sh(new THREE.Mesh(new THREE.ConeGeometry(w / 2, 0.45, 8, 1, true), M.canvas)); cone.position.y = 2.2; g.add(cone); return g;
  }
  function grill(w, d) {
    const g = grp(at(rb(w * 0.62, 0.7, d * 0.9, M.charcoal, 0.02), -w * 0.19, 0.37, 0), at(rb(w * 0.62, 0.22, d, M.black, 0.05), -w * 0.19, 0.84, 0), at(rb(w * 0.36, 0.03, d * 0.85, M.steel, 0.01), w * 0.31, 0.78, 0), at(bx(w * 0.4, 0.02, 0.03, M.steel), -w * 0.19, 0.9, d / 2 + 0.03));
    for (const sz of [-1, 1]) g.add(at(bx(0.03, 0.76, 0.03, M.steel), w * 0.45, 0.38, sz * d * 0.35));
    return g;
  }
  function gardenset(w, d) {
    const g = grp(rectTable(w, d, 0.74, M.teak)); const n = Math.max(1, Math.floor(w / 0.65));
    for (let i = 0; i < n; i++) { const x = -w / 2 + w * (i + 0.5) / n; g.add(at(chair(M.teak), x, 0, -d / 2 - 0.3), at(chair(M.teak), x, 0, d / 2 + 0.3, Math.PI)); }
    return g;
  }
  function screenTex(kind) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 288; const x = c.getContext('2d');
    if (kind === 'code') { x.fillStyle = '#0d1020'; x.fillRect(0, 0, 512, 288); const cols = ['#7ef0ff', '#c7a4ff', '#ffc98a', '#74e3a8', '#8a93c4']; let y = 18; while (y < 280) { let px = 18 + Math.floor(rnd() * 4) * 18; const n = 2 + Math.floor(rnd() * 4); for (let k = 0; k < n; k++) { const w = 20 + rnd() * 70; x.fillStyle = cols[Math.floor(rnd() * cols.length)]; x.fillRect(px, y, w, 7); px += w + 10; } y += 15; } }
    else { const g = x.createLinearGradient(0, 0, 512, 288); g.addColorStop(0, '#0b2a5a'); g.addColorStop(0.5, '#3a1d6e'); g.addColorStop(1, '#0d4b5a'); x.fillStyle = g; x.fillRect(0, 0, 512, 288); for (let i = 0; i < 6; i++) { const rg = x.createRadialGradient(rnd() * 512, rnd() * 288, 0, 256, 144, 220); rg.addColorStop(0, `rgba(${120 + rnd() * 130},${160 + rnd() * 90},255,.5)`); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(0, 0, 512, 288); } }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const TVTEX = screenTex('tv'), CODETEX = screenTex('code');
  function screenMat(tex) { return own(std('#05060a', 0.25, 0.2, { emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0 })); }

  /* ---------- Steuerung (eigene Orbit-Kamera) ---------- */
  const orbit = { target: new THREE.Vector3(), sph: new THREE.Spherical(28, 0.8, 0.3), vT: 0, vP: 0, vZ: 0, pan: new THREE.Vector3(), minR: 2.5, maxR: 90, minPhi: 0.06, maxPhi: 1.35, onUser: null, enabled: true };
  {
    const ptrs = new Map(); let last = null, pinchD = 0, mode = null;
    const panBy = (dx, dy) => {
      const k = orbit.sph.radius * 0.0016;
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
      const fwd = orbit.target.clone().sub(camera.position); fwd.y = 0; fwd.normalize();
      orbit.pan.addScaledVector(right, -dx * k).addScaledVector(fwd, dy * k);
    };
    canvas.addEventListener('pointerdown', e => {
      if (!orbit.enabled) return;
      canvas.setPointerCapture?.(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinchD = Math.hypot(a[0] - b[0], a[1] - b[1]); last = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; mode = 'pinch'; }
      else { mode = (e.button === 2 || e.shiftKey || e.ctrlKey) ? 'pan' : 'rot'; last = [e.clientX, e.clientY]; }
      orbit.onUser?.();
    });
    canvas.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId) || !orbit.enabled) return;
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (mode === 'pinch' && ptrs.size >= 2) {
        const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        if (d > 0 && pinchD > 0) orbit.sph.radius = clamp(orbit.sph.radius * pinchD / d, orbit.minR, orbit.maxR);
        pinchD = d; panBy(m[0] - last[0], m[1] - last[1]); last = m; return;
      }
      const dx = e.clientX - last[0], dy = e.clientY - last[1]; last = [e.clientX, e.clientY];
      if (mode === 'rot') { orbit.vT -= dx * 0.0052; orbit.vP -= dy * 0.0052; } else if (mode === 'pan') panBy(dx, dy);
    });
    const up = e => { ptrs.delete(e.pointerId); if (ptrs.size === 1) { mode = 'rot'; last = [...ptrs.values()][0]; } else if (!ptrs.size) mode = null; };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', e => { if (!orbit.enabled) return; e.preventDefault(); orbit.vZ += clamp(e.deltaY, -120, 120) * 0.0011; orbit.onUser?.(); }, { passive: false });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  }
  function orbitApply() { camera.position.setFromSpherical(orbit.sph).add(orbit.target); camera.lookAt(orbit.target); }
  function orbitStep() {
    orbit.sph.theta += orbit.vT; orbit.sph.phi = clamp(orbit.sph.phi + orbit.vP, orbit.minPhi, orbit.maxPhi);
    orbit.sph.radius = clamp(orbit.sph.radius * Math.exp(orbit.vZ), orbit.minR, orbit.maxR); orbit.target.add(orbit.pan);
    orbit.vT *= 0.82; orbit.vP *= 0.82; orbit.vZ *= 0.78; orbit.pan.multiplyScalar(0.78);
    orbitApply();
  }

  /* ---------- Aufbau aus dem Plan ---------- */
  let reg = null, ctr = [0, 0], nightCur = 0, nightTarget = 0, wallScale = 1, wallTarget = 1, tween = null;
  const wallGroup = new THREE.Group(), content = new THREE.Group(); root.add(wallGroup, content);
  const P3 = p => [p[0] - ctr[0], p[1] - ctr[1]];
  function shapeGeo(pts) { const s = new THREE.Shape(pts.map(p => { const q = P3(p); return new THREE.Vector2(q[0], -q[1]); })); const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); return g; }
  function offsetPoly(pts, d) {
    const n = pts.length, lines = [];
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], u = norm(sub(b, a)); let nn = [u[1], -u[0]]; const m = mul(add(a, b), 0.5); if (inPoly(pts, m[0] + nn[0] * 0.01, m[1] + nn[1] * 0.01)) nn = mul(nn, -1); lines.push({ p: add(a, mul(nn, d)), u }); }
    return lines.map((l1, i) => { const l0 = lines[(i - 1 + n) % n]; const den = cross(l0.u, l1.u); if (Math.abs(den) < 1e-6) return l1.p; const t = cross(sub(l1.p, l0.p), l1.u) / den; return add(l0.p, mul(l0.u, t)); });
  }
  function clear(g) { while (g.children.length) { const c = g.children.pop(); c.traverse(o => { if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); if (o.material?.userData?.own) o.material.dispose(); if (o.isLight) o.dispose?.(); }); } }
  function decal(poly, cx, cy, R) {
    const geo = shapeGeo(poly), pos = geo.attributes.position, uv = geo.attributes.uv, q = P3([cx, cy]);
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - q[0]) / (2 * R) + 0.5, (pos.getZ(i) - q[1]) / (2 * R) + 0.5);
    const m = new THREE.Mesh(geo, own(new THREE.MeshBasicMaterial({ map: radial, color: '#ffc78a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })));
    m.position.y = 0.012; m.renderOrder = 1; return m;
  }

  function buildWall(plan, pc, bo) {
    const H = pc.kind === 'rail' ? 0.42 : plan.wallHeight, t = pc.t, A = P3(pc.a), L = pc.L, u = pc.u;
    const g = new THREE.Group(); g.position.set(A[0], 0, A[1]); g.rotation.y = -Math.atan2(u[1], u[0]);
    /* Wandstücke an Raumgrenzen teilen, damit jede Seite die Wandfarbe ihres Raums bekommt */
    const nrm = [-u[1], u[0]], probe = t / 2 + 0.06, cuts = [];
    if (pc.kind !== 'rail') for (const r of plan.rooms) for (const q of r.pts) { const v = sub(q, pc.a); if (Math.abs(cross(u, v)) < 0.1) { const s = dot(u, v); if (s > 0.02 && s < L - 0.02) cuts.push(s); } }
    const sideMat = s => {
      const P = add(pc.a, mul(u, s)), rp = roomOfPoint(plan, P[0] + nrm[0] * probe, P[1] + nrm[1] * probe), rm = roomOfPoint(plan, P[0] - nrm[0] * probe, P[1] - nrm[1] * probe);
      return wallArr(rp && !rp.outdoor ? wallMat(rp.wall) : M.wall, rm && !rm.outdoor ? wallMat(rm.wall) : M.wall);
    };
    const piece = (x0, x1, y0, y1) => {
      if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return;
      const bps = [x0, ...cuts.filter(c => c > x0 + 0.01 && c < x1 - 0.01).sort((a, b) => a - b), x1], segs = [];
      for (let i = 0; i < bps.length - 1; i++) { const a = bps[i], b = bps[i + 1], mat = pc.kind === 'rail' ? WALLM : sideMat((a + b) / 2), last = segs[segs.length - 1]; if (last && last.mat === mat) last.b = b; else segs.push({ a, b, mat }); }
      for (const { a, b, mat } of segs) { const m = sh(new THREE.Mesh(new THREE.BoxGeometry(b - a, y1 - y0, t), mat)); m.position.set((a + b) / 2, (y0 + y1) / 2, 0); g.add(m); }
    };
    const glaz = (cx, w, y0, h, isDoor, o) => {
      const fr = 0.05, fz = t * 0.45, fm = o?.contact ? own(M.frame.clone()) : M.frame;
      g.add(at(bx(w, fr, fz, fm), cx, y0 + h - fr / 2, 0)); if (!isDoor) g.add(at(bx(w, fr, fz, fm), cx, y0 + fr / 2, 0)); g.add(at(bx(fr, h, fz, fm), cx - w / 2 + fr / 2, y0 + h / 2, 0), at(bx(fr, h, fz, fm), cx + w / 2 - fr / 2, y0 + h / 2, 0)); if (w > 1.05) g.add(at(bx(fr * 0.8, h, fz, fm), cx, y0 + h / 2, 0));
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(Math.max(0.05, w - fr * 2), Math.max(0.05, h - fr)), M.glass); gl.position.set(cx, y0 + h / 2, 0); g.add(gl); if (isDoor) g.add(at(bx(w, 0.02, t, M.frame), cx, 0.01, 0));
      if (o?.contact) { const am = own(new THREE.MeshBasicMaterial({ color: '#ffb25c', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); const ap = new THREE.Mesh(new THREE.PlaneGeometry(Math.max(0.05, w - 0.04), Math.max(0.05, h - 0.04)), am); ap.position.set(cx, y0 + h / 2, 0); ap.renderOrder = 4; g.add(ap); reg.contacts.set(o.id, { fm, am, cur: 0, target: 0 }); }
    };
    const ops = pc.ops.map(x => ({ ...x, s: clamp(x.c - x.w / 2, 0, L), e: clamp(x.c + x.w / 2, 0, L) })).sort((a, b) => a.s - b.s);
    let cur = -t / 2;
    for (const x of ops) {
      const o = x.o, w = x.e - x.s, cx = (x.s + x.e) / 2, h = Math.min(o.h, H - 0.05), op = openingPos(plan, o);
      if (o.entity || o.contact) { const y0 = o.type === 'window' ? Math.min(o.sill, H - 0.3) : 0, hh = o.type === 'window' ? Math.min(h, H - y0 - 0.05) : h, p = hitProxy(new THREE.BoxGeometry(Math.max(0.3, w), Math.max(0.3, hh + 0.2), t + 0.3), 'op:' + o.id); p.position.set(cx, y0 + hh / 2, 0); g.add(p); reg.hits.push(p); }
      piece(cur, x.s, 0, H);
      if (o.type === 'window') { const sill = Math.min(o.sill, H - 0.3), hh = Math.min(h, H - sill - 0.05); piece(x.s, x.e, 0, sill); piece(x.s, x.e, sill + hh, H); glaz(cx, w, sill, hh, false, o); addShutter(o, op, cx, w, sill + hh, hh); }
      else {
        piece(x.s, x.e, h, H);
        if (o.type === 'gdoor') { glaz(cx, w, 0, h, true, o); addShutter(o, op, cx, w, h, h); }
        else if (op) {
          const ns = o.flipSide ? mul(op.n, -1) : op.n, s = Math.sign(cross(u, ns)) || 1;
          const hingeEnd = o.flipHinge ? add(op.c, mul(op.u, o.w / 2)) : sub(op.c, mul(op.u, o.w / 2));
          const hx = clamp(dot(sub(hingeEnd, pc.a), u), x.s, x.e), dir = hx <= cx ? 1 : -1, lw = w - 0.04, openRot = -s * dir * 1.25;
          const pivot = new THREE.Group(); g.add(pivot);
          if (o.type === 'front') {
            const fm = o.contact ? own(M.front.clone()) : M.front;
            pivot.position.set(hx, 0, s * (t / 2 - 0.045)); pivot.add(at(bx(lw, h - 0.02, 0.07, fm), dir * lw / 2, (h - 0.02) / 2, 0));
            const led = own(std('#222', 0.4, 0, { emissive: '#7ef0ff', emissiveIntensity: 0.4 }));
            for (const z of [-0.05, 0.05]) pivot.add(at(bx(0.025, 0.3, 0.02, M.steel), dir * (lw - 0.1), 1.05, z), at(bx(0.03, 0.16, 0.012, led), dir * (lw - 0.1), 1.32, z * 1.05));
            reg.locks.set(o.id, { mat: led, cur: 0.5, target: 0.5 });
            if (o.contact) { reg.doors.set(o.id, { pivot, open: openRot, cur: 0, target: 0 }); reg.contacts.set(o.id, { fm, am: null, cur: 0, target: 0 }); }
          } else {
            const fm = o.contact ? own(M.door.clone()) : M.door;
            pivot.position.set(hx, 0, s * (t / 2 - 0.02));
            pivot.add(at(bx(lw, h - 0.02, 0.04, fm), dir * lw / 2, (h - 0.02) / 2, 0), at(bx(0.12, 0.025, 0.06, M.steel), dir * (lw - 0.1), 1.02, 0));
            pivot.rotation.y = openRot;
            if (o.contact) { reg.doors.set(o.id, { pivot, open: openRot, cur: 1, target: 1 }); reg.contacts.set(o.id, { fm, am: null, cur: 0, target: 0 }); }
          }
        }
      }
      cur = x.e;
    }
    piece(cur, L + t / 2, 0, H);
    if (pc.kind === 'rail') { const gl = new THREE.Mesh(new THREE.BoxGeometry(L + 0.1, 0.6, 0.02), M.glass); gl.position.set(L / 2, H + 0.3, 0); g.add(gl, at(bx(L + 0.1, 0.04, 0.07, M.frame), L / 2, H + 0.62, 0)); }
    function addShutter(o, op, cx, w, top, hh) {
      if (!op || !(o.entity || bo.shutters?.has(o.id))) return;
      const out = -(Math.sign(cross(u, op.n)) || 1);
      const pivot = new THREE.Group(); pivot.position.set(cx, top, out * (t / 2 + 0.035)); g.add(pivot);
      const box = sh(new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, 1, 0.04), M.shutter)); box.visible = false; pivot.add(box);
      g.add(at(bx(w + 0.08, 0.15, 0.13, M.frame), cx, top + 0.075, out * (t / 2 + 0.065)));
      const list = reg.shutters.get(o.id) || []; list.push({ box, h: hh, cur: 0, target: 0 }); reg.shutters.set(o.id, list);
    }
    wallGroup.add(g);
  }

  function build(plan, bo = {}) {
    clear(wallGroup); clear(content);
    reg = { lights: new Map(), shutters: new Map(), screens: new Map(), locks: new Map(), drums: new Map(), contacts: new Map(), doors: new Map(), fires: new Map(), motionDevs: new Map(), rooms: new Map(), floors: [], hits: [], bbox: null, radius: 6, center: [0, 0] };
    let nPL = 0;
    const all = plan.rooms.flatMap(r => r.pts);
    if (!all.length) return reg;
    const b = bbox(all); ctr = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]; reg.bbox = b; reg.center = ctr.slice(); reg.radius = Math.hypot(b.x1 - b.x0, b.y1 - b.y0) / 2;
    const fitH = plan.wallHeight || 2.55;
    reg.fitPts = all.flatMap(p => [new THREE.Vector3(p[0] - ctr[0], 0, p[1] - ctr[1]), new THREE.Vector3(p[0] - ctr[0], fitH, p[1] - ctr[1])]);
    seed = 11;
    const shadowR = Math.max(10, reg.radius + 3); Object.assign(sun.shadow.camera, { left: -shadowR, right: shadowR, top: shadowR, bottom: -shadowR }); sun.shadow.camera.updateProjectionMatrix();
    halo.scale.setScalar(Math.max(0.6, reg.radius / 9));
    for (const r of plan.rooms) {
      const slab = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(offsetPoly(r.pts, 0.2).map(p => { const q = P3(p); return new THREE.Vector2(q[0], -q[1]); })), { depth: 0.28, bevelEnabled: false }), M.slab);
      slab.geometry.rotateX(-Math.PI / 2); slab.position.y = -0.281; slab.receiveShadow = true; content.add(slab);
      const geo = shapeGeo(r.pts);
      const floor = new THREE.Mesh(geo, floorMat(r.floor)); floor.position.y = 0.002; floor.receiveShadow = true; floor.userData.room = r.id; content.add(floor); reg.floors.push(floor);
      const fill = new THREE.Mesh(geo, own(new THREE.MeshBasicMaterial({ color: '#7ef0ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))); fill.position.y = 0.02; fill.renderOrder = 2; content.add(fill);
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(r.pts.map(p => { const q = P3(p); return new THREE.Vector3(q[0], 0.035, q[1]); })), own(new THREE.LineBasicMaterial({ color: '#7ef0ff', transparent: true, opacity: 0 }))); line.renderOrder = 3; content.add(line);
      const c = centroid(r.pts), radius = Math.max(...r.pts.map(p => dist(p, c)));
      const mv = decal(r.pts, c[0], c[1], Math.max(1.6, radius * 1.1)); mv.material.color.set('#9b7bff'); mv.position.y = 0.016; content.add(mv);
      const heat = new THREE.Mesh(geo, own(new THREE.MeshBasicMaterial({ color: '#50dc82', transparent: true, opacity: 0, depthWrite: false }))); heat.position.y = 0.026; heat.renderOrder = 2; content.add(heat);
      reg.rooms.set(r.id, { center: c, radius, fill, line, cur: 0, target: 0, poly: r.pts, motion: { mat: mv.material, cur: 0, target: 0 }, heat: { mat: heat.material, cur: 0, target: 0 } });
    }
    const W = computeWalls(plan);
    for (const pc of W.pieces) buildWall(plan, pc, bo);
    for (const it of plan.items) {
      let o;
      switch (it.kind) {
        case 'sofa': o = sofa(it.w, it.d, M.rose); break;
        case 'armchair': o = sofa(it.w, it.d, M.sand); break;
        case 'coffee': o = rectTable(it.w, it.d, 0.4, M.oak); break;
        case 'round': o = roundTable(Math.min(it.w, it.d) / 2, it.w > 0.7 ? 0.74 : 0.45); break;
        case 'tvunit': { const tw = Math.min(1.42, it.w * 0.85), sm = screenMat(TVTEX); o = grp(at(rb(it.w, 0.38, it.d, M.walnut, 0.015), 0, 0.42, 0), at(bx(tw, tw * 0.58, 0.04, M.black), 0, 1.3, -it.d / 2 + 0.03)); const s = new THREE.Mesh(new THREE.PlaneGeometry(tw - 0.04, tw * 0.58 - 0.04), sm); s.position.set(0, 1.3, -it.d / 2 + 0.051); o.add(s); reg.screens.set(it.id, { mat: sm, cur: 0, target: 0, base: TVTEX, pic: null }); break; }
        case 'rug': o = rug(it.w, it.d); break;
        case 'plant': o = plant(it.w / 0.45, it.w > 0.42); break;
        case 'shelf': o = shelf(it.w, 1.9, it.d); break;
        case 'bed': o = bed(it.w - 0.08, it.d - 0.1, M.throwA); break;
        case 'bed1': o = bed(it.w - 0.08, it.d - 0.1, M.throwB); break;
        case 'wardrobe': o = wardrobe(it.w, it.d); break;
        case 'nightstand': o = grp(at(rb(it.w, 0.48, it.d, M.oak, 0.02), 0, 0.27, 0), at(cyl(0.05, 0.07, 0.22, M.white, 12), 0, 0.62, 0), at(cyl(0.11, 0.15, 0.18, M.linen, 18), 0, 0.82, 0)); break;
        case 'counter': o = kitchenRun(it.w, it.d, it.sink, it.hob); break;
        case 'fridge': o = grp(at(rb(it.w, 2.02, it.d, M.steel, 0.02), 0, 1.01, 0), at(bx(0.006, 1.9, 0.01, M.seam), 0, 1.0, it.d / 2 + 0.002)); break;
        case 'dining': o = dining(it.w, it.d); break;
        case 'chair': o = chair(); break;
        case 'stool': o = grp(at(cyl(0.18, 0.18, 0.05, M.charcoal, 20), 0, 0.68, 0), at(cyl(0.02, 0.02, 0.66, M.steel, 8), 0, 0.34, 0), at(cyl(0.17, 0.17, 0.015, M.steel, 20), 0, 0.01, 0)); break;
        case 'desk': { const sm = it.pc ? screenMat(CODETEX) : null; o = desk(it.w, it.d, it.pc, sm); if (sm) reg.screens.set(it.id, { mat: sm, cur: 0, target: 0, base: CODETEX, pic: null }); break; }
        case 'ochair': o = officeChair(); break;
        case 'beanbag': { const m = sph(it.w / 2, M.cushion, 24, 16); m.scale.set(1, 0.6, 1); m.position.y = it.w * 0.3; o = grp(m); break; }
        case 'bathtub': o = bathtub(it.w, it.d); break;
        case 'shower': o = shower(it.w, it.d); break;
        case 'toilet': o = toilet(); break;
        case 'vanity': o = vanity(it.w, it.d); break;
        case 'washer': o = appliance(it, false); break;
        case 'dryer': o = appliance(it, true); break;
        case 'lounger': o = lounger(it.w, it.d); break;
        case 'sectional': o = sectional(it.w, it.d, M.slate); break;
        case 'sideboard': o = sideboard(it.w, it.d); break;
        case 'fireplace': {
          const fm = own(std('#140a05', 0.9, 0, { emissive: '#ffffff', emissiveMap: FIRETEX, emissiveIntensity: 0 })); o = fireplace(it.w, it.d, fm);
          const fr = { mat: fm, cur: 0, target: it.entity ? 0 : 1, pl: null };
          if (nPL < 16) { fr.pl = new THREE.PointLight('#ff8a3a', 0, 4.5, 2); fr.pl.position.set(0, 0.5, it.d / 2 + 0.35); o.add(fr.pl); nPL++; }
          reg.fires.set(it.id, fr); break;
        }
        case 'piano': o = piano(it.w, it.d); break;
        case 'dresser': o = dresser(it.w, it.d); break;
        case 'crib': o = crib(it.w, it.d); break;
        case 'island': o = island(it.w, it.d); break;
        case 'tallunit': o = tallunit(it.w, it.d); break;
        case 'cdesk': { const sm = it.pc ? screenMat(CODETEX) : null; o = cdesk(it.w, it.d, it.pc, sm); if (sm) reg.screens.set(it.id, { mat: sm, cur: 0, target: 0, base: CODETEX, pic: null }); break; }
        case 'dvanity': o = dvanity(it.w, it.d); break;
        case 'parasol': o = parasol(Math.max(it.w, it.d)); break;
        case 'grill': o = grill(it.w, it.d); break;
        case 'gardenset': o = gardenset(it.w, it.d); break;
        default: continue;
      }
      const q = P3([it.x, it.y]); o.position.set(q[0], 0, q[1]); o.rotation.y = -it.rot * DEG; content.add(o);
      if (it.entity) { o.userData.hitKey = 'item:' + it.id; reg.hits.push(o); }
    }
    const addLight = (key, x, y, h, I, R, poly, mats) => {
      const L = { cur: 0, target: 0, color: new THREE.Color('#ffc78a'), I, pl: null, decals: [], mats: mats || [] };
      const q = P3([x, y]);
      if (I > 0 && nPL < 16) { L.pl = new THREE.PointLight('#ffc78a', 0, Math.max(5, R * 2), 2); L.pl.position.set(q[0], h, q[1]); content.add(L.pl); nPL++; }
      if (poly) { const d = decal(poly, x, y, R); content.add(d); L.decals.push(d); }
      reg.lights.set(key, L); return L;
    };
    for (const d of plan.devices) {
      const q = P3([d.x, d.y]);
      if (d.entity) {
        const lh = clamp(d.h ?? 2.1, 0.4, plan.wallHeight), px = d.kind === 'lamp' ? hitProxy(new THREE.CylinderGeometry(0.32, 0.32, 1.8, 10), 'dev:' + d.id) : hitProxy(new THREE.SphereGeometry(0.34, 10, 8), 'dev:' + d.id);
        px.position.set(q[0], d.kind === 'lamp' ? 0.9 : d.kind === 'sensor' ? 1.5 : d.kind === 'motion' ? plan.wallHeight - 0.32 : d.kind === 'spot' ? plan.wallHeight - 0.08 : lh - 0.08, q[1]); content.add(px); reg.hits.push(px);
      }
      if (d.kind === 'sensor') { content.add(at(rb(0.12, 0.12, 0.04, M.sensor, 0.015), q[0], 1.5, q[1])); continue; }
      if (d.kind === 'motion') {
        const mm = own(std('#f2f2f4', 0.4, 0, { emissive: '#b48cff', emissiveIntensity: 0 })), dome = sph(0.075, mm, 16, 10); dome.scale.y = 0.6;
        content.add(at(cyl(0.004, 0.004, 0.3, M.black, 4), q[0], plan.wallHeight - 0.15, q[1]), at(dome, q[0], plan.wallHeight - 0.32, q[1]));
        reg.motionDevs.set(d.id, { mat: mm, cur: 0, target: 0 }); continue;
      }
      const room = roomOfPoint(plan, d.x, d.y), gm = own(std('#f4efe6', 0.35, 0, { emissive: '#000000' }));
      if (d.kind === 'spot') { const y = plan.wallHeight - 0.04; content.add(at(cyl(0.065, 0.05, 0.05, gm, 18), q[0], y, q[1]), at(cyl(0.075, 0.075, 0.012, M.white, 18), q[0], y + 0.03, q[1])); addLight('dev:' + d.id, d.x, d.y, y - 0.15, 3.2, 2.2, room?.pts, [gm]); }
      else if (d.kind === 'light') { const y = clamp(d.h ?? 2.1, 0.4, plan.wallHeight); content.add(at(cyl(0.006, 0.006, Math.max(0.01, plan.wallHeight - y), M.black, 6), q[0], (plan.wallHeight + y) / 2, q[1]), at(sph(0.15, gm, 20, 14), q[0], y - 0.08, q[1])); addLight('dev:' + d.id, d.x, d.y, y - 0.25, 6, 3.4, room?.pts, [gm]); }
      else { const fl = grp(at(cyl(0.15, 0.17, 0.03, M.black, 20), 0, 0.015, 0), at(cyl(0.012, 0.012, 1.5, M.black, 8), 0, 0.77, 0), at(cyl(0.17, 0.23, 0.3, gm, 24), 0, 1.58, 0)); fl.position.set(q[0], 0, q[1]); content.add(fl); addLight('dev:' + d.id, d.x, d.y, 1.4, 2.5, 2.0, room?.pts, [gm]); }
    }
    for (const id of (bo.roomLights || [])) { const r = plan.rooms.find(x => x.id === id), info = reg.rooms.get(id); if (r && info) addLight('room:' + id, info.center[0], info.center[1], plan.wallHeight - 0.3, 5, Math.max(1.6, info.radius * 0.95), r.pts); }
    return reg;
  }

  /* ---------- Darstellung pro Bild ---------- */
  const clock = new THREE.Clock(), DAY = new THREE.Color('#fff3e2'), NIGHT = new THREE.Color('#7e95ff'), AMBER = new THREE.Color('#ffb25c'), BOO = new THREE.Color('#7ef0ff');
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), k = 1 - Math.exp(-dt * 5);
    nightCur += (nightTarget - nightCur) * (1 - Math.exp(-dt * 2.5));
    const n = nightCur;
    hemi.intensity = THREE.MathUtils.lerp(0.62, 0.1, n); sun.intensity = THREE.MathUtils.lerp(2.3, 0.32, n); sun.color.copy(DAY).lerp(NIGHT, n);
    scene.environmentIntensity = THREE.MathUtils.lerp(0.5, 0.1, n); renderer.toneMappingExposure = THREE.MathUtils.lerp(1.05, 1.25, n);
    if (reg) {
      for (const L of reg.lights.values()) {
        L.cur += (L.target - L.cur) * k; const v = L.cur;
        if (L.pl) { L.pl.intensity = v * L.I * (0.45 + 0.55 * n); L.pl.color.copy(L.color); }
        for (const d of L.decals) { d.material.opacity = v * (0.1 + 0.42 * n); d.material.color.copy(L.color); }
        for (const m of L.mats) { m.emissive.copy(L.color); m.emissiveIntensity = v * 2.6; }
      }
      for (const s of reg.screens.values()) { s.cur += (s.target - s.cur) * k; s.mat.emissiveIntensity = s.cur * 1.25; }
      for (const l of reg.locks.values()) { l.cur += (l.target - l.cur) * k; l.mat.emissive.copy(AMBER).lerp(BOO, l.cur); l.mat.emissiveIntensity = 0.4 + Math.abs(l.cur - 0.5) * 2.4; }
      for (const d of reg.drums.values()) { d.cur += (d.target - d.cur) * k; d.mat.emissiveIntensity = d.cur * 1.8; d.drum.rotation.z -= dt * 9 * d.cur; }
      for (const list of reg.shutters.values()) for (const s of list) { const st = dt * 0.55; s.cur += clamp(s.target - s.cur, -st, st); const hh = Math.max(0.001, s.cur * s.h); s.box.scale.y = hh; s.box.position.y = -hh / 2; s.box.visible = s.cur > 0.003; }
      const time = clock.elapsedTime, pulse = 0.5 + 0.5 * Math.sin(time * 3.2), flick = 0.82 + 0.18 * Math.sin(time * 11.3) * Math.sin(time * 6.7 + 1);
      for (const r of reg.rooms.values()) {
        r.cur += (r.target - r.cur) * k * 1.4; r.line.material.opacity = r.cur * 0.95; r.fill.material.opacity = r.cur * 0.07;
        const m = r.motion; if (m) { m.cur += (m.target - m.cur) * k; m.mat.opacity = m.cur * (0.14 + 0.26 * pulse); }
      }
      for (const c of reg.contacts.values()) { c.cur += (c.target - c.cur) * k; c.fm.emissive.copy(AMBER); c.fm.emissiveIntensity = c.cur * (0.35 + 0.65 * pulse); if (c.am) c.am.opacity = c.cur * (0.12 + 0.22 * pulse); }
      for (const d of reg.doors.values()) { d.cur += (d.target - d.cur) * k * 0.7; d.pivot.rotation.y = d.open * d.cur; }
      for (const f of reg.fires.values()) { f.cur += (f.target - f.cur) * k * 0.5; f.mat.emissiveIntensity = f.cur * 2.2 * flick; if (f.pl) f.pl.intensity = f.cur * 2.4 * flick * (0.4 + 0.6 * n); }
      for (const m of reg.motionDevs.values()) { m.cur += (m.target - m.cur) * k; m.mat.emissiveIntensity = m.cur * (0.8 + 1.6 * pulse); }
      for (const r of reg.rooms.values()) { const h = r.heat; if (h) { h.cur += (h.target - h.cur) * k; h.mat.opacity = h.cur * 0.5; } }
    }
    for (let i = pings.length - 1; i >= 0; i--) {
      const q = pings[i]; q.t += Math.max(dt, 0.016); const f = q.t / 0.75;
      if (f >= 1) { scene.remove(q.s); q.s.material.dispose(); pings.splice(i, 1); continue; }
      const sc = (0.3 + f * 1.1) * Math.max(0.7, orbit.sph.radius / 14); q.s.scale.set(sc, sc, 1); q.s.material.opacity = (1 - f) * 0.9;
    }
    wallScale += (wallTarget - wallScale) * (1 - Math.exp(-dt * 4)); wallGroup.scale.y = wallScale;
    if (tween) {
      tween.t += dt; const p = Math.min(1, tween.t / tween.dur), e = ease(p);
      orbit.target.copy(tween.fromT).lerp(tween.toT, e);
      orbit.sph.radius = THREE.MathUtils.lerp(tween.fromS.radius, tween.toR, e) * (1 + 0.07 * Math.sin(Math.PI * e));
      orbit.sph.phi = THREE.MathUtils.lerp(tween.fromS.phi, tween.toPhi, e); orbit.sph.theta = tween.fromS.theta + tween.dT * e;
      orbitApply(); if (p >= 1) tween = null;
    } else orbitStep();
    renderer.render(scene, camera);
  }
  let userAt = 0;
  orbit.onUser = () => { tween = null; userAt = performance.now(); };
  function flyTo(xy, radius, phi, theta, dur = 1.4) {
    const toT = new THREE.Vector3(...(xy ? [xy[0] - ctr[0], 0.35, xy[1] - ctr[1]] : [0, 0, 0]));
    const fromS = orbit.sph.clone(); if (theta == null) theta = fromS.theta;
    let dT = theta - fromS.theta; dT = ((dT + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    orbit.vT = orbit.vP = orbit.vZ = 0; orbit.pan.set(0, 0, 0);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    tween = { t: 0, dur: reduce ? 0.001 : dur, fromT: orbit.target.clone(), toT, fromS, toR: radius, toPhi: phi, dT };
  }
  function jumpTo(xy, radius, phi, theta) { orbit.target.set(xy ? xy[0] - ctr[0] : 0, 0, xy ? xy[1] - ctr[1] : 0); orbit.sph.set(radius, phi, theta); orbitApply(); tween = null; }
  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2(), tmp = new THREE.Vector3();
  function pick(clientX, clientY) {
    if (!reg) return null; const r = canvas.getBoundingClientRect();
    v2.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, camera);
    const hit = ray.intersectObjects(reg.floors, false)[0]; return hit ? hit.object.userData.room : null;
  }
  /* Gerät oder Möbel unter dem Zeiger – nur wenn keine Wand davor steht */
  const wallHit = o => { while (o && o !== wallGroup) { if (o.userData.hitKey) return false; o = o.parent; } return true; };
  function pickAt(clientX, clientY) {
    if (!reg) return null; const r = canvas.getBoundingClientRect();
    v2.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, camera);
    const fl = ray.intersectObjects(reg.floors, false)[0], out = { room: fl ? fl.object.userData.room : null, key: null, point: fl ? fl.point.clone() : null };
    const hit = reg.hits.length ? ray.intersectObjects(reg.hits, true)[0] : null; if (!hit) return out;
    let o = hit.object; while (o && !o.userData.hitKey) o = o.parent; if (!o) return out;
    const wall = ray.intersectObjects(wallGroup.children, true).find(x => x.object.isMesh && x.object.material !== M.glass && x.object.material !== HITM && wallHit(x.object));
    if (wall && wall.distance < hit.distance - 0.05) return out;
    out.key = o.userData.hitKey; out.point = hit.point.clone(); return out;
  }
  function ping(p, color = '#7ef0ff') {
    if (!p) return; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: RINGTEX, color, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.copy(p); s.renderOrder = 20; scene.add(s); pings.push({ s, t: 0 });
  }
  function project(x, y, h = 0.2) { tmp.set(x - ctr[0], h, y - ctr[1]).project(camera); return { x: (tmp.x + 1) / 2 * canvas.clientWidth, y: (1 - tmp.y) / 2 * canvas.clientHeight, vis: tmp.z < 1 }; }
  function resize(w, h, ox = 0, oy = 0) { if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.setViewOffset(w, h, ox, oy, w, h); camera.updateProjectionMatrix(); }
  /* Kameraabstand, bei dem der ganze Grundriss genau in den freien Bereich passt */
  const fitCam = camera.clone(), fitV = new THREE.Vector3(), fitS = new THREE.Spherical();
  function fitView(phi, theta, rect) {
    const pts = reg?.fitPts, W = canvas.clientWidth, H = canvas.clientHeight;
    if (!pts?.length || !rect || !W || !H) return null;
    fitCam.copy(camera, false);
    const pad = Math.max(8, Math.min(30, (rect.x1 - rect.x0) * 0.06, (rect.y1 - rect.y0) * 0.06));
    const ok = d => {
      fitS.set(d, phi, theta); fitCam.position.setFromSpherical(fitS); fitCam.lookAt(0, 0, 0); fitCam.updateMatrixWorld(true);
      for (const p of pts) {
        fitV.copy(p).project(fitCam); const x = (fitV.x + 1) / 2 * W, y = (1 - fitV.y) / 2 * H;
        if (fitV.z > 1 || x < rect.x0 + pad || x > rect.x1 - pad || y < rect.y0 + pad || y > rect.y1 - pad) return false;
      }
      return true;
    };
    let lo = orbit.minR, hi = orbit.maxR; if (!ok(hi)) return hi;
    for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; }
    return hi;
  }
  function fitDistance(r, availW, availH, H) { const tv = Math.tan(camera.fov * DEG / 2); const fv = 2 * Math.atan(tv * availH / H), fh = 2 * Math.atan(tv * availW / H); return r / Math.sin(Math.min(fv, fh) / 2); }
  function loadPicture(id, url) {
    const s = reg?.screens.get(id); if (!s) return;
    if (!url) { if (s.pic) { s.mat.emissiveMap = s.base; s.mat.needsUpdate = true; s.pic = null; } return; }
    if (s.pic === url) return; s.pic = url;
    new THREE.TextureLoader().load(url, tex => { if (s.pic !== url) { tex.dispose(); return; } tex.colorSpace = THREE.SRGBColorSpace; s.mat.emissiveMap = tex; s.mat.needsUpdate = true; }, undefined, () => {});
  }
  function dispose() { clear(wallGroup); clear(content); renderer.dispose(); pmrem.dispose(); }
  return {
    THREE, renderer, camera, orbit, build, frame, flyTo, jumpTo, pick, pickAt, ping, project, resize, fitDistance, fitView, loadPicture, dispose, lastUser: () => userAt,
    reg: () => reg, setNight: v => { nightTarget = v; }, setWallsLow: v => { wallTarget = v ? 0.42 : 1; }, wallsLow: () => wallTarget < 1, isFlying: () => !!tween,
  };
}

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
  img(eid) { const u = this.plan?.icons?.[eid]; return u ? `<img src="${esc(u)}" alt="" draggable="false">` : ''; }
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
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.tile{min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px 5px;border-radius:10px;border:1px solid var(--hb-line);background:#141a2e;font-weight:600;font-size:10.5px;line-height:1.15;color:var(--hb-muted);text-align:center;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}
.tile:hover{color:var(--hb-fg);border-color:rgba(126,240,255,.4)}
.tile svg{width:40px;height:34px}
.tile span{max-width:100%;overflow:hidden;padding:0 2px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;hyphens:auto;-webkit-hyphens:auto;overflow-wrap:anywhere}
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
.eall{display:grid;grid-template-columns:1fr 1fr;gap:6px}.eall .btn{min-width:0;justify-content:center;gap:5px;padding:0 6px;font-size:11.5px}.eall .btn svg{width:14px;height:14px}
.hint2{margin:0;font-size:12px;color:var(--hb-muted)}
.lnk{border:0;background:none;padding:0;color:var(--hb-accent);font-weight:600;font-size:12px;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.elist{display:flex;flex-direction:column;gap:4px;max-height:340px;overflow:auto;scrollbar-width:thin;scrollbar-color:var(--hb-line2) transparent}
.er{display:grid;grid-template-columns:12px 28px minmax(0,1fr) 30px;align-items:center;gap:7px;padding:5px 5px 5px 4px;border-radius:10px;background:#141a2e;border:1px solid transparent}
.grip{display:grid;place-items:center;height:28px;color:var(--hb-faint);cursor:grab;touch-action:none}.grip svg{width:8px;height:14px;fill:currentColor}.grip:hover{color:var(--hb-fg)}
.er.drag{border-color:var(--hb-accent);background:#1b2240;box-shadow:0 8px 22px rgba(0,0,0,.45);position:relative;z-index:2}.er.drag .grip{cursor:grabbing}
.eiw{position:relative;display:grid}
.ei{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;border:1px dashed transparent;padding:0;background:rgba(126,240,255,.08);color:var(--hb-accent);cursor:pointer;overflow:hidden}
.ei:hover{border-color:rgba(126,240,255,.6)}
.ei svg{width:16px;height:16px}.ei img{width:100%;height:100%;object-fit:contain}
.ei.pic{background:rgba(255,255,255,.07)}
.eix{position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;border:1px solid var(--hb-line2);background:#0f1324;color:var(--hb-fg);font:700 11px/1 var(--hb-font);display:grid;place-items:center;padding:0;cursor:pointer}
.eix:hover{color:#ff7a8a;border-color:#ff7a8a}
.picrow{display:flex;align-items:center;gap:12px}.picrow .ei{width:52px;height:52px;border-radius:12px;border-style:dashed;border-color:var(--hb-line2)}.picrow .ei svg{width:24px;height:24px}
.er .et{min-width:0;display:flex;flex-direction:column}
.er .et b{font-weight:600;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.er .et small{font:500 10.5px/1.4 var(--hb-mono);color:var(--hb-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.er.off{background:transparent;border-color:var(--hb-line)}.er.off .ei{background:rgba(255,255,255,.04);color:var(--hb-faint)}.er.off .et b{color:var(--hb-muted);text-decoration:line-through;text-decoration-color:rgba(255,255,255,.25)}
.eb{width:30px;height:30px;border-radius:8px;border:1px solid var(--hb-line);background:transparent;color:var(--hb-faint);display:grid;place-items:center;cursor:pointer;padding:0}
.eb svg{width:16px;height:16px}.eb:hover{color:var(--hb-fg);border-color:var(--hb-line2)}.eb.on{color:var(--hb-accent)}
.addr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px}
.addr .btn{height:34px}
.fls{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.fl{display:flex;align-items:center;gap:7px;height:32px;padding:0 8px;border-radius:9px;border:1px solid var(--hb-line);background:#141a2e;font-weight:600;font-size:11.5px;color:var(--hb-muted);cursor:pointer;text-align:left;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fl i{width:16px;height:16px;border-radius:4px;flex:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.fl:hover{color:var(--hb-fg)}.fl.on{border-color:rgba(126,240,255,.6);color:var(--hb-accent);background:var(--hb-accent-soft)}
.wcs{display:flex;flex-wrap:wrap;gap:7px}
.wc{position:relative;width:28px;height:28px;border-radius:50%;border:2px solid #0f1324;background:var(--c);box-shadow:0 0 0 1px var(--hb-line2);cursor:pointer;padding:0}
.wc.on{box-shadow:0 0 0 2px var(--hb-accent)}
.wc.custom{background:conic-gradient(#ff7a8a,#ffc98a,#74e3a8,#7ef0ff,#b48cff,#ff7a8a);overflow:hidden}
.wc.custom.on{background:var(--c)}
.wc.custom input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:0;padding:0}
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
    case 'sectional': { const sd = Math.min(0.95, d), f = '#6d7590', a = '#5b627b'; return R(-hw, -hd, w, sd, f, 0.08) + R(hw - sd, -hd + sd - 0.05, sd, d - sd + 0.05, f, 0.08) + R(-hw, -hd, w, 0.22, '#4f556b', 0.06) + R(-hw, -hd, 0.17, sd, a, 0.06) + R(hw - 0.17, -hd, 0.17, d, a, 0.06); }
    case 'sideboard': { let s = R(-hw, -hd, w, d, C2.woodD, 0.02); const n = Math.max(2, Math.round(w / 0.45)); for (let i = 1; i < n; i++) s += svgLine([-hw + i * w / n, -hd], [-hw + i * w / n, hd], C2.ink, 0.012); return s; }
    case 'fireplace': return R(-hw, -hd, w, d, '#cfc9be', 0.02) + R(-w * 0.31, hd - 0.14, w * 0.62, 0.12, '#0b0d14', 0.01) + `<ellipse cx="0" cy="${fx(hd - 0.08)}" rx="${fx(w * 0.18)}" ry="0.04" fill="#ff8a3a"/>`;
    case 'piano': return R(-hw, -hd, w, d * 0.55, '#15161b', 0.02) + R(-hw, -hd + d * 0.55, w, d * 0.45, '#15161b', 0.01) + R(-hw + 0.06, -hd + d * 0.6, w - 0.12, d * 0.28, '#f4f4f6', 0.005) + R(-0.4, hd + 0.15, 0.8, 0.34, '#15161b', 0.03);
    case 'dresser': return R(-hw, -hd, w, d, C2.white, 0.02) + svgLine([-hw + 0.04, hd - 0.03], [hw - 0.04, hd - 0.03], C2.ink, 0.02) + Ci(-w * 0.3, 0, Math.min(0.12, hd * 0.5), '#f3e6cf');
    case 'crib': return R(-hw, -hd, w, d, C2.white, 0.03) + R(-hw + 0.05, -hd + 0.05, w - 0.1, d - 0.1, '#ece7df', 0.03) + R(-hw + 0.07, 0, w - 0.14, d * 0.38, '#7b8fae', 0.02);
    case 'island': return R(-hw, -hd, w, d, C2.dark, 0.01) + R(-hw, -hd, w, d, 'none', 0.01, 'stroke="#cfd2da" stroke-width="0.025"') + Ci(-w * 0.22, 0, 0.14, C2.white);
    case 'tallunit': return R(-hw, -hd, w, d, C2.dark, 0.01) + svgLine([-hw + 0.06, hd - 0.04], [hw - 0.06, hd - 0.04], '#ff8a3a', 0.025);
    case 'cdesk': { const dp = Math.min(0.7, d, w); let s = R(-hw, -hd, w, dp, C2.woodL, 0.02) + R(-hw, -hd + dp - 0.02, dp, d - dp + 0.02, C2.woodL, 0.02); if (it.pc) s += svgLine([-hw + dp + 0.05, -hd + 0.16], [Math.min(hw - 0.05, -hw + dp + 0.65), -hd + 0.16], '#0b0d14', 0.04) + svgLine([-hw + 0.16, -hd + dp + 0.05], [-hw + 0.16, Math.min(hd - 0.05, -hd + dp + 0.65)], '#0b0d14', 0.04); return s; }
    case 'dvanity': return R(-hw, -hd, w, d, C2.wood, 0.02) + [-1, 1].map(sx => `<ellipse cx="${fx(sx * w / 4)}" cy="0" rx="${fx(Math.min(0.25, w * 0.16))}" ry="${fx(hd * 0.6)}" fill="${C2.cer}" ${k}/>`).join('');
    case 'dryer': return R(-hw, -hd, w, d, C2.cer, 0.04) + Ci(0, 0.03, Math.min(hw, hd) * 0.55, '#c7cede');
    case 'parasol': { const r = Math.min(hw, hd); let s = Ci(0, 0, r, '#e8dcc6'); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += svgLine([0, 0], [Math.cos(a) * r, Math.sin(a) * r], 'rgba(120,100,80,.5)', 0.02); } return s + Ci(0, 0, 0.05, '#7a6a5a'); }
    case 'grill': return R(-hw, -hd, w * 0.62, d, '#2a2f3d', 0.05) + R(-hw + w * 0.62, -hd + 0.03, w * 0.38, d - 0.06, C2.steel, 0.02) + [0.25, 0.5, 0.75].map(f => svgLine([-hw + 0.05, -hd + d * f], [-hw + w * 0.57, -hd + d * f], '#5d648a', 0.012)).join('');
    case 'gardenset': { let s = ''; const n = Math.max(1, Math.floor(w / 0.65)); for (let i = 0; i < n; i++) { const x = -hw + w * (i + 0.5) / n; s += R(x - 0.22, -hd - 0.52, 0.44, 0.44, '#9a6b44', 0.06) + R(x - 0.22, hd + 0.08, 0.44, 0.44, '#9a6b44', 0.06); } return s + R(-hw, -hd, w, d, '#b58556', 0.03); }
    default: return R(-hw, -hd, w, d, C2.fab, 0.03);
  }
}
function hbDeviceSVG(d) {
  const col = d.kind === 'sensor' ? '#7ef0ff' : d.kind === 'motion' ? '#b48cff' : '#ffc98a';
  let g = `<g class="dv" data-dv="${d.id}" transform="translate(${fx(d.x)} ${fx(d.y)})">`;
  if (d.kind !== 'sensor' && d.kind !== 'motion') g += `<circle r="${d.kind === 'spot' ? 0.3 : 0.42}" fill="url(#devGlow)"/>`;
  g += `<circle r="0.15" fill="#121628" stroke="${col}" stroke-width="0.03"/>`;
  if (d.kind === 'light') { g += `<circle r="0.055" fill="${col}"/>`; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; g += svgLine([Math.cos(a) * 0.08, Math.sin(a) * 0.08], [Math.cos(a) * 0.12, Math.sin(a) * 0.12], col, 0.02); } }
  else if (d.kind === 'spot') g += `<circle r="0.09" fill="none" stroke="${col}" stroke-width="0.02"/><circle r="0.045" fill="${col}"/>`;
  else if (d.kind === 'lamp') g += `<circle r="0.07" fill="none" stroke="${col}" stroke-width="0.025"/><circle r="0.03" fill="${col}"/>`;
  else if (d.kind === 'motion') g += `<circle r="0.03" fill="${col}"/><path d="M-0.05 -0.08A0.095 0.095 0 0 0 -0.05 0.08M0.05 -0.08A0.095 0.095 0 0 1 0.05 0.08" fill="none" stroke="${col}" stroke-width="0.022" stroke-linecap="round"/>`;
  else g += `<rect x="-0.06" y="-0.06" width="0.12" height="0.12" rx="0.02" fill="none" stroke="${col}" stroke-width="0.022"/>`;
  return g + '</g>';
}

function hbCreatePlanner(root, opts) {
  const $ = s => root.querySelector(s);
  const hass = opts.hass;
  root.innerHTML = `<style>${HB_PLAN_CSS}</style><div class="app" lang="${HB_LANG}">
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
    <input type="file" id="fileImg" accept="image/*" hidden><input type="file" id="fileJson" accept=".json,application/json,text/plain" hidden><input type="file" id="fileIcon" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" hidden>
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
    const r = { id: uid('r'), name: `${T('Raum', 'Room')} ${plan.rooms.length + 1}`, type: 'sonst', floor: 'ash', outdoor: false, area: '', wall: '', hide: [], add: [], open: [], pts: pts.map(p => p.map(r2)) };
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
  function itemIcon(kind) { const c = CAT[kind], m = Math.max(c.w, c.d) / 2 * (kind === 'dining' || kind === 'gardenset' ? 1.75 : kind === 'piano' ? 1.5 : 1.12); return `<svg viewBox="${fx(-m)} ${fx(-m)} ${fx(2 * m)} ${fx(2 * m)}" aria-hidden="true">${hbItemShape(kind, c.w, c.d, { kind })}</svg>`; }
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
  const fname = e => hass?.states[e]?.attributes?.friendly_name || e;
  const dlList = (id, ids) => `<datalist id="${id}">${ids.slice(0, 600).map(e => `<option value="${e}">${esc(fname(e))}</option>`).join('')}</datalist>`;
  function entIcon(c) {
    if (c.kind === 'temp') return HB_ICON.thermo; if (c.kind === 'hum') return HB_ICON.drop; if (c.kind === 'motion') return HB_ICON.motion; if (c.kind === 'contact') return HB_ICON.contact; if (c.kind === 'value') return HB_ICON.sensor;
    return { light: HB_ICON.bulb, cover: HB_ICON.blinds, media_player: HB_ICON.tv, lock: HB_ICON.lock, climate: HB_ICON.thermo, fan: HB_ICON.fan }[c.d] || HB_ICON.power;
  }
  /* Symbol oder eigenes Bild – antippen zum Ändern */
  function iconBtn(eid, fallback) {
    const u = plan.icons?.[eid];
    return `<span class="eiw"><button type="button" class="ei${u ? ' pic' : ''}" data-act="eimg" data-e="${esc(eid)}" title="${u ? T('Anderes Bild wählen', 'Choose another picture') : T('Eigenes Bild wählen (z. B. ein Foto deiner Lampe)', 'Choose your own picture (e.g. a photo of your lamp)')}" aria-label="${T('Bild für', 'Picture for')} ${esc(fname(eid))}">${u ? `<img src="${esc(u)}" alt="">` : fallback}</button>${u ? `<button type="button" class="eix" data-act="eimgdel" data-e="${esc(eid)}" title="${T('Bild entfernen', 'Remove picture')}" aria-label="${T('Bild entfernen', 'Remove picture')}">×</button>` : ''}</span>`;
  }
  let iconFor = null;
  function pickIcon(eid) { iconFor = eid; $('#fileIcon').click(); }
  on($('#fileIcon'), 'change', e => {
    const file = e.target.files[0], eid = iconFor; e.target.value = ''; iconFor = null; if (!file || !eid) return;
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 128, nw = img.naturalWidth || S, nh = img.naturalHeight || S, k = Math.min(1, S / Math.max(nw, nh)), c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(nw * k)); c.height = Math.max(1, Math.round(nh * k)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        let url = c.toDataURL('image/webp', 0.9); if (!url.startsWith('data:image/webp')) url = c.toDataURL('image/png');
        plan.icons = { ...(plan.icons || {}), [eid]: url }; commit(true);
        toast(T(`Bild für ${fname(eid)} gesetzt.`, `Picture set for ${fname(eid)}.`));
      };
      img.onerror = () => toast(T('Das Bild konnte nicht gelesen werden.', 'The picture could not be read.'));
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
  /* Geräteliste eines Raums: ein-/ausblenden und Geräte aus anderen Bereichen dazunehmen */
  function roomDevicesHTML(r) {
    let h = `<div class="sec"><h3>${T('Geräte in diesem Raum', 'Devices in this room')}</h3>`;
    if (!hass?.states) return h + `<p class="note">${T('Die Geräteliste erscheint, wenn du den Editor aus Home Assistant öffnest.', 'The device list appears when you open the editor from Home Assistant.')}</p></div>`;
    const ents = hbRoomEntities(plan, r, hass), hid = new Set(r.hide || []), SRC = { dev: T('im Plan', 'in plan'), item: T('Möbel', 'furniture'), op: T('Tür/Fenster', 'door/window'), add: T('hinzugefügt', 'added'), area: T('Bereich', 'area') };
    if (ents.length) {
      const shown = ents.filter(c => !hid.has(c.eid)).length;
      const hideable = ents.filter(c => c.src !== 'add');
      h += `<p class="hint2">${shown} ${T('von', 'of')} ${ents.length} ${T('werden in der Karte angezeigt', 'shown on the card')}</p><div class="eall"><button type="button" class="btn small" data-act="eshowall" ${hid.size ? '' : 'disabled'}>${HB_ICON.eye}${T('Alle einblenden', 'Show all')}</button><button type="button" class="btn small" data-act="ehideall" ${hideable.some(c => !hid.has(c.eid)) ? '' : 'disabled'}>${HB_ICON.eyeOff}${T('Alle ausblenden', 'Hide all')}</button></div><div class="elist">`;
      for (const c of ents) {
        const off = hid.has(c.eid);
        const btn = c.src === 'add' ? `<button type="button" class="eb" data-act="eremove" data-e="${esc(c.eid)}" title="${T('Wieder entfernen', 'Remove again')}" aria-label="${T('Entfernen', 'Remove')}: ${esc(fname(c.eid))}">${HB_PIC.x}</button>`
          : `<button type="button" class="eb${off ? '' : ' on'}" data-act="ehide" data-e="${esc(c.eid)}" aria-pressed="${!off}" title="${off ? T('In der Karte einblenden', 'Show on the card') : T('In der Karte ausblenden', 'Hide on the card')}" aria-label="${off ? T('Einblenden', 'Show') : T('Ausblenden', 'Hide')}: ${esc(fname(c.eid))}">${off ? HB_ICON.eyeOff : HB_ICON.eye}</button>`;
        h += `<div class="er${off ? ' off' : ''}" data-e="${esc(c.eid)}"><span class="grip" data-grip title="${T('Ziehen zum Sortieren', 'Drag to reorder')}" aria-hidden="true"><svg viewBox="0 0 10 16"><circle cx="3" cy="3" r="1.3"/><circle cx="7" cy="3" r="1.3"/><circle cx="3" cy="8" r="1.3"/><circle cx="7" cy="8" r="1.3"/><circle cx="3" cy="13" r="1.3"/><circle cx="7" cy="13" r="1.3"/></svg></span>${iconBtn(c.eid, entIcon(c))}<span class="et"><b>${esc(fname(c.eid))}</b><small>${esc(c.eid)} · ${SRC[c.src] || ''}</small></span>${btn}</div>`;
      }
      h += `</div>`;
    } else h += `<p class="note">${r.area ? T('In diesem Bereich gibt es keine Geräte, die die Karte anzeigen kann.', 'This area has no devices the card can show.') : T('Wähle oben einen Bereich – dann erscheinen hier seine Geräte.', 'Pick an area above – its devices then appear here.')}</p>`;
    const have = new Set(ents.map(c => c.eid)), cand = Object.keys(hass.states).filter(e => !have.has(e) && /^(light|switch|input_boolean|fan|cover|media_player|lock|climate|sensor|binary_sensor)\./.test(e)).sort();
    h += `<div class="addr"><input class="inp" id="f_eadd" list="dl_eadd" placeholder="${T('Gerät hinzufügen …', 'Add a device …')}" aria-label="${T('Gerät hinzufügen', 'Add a device')}" autocomplete="off"><button type="button" class="btn small" data-act="eadd">${T('Hinzufügen', 'Add')}</button></div>${dlList('dl_eadd', cand)}`;
    return h + `<p class="note">${T('Mit dem <b>Auge</b> blendest du ein Gerät in der Karte aus. An den <b>Punkten</b> links ziehst du es an eine andere Stelle – so ist es auch in der Karte sortiert. Über <b>Hinzufügen</b> holst du Geräte aus anderen Bereichen in diesen Raum.', 'Use the <b>eye</b> to hide a device on the card. Drag the <b>dots</b> on the left to reorder – the card uses the same order. <b>Add</b> brings devices from other areas into this room.')}</p></div>`;
  }
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
      h += sel3('type', Object.fromEntries(Object.entries(RTYPES).map(([k, v]) => [k, N(v)])), r.type, T('Raumart', 'Room type'), 'f_rtype');
      h += `<label class="chk"><input type="checkbox" data-f="outdoor" ${r.outdoor ? 'checked' : ''}> ${T('Außenbereich (Geländer statt Wände)', 'Outdoor (railing instead of walls)')}</label>`;
      if (hass?.areas && Object.keys(hass.areas).length) h += sel3('area', { '': T('– kein Bereich –', '– no area –'), ...Object.fromEntries(Object.values(hass.areas).map(a => [a.area_id, a.name])) }, r.area || '', T('Bereich in Home Assistant', 'Home Assistant area'), 'f_rarea');
      else h += inp('area', r.area, T('Bereich in Home Assistant', 'Home Assistant area'), 'f_rarea', 'text', `placeholder="${T('z. B. wohnzimmer', 'e.g. living_room')}"`);
      h += roomDevicesHTML(r);
      h += `<div class="sec"><h3>${T('Boden', 'Floor')}</h3><div class="fls">${Object.entries(FLOORS).map(([k, f]) => `<button type="button" class="fl${r.floor === k ? ' on' : ''}" data-act="floor" data-k="${k}" aria-pressed="${r.floor === k}"><i style="background:${f.c}"></i>${N(f.n)}</button>`).join('')}</div></div>`;
      if (!r.outdoor) h += `<div class="sec"><h3>${T('Wandfarbe innen', 'Interior wall colour')}</h3><div class="wcs">${WALLCOLORS.map(([c, n]) => `<button type="button" class="wc${(r.wall || '') === c ? ' on' : ''}" style="--c:${c || '#ecebe7'}" data-act="wall" data-c="${c}" title="${N(n)}" aria-label="${N(n)}" aria-pressed="${(r.wall || '') === c}"></button>`).join('')}<label class="wc custom${r.wall && !WALLCOLORS.some(x => x[0] === r.wall) ? ' on' : ''}" title="${T('Eigene Farbe', 'Custom colour')}" style="--c:${r.wall || '#ecebe7'}"><input type="color" data-f="wall" value="${r.wall || '#ecebe7'}" aria-label="${T('Eigene Farbe', 'Custom colour')}"></label></div></div>`;
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
      if (hass?.states) { const bs = Object.keys(hass.states).filter(e => e.startsWith('binary_sensor.')), pri = e => HB_CONTACT_DC.includes(hass.states[e]?.attributes?.device_class) ? 0 : 1; bs.sort((a, b) => pri(a) - pri(b) || a.localeCompare(b)); h += inp('contact', o.contact, T('Kontakt-Sensor (offen/zu)', 'Contact sensor (open/closed)'), 'f_ocon', 'text', 'placeholder="binary_sensor.…" list="dl_con" autocomplete="off"') + dlList('dl_con', bs); }
      else h += inp('contact', o.contact, T('Kontakt-Sensor (offen/zu)', 'Contact sensor (open/closed)'), 'f_ocon', 'text', 'placeholder="binary_sensor.…"');
      h += `<p class="note">${isDoor ? T('Mit Kontakt-Sensor geht die Tür im Modell auf und zu und leuchtet orange, solange sie offen ist.', 'With a contact sensor the door opens and closes in the model and glows orange while open.') : T('Mit Kontakt-Sensor leuchtet das Fenster im Modell orange, solange es offen ist.', 'With a contact sensor the window glows orange in the model while it is open.')}</p>`;
      h += `<p class="note">${T('Ziehen verschiebt entlang der Wand oder auf eine andere Wand. Die Griffe an den Enden ändern die Breite.', 'Drag to move along the wall or onto another wall. The end handles change the width.')}</p><div class="acts"><button type="button" class="btn small danger" data-act="del">${T('Löschen', 'Delete')}</button></div>`;
    } else if (sel.type === 'item') {
      const it = IT(sel.id), c = CAT[it.kind];
      h += `<div class="ph"><h2>${N(c.n)}</h2><span class="tag">${T('Möbel', 'Furniture')}</span></div><div class="row3">${nInp('w', it.w, T('Breite (m)', 'Width (m)'), 'f_iw')}${nInp('d', it.d, T('Tiefe (m)', 'Depth (m)'), 'f_id')}${nInp('rot', it.rot, T('Drehung (°)', 'Rotation (°)'), 'f_irot')}</div>`;
      h += `<div class="acts"><button type="button" class="btn small" data-act="rot" data-d="-90">↺ 90°</button><button type="button" class="btn small" data-act="rot" data-d="90">↻ 90°</button>${c.wall ? `<button type="button" class="btn small" data-act="towall">${T('An Wand setzen', 'Snap to wall')}</button>` : ''}</div>`;
      if (it.kind === 'counter') h += `<label class="chk"><input type="checkbox" data-f="sink" ${it.sink ? 'checked' : ''}> ${T('Spüle', 'Sink')}</label><label class="chk"><input type="checkbox" data-f="hob" ${it.hob ? 'checked' : ''}> ${T('Kochfeld', 'Hob')}</label>`;
      if (it.kind === 'desk' || it.kind === 'cdesk') h += `<label class="chk"><input type="checkbox" data-f="pc" ${it.pc ? 'checked' : ''}> ${T('Mit Bildschirmen', 'With monitors')}</label>`;
      if (c.ent || it.kind === 'desk' || it.kind === 'cdesk' || it.entity) h += inp('entity', it.entity, T('Gerät in Home Assistant (Entität)', 'Home Assistant entity'), 'f_ient', 'text', `placeholder="${c.ent || 'switch'}.…" list="dl_item"`) + dl('dl_item', 'media_player|switch|input_boolean|light|climate|fan');
      if (it.kind === 'fireplace') h += `<p class="note">${T('Ohne Entität brennt das Feuer immer. Mit Entität nur, wenn das Gerät an ist.', 'Without an entity the fire is always lit. With one, only while the device is on.')}</p>`;
      h += `<div class="acts"><button type="button" class="btn small" data-act="dup">${T('Duplizieren', 'Duplicate')}</button><button type="button" class="btn small danger" data-act="del">${T('Löschen', 'Delete')}</button></div>`;
    } else if (sel.type === 'device') {
      const d = DV(sel.id), dom = DEVDEF[d.kind].ent;
      h += `<div class="ph"><h2>${esc(d.name || N(DEVDEF[d.kind].n))}</h2><span class="tag">${T('Gerät', 'Device')}</span></div>` + sel3('kind', Object.fromEntries(Object.entries(DEVDEF).map(([k, v]) => [k, N(v.n)])), d.kind, T('Art', 'Type'), 'f_dkind') + inp('name', d.name, T('Name', 'Name'), 'f_dname');
      h += inp('entity', d.entity, T('Entität in Home Assistant', 'Home Assistant entity'), 'f_dent', 'text', `placeholder="${dom}.…" list="dl_dev"`) + dl('dl_dev', dom === 'light' ? 'light|switch' : dom);
      if (d.kind === 'motion') h += `<p class="note">${T('Erkennt der Melder Bewegung, pulsiert der Raum im Modell violett. Bewegungsmelder aus dem Bereich des Raums werden auch ohne Symbol erkannt.', 'When the sensor detects motion, the room pulses violet in the model. Motion sensors in the room’s area are detected even without a symbol.')}</p>`;
      if (d.kind === 'light') h += nInp('h', d.h ?? 2.1, T('Höhe der Leuchte (m)', 'Light height (m)'), 'f_dh');
      if (d.entity) h += `<div class="fld"><label>${T('Bild in der Karte', 'Picture on the card')}</label><div class="picrow">${iconBtn(d.entity, d.kind === 'sensor' ? HB_ICON.thermo : d.kind === 'motion' ? HB_ICON.motion : HB_ICON.bulb)}<span class="hint2">${plan.icons?.[d.entity] ? T('Antippen zum Ändern, × zum Entfernen.', 'Tap to change, × to remove.') : T('Antippen und ein Foto deiner Lampe wählen (PNG mit transparentem Hintergrund sieht am besten aus).', 'Tap and choose a photo of your lamp (PNG with a transparent background looks best).')}</span></div></div>`;
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
      if (f === 'wall') o.wall = /^#[0-9a-f]{6}$/i.test(v) && v.toLowerCase() !== '#ecebe7' ? v.toLowerCase() : '';
      commit(f === 'outdoor' || f === 'floor' || f === 'wall' || f === 'area'); return;
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
  function addEntity() {
    const o = selObj(), el = $('#f_eadd'); if (!o || sel?.type !== 'room' || !el) return;
    const e = el.value.trim();
    if (!e) { el.focus(); return; }
    if (!hass?.states?.[e]) { toast(T('Diese Entität gibt es in Home Assistant nicht.', 'That entity does not exist in Home Assistant.')); el.focus(); return; }
    o.add = [...new Set([...(o.add || []), e])]; o.hide = (o.hide || []).filter(x => x !== e); commit(true);
    toast(T(`${fname(e)} wird jetzt in diesem Raum angezeigt.`, `${fname(e)} now shows in this room.`));
  }
  on(right, 'keydown', e => { if (e.target.id === 'f_eadd' && e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); addEntity(); } });
  /* Geräte-Reihenfolge per Drag & Drop */
  let edrag = null;
  on(right, 'pointerdown', e => {
    const g = e.target.closest('[data-grip]'); if (!g || e.button !== 0) return;
    const row = g.closest('.er'); if (!row) return; e.preventDefault();
    g.setPointerCapture?.(e.pointerId); edrag = { row, list: row.parentElement, id: e.pointerId, start: [...row.parentElement.children].map(x => x.dataset.e).join('|') }; row.classList.add('drag');
  });
  on(right, 'pointermove', e => {
    if (!edrag || e.pointerId !== edrag.id) return;
    const { row, list } = edrag; let before = null;
    for (const r of list.children) { if (r === row) continue; const b = r.getBoundingClientRect(); if (e.clientY < b.top + b.height / 2) { before = r; break; } }
    if (before !== row.nextElementSibling && before !== row) list.insertBefore(row, before);
    const lb = list.getBoundingClientRect(); if (e.clientY < lb.top + 24) list.scrollTop -= 8; else if (e.clientY > lb.bottom - 24) list.scrollTop += 8;
  });
  const endEdrag = e => {
    if (!edrag || (e && e.pointerId !== edrag.id)) return;
    const { row, list, start } = edrag; edrag = null; row.classList.remove('drag');
    const order = [...list.children].map(x => x.dataset.e), o = selObj();
    if (o && sel?.type === 'room' && order.join('|') !== start) { o.order = order; commit(true); }
  };
  on(right, 'pointerup', endEdrag); on(right, 'pointercancel', endEdrag);
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
    if (act === 'floor') { o.floor = b.dataset.k; commit(true); return; }
    if (act === 'wall') { o.wall = b.dataset.c || ''; commit(true); return; }
    if (act === 'ehide') { const e = b.dataset.e, s = new Set(o.hide || []); s.has(e) ? s.delete(e) : s.add(e); o.hide = [...s]; commit(true); return; }
    if (act === 'eshowall') { o.hide = []; commit(true); return; }
    if (act === 'ehideall') { o.hide = hbRoomEntities(plan, o, hass).filter(c => c.src !== 'add').map(c => c.eid); commit(true); toast(T('Alle ausgeblendet – jetzt mit dem Auge nur die gewünschten Geräte einblenden.', 'All hidden – now use the eye to show just the devices you want.')); return; }
    if (act === 'eremove') { o.add = (o.add || []).filter(x => x !== b.dataset.e); commit(true); return; }
    if (act === 'eadd') return addEntity();
    if (act === 'eimg') return pickIcon(b.dataset.e);
    if (act === 'eimgdel') { const ic = { ...(plan.icons || {}) }; delete ic[b.dataset.e]; plan.icons = ic; commit(true); return; }
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

/* =====================================================================
   KARTE & KARTEN-EDITOR FÜR HOME ASSISTANT
   ===================================================================== */
class HomeBoo3DCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._v = new HBViewer(this.shadowRoot); }
  setConfig(config) {
    if (!config || typeof config !== 'object') throw new Error('HomeBoo 3D: invalid configuration');
    if (config.plan != null && typeof config.plan !== 'object') throw new Error('HomeBoo 3D: "plan" must be an object');
    this._config = config; this._v.setConfig(config);
  }
  set hass(h) { this._hass = h; this._v.setHass(h); }
  get hass() { return this._hass; }
  connectedCallback() { this._v.connectedCallback(); }
  disconnectedCallback() { this._v.disconnectedCallback(); }
  getCardSize() { return 12; }
  getGridOptions() { return { columns: 'full', rows: 10, min_rows: 6 }; }
  static getConfigElement() { return document.createElement('homeboo-3d-card-editor'); }
  static getStubConfig() { return { title: '', height: '600px', night: 'auto', plan: demoPlan() }; }
}

const HB_EDITOR_CSS = `
:host{display:block}
*{box-sizing:border-box}
.wrap{display:flex;flex-direction:column;gap:16px;font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,system-ui,sans-serif));color:var(--primary-text-color,#e8ecff)}
.hero{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:center;padding:16px;border-radius:16px;background:linear-gradient(135deg,#0f1324,#141a2e);border:1px solid rgba(150,172,255,.22);color:#e8ecff}
.ghost{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;color:#7ef0ff;background:radial-gradient(circle at 50% 40%,rgba(126,240,255,.3),rgba(126,240,255,.05) 70%);filter:drop-shadow(0 0 10px rgba(126,240,255,.45))}
.ghost svg{width:28px;height:28px}
.hero b{display:block;font-size:15px}
.hero span{display:block;font-size:12.5px;color:#9097ba;margin-top:2px}
.open{grid-column:1/-1;height:44px;border:0;border-radius:12px;background:#7ef0ff;color:#04171c;font-weight:700;font-size:14px;font-family:inherit;cursor:pointer;box-shadow:0 0 22px rgba(126,240,255,.35)}
.open:hover{filter:brightness(1.06)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fld{display:flex;flex-direction:column;gap:6px}
.fld label{font-size:12px;font-weight:600;color:var(--secondary-text-color,#9097ba)}
.fld input,.fld select{height:40px;padding:0 12px;border-radius:10px;border:1px solid var(--divider-color,rgba(150,172,255,.25));background:var(--card-background-color,#141a2e);color:var(--primary-text-color,#e8ecff);font:inherit;min-width:0;width:100%}
.fld input[type=color]{padding:4px}
.fld input:focus,.fld select:focus{outline:2px solid var(--primary-color,#7ef0ff);outline-offset:0}
.hint{margin:0;font-size:12px;line-height:1.5;color:var(--secondary-text-color,#9097ba)}
details summary{cursor:pointer;font-size:12.5px;font-weight:600;color:var(--secondary-text-color,#9097ba)}
details .fld{margin-top:10px}
.support{margin:4px 0 0;font-size:12px;text-align:center;color:var(--secondary-text-color,#9097ba)}
.support a{color:var(--primary-color,#7ef0ff);font-weight:600;text-decoration:none}
.support a:hover{text-decoration:underline}
@media (max-width:480px){.grid{grid-template-columns:1fr}}
`;
class HomeBoo3DCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._config = {}; }
  setConfig(c) { this._config = { ...c }; this.render(); }
  set hass(h) { const first = !this._hass; this._hass = h; hbSetLang(h?.language); if (first) this.render(); }
  render() {
    const c = this._config, p = normalizePlan(c.plan), area = p.rooms.filter(r => !r.outdoor).reduce((s, r) => s + Math.abs(polyArea(r.pts)), 0);
    const ae = this.shadowRoot.activeElement?.id;
    this.shadowRoot.innerHTML = `<style>${HB_EDITOR_CSS}</style><div class="wrap">
      <div class="hero"><span class="ghost">${HB_GHOST}</span><div><b>${esc(p.name || 'HomeBoo 3D')}</b><span>${p.rooms.length ? `${p.rooms.length} ${T('Räume', 'rooms')} · ≈ ${Math.round(area)} m² · ${p.devices.length} ${T('Geräte', 'devices')}` : T('Noch kein Grundriss', 'No floor plan yet')}</span></div>
        <button class="open" type="button" id="openPlanner">${T('Grundriss-Editor öffnen', 'Open floor plan editor')}</button></div>
      <div class="grid">
        <div class="fld"><label for="title">${T('Titel', 'Title')}</label><input id="title" data-k="title" value="${esc(c.title || '')}" placeholder="${esc(p.name)}"></div>
        <div class="fld"><label for="height">${T('Höhe', 'Height')}</label><select id="height" data-k="height">${[['600px', '600 px'], ['480px', '480 px'], ['720px', '720 px'], ['900px', '900 px'], ['full', T('Bildschirmhöhe (Panel)', 'Screen height (panel)')]].map(([v, n]) => `<option value="${v}" ${(c.height || '600px') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="fld"><label for="night">${T('Tag und Nacht', 'Day and night')}</label><select id="night" data-k="night">${[['auto', T('Automatisch (Sonnenstand)', 'Automatic (sun)')], ['day', T('Immer Tag', 'Always day')], ['night', T('Immer Nacht', 'Always night')]].map(([v, n]) => `<option value="${v}" ${(c.night || 'auto') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="fld"><label for="accent">${T('Akzentfarbe', 'Accent colour')}</label><input id="accent" type="color" data-k="accent" value="${esc(c.accent || '#7ef0ff')}"></div>
        <div class="fld"><label for="tap">${T('Antippen im 3D-Modell', 'Tapping in the 3D model')}</label><select id="tap" data-k="tap_action">${[['toggle', T('Schaltet direkt', 'Switches directly')], ['details', T('Öffnet erst die Steuerung', 'Opens the controls first')]].map(([v, n]) => `<option value="${v}" ${(c.tap_action || 'toggle') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="fld"><label for="panel">${T('Seitenleiste beim Start', 'Side panel on start')}</label><select id="panel" data-k="panel">${[['open', T('Aufgeklappt', 'Expanded')], ['collapsed', T('Eingeklappt (z. B. Wand-Tablet)', 'Collapsed (e.g. wall tablet)')]].map(([v, n]) => `<option value="${v}" ${(c.panel || 'open') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      </div>
      <p class="hint">${T('Tipp: Verknüpfe jeden Raum im Editor mit einem Bereich aus Home Assistant. Dann erscheinen dessen Geräte automatisch im Raum.', 'Tip: link each room to a Home Assistant area in the editor. Its devices then appear in the room automatically.')}</p>
      <details><summary>${T('Erweitert', 'Advanced')}</summary><div class="fld"><label for="three">${T('Adresse von three.module.js (für Betrieb ohne Internet)', 'URL of three.module.js (for offline use)')}</label><input id="three" data-k="three_url" value="${esc(c.three_url || '')}" placeholder="${HB_THREE_DEFAULT}"></div></details>
      <p class="support">${T('Gefällt dir HomeBoo 3D?', 'Enjoying HomeBoo 3D?')} <a href="${HB_SUPPORT_URL}" target="_blank" rel="noopener noreferrer">☕ ${T('Spendier mir einen Kaffee', 'Buy me a coffee')}</a></p>
    </div>`;
    const sr = this.shadowRoot;
    sr.getElementById('openPlanner').addEventListener('click', () => this.openPlanner());
    sr.querySelectorAll('[data-k]').forEach(el => el.addEventListener('change', () => this.update(el.dataset.k, el.value.trim())));
    if (ae) sr.getElementById(ae)?.focus();
  }
  update(k, v) {
    const c = { ...this._config };
    if (v === '' || v == null || (k === 'night' && v === 'auto') || (k === 'accent' && v.toLowerCase() === '#7ef0ff') || (k === 'height' && v === '600px') || (k === 'tap_action' && v === 'toggle') || (k === 'panel' && v === 'open')) delete c[k]; else c[k] = v;
    this._config = c; this.fire();
  }
  fire() { this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true })); }
  openPlanner() {
    const dlg = document.createElement('dialog');
    dlg.setAttribute('style', 'position:fixed;inset:0;width:100vw;height:100vh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#080a13;color:#e8ecff;overflow:hidden');
    dlg.setAttribute('aria-label', T('Grundriss-Editor', 'Floor plan editor'));
    const host = document.createElement('div'); host.style.cssText = 'position:absolute;inset:0'; dlg.appendChild(host);
    const sr = host.attachShadow({ mode: 'open' });
    document.body.appendChild(dlg);
    let pl = null;
    const close = () => { pl?.destroy(); try { dlg.close(); } catch (e) {} dlg.remove(); };
    dlg.addEventListener('cancel', e => e.preventDefault());
    pl = hbCreatePlanner(sr, {
      plan: this._config.plan || emptyPlan(), hass: this._hass, threeUrl: this._config.three_url,
      onApply: plan => { this._config = { ...this._config, plan }; this.fire(); this.render(); close(); },
      onCancel: close,
    });
    try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
  }
}

if (!customElements.get('homeboo-3d-card')) customElements.define('homeboo-3d-card', HomeBoo3DCard);
if (!customElements.get('homeboo-3d-card-editor')) customElements.define('homeboo-3d-card-editor', HomeBoo3DCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'homeboo-3d-card')) window.customCards.push({ type: 'homeboo-3d-card', name: 'HomeBoo 3D', description: T('Deine Wohnung als 3D-Modell: Räume antippen und Geräte direkt im Raum schalten.', 'Your home as a 3D model: tap a room and control its devices right there.'), preview: true, documentationURL: 'https://github.com/AbuTvboo/homeboo-3d-card' });
console.info(`%c HOMEBOO 3D %c v${HB_VERSION} `, 'background:#7ef0ff;color:#04171c;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px', 'background:#141a2e;color:#7ef0ff;padding:2px 6px;border-radius:0 4px 4px 0');
