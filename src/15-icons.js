
/* =====================================================================
   SYMBOL-BIBLIOTHEK (eingebaute Icons im HomeBoo-Stil)
   ===================================================================== */
const hbIconDefs = p => `
<linearGradient id="${p}-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f0e4"/><stop offset="1" stop-color="#d6c7ae"/></linearGradient>
<linearGradient id="${p}-shadeH" x1="0" x2="1"><stop offset="0" stop-color="#c9b89c"/><stop offset=".42" stop-color="#f8f2e7"/><stop offset="1" stop-color="#c4b296"/></linearGradient>
<radialGradient id="${p}-warm" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#fffaf0"/><stop offset=".45" stop-color="#ffe2b0"/><stop offset="1" stop-color="#ffb35a"/></radialGradient>
<linearGradient id="${p}-brass" x1="0" x2="1"><stop offset="0" stop-color="#94692f"/><stop offset=".33" stop-color="#ecd296"/><stop offset=".62" stop-color="#c39a55"/><stop offset="1" stop-color="#83602a"/></linearGradient>
<linearGradient id="${p}-black" x1="0" x2="1"><stop offset="0" stop-color="#171a21"/><stop offset=".38" stop-color="#454b59"/><stop offset="1" stop-color="#1a1d24"/></linearGradient>
<linearGradient id="${p}-blackV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5160"/><stop offset="1" stop-color="#1b1e26"/></linearGradient>
<linearGradient id="${p}-white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d0d6df"/></linearGradient>
<linearGradient id="${p}-whiteH" x1="0" x2="1"><stop offset="0" stop-color="#c9d0da"/><stop offset=".4" stop-color="#ffffff"/><stop offset="1" stop-color="#c3cad5"/></linearGradient>
<linearGradient id="${p}-steel" x1="0" x2="1"><stop offset="0" stop-color="#7f889a"/><stop offset=".45" stop-color="#eef1f6"/><stop offset="1" stop-color="#737c8d"/></linearGradient>
<linearGradient id="${p}-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4a677"/><stop offset="1" stop-color="#8f6139"/></linearGradient>
<linearGradient id="${p}-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f7ff" stop-opacity=".95"/><stop offset="1" stop-color="#8fbfe0" stop-opacity=".8"/></linearGradient>
<linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd6ff"/><stop offset="1" stop-color="#d9f0ff"/></linearGradient>
<linearGradient id="${p}-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16407a"/><stop offset=".55" stop-color="#43268a"/><stop offset="1" stop-color="#0d5868"/></linearGradient>
<radialGradient id="${p}-shadow"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${p}-glow"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".95"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
<radialGradient id="${p}-cglow"><stop offset="0" stop-color="#7ef0ff" stop-opacity=".9"/><stop offset="1" stop-color="#7ef0ff" stop-opacity="0"/></radialGradient>
<linearGradient id="${p}-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff1b8"/><stop offset=".4" stop-color="#ffa340"/><stop offset="1" stop-color="#ff4d1a"/></linearGradient>
<linearGradient id="${p}-terra" x1="0" x2="1"><stop offset="0" stop-color="#93492e"/><stop offset=".42" stop-color="#df9369"/><stop offset="1" stop-color="#86422a"/></linearGradient>
<linearGradient id="${p}-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eeeae3"/><stop offset="1" stop-color="#b9b2a5"/></linearGradient>
<linearGradient id="${p}-opal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#f0dcbc"/></linearGradient>
<linearGradient id="${p}-beamD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></linearGradient>
<linearGradient id="${p}-beamU" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></linearGradient>
<linearGradient id="${p}-neon" gradientUnits="userSpaceOnUse" x1="30" y1="200" x2="226" y2="60"><stop offset="0" stop-color="#7ef0ff"/><stop offset=".5" stop-color="#b48cff"/><stop offset="1" stop-color="#ff6fb5"/></linearGradient>
<linearGradient id="${p}-fabric" x1="0" x2="1"><stop offset="0" stop-color="#2a2e38"/><stop offset=".42" stop-color="#5a6172"/><stop offset="1" stop-color="#262a33"/></linearGradient>
<pattern id="${p}-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.1" fill="#000" fill-opacity=".28"/></pattern>
<filter id="${p}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="${p}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>`;
const HBI_RIM = 'stroke="#ffffff" stroke-opacity=".16" stroke-width="2"';
const hbiShadow = (u, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${u('shadow')}"/>`;
const HB_ICONLIB = {
  'stehlampe': ['Stehlampe', 'Floor lamp', 'licht', u => `${hbiShadow(u, 128, 226, 62, 10)}
    <ellipse cx="128" cy="220" rx="46" ry="10" fill="${u('black')}"/><ellipse cx="128" cy="216" rx="46" ry="9" fill="#3d4350" ${HBI_RIM}/>
    <rect x="124.5" y="98" width="7" height="118" rx="3" fill="${u('black')}" ${HBI_RIM}/>
    <path d="M84 30 L172 30 L190 104 L66 104 Z" fill="${u('shadeH')}"/>
    <ellipse cx="128" cy="30" rx="44" ry="7" fill="#efe6d5"/>
    <ellipse cx="128" cy="104" rx="62" ry="10" fill="${u('warm')}"/>`],

  'bogenlampe': ['Bogenlampe', 'Arc lamp', 'licht', u => `${hbiShadow(u, 92, 226, 52, 9)}
    <rect x="60" y="188" width="64" height="34" rx="7" fill="${u('stone')}"/><rect x="60" y="188" width="64" height="9" rx="4" fill="#f7f4ee"/>
    <path d="M92 190 C 90 64, 168 18, 202 86" fill="none" stroke="#c9ced8" stroke-width="7" stroke-linecap="round"/>
    <path d="M92 190 C 90 64, 168 18, 202 86" fill="none" stroke="#ffffff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
    <rect x="197" y="84" width="10" height="12" rx="3" fill="${u('black')}"/>
    <path d="M164 132 A38 38 0 0 1 240 132 Z" fill="${u('brass')}"/>
    <ellipse cx="202" cy="132" rx="38" ry="8" fill="${u('warm')}"/>`],

  'deckenleuchte': ['Deckenleuchte', 'Ceiling light', 'licht', u => `<g transform="translate(0 30)">
    <rect x="96" y="56" width="64" height="12" rx="6" fill="${u('white')}"/><rect x="124" y="66" width="8" height="26" fill="${u('steel')}"/>
    <ellipse cx="128" cy="96" rx="96" ry="20" fill="#f4f6f9"/>
    <path d="M32 96 L32 134 A96 20 0 0 0 224 134 L224 96 Z" fill="${u('whiteH')}"/>
    <ellipse cx="128" cy="134" rx="96" ry="20" fill="${u('warm')}"/>
    <ellipse cx="128" cy="134" rx="70" ry="12" fill="#fffaf0" opacity=".7"/></g>`],

  'pendelleuchte': ['Pendelleuchte', 'Pendant light', 'licht', u => `
    <line x1="128" y1="14" x2="128" y2="92" stroke="#3d4350" stroke-width="3"/>
    <rect x="114" y="86" width="28" height="18" rx="5" fill="${u('black')}" ${HBI_RIM}/>
    <path d="M48 190 A80 88 0 0 1 208 190 Z" fill="${u('black')}" ${HBI_RIM}/>
    <ellipse cx="128" cy="190" rx="80" ry="13" fill="${u('brass')}"/>
    <ellipse cx="128" cy="191" rx="70" ry="9" fill="${u('warm')}"/>
    <circle cx="128" cy="196" r="10" fill="#fffaf0"/>`],

  'pendel-trio': ['Pendel-Trio', 'Pendant trio', 'licht', u => {
    const one = (x, y) => `<line x1="${x}" y1="10" x2="${x}" y2="${y - 30}" stroke="#3d4350" stroke-width="2.5"/><rect x="${x - 7}" y="${y - 34}" width="14" height="10" rx="2" fill="${u('brass')}"/>
      <circle cx="${x}" cy="${y}" r="30" fill="#5d6b80" fill-opacity=".35" stroke="#cfe6ff" stroke-opacity=".55" stroke-width="2"/>
      <circle cx="${x}" cy="${y + 2}" r="22" fill="${u('glow')}"/><circle cx="${x}" cy="${y + 2}" r="9" fill="#fffaf0"/>
      <path d="M${x - 18} ${y - 12} A24 24 0 0 1 ${x - 4} ${y - 24}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`;
    return one(60, 150) + one(128, 112) + one(196, 150);
  }],

  'tischlampe': ['Tischlampe', 'Table lamp', 'licht', u => `${hbiShadow(u, 128, 226, 60, 8)}
    <path d="M100 222 Q84 188 104 160 Q114 148 128 148 Q142 148 152 160 Q172 188 156 222 Z" fill="${u('terra')}"/>
    <ellipse cx="128" cy="222" rx="28" ry="5" fill="#7a3a24"/>
    <rect x="122" y="134" width="12" height="16" fill="${u('brass')}"/>
    <path d="M78 54 L178 54 L204 136 L52 136 Z" fill="${u('shadeH')}"/>
    <ellipse cx="128" cy="54" rx="50" ry="7" fill="#efe6d5"/>
    <ellipse cx="128" cy="136" rx="76" ry="11" fill="${u('warm')}"/>`],

  'leselampe': ['Leselampe', 'Reading lamp', 'licht', u => `${hbiShadow(u, 92, 226, 52, 9)}
    <ellipse cx="92" cy="220" rx="40" ry="9" fill="${u('black')}"/><ellipse cx="92" cy="216" rx="40" ry="8" fill="#3d4350" ${HBI_RIM}/>
    <rect x="88.5" y="70" width="7" height="146" rx="3" fill="${u('black')}" ${HBI_RIM}/>
    <path d="M92 74 Q140 40 176 58" fill="none" stroke="#2a2f39" stroke-width="7" stroke-linecap="round"/>
    <circle cx="92" cy="74" r="7" fill="${u('brass')}"/>
    <g transform="translate(180 66) rotate(28)"><path d="M-16 -8 L16 -8 L34 40 L-34 40 Z" fill="${u('brass')}"/><ellipse cx="0" cy="40" rx="34" ry="8" fill="${u('warm')}"/></g>`],

  'schreibtischlampe': ['Schreibtischlampe', 'Desk lamp', 'licht', u => `${hbiShadow(u, 92, 224, 56, 9)}
    <rect x="44" y="204" width="96" height="16" rx="8" fill="${u('black')}" ${HBI_RIM}/>
    <path d="M86 206 L112 116" stroke="#2a2f39" stroke-width="9" stroke-linecap="round"/>
    <path d="M112 116 L176 74" stroke="#2a2f39" stroke-width="9" stroke-linecap="round"/>
    <circle cx="86" cy="204" r="8" fill="#7ef0ff"/><circle cx="112" cy="116" r="9" fill="#7ef0ff"/><circle cx="112" cy="116" r="4" fill="#0f1324"/>
    <g transform="translate(184 84) rotate(38)"><rect x="-8" y="-20" width="16" height="16" rx="4" fill="#2a2f39"/><path d="M-14 -6 L14 -6 L34 44 L-34 44 Z" fill="${u('black')}" ${HBI_RIM}/><ellipse cx="0" cy="44" rx="34" ry="8" fill="${u('warm')}"/></g>`],

  'wandleuchte': ['Wandleuchte', 'Wall light', 'licht', u => `
    <path d="M104 72 L152 72 L204 8 L52 8 Z" fill="${u('beamU')}"/>
    <path d="M104 184 L152 184 L204 248 L52 248 Z" fill="${u('beamD')}"/>
    <rect x="96" y="104" width="64" height="52" rx="10" fill="${u('stone')}"/>
    <rect x="102" y="70" width="52" height="116" rx="8" fill="${u('brass')}"/>
    <ellipse cx="128" cy="72" rx="26" ry="6" fill="${u('warm')}"/><ellipse cx="128" cy="184" rx="26" ry="6" fill="${u('warm')}"/>`],

  'spiegelleuchte': ['Spiegelleuchte', 'Mirror light', 'licht', u => `
    <rect x="54" y="66" width="148" height="166" rx="16" fill="${u('glass')}" stroke="${u('steel')}" stroke-width="5"/>
    <path d="M80 92 L120 92 L84 204 L60 204 Z" fill="#fff" opacity=".28"/><path d="M128 92 L144 92 L108 204 L92 204 Z" fill="#fff" opacity=".18"/>
    <rect x="58" y="34" width="140" height="22" rx="11" fill="${u('white')}"/>
    <rect x="66" y="50" width="124" height="7" rx="3.5" fill="${u('warm')}"/>`],

  'spot': ['Spots', 'Spotlights', 'licht', u => {
    const sp = (x, rot) => `<g transform="translate(${x} 74) rotate(${rot})"><rect x="-5" y="0" width="10" height="22" fill="#2a2f39"/><rect x="-24" y="18" width="48" height="72" rx="12" fill="${u('black')}" ${HBI_RIM}/><ellipse cx="0" cy="90" rx="24" ry="7" fill="${u('warm')}"/></g>`;
    return '<g transform="translate(0 26)">' + `<rect x="28" y="60" width="200" height="16" rx="8" fill="${u('black')}" ${HBI_RIM}/>` + sp(84, 16) + sp(172, -16) + '</g>';
  }],

  'led-streifen': ['LED-Streifen', 'LED strip', 'licht', u => `
    <path d="M36 196 C 92 112, 150 232, 204 152 S 226 70, 156 62" fill="none" stroke="${u('neon')}" stroke-width="34" stroke-linecap="round" filter="url(#${'P'}-blur)" opacity=".7"/>
    <path d="M36 196 C 92 112, 150 232, 204 152 S 226 70, 156 62" fill="none" stroke="#e9ecf2" stroke-width="22" stroke-linecap="round"/>
    <path d="M36 196 C 92 112, 150 232, 204 152 S 226 70, 156 62" fill="none" stroke="${u('neon')}" stroke-width="10" stroke-dasharray="9 9" stroke-linecap="round"/>`],

  'lichterkette': ['Lichterkette', 'String lights', 'licht', u => {
    const P0 = [14, 74], P1 = [128, 210], P2 = [242, 74], B = t => [0, 1].map(k => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t ** 2 * P2[k]);
    let s = `<path d="M14 74 Q128 210 242 74" fill="none" stroke="#3d4350" stroke-width="4"/>`;
    for (let i = 0; i < 9; i++) { const [x, y] = B(0.08 + i * 0.105); s += `<circle cx="${x}" cy="${y + 20}" r="20" fill="${u('glow')}"/><rect x="${x - 4}" y="${y - 2}" width="8" height="10" rx="2" fill="#2a2f39"/><ellipse cx="${x}" cy="${y + 20}" rx="8" ry="12" fill="${u('warm')}"/>`; }
    return s;
  }],

  'gluehbirne': ['Glühbirne', 'Light bulb', 'licht', u => `
    <circle cx="128" cy="96" r="84" fill="${u('glow')}" opacity=".5"/>
    <path d="M128 26 C 70 26 50 76 62 110 C 72 138 98 150 100 176 L156 176 C 158 150 184 138 194 110 C 206 76 186 26 128 26 Z" fill="${u('warm')}" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
    <path d="M94 54 C 80 64 74 80 76 98" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".75"/>
    <path d="M110 176 L110 124 Q128 96 146 124 L146 176" fill="none" stroke="#ff9f3c" stroke-width="3"/>
    <rect x="100" y="174" width="56" height="40" rx="6" fill="${u('steel')}"/>
    <path d="M100 186 L156 182 M100 198 L156 194 M100 210 L156 206" stroke="#5f6878" stroke-width="3"/>
    <path d="M112 214 L144 214 L136 230 L120 230 Z" fill="#2a2f39"/>`],

  'nachttischlampe': ['Nachttischlampe', 'Bedside lamp', 'licht', u => `${hbiShadow(u, 128, 222, 56, 8)}
    <circle cx="128" cy="118" r="78" fill="${u('glow')}" opacity=".35"/>
    <path d="M108 136 Q118 176 102 216 L154 216 Q138 176 148 136 Z" fill="${u('opal')}"/>
    <path d="M60 138 A68 64 0 0 1 196 138 Z" fill="${u('opal')}" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    <ellipse cx="128" cy="138" rx="68" ry="11" fill="${u('warm')}"/>
    <path d="M84 110 A48 44 0 0 1 112 82" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`],

  'aussenleuchte': ['Außenleuchte', 'Outdoor light', 'licht', u => `
    <rect x="36" y="70" width="24" height="128" rx="7" fill="${u('black')}" ${HBI_RIM}/>
    <path d="M60 104 L92 104" stroke="#2a2f39" stroke-width="8" stroke-linecap="round"/>
    <circle cx="128" cy="140" r="70" fill="${u('glow')}" opacity=".45"/>
    <path d="M80 86 L176 86 L158 54 L98 54 Z" fill="${u('black')}" ${HBI_RIM}/><rect x="122" y="40" width="12" height="16" rx="3" fill="#2a2f39"/>
    <rect x="90" y="86" width="76" height="108" fill="${u('glass')}" opacity=".55"/>
    <circle cx="128" cy="138" r="18" fill="${u('warm')}"/>
    <path d="M90 86 L90 194 M166 86 L166 194 M128 86 L128 116 M128 160 L128 194" stroke="#2a2f39" stroke-width="6"/>
    <rect x="84" y="190" width="88" height="12" rx="4" fill="${u('black')}" ${HBI_RIM}/>`],

  'fernseher': ['Fernseher', 'TV', 'medien', u => `${hbiShadow(u, 128, 214, 70, 8)}
    <rect x="20" y="46" width="216" height="134" rx="10" fill="#0d0f14" ${HBI_RIM}/>
    <rect x="28" y="54" width="200" height="118" rx="5" fill="${u('screen')}"/>
    <circle cx="80" cy="96" r="60" fill="${u('cglow')}" opacity=".45"/><circle cx="182" cy="142" r="56" fill="#ff6fb5" opacity=".18" filter="url(#P-blur)"/>
    <path d="M28 54 L120 54 L52 172 L28 172 Z" fill="#fff" opacity=".07"/>
    <rect x="118" y="180" width="20" height="18" fill="${u('steel')}"/><rect x="80" y="196" width="96" height="9" rx="4.5" fill="${u('steel')}"/>`],

  'rollladen': ['Rollladen', 'Roller shutter', 'fenster', u => {
    let s = `<rect x="50" y="40" width="156" height="182" rx="8" fill="${u('white')}"/><rect x="64" y="54" width="128" height="154" fill="${u('sky')}"/>
      <rect x="126" y="54" width="4" height="154" fill="#ffffff"/>`;
    for (let y = 54; y < 128; y += 11) s += `<rect x="64" y="${y}" width="128" height="9" rx="2" fill="${u('steel')}"/>`;
    return s + `<rect x="62" y="128" width="132" height="8" rx="3" fill="#5f6878"/><rect x="42" y="22" width="172" height="26" rx="7" fill="${u('whiteH')}"/>`;
  }],

  'kamin': ['Kamin', 'Fireplace', 'haushalt', u => `
    <rect x="34" y="62" width="188" height="164" rx="8" fill="${u('stone')}"/>
    <rect x="22" y="50" width="212" height="20" rx="5" fill="${u('wood')}"/>
    <path d="M74 226 L74 140 Q128 96 182 140 L182 226 Z" fill="#14161b"/>
    <ellipse cx="128" cy="212" rx="56" ry="16" fill="${u('glow')}" opacity=".9"/>
    <path d="M128 132 C 152 160 158 182 146 206 C 160 198 166 186 164 172 C 176 190 172 212 152 220 L104 220 C 84 212 80 190 92 172 C 92 186 98 196 110 204 C 100 180 108 156 128 132 Z" fill="${u('fire')}"/>
    <path d="M128 168 C 140 182 142 200 132 214 L122 214 C 114 202 116 184 128 168 Z" fill="#fff4c4"/>
    <rect x="92" y="212" width="72" height="12" rx="6" fill="#6b4428" transform="rotate(-6 128 218)"/><rect x="92" y="212" width="72" height="12" rx="6" fill="#7d5132" transform="rotate(7 128 218)"/>`],

  'kaffeemaschine': ['Kaffeemaschine', 'Coffee machine', 'haushalt', u => `${hbiShadow(u, 128, 226, 82, 8)}
    <rect x="48" y="40" width="160" height="182" rx="18" fill="${u('steel')}"/>
    <rect x="56" y="30" width="144" height="12" rx="6" fill="#d5dae2"/>
    <rect x="66" y="54" width="124" height="34" rx="9" fill="#1b1f27"/>
    <circle cx="86" cy="71" r="6" fill="#7ef0ff"/><circle cx="106" cy="71" r="6" fill="#3d4350"/><rect x="124" y="64" width="52" height="14" rx="4" fill="#0f1324"/><rect x="130" y="69" width="22" height="4" rx="2" fill="#7ef0ff"/>
    <rect x="64" y="104" width="128" height="94" rx="10" fill="#262a33"/>
    <rect x="106" y="104" width="44" height="18" rx="4" fill="${u('black')}"/><rect x="146" y="110" width="58" height="12" rx="6" fill="#16191f"/>
    <path d="M108 150 L148 150 L144 184 Q128 190 112 184 Z" fill="${u('white')}"/><path d="M148 158 Q162 160 160 172 Q158 180 146 178" fill="none" stroke="#e6e9ef" stroke-width="5"/>
    <ellipse cx="128" cy="150" rx="20" ry="4" fill="#8a552e"/>
    <path d="M120 140 Q114 132 120 124 M134 140 Q128 130 134 122" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    <rect x="70" y="190" width="116" height="10" rx="4" fill="#3d4350"/>`],

  'waschmaschine': ['Waschmaschine', 'Washing machine', 'haushalt', u => `${hbiShadow(u, 128, 236, 84, 7)}
    <rect x="46" y="24" width="164" height="208" rx="16" fill="${u('white')}"/>
    <path d="M46 70 L210 70" stroke="#c9d0da" stroke-width="2"/>
    <rect x="66" y="38" width="62" height="18" rx="5" fill="#1b2033"/><rect x="72" y="44" width="24" height="6" rx="3" fill="#7ef0ff"/>
    <circle cx="182" cy="47" r="13" fill="${u('steel')}"/><circle cx="182" cy="47" r="4" fill="#5f6878"/>
    <circle cx="128" cy="150" r="62" fill="${u('steel')}"/><circle cx="128" cy="150" r="50" fill="#2b5f8e"/>
    <path d="M78 156 Q103 140 128 156 T178 156 L178 170 A50 50 0 0 1 78 170 Z" fill="#7fc6ee" opacity=".85"/>
    <path d="M96 116 A44 44 0 0 1 146 104" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".55"/>`],

  'trockner': ['Trockner', 'Dryer', 'haushalt', u => `${hbiShadow(u, 128, 236, 84, 7)}
    <rect x="46" y="24" width="164" height="208" rx="16" fill="${u('white')}"/>
    <path d="M46 70 L210 70" stroke="#c9d0da" stroke-width="2"/>
    <rect x="66" y="38" width="62" height="18" rx="5" fill="#1b2033"/><rect x="72" y="44" width="34" height="6" rx="3" fill="#ffc98a"/>
    <circle cx="182" cy="47" r="13" fill="${u('steel')}"/><path d="M182 36 L182 44" stroke="#5f6878" stroke-width="3" stroke-linecap="round"/>
    <circle cx="128" cy="150" r="62" fill="#3d4350"/><circle cx="128" cy="150" r="50" fill="#1e2330"/>
    <path d="M90 168 Q110 138 140 150 Q160 158 168 140 Q172 178 128 192 Q100 190 90 168 Z" fill="#b48cff" opacity=".55"/><path d="M98 140 Q118 124 138 132 Q122 146 98 140 Z" fill="#ffc98a" opacity=".5"/>
    <path d="M96 116 A44 44 0 0 1 146 104" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/>`],

  'pc': ['PC / Monitor', 'PC / monitor', 'medien', u => {
    let s = `${hbiShadow(u, 128, 232, 92, 7)}<rect x="24" y="30" width="208" height="134" rx="10" fill="#0d0f14" ${HBI_RIM}/><rect x="32" y="38" width="192" height="114" rx="5" fill="#0d1020"/>`;
    const cols = ['#7ef0ff', '#b48cff', '#ffc98a', '#74e3a8', '#8a93c4']; let y = 50, k = 0;
    while (y < 142) { let x = 44 + (k % 3) * 14; const n = 2 + (k * 7) % 3; for (let i = 0; i < n; i++) { const w = 18 + ((k * 13 + i * 29) % 46); s += `<rect x="${x}" y="${y}" width="${w}" height="6" rx="3" fill="${cols[(k + i) % 5]}"/>`; x += w + 8; } y += 13; k++; }
    return s + `<rect x="118" y="164" width="20" height="24" fill="${u('steel')}"/><ellipse cx="128" cy="190" rx="44" ry="7" fill="${u('steel')}"/>
      <rect x="44" y="204" width="168" height="22" rx="6" fill="#2b3039" ${HBI_RIM}/><path d="M56 212 H200 M56 219 H200" stroke="#4a5160" stroke-width="3" stroke-dasharray="8 4"/>`;
  }],

  'ventilator': ['Ventilator', 'Fan', 'klima', u => {
    let s = `${hbiShadow(u, 128, 228, 60, 8)}<rect x="122" y="164" width="12" height="56" rx="5" fill="${u('steel')}"/><ellipse cx="128" cy="220" rx="48" ry="9" fill="${u('white')}"/>
      <circle cx="128" cy="96" r="78" fill="#dfe6ef" fill-opacity=".12" stroke="#d8dee8" stroke-width="5"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M128 96 C 120 60 140 34 160 40 C 174 46 160 76 128 96 Z" fill="#7ef0ff" fill-opacity=".75" stroke="#fff" stroke-opacity=".5" stroke-width="2" transform="rotate(${i * 120} 128 96)"/>`;
    for (let i = 0; i < 12; i++) s += `<path d="M128 96 L${128 + 76 * Math.cos(i * Math.PI / 6)} ${96 + 76 * Math.sin(i * Math.PI / 6)}" stroke="#d8dee8" stroke-opacity=".45" stroke-width="2"/>`;
    return s + `<circle cx="128" cy="96" r="56" fill="none" stroke="#d8dee8" stroke-opacity=".4" stroke-width="2"/><circle cx="128" cy="96" r="16" fill="${u('white')}"/><circle cx="128" cy="96" r="5" fill="#7ef0ff"/>`;
  }],

  'heizung': ['Heizung', 'Radiator', 'klima', u => {
    let s = '';
    for (let i = 0; i < 3; i++) s += `<path d="M${84 + i * 36} 60 q-10 -10 0 -20 t0 -20" fill="none" stroke="#ffb25c" stroke-width="5" stroke-linecap="round" opacity="${0.9 - i * 0.15}"/>`;
    s += `${hbiShadow(u, 120, 222, 90, 7)}<rect x="30" y="76" width="172" height="134" rx="12" fill="${u('white')}"/>`;
    for (let i = 0; i < 7; i++) s += `<rect x="${40 + i * 23}" y="86" width="15" height="114" rx="7" fill="${u('whiteH')}"/>`;
    return s + `<rect x="200" y="120" width="34" height="56" rx="10" fill="${u('white')}"/><rect x="206" y="128" width="22" height="14" rx="4" fill="#1b2033"/><rect x="210" y="133" width="12" height="4" rx="2" fill="#ffb25c"/><ellipse cx="217" cy="164" rx="12" ry="5" fill="#7ef0ff" opacity=".8"/>`;
  }],

  'tuerschloss': ['Türschloss', 'Door lock', 'sicher', u => `
    <rect x="56" y="16" width="144" height="224" rx="8" fill="${u('wood')}"/>
    <rect x="72" y="32" width="112" height="70" rx="5" fill="none" stroke="#6e4a2b" stroke-opacity=".5" stroke-width="3"/><rect x="72" y="176" width="112" height="50" rx="5" fill="none" stroke="#6e4a2b" stroke-opacity=".5" stroke-width="3"/>
    <rect x="112" y="92" width="64" height="96" rx="16" fill="${u('black')}" ${HBI_RIM}/>
    <circle cx="144" cy="124" r="22" fill="${u('cglow')}" opacity=".6"/><circle cx="144" cy="124" r="13" fill="none" stroke="#7ef0ff" stroke-width="4"/><rect x="141" y="114" width="6" height="12" rx="3" fill="#7ef0ff"/>
    <rect x="128" y="156" width="62" height="13" rx="6.5" fill="${u('steel')}"/><circle cx="134" cy="162" r="9" fill="${u('steel')}"/>`],

  'bewegungsmelder': ['Bewegungsmelder', 'Motion sensor', 'sicher', u => {
    let s = '';
    for (let i = 0; i < 3; i++) { const r = 66 + i * 18; s += `<path d="M${128 - r * 0.7} ${140 - r * 0.7} A${r} ${r} 0 0 0 ${128 - r * 0.7} ${140 + r * 0.7}" fill="none" stroke="#b48cff" stroke-width="6" stroke-linecap="round" opacity="${0.9 - i * 0.25}"/><path d="M${128 + r * 0.7} ${140 - r * 0.7} A${r} ${r} 0 0 1 ${128 + r * 0.7} ${140 + r * 0.7}" fill="none" stroke="#b48cff" stroke-width="6" stroke-linecap="round" opacity="${0.9 - i * 0.25}"/>`; }
    s += `<rect x="78" y="90" width="100" height="100" rx="28" fill="${u('white')}"/><circle cx="128" cy="140" r="36" fill="${u('whiteH')}" stroke="#c9d0da" stroke-width="2"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M128 140 L${128 + 36 * Math.cos(i * Math.PI / 3)} ${140 + 36 * Math.sin(i * Math.PI / 3)}" stroke="#c9d0da" stroke-width="1.5"/>`;
    return s + `<circle cx="128" cy="140" r="17" fill="none" stroke="#c9d0da" stroke-width="1.5"/><circle cx="160" cy="108" r="5" fill="#b48cff"/>`;
  }],

  'fensterkontakt': ['Fensterkontakt', 'Window contact', 'sicher', u => `
    <rect x="30" y="28" width="136" height="200" rx="8" fill="${u('white')}"/><rect x="44" y="42" width="108" height="172" fill="${u('sky')}"/>
    <path d="M58 56 L96 56 L64 150 L58 150 Z" fill="#fff" opacity=".4"/>
    <rect x="166" y="28" width="20" height="200" rx="5" fill="${u('whiteH')}"/>
    <rect x="146" y="98" width="18" height="54" rx="6" fill="${u('white')}" stroke="#c9d0da" stroke-width="2"/>
    <rect x="188" y="86" width="34" height="78" rx="9" fill="${u('white')}" stroke="#c9d0da" stroke-width="2"/><circle cx="205" cy="104" r="5" fill="#7ef0ff"/>
    <path d="M226 62 A20 20 0 0 1 240 80 M226 46 A36 36 0 0 1 250 80" fill="none" stroke="#7ef0ff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`],

  'klimasensor': ['Klimasensor', 'Climate sensor', 'klima', u => `${hbiShadow(u, 128, 224, 74, 7)}
    <rect x="50" y="46" width="156" height="164" rx="32" fill="${u('white')}"/>
    <rect x="66" y="62" width="124" height="118" rx="18" fill="#1b2033"/>
    <text x="128" y="122" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="38" fill="#7ef0ff">21,6°</text>
    <path d="M100 140 C 100 140 92 150 92 156 A8 8 0 0 0 108 156 C 108 150 100 140 100 140 Z" fill="#9fd6ff"/>
    <text x="116" y="164" font-family="Inter, DejaVu Sans, sans-serif" font-weight="600" font-size="24" fill="#e8ecff">48 %</text>
    <circle cx="128" cy="196" r="5" fill="#c9d0da"/>`],

  'lautsprecher': ['Lautsprecher', 'Speaker', 'medien', u => `${hbiShadow(u, 128, 228, 58, 8)}
    <path d="M58 92 A40 40 0 0 0 58 168 M40 74 A64 64 0 0 0 40 186" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <path d="M198 92 A40 40 0 0 1 198 168 M216 74 A64 64 0 0 1 216 186" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <rect x="80" y="54" width="96" height="168" rx="24" fill="${u('fabric')}" ${HBI_RIM}/><rect x="80" y="54" width="96" height="168" rx="24" fill="url(#P-dots)"/>
    <ellipse cx="128" cy="62" rx="40" ry="9" fill="#14171d"/><ellipse cx="128" cy="62" rx="30" ry="6" fill="none" stroke="#7ef0ff" stroke-width="3.5"/><ellipse cx="128" cy="62" rx="36" ry="9" fill="${u('cglow')}" opacity=".4"/>`],

  'steckdose': ['Smarte Steckdose', 'Smart plug', 'haushalt', u => `${hbiShadow(u, 128, 222, 66, 7)}
    <rect x="58" y="40" width="140" height="172" rx="36" fill="${u('white')}"/>
    <circle cx="128" cy="116" r="44" fill="#e3e8ef"/><circle cx="128" cy="116" r="44" fill="none" stroke="#c9d0da" stroke-width="2"/>
    <circle cx="111" cy="116" r="7.5" fill="#6f7888"/><circle cx="145" cy="116" r="7.5" fill="#6f7888"/>
    <rect x="122" y="74" width="12" height="8" rx="2" fill="${u('steel')}"/><rect x="122" y="150" width="12" height="8" rx="2" fill="${u('steel')}"/>
    <circle cx="128" cy="186" r="11" fill="#f4f6f9" stroke="#7ef0ff" stroke-width="3"/><path d="M128 180 L128 186" stroke="#7ef0ff" stroke-width="2.5" stroke-linecap="round"/>`],
};

/* ---------- Neue Symbole ab 0.4.0 ---------- */
Object.assign(HB_ICONLIB, {
  'kronleuchter': ['Kronleuchter', 'Chandelier', 'licht', u => {
    let s = `<line x1="128" y1="8" x2="128" y2="96" stroke="${u('brass')}" stroke-width="5"/><ellipse cx="128" cy="106" rx="20" ry="14" fill="${u('brass')}"/>`;
    const arms = [[44, 132], [84, 144], [172, 144], [212, 132]];
    for (const [x, y] of arms) s += `<path d="M128 110 C ${(128 + x) / 2} ${y + 40}, ${x} ${y + 30}, ${x} ${y}" fill="none" stroke="${u('brass')}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M128 112 L128 136" stroke="${u('brass')}" stroke-width="5"/>`;
    for (const [x, y] of [...arms, [128, 132]]) s += `<circle cx="${x}" cy="${y - 22}" r="18" fill="${u('glow')}"/><rect x="${x - 9}" y="${y - 4}" width="18" height="8" rx="3" fill="${u('brass')}"/><path d="M${x} ${y - 30} C ${x - 8} ${y - 18}, ${x - 6} ${y - 6}, ${x} ${y - 4} C ${x + 6} ${y - 6}, ${x + 8} ${y - 18}, ${x} ${y - 30} Z" fill="${u('warm')}"/>`;
    for (const [x, y] of [[64, 176], [104, 190], [128, 196], [152, 190], [192, 176]]) s += `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y - 8}" stroke="#e9f7ff" stroke-opacity=".6" stroke-width="1.5"/><path d="M${x} ${y - 10} l6 9 l-6 9 l-6 -9 Z" fill="#e9f7ff" fill-opacity=".85"/>`;
    return s;
  }],
  'deckenfluter': ['Deckenfluter', 'Torchiere', 'licht', u => `${hbiShadow(u, 128, 228, 54, 9)}
    <circle cx="128" cy="44" r="70" fill="${u('glow')}" opacity=".55"/>
    <ellipse cx="128" cy="222" rx="42" ry="9" fill="${u('black')}"/><ellipse cx="128" cy="218" rx="42" ry="8" fill="#3d4350" ${HBI_RIM}/>
    <rect x="124.5" y="88" width="7" height="130" rx="3" fill="${u('black')}" ${HBI_RIM}/>
    <path d="M70 52 L186 52 L148 92 L108 92 Z" fill="${u('brass')}"/>
    <ellipse cx="128" cy="52" rx="58" ry="11" fill="${u('warm')}"/>`],
  'papierlampe': ['Papierlampe', 'Paper lantern', 'licht', u => `
    <line x1="128" y1="8" x2="128" y2="54" stroke="#3d4350" stroke-width="3"/>
    <circle cx="128" cy="136" r="92" fill="${u('glow')}" opacity=".35"/>
    <ellipse cx="128" cy="136" rx="82" ry="78" fill="${u('opal')}"/>
    ${[-56, -36, -16, 4, 24, 44].map(dy => `<path d="M${128 - Math.sqrt(Math.max(0, 1 - (dy / 78) ** 2)) * 82} ${136 + dy} Q128 ${136 + dy + 10} ${128 + Math.sqrt(Math.max(0, 1 - (dy / 78) ** 2)) * 82} ${136 + dy}" fill="none" stroke="#d9c2a0" stroke-opacity=".7" stroke-width="2"/>`).join('')}
    <ellipse cx="128" cy="136" rx="34" ry="40" fill="${u('warm')}" opacity=".55"/>
    <rect x="114" y="54" width="28" height="8" rx="3" fill="#2a2f39"/>`],
  'lichtpanel': ['Lichtpanels', 'Light panels', 'licht', u => {
    const hex = (cx, cy, c) => { const r = 34, pts = Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos(Math.PI / 6 + i * Math.PI / 3)},${cy + r * Math.sin(Math.PI / 6 + i * Math.PI / 3)}`).join(' '); return `<polygon points="${pts}" fill="${c}" opacity=".35" filter="url(#P-blur)"/><polygon points="${pts}" fill="#1b2033" stroke="${c}" stroke-width="5" stroke-linejoin="round"/><polygon points="${pts}" fill="${c}" opacity=".22"/>`; };
    const dx = 34 * Math.sqrt(3);
    return hex(128 - dx / 2, 98, '#7ef0ff') + hex(128 + dx / 2, 98, '#b48cff') + hex(128 - dx, 157, '#ff6fb5') + hex(128, 157, '#ffc98a') + hex(128 + dx, 157, '#7ef0ff');
  }],
  'lightbar': ['Lightbar', 'Light bar', 'licht', u => `${hbiShadow(u, 128, 222, 100, 9)}
    <rect x="30" y="28" width="44" height="176" rx="22" fill="${u('neon')}" opacity=".55" filter="url(#P-blur)"/><rect x="182" y="28" width="44" height="176" rx="22" fill="${u('neon')}" opacity=".55" filter="url(#P-blur)"/>
    <rect x="38" y="34" width="28" height="164" rx="14" fill="#262a33" ${HBI_RIM}/><rect x="46" y="44" width="12" height="144" rx="6" fill="${u('neon')}"/>
    <rect x="190" y="34" width="28" height="164" rx="14" fill="#262a33" ${HBI_RIM}/><rect x="198" y="44" width="12" height="144" rx="6" fill="${u('neon')}"/>
    <rect x="30" y="196" width="44" height="12" rx="6" fill="#3d4350"/><rect x="182" y="196" width="44" height="12" rx="6" fill="#3d4350"/>`],
  'gartenleuchte': ['Gartenleuchte', 'Garden light', 'licht', u => `${hbiShadow(u, 128, 228, 60, 9)}
    <circle cx="128" cy="96" r="64" fill="${u('glow')}" opacity=".55"/>
    <rect x="102" y="70" width="52" height="154" rx="8" fill="${u('black')}" ${HBI_RIM}/>
    <rect x="96" y="58" width="64" height="16" rx="5" fill="#2a2f39" ${HBI_RIM}/>
    <rect x="106" y="78" width="44" height="38" rx="4" fill="${u('warm')}"/>
    <path d="M60 230 q8 -26 14 0 M74 230 q6 -20 12 0 M170 230 q8 -26 14 0 M184 230 q6 -18 12 0" fill="#5aa04f"/>`],
  'lichtschalter': ['Lichtschalter', 'Light switch', 'licht', u => `${hbiShadow(u, 128, 222, 72, 7)}
    <rect x="52" y="52" width="152" height="152" rx="22" fill="${u('white')}"/>
    <rect x="80" y="76" width="96" height="104" rx="14" fill="${u('whiteH')}" stroke="#c9d0da" stroke-width="2"/>
    <path d="M80 128 L176 128" stroke="#c9d0da" stroke-width="2"/>
    <circle cx="128" cy="98" r="5" fill="#7ef0ff"/><circle cx="128" cy="98" r="12" fill="${u('cglow')}" opacity=".7"/>`],
  'kuehlschrank': ['Kühlschrank', 'Fridge', 'haushalt', u => `${hbiShadow(u, 128, 236, 74, 7)}
    <rect x="62" y="14" width="132" height="220" rx="16" fill="${u('steel')}"/>
    <path d="M62 86 L194 86" stroke="#6f7888" stroke-width="3"/>
    <rect x="76" y="34" width="8" height="38" rx="4" fill="#5f6878"/><rect x="76" y="100" width="8" height="70" rx="4" fill="#5f6878"/>
    <rect x="132" y="104" width="46" height="26" rx="6" fill="#1b2033"/><text x="155" y="123" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="15" fill="#7ef0ff">4°</text>`],
  'geschirrspueler': ['Geschirrspüler', 'Dishwasher', 'haushalt', u => `${hbiShadow(u, 128, 236, 84, 7)}
    <rect x="46" y="30" width="164" height="202" rx="14" fill="${u('white')}"/>
    <rect x="46" y="30" width="164" height="36" rx="14" fill="#e9edf2"/><path d="M46 66 L210 66" stroke="#c9d0da" stroke-width="2"/>
    <rect x="66" y="40" width="60" height="16" rx="5" fill="#1b2033"/><rect x="72" y="46" width="30" height="5" rx="2.5" fill="#7ef0ff"/>
    <circle cx="170" cy="48" r="6" fill="#c9d0da"/><circle cx="188" cy="48" r="6" fill="#c9d0da"/>
    <rect x="96" y="80" width="64" height="10" rx="5" fill="${u('steel')}"/>
    <path d="M80 150 a20 20 0 0 1 40 0 M136 150 a20 20 0 0 1 40 0" fill="none" stroke="#c9d0da" stroke-width="3"/>
    <path d="M88 186 q8 -10 16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#7ef0ff" stroke-width="3" opacity=".6"/>`],
  'backofen': ['Backofen', 'Oven', 'haushalt', u => `${hbiShadow(u, 128, 226, 90, 7)}
    <rect x="34" y="34" width="188" height="186" rx="14" fill="${u('steel')}"/>
    <rect x="34" y="34" width="188" height="40" rx="14" fill="#2b3039"/>
    <circle cx="62" cy="54" r="10" fill="${u('steel')}"/><circle cx="194" cy="54" r="10" fill="${u('steel')}"/><rect x="96" y="44" width="64" height="20" rx="5" fill="#0f1324"/><text x="128" y="60" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="15" fill="#ffb25c">180°</text>
    <rect x="60" y="92" width="136" height="16" rx="8" fill="${u('steel')}"/>
    <rect x="56" y="118" width="144" height="84" rx="10" fill="#1a1d24"/>
    <rect x="66" y="126" width="124" height="68" rx="6" fill="${u('glow')}" opacity=".8"/>
    <path d="M78 176 L178 176" stroke="#5f6878" stroke-width="3"/><path d="M96 170 q12 -16 28 0 q16 14 32 0" fill="#c98a52"/>`],
  'mikrowelle': ['Mikrowelle', 'Microwave', 'haushalt', u => `${hbiShadow(u, 128, 206, 96, 7)}
    <rect x="22" y="58" width="212" height="142" rx="14" fill="${u('white')}"/>
    <rect x="36" y="72" width="140" height="114" rx="8" fill="#1a1d24"/>
    <rect x="44" y="80" width="124" height="98" rx="5" fill="${u('glow')}" opacity=".5"/>
    <ellipse cx="106" cy="160" rx="38" ry="8" fill="#e6e9ef" opacity=".8"/><rect x="88" y="138" width="36" height="20" rx="6" fill="#c97a4a"/>
    <rect x="188" y="76" width="34" height="18" rx="4" fill="#1b2033"/><rect x="193" y="82" width="18" height="5" rx="2.5" fill="#7ef0ff"/>
    ${[0, 1, 2].map(r => [0, 1].map(c => `<circle cx="${197 + c * 16}" cy="${112 + r * 18}" r="5" fill="#c9d0da"/>`).join('')).join('')}
    <rect x="190" y="166" width="30" height="12" rx="6" fill="#7ef0ff" opacity=".8"/>`],
  'wasserkocher': ['Wasserkocher', 'Kettle', 'haushalt', u => `${hbiShadow(u, 120, 226, 70, 8)}
    <ellipse cx="120" cy="214" rx="66" ry="12" fill="#2a2f39"/><ellipse cx="120" cy="208" rx="62" ry="10" fill="#7ef0ff" opacity=".7"/>
    <path d="M70 204 L80 70 Q120 52 160 70 L170 204 Z" fill="${u('whiteH')}"/>
    <ellipse cx="120" cy="70" rx="40" ry="10" fill="#e9edf2"/><rect x="110" y="54" width="20" height="10" rx="5" fill="#3d4350"/>
    <path d="M78 84 L50 62 L60 56 L84 74" fill="${u('whiteH')}"/>
    <path d="M164 86 Q206 90 204 140 Q202 178 168 184" fill="none" stroke="#3d4350" stroke-width="14" stroke-linecap="round"/>
    <rect x="112" y="100" width="16" height="70" rx="8" fill="#9fd6ff" opacity=".7"/>
    <path d="M100 40 q-8 -12 0 -24 M124 36 q-8 -12 0 -24" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>`],
  'saugroboter': ['Saugroboter', 'Robot vacuum', 'haushalt', u => `${hbiShadow(u, 128, 196, 108, 16)}
    <path d="M28 128 L28 150 A100 44 0 0 0 228 150 L228 128 Z" fill="${u('black')}"/>
    <ellipse cx="128" cy="128" rx="100" ry="44" fill="${u('white')}"/>
    <ellipse cx="128" cy="128" rx="86" ry="36" fill="none" stroke="#c9d0da" stroke-width="2"/>
    <path d="M100 120 L100 106 A28 13 0 0 1 156 106 L156 120 A28 13 0 0 1 100 120 Z" fill="${u('black')}"/><ellipse cx="128" cy="106" rx="28" ry="13" fill="#3d4350" ${HBI_RIM}/>
    <path d="M70 146 Q128 170 186 146" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="128" cy="106" r="5" fill="#7ef0ff"/><circle cx="88" cy="128" r="6" fill="#e3e8ef" stroke="#c9d0da" stroke-width="2"/>`],
  'klimaanlage': ['Klimaanlage', 'Air conditioner', 'klima', u => `
    <rect x="18" y="52" width="220" height="86" rx="20" fill="${u('white')}"/>
    <path d="M28 110 L228 110" stroke="#c9d0da" stroke-width="2"/>
    <rect x="34" y="114" width="188" height="14" rx="7" fill="#d0d6df"/>
    <rect x="182" y="70" width="38" height="18" rx="5" fill="#1b2033"/><text x="201" y="84" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="13" fill="#7ef0ff">20°</text>
    ${[60, 104, 148, 192].map((x, i) => `<path d="M${x} 150 q-10 14 0 28 t0 28" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" opacity="${0.85 - i * 0.1}"/>`).join('')}`],
  'luftreiniger': ['Luftreiniger', 'Air purifier', 'klima', u => `${hbiShadow(u, 128, 230, 64, 8)}
    <rect x="72" y="40" width="112" height="186" rx="28" fill="${u('whiteH')}"/>
    <ellipse cx="128" cy="48" rx="50" ry="12" fill="#2a2f39"/>
    ${[0, 1, 2, 3].map(i => `<ellipse cx="128" cy="48" rx="${40 - i * 9}" ry="${9 - i * 2}" fill="none" stroke="#4a5160" stroke-width="2"/>`).join('')}
    <ellipse cx="128" cy="74" rx="46" ry="6" fill="#7ef0ff" opacity=".85"/><ellipse cx="128" cy="74" rx="52" ry="10" fill="${u('cglow')}" opacity=".5"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${88 + i * 14}" y="104" width="6" height="96" rx="3" fill="#d0d6df"/>`).join('')}
    <path d="M100 30 q-8 -10 0 -20 M128 26 q-8 -10 0 -20 M156 30 q-8 -10 0 -20" fill="none" stroke="#7ef0ff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>`],
  'thermostat': ['Thermostat', 'Thermostat', 'klima', u => `${hbiShadow(u, 128, 220, 76, 8)}
    <circle cx="128" cy="124" r="92" fill="${u('white')}"/>
    <circle cx="128" cy="124" r="72" fill="#1b2033"/>
    <path d="M77 175 A72 72 0 1 1 179 175" fill="none" stroke="#2a3150" stroke-width="10" stroke-linecap="round"/>
    <path d="M77 175 A72 72 0 0 1 128 52" fill="none" stroke="#ffb25c" stroke-width="10" stroke-linecap="round"/>
    <text x="128" y="138" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="44" fill="#f4f6ff">21°</text>
    <text x="128" y="164" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-weight="600" font-size="14" fill="#ffb25c">HEIZEN</text>`],
  'tuerklingel': ['Türklingel', 'Doorbell', 'sicher', u => `${hbiShadow(u, 128, 236, 50, 6)}
    <rect x="82" y="20" width="92" height="214" rx="46" fill="${u('black')}" ${HBI_RIM}/>
    <circle cx="128" cy="72" r="26" fill="#0d0f14"/><circle cx="128" cy="72" r="16" fill="#1d3b6b"/><circle cx="122" cy="66" r="5" fill="#9fd6ff" opacity=".8"/>
    <circle cx="128" cy="170" r="30" fill="${u('cglow')}" opacity=".6"/><circle cx="128" cy="170" r="24" fill="#1b1e26" stroke="#7ef0ff" stroke-width="5"/>
    <path d="M118 166 a10 10 0 0 1 20 0 v8 h-20 Z M124 176 a4 4 0 0 0 8 0" fill="#7ef0ff"/>`],
  'kamera': ['Kamera', 'Camera', 'sicher', u => `
    <rect x="186" y="44" width="28" height="70" rx="8" fill="${u('white')}"/>
    <path d="M190 80 L160 104" stroke="#c9d0da" stroke-width="12" stroke-linecap="round"/>
    <g transform="rotate(18 110 120)"><rect x="34" y="88" width="150" height="70" rx="22" fill="${u('white')}"/><rect x="26" y="82" width="150" height="16" rx="8" fill="#e9edf2"/>
    <circle cx="58" cy="124" r="24" fill="#0d0f14"/><circle cx="58" cy="124" r="14" fill="#1d3b6b"/><circle cx="53" cy="119" r="5" fill="#9fd6ff" opacity=".8"/>
    <circle cx="96" cy="112" r="5" fill="#ff5a5a"/></g>`],
  'rauchmelder': ['Rauchmelder', 'Smoke detector', 'sicher', u => `
    <path d="M70 60 q-12 -16 0 -32 q10 -14 0 -28 M128 52 q-12 -16 0 -32 M186 60 q-12 -16 0 -32 q10 -14 0 -28" fill="none" stroke="#9097ba" stroke-width="6" stroke-linecap="round" opacity=".6"/>
    ${hbiShadow(u, 128, 214, 90, 10)}
    <ellipse cx="128" cy="160" rx="96" ry="34" fill="#d0d6df"/>
    <path d="M32 124 L32 160 A96 34 0 0 0 224 160 L224 124 Z" fill="${u('whiteH')}"/>
    <ellipse cx="128" cy="124" rx="96" ry="34" fill="${u('white')}"/>
    ${[-56, -28, 0, 28, 56].map(dx => `<rect x="${124 + dx}" y="132" width="8" height="22" rx="4" fill="#c9d0da"/>`).join('')}
    <ellipse cx="128" cy="118" rx="40" ry="13" fill="#e9edf2" stroke="#c9d0da" stroke-width="2"/><circle cx="160" cy="112" r="5" fill="#ff5a5a"/>`],
  'wassermelder': ['Wassermelder', 'Leak sensor', 'sicher', u => `
    <ellipse cx="128" cy="196" rx="110" ry="30" fill="#3b82c4" opacity=".35"/><ellipse cx="128" cy="196" rx="80" ry="20" fill="#5aa8e6" opacity=".45"/>
    <ellipse cx="128" cy="168" rx="70" ry="20" fill="#d0d6df"/><path d="M58 140 L58 168 A70 20 0 0 0 198 168 L198 140 Z" fill="${u('whiteH')}"/><ellipse cx="128" cy="140" rx="70" ry="20" fill="${u('white')}"/>
    <circle cx="128" cy="138" r="7" fill="#7ef0ff"/>
    <path d="M128 30 C 128 30 104 62 104 78 A24 24 0 0 0 152 78 C 152 62 128 30 128 30 Z" fill="#7fc6ee"/><path d="M118 74 a10 10 0 0 0 8 12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`],
  'spielkonsole': ['Spielkonsole', 'Game console', 'medien', u => `${hbiShadow(u, 128, 206, 100, 10)}
    <path d="M60 86 Q128 70 196 86 Q236 96 238 150 Q240 196 206 198 Q186 200 168 168 L88 168 Q70 200 50 198 Q16 196 18 150 Q20 96 60 86 Z" fill="${u('blackV')}" ${HBI_RIM}/>
    <path d="M66 118 L66 150 M50 134 L82 134" stroke="#c9d0da" stroke-width="10" stroke-linecap="round"/>
    <circle cx="182" cy="118" r="8" fill="#7ef0ff"/><circle cx="200" cy="136" r="8" fill="#b48cff"/><circle cx="164" cy="136" r="8" fill="#ff6fb5"/><circle cx="182" cy="154" r="8" fill="#ffc98a"/>
    <circle cx="104" cy="158" r="12" fill="#2a2f39" stroke="#4a5160" stroke-width="3"/><circle cx="152" cy="158" r="12" fill="#2a2f39" stroke="#4a5160" stroke-width="3"/>
    <rect x="116" y="102" width="24" height="8" rx="4" fill="#7ef0ff" opacity=".8"/>`],
  'soundbar': ['Soundbar', 'Soundbar', 'medien', u => `${hbiShadow(u, 128, 172, 116, 8)}
    <path d="M40 92 q-14 18 0 36 M24 80 q-22 30 0 60" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <path d="M216 92 q14 18 0 36 M232 80 q22 30 0 60" fill="none" stroke="#7ef0ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <rect x="44" y="96" width="168" height="64" rx="22" fill="${u('fabric')}" ${HBI_RIM}/><rect x="44" y="96" width="168" height="64" rx="22" fill="url(#P-dots)"/>
    <rect x="112" y="150" width="32" height="5" rx="2.5" fill="#7ef0ff"/>`],
  'router': ['Router', 'Router', 'medien', u => `${hbiShadow(u, 128, 214, 96, 8)}
    <path d="M86 64 a60 60 0 0 1 84 0 M100 80 a38 38 0 0 1 56 0" fill="none" stroke="#7ef0ff" stroke-width="7" stroke-linecap="round"/><circle cx="128" cy="98" r="7" fill="#7ef0ff"/>
    <path d="M58 150 L48 70 M198 150 L208 70" stroke="#2a2f39" stroke-width="10" stroke-linecap="round"/>
    <rect x="32" y="140" width="192" height="64" rx="16" fill="${u('white')}"/>
    ${[0, 1, 2, 3, 4].map(i => `<circle cx="${76 + i * 26}" cy="178" r="5" fill="${i < 3 ? '#74e3a8' : '#7ef0ff'}"/>`).join('')}`],
  'tablet': ['Wand-Tablet', 'Wall tablet', 'medien', u => `${hbiShadow(u, 128, 214, 96, 7)}
    <rect x="20" y="40" width="216" height="160" rx="18" fill="#0d0f14" ${HBI_RIM}/>
    <rect x="32" y="52" width="192" height="136" rx="8" fill="#10152a"/>
    <circle cx="128" cy="112" r="44" fill="${u('cglow')}" opacity=".4"/>
    <path d="M128 78 a28 28 0 0 0 -28 28 v40 c0 2 2 3 4 2 l7 -5 7 6 c1 1 3 1 4 0 l6 -5 6 5 c1 1 3 1 4 0 l7 -6 7 5 c2 1 4 0 4 -2 v-40 a28 28 0 0 0 -28 -28 z" fill="#7ef0ff"/>
    <circle cx="118" cy="108" r="5" fill="#0d0f14"/><circle cx="138" cy="108" r="5" fill="#0d0f14"/>
    <rect x="44" y="164" width="60" height="10" rx="5" fill="#b48cff" opacity=".7"/><rect x="152" y="164" width="60" height="10" rx="5" fill="#ffc98a" opacity=".7"/>`],
  'jalousie': ['Jalousie', 'Venetian blind', 'fenster', u => {
    let s = `<rect x="50" y="40" width="156" height="182" rx="8" fill="${u('white')}"/><rect x="64" y="54" width="128" height="154" fill="${u('sky')}"/><rect x="42" y="24" width="172" height="20" rx="6" fill="${u('whiteH')}"/>`;
    for (let y = 56; y < 200; y += 14) s += `<path d="M60 ${y} L196 ${y} L192 ${y + 9} L64 ${y + 9} Z" fill="${u('whiteH')}" stroke="#b9c1cd" stroke-width="1"/>`;
    return s + `<path d="M182 44 L182 210" stroke="#9097ba" stroke-width="2"/><rect x="178" y="206" width="8" height="18" rx="4" fill="#9097ba"/>`;
  }],
  'vorhang': ['Vorhang', 'Curtain', 'fenster', u => `
    <rect x="26" y="30" width="204" height="10" rx="5" fill="${u('brass')}"/><circle cx="26" cy="35" r="9" fill="${u('brass')}"/><circle cx="230" cy="35" r="9" fill="${u('brass')}"/>
    <rect x="86" y="44" width="84" height="176" fill="${u('sky')}"/>
    <path d="M34 40 L110 40 Q96 120 104 226 L34 226 Z" fill="#7b8fae"/><path d="M146 40 L222 40 L222 226 L152 226 Q160 120 146 40 Z" fill="#7b8fae"/>
    ${[50, 66, 82, 96].map(x => `<path d="M${x} 42 Q${x - 6} 130 ${x + 2} 226" fill="none" stroke="#5c6f8f" stroke-width="5" opacity=".7"/>`).join('')}
    ${[166, 182, 198, 212].map(x => `<path d="M${x} 42 Q${x + 6} 130 ${x - 2} 226" fill="none" stroke="#5c6f8f" stroke-width="5" opacity=".7"/>`).join('')}
    <path d="M40 46 L104 46" stroke="#fff" stroke-opacity=".25" stroke-width="4"/>`],
  'garagentor': ['Garagentor', 'Garage door', 'fenster', u => `
    <path d="M18 104 L128 32 L238 104 L238 228 L18 228 Z" fill="${u('stone')}"/><path d="M10 108 L128 28 L246 108" fill="none" stroke="#5f6878" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="48" y="112" width="160" height="116" rx="4" fill="#3d4350"/>
    ${[0, 1, 2, 3].map(i => `<rect x="52" y="${116 + i * 28}" width="152" height="24" rx="3" fill="${u('whiteH')}"/>`).join('')}
    <rect x="114" y="200" width="28" height="6" rx="3" fill="#5f6878"/><circle cx="128" cy="80" r="8" fill="#7ef0ff"/>`],
  'markise': ['Markise', 'Awning', 'fenster', u => {
    let s = `<rect x="22" y="40" width="212" height="14" rx="7" fill="#3d4350"/><path d="M28 54 L228 54 L244 134 L12 134 Z" fill="#f2ede4"/>`;
    for (let i = 0; i < 8; i += 2) { const x0 = 28 + i * 25, x1 = x0 + 25, b0 = 12 + i * 29, b1 = b0 + 29; s += `<path d="M${x0} 54 L${x1} 54 L${b1} 134 L${b0} 134 Z" fill="#e0785f"/>`; }
    s += `<path d="M12 134 ${Array.from({ length: 8 }, (_, i) => `q14.5 18 29 0`).join(' ')}" fill="#f2ede4" stroke="#e0785f" stroke-width="3"/>`;
    return s + `<path d="M40 54 L24 150 M216 54 L232 150" stroke="#5f6878" stroke-width="4" stroke-linecap="round"/>${hbiShadow(u, 128, 214, 110, 14)}`;
  }],
  'bewaesserung': ['Bewässerung', 'Irrigation', 'draussen', u => `
    <path d="M18 230 Q128 196 238 230 L238 240 L18 240 Z" fill="#4f8a4a"/>
    <rect x="120" y="140" width="16" height="78" rx="5" fill="#3d4350"/><rect x="108" y="126" width="40" height="20" rx="6" fill="${u('steel')}"/>
    ${[[-1, 90], [-1, 60], [1, 90], [1, 60]].map(([d, h]) => `<path d="M128 126 Q${128 + d * h * 0.8} ${126 - h} ${128 + d * h * 1.4} ${126 - h * 0.1}" fill="none" stroke="#7fc6ee" stroke-width="4" stroke-dasharray="6 7" stroke-linecap="round"/>`).join('')}
    ${[[44, 128], [62, 92], [212, 128], [194, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#9fd6ff"/>`).join('')}`],
  'wallbox': ['Wallbox', 'EV charger', 'draussen', u => `${hbiShadow(u, 112, 228, 70, 7)}
    <rect x="60" y="30" width="104" height="150" rx="22" fill="${u('white')}"/>
    <rect x="76" y="48" width="72" height="50" rx="10" fill="#1b2033"/><path d="M118 56 L100 76 L114 76 L106 92 L126 70 L112 70 Z" fill="#74e3a8"/>
    <rect x="80" y="112" width="64" height="8" rx="4" fill="#74e3a8"/><rect x="80" y="112" width="40" height="8" rx="4" fill="#7ef0ff"/>
    <path d="M112 180 C 112 224, 196 230, 196 186 L196 168" fill="none" stroke="#2a2f39" stroke-width="10" stroke-linecap="round"/>
    <rect x="184" y="136" width="24" height="38" rx="8" fill="#2a2f39"/><rect x="190" y="128" width="4" height="10" fill="#9097ba"/><rect x="198" y="128" width="4" height="10" fill="#9097ba"/>`],
  'solar': ['Solaranlage', 'Solar panel', 'draussen', u => {
    let s = `<circle cx="198" cy="52" r="26" fill="#ffc98a"/><circle cx="198" cy="52" r="40" fill="${u('glow')}" opacity=".6"/>
      <path d="M40 96 L216 96 L236 196 L20 196 Z" fill="#1d3566" stroke="#c9d0da" stroke-width="5" stroke-linejoin="round"/>`;
    for (let i = 1; i < 4; i++) { const y = 96 + i * 25, xl = 40 - (y - 96) * 0.2, xr = 216 + (y - 96) * 0.2; s += `<path d="M${xl} ${y} L${xr} ${y}" stroke="#7fa6e6" stroke-width="2"/>`; }
    for (let i = 1; i < 6; i++) { const t = i / 6; s += `<path d="M${40 + 176 * t} 96 L${20 + 216 * t} 196" stroke="#7fa6e6" stroke-width="2"/>`; }
    return s + `<path d="M54 104 L110 104 L96 150 L44 150 Z" fill="#fff" opacity=".12"/><path d="M120 196 L120 226 M100 226 L140 226" stroke="#5f6878" stroke-width="8" stroke-linecap="round"/>`;
  }],
});

const HB_ICON_GROUPS = [['licht', ['Lampen', 'Lights']], ['haushalt', ['Haushalt & Küche', 'Home & kitchen']], ['klima', ['Klima & Luft', 'Climate & air']], ['medien', ['Medien & Technik', 'Media & tech']], ['fenster', ['Fenster & Türen', 'Windows & doors']], ['sicher', ['Sicherheit & Sensoren', 'Security & sensors']], ['draussen', ['Draußen & Energie', 'Outdoor & energy']]];
function hbIconSVG(name, pre) {
  const d = HB_ICONLIB[name]; if (!d) return '';
  pre = pre || 'hb' + name.replace(/[^a-z]/g, '');
  const body = d[3](n => `url(#${pre}-${n})`).replaceAll('url(#P-', `url(#${pre}-`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><defs>${hbIconDefs(pre)}</defs>${body}</svg>`;
}
const hbIconCache = new Map();
function hbIconURL(name) {
  if (!HB_ICONLIB[name]) return '';
  if (!hbIconCache.has(name)) hbIconCache.set(name, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(hbIconSVG(name)));
  return hbIconCache.get(name);
}
/* Passendes Symbol aus Name, Gerätetyp und Klasse erraten */
const HB_AUTO_LAMP = [
  [/kronleuchter|chandelier|l(ü|ue)ster/, 'kronleuchter'], [/fluter|uplight|torchiere/, 'deckenfluter'], [/bogen|arc ?lamp/, 'bogenlampe'],
  [/steh|floor ?lamp|stand ?lamp|stand ?leuchte/, 'stehlampe'], [/papier|paper|lampion/, 'papierlampe'], [/nanoleaf|panel|hexagon|shapes|canvas/, 'lichtpanel'],
  [/lightbar|light ?bar|hue ?play|gradient|ambilight|sync ?box/, 'lightbar'], [/pendel|pendant|h(ä|ae)nge|esstisch|theke|tresen|kochinsel/, 'pendelleuchte'],
  [/spiegel|mirror/, 'spiegelleuchte'], [/spot|strahler|downlight|einbau|track/, 'spot'], [/lichterkette|string ?light|fairy|girlande/, 'lichterkette'],
  [/led|strip|streifen|stripe|lightstrip|ambient|indirekt/, 'led-streifen'], [/lese|reading/, 'leselampe'], [/schreibtisch|desk/, 'schreibtischlampe'],
  [/nacht|bedside|night/, 'nachttischlampe'], [/tisch|table/, 'tischlampe'], [/wand|wall|sconce/, 'wandleuchte'],
  [/garten|weg|bollard|path/, 'gartenleuchte'], [/au(ß|ss)en|outdoor|terrasse|balkon|loggia|eingang|porch|haust(ü|ue)r/, 'aussenleuchte'],
  [/decke|ceiling|haupt|main/, 'deckenleuchte'],
];
const HB_AUTO_SWITCH = [
  [/kaffee|coffee|espresso|siebtr/, 'kaffeemaschine'], [/waschm|washer|washing/, 'waschmaschine'], [/trock|dryer/, 'trockner'], [/sp(ü|ue)l|dish/, 'geschirrspueler'],
  [/k(ü|ue)hl|fridge|freezer|gefrier/, 'kuehlschrank'], [/backofen|ofen|oven|herd/, 'backofen'], [/mikro|microwave/, 'mikrowelle'], [/wasserkocher|kettle/, 'wasserkocher'],
  [/pc|computer|rechner|desktop|gaming|workstation|monitor/, 'pc'], [/router|wlan|wifi|fritz|mesh/, 'router'], [/konsole|playstation|xbox|ps5|nintendo/, 'spielkonsole'],
  [/tv|fernseh|television/, 'fernseher'], [/soundbar/, 'soundbar'], [/ventilator|\bfan\b|l(ü|ue)fter/, 'ventilator'], [/luftrein|purifier|befeucht|humidifier/, 'luftreiniger'],
  [/heiz|heater|radiator|handtuch/, 'heizung'], [/klima|air ?con|\bac\b/, 'klimaanlage'], [/wallbox|charger|lades|\bev\b|auto/, 'wallbox'],
  [/bew(ä|ae)sser|sprinkler|irrigation|rasen/, 'bewaesserung'], [/kamin|fireplace/, 'kamin'], [/solar|\bpv\b|photovolt/, 'solar'], [/tablet|panel|display/, 'tablet'],
];
function hbAutoIcon(hass, eid) {
  const s = hass?.states?.[eid]; if (!s) return '';
  const d = eid.split('.')[0], a = s.attributes || {}, dc = a.device_class || '', txt = `${a.friendly_name || ''} ${eid.split('.')[1] || ''}`.toLowerCase();
  const find = list => (list.find(([re]) => re.test(txt)) || [])[1] || '';
  if (d === 'light') return 'hb:' + (find(HB_AUTO_LAMP) || 'gluehbirne');
  if (d === 'switch' || d === 'input_boolean') { if (/licht|lamp|light|leuchte|lampe/.test(txt)) return 'hb:' + (find(HB_AUTO_LAMP) || 'gluehbirne'); const f = find(HB_AUTO_SWITCH); return f ? 'hb:' + f : (dc === 'outlet' || /steckdose|plug|socket|outlet/.test(txt) || d === 'switch' ? 'hb:steckdose' : ''); }
  if (d === 'cover') { if (dc === 'garage' || /garage|\btor\b|gate/.test(txt)) return 'hb:garagentor'; if (dc === 'awning' || /markise|awning/.test(txt)) return 'hb:markise'; if (dc === 'curtain' || /vorhang|curtain|gardine/.test(txt)) return 'hb:vorhang'; if (dc === 'blind' || /jalousie|blind|raffstore/.test(txt)) return 'hb:jalousie'; return 'hb:rollladen'; }
  if (d === 'media_player') { if (dc === 'tv' || /tv|fernseh|television|shield|chromecast|apple ?tv/.test(txt)) return 'hb:fernseher'; if (/soundbar|beam|arc\b/.test(txt)) return 'hb:soundbar'; if (/konsole|playstation|xbox|ps5/.test(txt)) return 'hb:spielkonsole'; return 'hb:lautsprecher'; }
  if (d === 'lock') return 'hb:tuerschloss';
  if (d === 'climate') return /klima|air ?con|\bac\b|split/.test(txt) ? 'hb:klimaanlage' : 'hb:thermostat';
  if (d === 'fan') return /luftrein|purifier/.test(txt) ? 'hb:luftreiniger' : 'hb:ventilator';
  if (d === 'vacuum') return 'hb:saugroboter';
  if (d === 'camera') return /klingel|doorbell/.test(txt) ? 'hb:tuerklingel' : 'hb:kamera';
  if (d === 'binary_sensor') { if (['motion', 'occupancy', 'presence'].includes(dc)) return 'hb:bewegungsmelder'; if (['window', 'opening', 'door'].includes(dc)) return 'hb:fensterkontakt'; if (dc === 'garage_door') return 'hb:garagentor'; if (dc === 'smoke' || dc === 'gas') return 'hb:rauchmelder'; if (dc === 'moisture') return 'hb:wassermelder'; return ''; }
  if (d === 'sensor') { if (['temperature', 'humidity'].includes(dc)) return 'hb:klimasensor'; if (/solar|\bpv\b/.test(txt)) return 'hb:solar'; if (dc === 'carbon_dioxide' || dc === 'pm25' || dc === 'volatile_organic_compounds') return 'hb:luftreiniger'; return ''; }
  return '';
}
/* Welches Bild ein Gerät zeigt: eigenes Bild > gewähltes Symbol > automatisch passendes Symbol */
function hbIconSrc(plan, hass, eid, auto = true) {
  let u = plan?.icons?.[eid];
  if (u === 'none') return '';
  if (!u && auto) u = hbAutoIcon(hass, eid);
  if (!u) return '';
  return u.startsWith('hb:') ? hbIconURL(u.slice(3)) : u;
}
