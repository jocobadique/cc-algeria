/*
 * <cc-partners> — Classic Compass "Our Partners" grid.
 * A Wix custom element for the Classic Compass Wix Studio site
 * (classiccompass.org), built like <cc-algeria>.
 *
 * Data: the Wix page code queries the "Partners" CMS collection and passes
 * the items in as JSON on the `partners` attribute:
 *   $w('#customElement1').setAttribute('partners', JSON.stringify(items))
 * The logo can be a Wix image URI (wix:image://v1/...) or a plain URL.
 *
 * It renders into the light DOM (not a shadow root) so the partner names
 * and collaboration details are part of the page for search engines. All
 * styles are scoped under `cc-partners` and prefixed `ccp-`.
 *
 * Optional attributes:
 *   heading    — a heading above the grid (leave empty when the Wix page has its own)
 *   eyebrow    — small label above the heading
 *   link-label — text for the website link (default "Visit website")
 *   band       — a color (like #d9f5f2) for a full-width band behind the top
 *                of the cards, so they overlap the header above. It runs up
 *                to the top of the Wix section, so the element should be the
 *                first thing in its section.
 *   band-depth — how far the band reaches into the first row of cards, in
 *                pixels (default 140).
 */
(() => {
  const TAG = "cc-partners";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-partners {
  --ccp-card: #ffffff;
  --ccp-fg: #0f2a2c;
  --ccp-primary: #008381;
  --ccp-deep: #003c40;
  --ccp-secondary: #d9f5f2;
  --ccp-accent: #8ce5d3;
  --ccp-muted: #426566;
  --ccp-border: #cce4e2;
  --ccp-display: "Fraunces", Georgia, "Times New Roman", serif;
  --ccp-body: "Poppins", "Segoe UI", system-ui, sans-serif;
  display: block;
  color: var(--ccp-fg);
  font-family: var(--ccp-body);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
cc-partners *, cc-partners *::before, cc-partners *::after { box-sizing: border-box; }
cc-partners[band] { position: relative; }
cc-partners[band] .ccp-head, cc-partners[band] .ccp-grid { position: relative; }
cc-partners .ccp-band { position: absolute; left: 0; right: 0; background: var(--ccp-band); box-shadow: 0 0 0 100vmax var(--ccp-band); clip-path: inset(0 -100vmax); pointer-events: none; }
cc-partners .ccp-head { margin: 0 0 32px; }
cc-partners .ccp-eyebrow { margin: 0 0 10px; font: 600 0.78rem/1.3 var(--ccp-body); letter-spacing: 0.22em; text-transform: uppercase; color: var(--ccp-primary); }
cc-partners .ccp-title { margin: 0; font: 500 clamp(2rem, 4vw, 3rem)/1.1 var(--ccp-display); color: var(--ccp-deep); text-wrap: balance; }

cc-partners .ccp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
@media (max-width: 1000px) { cc-partners .ccp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { cc-partners .ccp-grid { grid-template-columns: 1fr; } }

cc-partners .ccp-card { display: flex; flex-direction: column; min-width: 0; background: var(--ccp-card); border: 1px solid var(--ccp-border); border-radius: 10px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
cc-partners .ccp-card:hover { transform: translateY(-3px); box-shadow: 0 18px 40px -22px rgba(0, 60, 64, 0.45); }
cc-partners .ccp-logo { position: relative; display: grid; place-items: center; aspect-ratio: 16 / 9; padding: 28px 36px; background: #fff; border-bottom: 1px solid var(--ccp-border); }
/* Positioned inside the padding so a square or tall logo can't stretch the 16:9 box. */
cc-partners .ccp-logo img { position: absolute; left: 36px; top: 28px; display: block; width: calc(100% - 72px); height: calc(100% - 56px); object-fit: contain; }
cc-partners .ccp-mono { width: 96px; height: 96px; display: grid; place-items: center; border-radius: 50%; background: var(--ccp-secondary); color: var(--ccp-deep); font: italic 500 2.4rem/1 var(--ccp-display); }
cc-partners .ccp-body { display: flex; flex-direction: column; flex: 1; padding: 22px 24px 20px; }
cc-partners .ccp-name { margin: 0; font: 500 1.5rem/1.2 var(--ccp-display); color: var(--ccp-deep); text-wrap: balance; }
cc-partners .ccp-desc { margin: 12px 0 20px; font-size: 0.93rem; color: var(--ccp-muted); white-space: pre-line; }
cc-partners .ccp-link { margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--ccp-border); padding: 14px 0 0; font: 600 0.95rem var(--ccp-body); color: var(--ccp-primary); text-decoration: none; }
cc-partners .ccp-link:hover { color: var(--ccp-deep); }

cc-partners .ccp-skel { background: linear-gradient(90deg, var(--ccp-secondary), #eefaf8, var(--ccp-secondary)); background-size: 200% 100%; animation: ccp-shimmer 1.4s infinite; border-radius: 10px; aspect-ratio: 4 / 4; }
@keyframes ccp-shimmer { to { background-position: -200% 0; } }
cc-partners :focus-visible { outline: 3px solid var(--ccp-accent); outline-offset: 2px; }
cc-partners [hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  cc-partners *, cc-partners *::before, cc-partners *::after { transition: none !important; animation: none !important; }
}
`;

  const ARROW =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  // Default reach of the band into the first row of cards, in pixels.
  const BAND_DEPTH = 140;

  function ensureAssets() {
    if (!document.querySelector(`link[data-${TAG}-fonts]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      link.setAttribute(`data-${TAG}-fonts`, "");
      document.head.appendChild(link);
    }
    if (!document.querySelector(`style[data-${TAG}]`)) {
      const style = document.createElement("style");
      style.setAttribute(`data-${TAG}`, "");
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // wix:image://v1/<mediaId>/<name>#originWidth=..  ->  https://static.wixstatic.com/media/<mediaId>
  // Logos are fitted, not cropped, so only the width is capped.
  function imageUrl(value, width) {
    if (!value) return "";
    const v = typeof value === "object" ? value.url || value.src || "" : String(value);
    const m = v.match(/^wix:image:\/\/v1\/([^/#]+)/);
    if (m) {
      const id = m[1];
      if (!width) return `https://static.wixstatic.com/media/${id}`;
      return `https://static.wixstatic.com/media/${id}/v1/fit/w_${width},h_${width},q_90,enc_auto/${id}`;
    }
    return v;
  }

  // "Erie Children's Museum" -> "EC"
  const initials = (name) =>
    name
      .split(/\s+/)
      .filter((w) => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

  function normalize(raw) {
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error(`<${TAG}> could not read the partners attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    if (!Array.isArray(list)) return [];
    return list
      .filter((p) => p && p.title)
      .map((p, i) => ({
        id: String(p._id || p.slug || `p${i}`),
        title: String(p.title),
        logo: p.logo || "",
        collaboration: p.collaboration || "",
        website: p.website || "",
        order: typeof p.order === "number" ? p.order : i + 1,
      }))
      .sort((a, b) => a.order - b.order);
  }

  class CcPartners extends HTMLElement {
    static get observedAttributes() {
      return ["partners", "heading", "eyebrow", "link-label", "band", "band-depth"];
    }

    constructor() {
      super();
      this._items = null;
    }

    connectedCallback() {
      ensureAssets();
      if (!this._built) this._build();
      this._readData();
      // The band follows the layout: breakpoints, fonts loading, data arriving.
      this._onResize = () => this._placeBand();
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(this);
      window.addEventListener("resize", this._onResize);
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._onResize) window.removeEventListener("resize", this._onResize);
    }

    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === "partners") this._readData();
      else if (name === "band" || name === "band-depth") this._placeBand();
      else if (name === "link-label") {
        if (this._items) this._renderGrid();
      } else this._renderHead();
    }

    // Lets page code pass the array directly instead of an attribute.
    set partners(value) {
      this._items = normalize(value);
      if (this._built) this._renderGrid();
    }

    get partners() {
      return this._items || [];
    }

    _readData() {
      if (!this.hasAttribute("partners")) {
        if (this._items) this._renderGrid();
        else this._renderLoading();
        return;
      }
      this._items = normalize(this.getAttribute("partners"));
      this._renderGrid();
    }

    _build() {
      this._built = true;
      this.innerHTML = `
        <div class="ccp-band" aria-hidden="true" data-band hidden></div>
        <div class="ccp-head" data-head hidden></div>
        <div class="ccp-grid" data-grid aria-live="polite"></div>`;
      this._el = {
        band: this.querySelector("[data-band]"),
        head: this.querySelector("[data-head]"),
        grid: this.querySelector("[data-grid]"),
      };
      this._renderHead();
    }

    // Sizes the band in pixels: from the top of the Wix section (covering the
    // section's top margin) to band-depth below the top of the cards. It starts
    // 1px above the section, under the header's edge, because Wix places
    // sections at fractional pixels and the blended edges show a light line.
    _placeBand() {
      const band = this._el.band;
      const color = this.getAttribute("band");
      if (!color) {
        band.hidden = true;
        return;
      }
      const top = this.getBoundingClientRect().top;
      const section = this.parentElement && this.parentElement.closest("section");
      const lift = section ? Math.max(0, Math.round(top - section.getBoundingClientRect().top)) : 0;
      const depth = parseFloat(this.getAttribute("band-depth"));
      const reach = this._el.grid.getBoundingClientRect().top - top + (Number.isFinite(depth) ? depth : BAND_DEPTH);
      this.style.setProperty("--ccp-band", color);
      band.style.top = `${-lift - 1}px`;
      band.style.height = `${lift + 1 + Math.max(0, Math.round(reach))}px`;
      band.hidden = false;
    }

    _renderHead() {
      const heading = this.getAttribute("heading");
      const eyebrow = this.getAttribute("eyebrow");
      const head = this._el.head;
      if (!heading && !eyebrow) {
        head.hidden = true;
        head.innerHTML = "";
        return;
      }
      head.hidden = false;
      head.innerHTML =
        (eyebrow ? `<p class="ccp-eyebrow">${esc(eyebrow)}</p>` : "") +
        (heading ? `<h2 class="ccp-title">${esc(heading)}</h2>` : "");
    }

    _renderLoading() {
      this._el.grid.innerHTML = Array.from({ length: 3 }, () => '<div class="ccp-skel" aria-hidden="true"></div>').join("");
    }

    _renderGrid() {
      const label = this.getAttribute("link-label") || "Visit website";
      this._el.grid.innerHTML = this.partners
        .map(
          (p) => `
          <article class="ccp-card">
            <div class="ccp-logo">
              ${p.logo ? `<img src="${esc(imageUrl(p.logo, 600))}" alt="${esc(p.title)} logo" loading="lazy">` : `<span class="ccp-mono" aria-hidden="true">${esc(initials(p.title))}</span>`}
            </div>
            <div class="ccp-body">
              <h3 class="ccp-name">${esc(p.title)}</h3>
              <p class="ccp-desc">${esc(p.collaboration)}</p>
              ${p.website ? `<a class="ccp-link" href="${esc(p.website)}" target="_blank" rel="noopener">${esc(label)} ${ARROW}</a>` : ""}
            </div>
          </article>`,
        )
        .join("");
    }
  }

  customElements.define(TAG, CcPartners);
})();
