
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
