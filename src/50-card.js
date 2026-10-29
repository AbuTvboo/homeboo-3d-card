
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
      </div>
      <p class="hint">${T('Tipp: Verknüpfe jeden Raum im Editor mit einem Bereich aus Home Assistant. Dann erscheinen dessen Geräte automatisch im Raum.', 'Tip: link each room to a Home Assistant area in the editor. Its devices then appear in the room automatically.')}</p>
      <details><summary>${T('Erweitert', 'Advanced')}</summary><div class="fld"><label for="three">${T('Adresse von three.module.js (für Betrieb ohne Internet)', 'URL of three.module.js (for offline use)')}</label><input id="three" data-k="three_url" value="${esc(c.three_url || '')}" placeholder="${HB_THREE_DEFAULT}"></div></details>
    </div>`;
    const sr = this.shadowRoot;
    sr.getElementById('openPlanner').addEventListener('click', () => this.openPlanner());
    sr.querySelectorAll('[data-k]').forEach(el => el.addEventListener('change', () => this.update(el.dataset.k, el.value.trim())));
    if (ae) sr.getElementById(ae)?.focus();
  }
  update(k, v) {
    const c = { ...this._config };
    if (v === '' || v == null || (k === 'night' && v === 'auto') || (k === 'accent' && v.toLowerCase() === '#7ef0ff') || (k === 'height' && v === '600px')) delete c[k]; else c[k] = v;
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
