
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
  function planks(ctx, s, { h, sat, light, vary = 7, rows = 8, gapA = 0.32 }) {
    const rh = s / rows;
    for (let r = 0; r < rows; r++) {
      let x = rnd() * s; const st = x;
      while (x < st + s) {
        const ln = s * (0.32 + rnd() * 0.42), col = `hsl(${h + (rnd() - .5) * 6},${sat + (rnd() - .5) * 6}%,${light + (rnd() - .5) * vary}%)`;
        for (const ox of [0, -s]) {
          ctx.fillStyle = col; ctx.fillRect(x + ox, r * rh, ln, rh);
          for (let k = 0; k < 8; k++) { ctx.strokeStyle = `rgba(30,16,6,${0.03 + rnd() * 0.06})`; ctx.lineWidth = 0.6 + rnd(); ctx.beginPath(); const y0 = r * rh + rnd() * rh; ctx.moveTo(x + ox, y0); ctx.bezierCurveTo(x + ox + ln * .3, y0 + (rnd() - .5) * rh * .3, x + ox + ln * .7, y0 + (rnd() - .5) * rh * .3, x + ox + ln, y0 + (rnd() - .5) * rh * .2); ctx.stroke(); }
          ctx.fillStyle = `rgba(20,10,4,${gapA})`; ctx.fillRect(x + ox, r * rh, 2, rh);
        }
        x += ln;
      }
      ctx.fillStyle = `rgba(20,10,4,${gapA})`; ctx.fillRect(0, r * rh, s, 2);
    }
  }
  function tiles(ctx, s, { n, h, sat, light, grout }) { const ts = s / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { ctx.fillStyle = `hsl(${h},${sat}%,${light + (rnd() - .5) * 4}%)`; ctx.fillRect(i * ts, j * ts, ts, ts); for (let k = 0; k < ts; k++) { ctx.fillStyle = `rgba(255,255,255,${0.04 * rnd()})`; ctx.fillRect(i * ts + rnd() * ts, j * ts + rnd() * ts, 1.5, 1.5); } } ctx.fillStyle = grout; for (let i = 0; i <= n; i++) { ctx.fillRect(i * ts - 1.5, 0, 3, s); ctx.fillRect(0, i * ts - 1.5, s, 3); } }
  const std = (color, roughness = 0.8, metalness = 0, ex = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...ex });
  const FLOORM = {
    oak: std('#fff', 0.72, 0, { map: mkCanvasTex(1024, (c, s) => planks(c, s, { h: 28, sat: 42, light: 42 }), 2.4) }),
    ash: std('#fff', 0.72, 0, { map: mkCanvasTex(1024, (c, s) => planks(c, s, { h: 32, sat: 30, light: 56, vary: 6 }), 2.4) }),
    deck: std('#fff', 0.8, 0, { map: mkCanvasTex(512, (c, s) => planks(c, s, { h: 26, sat: 36, light: 47, rows: 6, gapA: 0.6 }), 1.6) }),
    slate: std('#fff', 0.55, 0, { map: mkCanvasTex(512, (c, s) => tiles(c, s, { n: 2, h: 222, sat: 10, light: 17, grout: 'rgba(160,170,200,.12)' }), 1.2) }),
    tile: std('#fff', 0.4, 0, { map: mkCanvasTex(512, (c, s) => tiles(c, s, { n: 4, h: 220, sat: 8, light: 24, grout: 'rgba(210,215,230,.16)' }), 1.0) }),
    carpet: std('#5a566e', 1),
    grass: std('#fff', 1, 0, { map: mkCanvasTex(512, (c, s) => { c.fillStyle = '#3f6b34'; c.fillRect(0, 0, s, s); for (let i = 0; i < 8000; i++) { c.strokeStyle = `rgba(${40 + rnd() * 40},${90 + rnd() * 70},${30 + rnd() * 30},.75)`; c.lineWidth = 1; const x = rnd() * s, y = rnd() * s; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - .5) * 4, y - 3 - rnd() * 5); c.stroke(); } }, 1.4) }),
  };
  const M = {
    wall: std('#ecebe7', 0.92), wallTop: std('#1c2032', 0.75), slab: std('#141a2c', 0.9),
    glass: std('#cde9ff', 0.05, 0.1, { transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }),
    frame: std('#2a2f3d', 0.5, 0.3), shutter: std('#394054', 0.55, 0.35), door: std('#efede8', 0.6), front: std('#3c2a20', 0.55), steel: std('#c3c8d0', 0.32, 0.75), black: std('#1a1c22', 0.45), white: std('#f1f0ec', 0.5), ceramic: std('#f8f8f6', 0.16),
    cabinet: std('#2c3140', 0.5), stone: std('#d9d6cf', 0.35), oak: std('#b88a5e', 0.65), walnut: std('#6a4a33', 0.6), oakL: std('#cba57a', 0.6),
    rose: std('#9d7c79', 0.97), slate: std('#55617f', 0.97), sand: std('#c4b3a1', 0.97), charcoal: std('#3a3d46', 0.97), cushion: std('#e6dccd', 0.98), linen: std('#eeeae3', 0.95), throwA: std('#7b8fae', 0.98), throwB: std('#b9806a', 0.98),
    leaf: std('#4c8546', 0.75, 0, { flatShading: true }), leaf2: std('#6aa257', 0.75, 0, { flatShading: true }), pot: std('#d8d2c8', 0.8), terracotta: std('#b46c4b', 0.85), mirror: std('#d9e6f2', 0.03, 0.95), water: std('#9fd7e8', 0.08, 0, { transparent: true, opacity: 0.75 }), teak: std('#9a6b44', 0.7), seam: std('#151821', 0.6), rug: std('#3e4560', 1),
    books: ['#a85b4f', '#3f6c8a', '#c8a256', '#55745a', '#7a5c8f', '#d9d2c4'].map(c => std(c, 0.8)),
    sensor: std('#1b2033', 0.4, 0, { emissive: '#7ef0ff', emissiveIntensity: 1.2 }),
  };
  const WALLM = [M.wall, M.wall, M.wallTop, M.wall, M.wall, M.wall];
  const own = m => { m.userData.own = true; return m; };

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
    const piece = (x0, x1, y0, y1) => { if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return; const m = sh(new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, t), WALLM)); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(m); };
    const glaz = (cx, w, y0, h, isDoor) => { const fr = 0.05, fz = t * 0.45; g.add(at(bx(w, fr, fz, M.frame), cx, y0 + h - fr / 2, 0)); if (!isDoor) g.add(at(bx(w, fr, fz, M.frame), cx, y0 + fr / 2, 0)); g.add(at(bx(fr, h, fz, M.frame), cx - w / 2 + fr / 2, y0 + h / 2, 0), at(bx(fr, h, fz, M.frame), cx + w / 2 - fr / 2, y0 + h / 2, 0)); if (w > 1.05) g.add(at(bx(fr * 0.8, h, fz, M.frame), cx, y0 + h / 2, 0)); const gl = new THREE.Mesh(new THREE.PlaneGeometry(Math.max(0.05, w - fr * 2), Math.max(0.05, h - fr)), M.glass); gl.position.set(cx, y0 + h / 2, 0); g.add(gl); if (isDoor) g.add(at(bx(w, 0.02, t, M.frame), cx, 0.01, 0)); };
    const ops = pc.ops.map(x => ({ ...x, s: clamp(x.c - x.w / 2, 0, L), e: clamp(x.c + x.w / 2, 0, L) })).sort((a, b) => a.s - b.s);
    let cur = -t / 2;
    for (const x of ops) {
      const o = x.o, w = x.e - x.s, cx = (x.s + x.e) / 2, h = Math.min(o.h, H - 0.05), op = openingPos(plan, o);
      piece(cur, x.s, 0, H);
      if (o.type === 'window') { const sill = Math.min(o.sill, H - 0.3), hh = Math.min(h, H - sill - 0.05); piece(x.s, x.e, 0, sill); piece(x.s, x.e, sill + hh, H); glaz(cx, w, sill, hh, false); addShutter(o, op, cx, w, sill + hh, hh); }
      else {
        piece(x.s, x.e, h, H);
        if (o.type === 'gdoor') { glaz(cx, w, 0, h, true); addShutter(o, op, cx, w, h, h); }
        else if (op) {
          const ns = o.flipSide ? mul(op.n, -1) : op.n, s = Math.sign(cross(u, ns)) || 1;
          const hingeEnd = o.flipHinge ? add(op.c, mul(op.u, o.w / 2)) : sub(op.c, mul(op.u, o.w / 2));
          const hx = clamp(dot(sub(hingeEnd, pc.a), u), x.s, x.e), dir = hx <= cx ? 1 : -1, lw = w - 0.04;
          if (o.type === 'front') {
            g.add(at(bx(lw, h - 0.02, 0.07, M.front), cx, (h - 0.02) / 2, 0));
            const led = own(std('#222', 0.4, 0, { emissive: '#7ef0ff', emissiveIntensity: 0.4 }));
            for (const z of [-0.05, 0.05]) { g.add(at(bx(0.025, 0.3, 0.02, M.steel), cx + dir * (lw / 2 - 0.1), 1.05, z)); g.add(at(bx(0.03, 0.16, 0.012, led), cx + dir * (lw / 2 - 0.1), 1.32, z * 1.05)); }
            reg.locks.set(o.id, { mat: led, cur: 0.5, target: 0.5 });
          } else {
            const pivot = new THREE.Group(); pivot.position.set(hx, 0, s * (t / 2 - 0.02));
            pivot.add(at(bx(lw, h - 0.02, 0.04, M.door), dir * lw / 2, (h - 0.02) / 2, 0), at(bx(0.12, 0.025, 0.06, M.steel), dir * (lw - 0.1), 1.02, 0));
            pivot.rotation.y = -s * dir * 1.25; g.add(pivot);
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
    reg = { lights: new Map(), shutters: new Map(), screens: new Map(), locks: new Map(), drums: new Map(), rooms: new Map(), floors: [], bbox: null, radius: 6, center: [0, 0] };
    const all = plan.rooms.flatMap(r => r.pts);
    if (!all.length) return reg;
    const b = bbox(all); ctr = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]; reg.bbox = b; reg.center = ctr.slice(); reg.radius = Math.hypot(b.x1 - b.x0, b.y1 - b.y0) / 2;
    seed = 11;
    const shadowR = Math.max(10, reg.radius + 3); Object.assign(sun.shadow.camera, { left: -shadowR, right: shadowR, top: shadowR, bottom: -shadowR }); sun.shadow.camera.updateProjectionMatrix();
    halo.scale.setScalar(Math.max(0.6, reg.radius / 9));
    for (const r of plan.rooms) {
      const slab = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(offsetPoly(r.pts, 0.2).map(p => { const q = P3(p); return new THREE.Vector2(q[0], -q[1]); })), { depth: 0.28, bevelEnabled: false }), M.slab);
      slab.geometry.rotateX(-Math.PI / 2); slab.position.y = -0.281; slab.receiveShadow = true; content.add(slab);
      const geo = shapeGeo(r.pts);
      const floor = new THREE.Mesh(geo, FLOORM[r.floor] || FLOORM.ash); floor.position.y = 0.002; floor.receiveShadow = true; floor.userData.room = r.id; content.add(floor); reg.floors.push(floor);
      const fill = new THREE.Mesh(geo, own(new THREE.MeshBasicMaterial({ color: '#7ef0ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))); fill.position.y = 0.02; fill.renderOrder = 2; content.add(fill);
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(r.pts.map(p => { const q = P3(p); return new THREE.Vector3(q[0], 0.035, q[1]); })), own(new THREE.LineBasicMaterial({ color: '#7ef0ff', transparent: true, opacity: 0 }))); line.renderOrder = 3; content.add(line);
      const c = centroid(r.pts); reg.rooms.set(r.id, { center: c, radius: Math.max(...r.pts.map(p => dist(p, c))), fill, line, cur: 0, target: 0, poly: r.pts });
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
        case 'washer': { o = grp(at(rb(it.w, 0.84, it.d, M.white, 0.03), 0, 0.42, 0)); const ring = new THREE.Mesh(new THREE.TorusGeometry(Math.min(it.w, 0.6) * 0.28, 0.025, 10, 32), M.steel); ring.position.set(0, 0.42, it.d / 2 + 0.005); o.add(ring); const dm = own(std('#111', 0.4, 0, { emissive: '#7ef0ff', emissiveIntensity: 0 })); const drum = new THREE.Mesh(new THREE.TorusGeometry(Math.min(it.w, 0.6) * 0.18, 0.008, 6, 28, Math.PI * 1.4), dm); drum.position.set(0, 0.42, it.d / 2 + 0.01); o.add(drum); reg.drums.set(it.id, { mat: dm, drum, cur: 0, target: 0 }); break; }
        case 'lounger': o = lounger(it.w, it.d); break;
        default: continue;
      }
      const q = P3([it.x, it.y]); o.position.set(q[0], 0, q[1]); o.rotation.y = -it.rot * DEG; content.add(o);
    }
    let nPL = 0;
    const addLight = (key, x, y, h, I, R, poly, mats) => {
      const L = { cur: 0, target: 0, color: new THREE.Color('#ffc78a'), I, pl: null, decals: [], mats: mats || [] };
      const q = P3([x, y]);
      if (I > 0 && nPL < 16) { L.pl = new THREE.PointLight('#ffc78a', 0, Math.max(5, R * 2), 2); L.pl.position.set(q[0], h, q[1]); content.add(L.pl); nPL++; }
      if (poly) { const d = decal(poly, x, y, R); content.add(d); L.decals.push(d); }
      reg.lights.set(key, L); return L;
    };
    for (const d of plan.devices) {
      const q = P3([d.x, d.y]);
      if (d.kind === 'sensor') { content.add(at(rb(0.12, 0.12, 0.04, M.sensor, 0.015), q[0], 1.5, q[1])); continue; }
      const room = roomOfPoint(plan, d.x, d.y), gm = own(std('#f4efe6', 0.35, 0, { emissive: '#000000' }));
      if (d.kind === 'light') { const y = clamp(d.h ?? 2.1, 0.4, plan.wallHeight); content.add(at(cyl(0.006, 0.006, Math.max(0.01, plan.wallHeight - y), M.black, 6), q[0], (plan.wallHeight + y) / 2, q[1]), at(sph(0.15, gm, 20, 14), q[0], y - 0.08, q[1])); addLight('dev:' + d.id, d.x, d.y, y - 0.25, 6, 3.4, room?.pts, [gm]); }
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
      for (const r of reg.rooms.values()) { r.cur += (r.target - r.cur) * k * 1.4; r.line.material.opacity = r.cur * 0.95; r.fill.material.opacity = r.cur * 0.07; }
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
  orbit.onUser = () => { tween = null; };
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
  function project(x, y, h = 0.2) { tmp.set(x - ctr[0], h, y - ctr[1]).project(camera); return { x: (tmp.x + 1) / 2 * canvas.clientWidth, y: (1 - tmp.y) / 2 * canvas.clientHeight, vis: tmp.z < 1 }; }
  function resize(w, h, ox = 0, oy = 0) { if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.setViewOffset(w, h, ox, oy, w, h); camera.updateProjectionMatrix(); }
  function fitDistance(r, availW, availH, H) { const tv = Math.tan(camera.fov * DEG / 2); const fv = 2 * Math.atan(tv * availH / H), fh = 2 * Math.atan(tv * availW / H); return r / Math.sin(Math.min(fv, fh) / 2); }
  function loadPicture(id, url) {
    const s = reg?.screens.get(id); if (!s) return;
    if (!url) { if (s.pic) { s.mat.emissiveMap = s.base; s.mat.needsUpdate = true; s.pic = null; } return; }
    if (s.pic === url) return; s.pic = url;
    new THREE.TextureLoader().load(url, tex => { if (s.pic !== url) { tex.dispose(); return; } tex.colorSpace = THREE.SRGBColorSpace; s.mat.emissiveMap = tex; s.mat.needsUpdate = true; }, undefined, () => {});
  }
  function dispose() { clear(wallGroup); clear(content); renderer.dispose(); pmrem.dispose(); }
  return {
    THREE, renderer, camera, orbit, build, frame, flyTo, jumpTo, pick, project, resize, fitDistance, loadPicture, dispose,
    reg: () => reg, setNight: v => { nightTarget = v; }, setWallsLow: v => { wallTarget = v ? 0.42 : 1; }, wallsLow: () => wallTarget < 1, isFlying: () => !!tween,
  };
}
