/*! cc-algeria v1.1.0 */
/*
 * <cc-algeria> — Classic Compass "Algeria Initiative" monument explorer.
 * A Wix custom element for the Classic Compass Wix Studio site
 * (classiccompass.org/algeria).
 *
 * Data: the Wix page code queries the "Monuments" CMS collection and passes
 * the items in as JSON on the `monuments` attribute:
 *   $w('#customElement1').setAttribute('monuments', JSON.stringify(items))
 * Image fields can be Wix image URIs (wix:image://v1/...) or plain URLs.
 *
 * It renders into the light DOM (not a shadow root) so the monument names
 * and descriptions are part of the page for search engines. All styles are
 * scoped under `cc-algeria` and prefixed `cca-` so they don't touch the site.
 *
 * Optional attributes:
 *   heading   — a heading above the grid (leave empty when the Wix page has its own)
 *   eyebrow   — small label above the heading
 *   guide-label — text for the card button that opens the popup, and for the
 *                 popup's guide link when one is set (default "Student Guide")
 */
(() => {
  const TAG = "cc-algeria";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-algeria {
  --cca-bg: #f7fdfd;
  --cca-card: #ffffff;
  --cca-fg: #002529;
  --cca-primary: #008381;
  --cca-deep: #003c40;
  --cca-secondary: #d9f5f2;
  --cca-accent: #8ce5d3;
  --cca-muted: #426566;
  --cca-border: #cce4e2;
  --cca-display: "Fraunces", Georgia, "Times New Roman", serif;
  --cca-body: "Poppins", "Segoe UI", system-ui, sans-serif;
  display: block;
  color: var(--cca-fg);
  font-family: var(--cca-body);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
cc-algeria *, cc-algeria *::before, cc-algeria *::after { box-sizing: border-box; }
cc-algeria .cca { width: 100%; }
cc-algeria .cca-head { margin: 0 0 8px; }
cc-algeria .cca-eyebrow { margin: 0 0 10px; font: 600 0.78rem/1.3 var(--cca-body); letter-spacing: 0.22em; text-transform: uppercase; color: var(--cca-primary); }
cc-algeria .cca-title { margin: 0; font: 500 clamp(2rem, 4vw, 3rem)/1.1 var(--cca-display); color: var(--cca-deep); text-wrap: balance; }

cc-algeria .cca-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; padding-bottom: 18px; margin: 24px 0 30px; border-bottom: 1px solid var(--cca-border); }
cc-algeria .cca-filters { display: flex; flex-wrap: wrap; gap: 6px; }
cc-algeria .cca-chip { appearance: none; border: 1px solid transparent; background: transparent; color: var(--cca-fg); font: 600 0.9rem/1 var(--cca-body); padding: 10px 16px; border-radius: 999px; cursor: pointer; transition: background .2s, color .2s; }
cc-algeria .cca-chip:hover { background: var(--cca-secondary); }
cc-algeria .cca-chip[aria-pressed="true"] { background: var(--cca-primary); color: #fff; }
cc-algeria .cca-search { display: flex; align-items: center; gap: 8px; border: 1px solid var(--cca-border); background: var(--cca-card); border-radius: 999px; padding: 8px 16px; color: var(--cca-muted); min-width: 0; }
cc-algeria .cca-search input { appearance: none; border: 0; outline: 0; background: transparent; font: 400 0.95rem var(--cca-body); color: var(--cca-fg); width: 180px; max-width: 100%; padding: 2px 0; }
cc-algeria .cca-search:focus-within { border-color: var(--cca-primary); }

cc-algeria .cca-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px 28px; }
@media (max-width: 1000px) { cc-algeria .cca-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { cc-algeria .cca-grid { grid-template-columns: 1fr; gap: 28px; } cc-algeria .cca-search { width: 100%; } cc-algeria .cca-search input { width: 100%; } }

cc-algeria .cca-card { display: flex; flex-direction: column; min-width: 0; background: var(--cca-card); border: 1px solid var(--cca-border); border-radius: 10px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
cc-algeria .cca-card:hover { transform: translateY(-3px); box-shadow: 0 18px 40px -22px rgba(0, 60, 64, 0.45); }
cc-algeria .cca-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--cca-secondary); }
cc-algeria .cca-media img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
cc-algeria .cca-card:hover .cca-media img { transform: scale(1.04); }
cc-algeria .cca-badge { position: absolute; left: 14px; top: 14px; background: rgba(255, 255, 255, 0.95); color: var(--cca-deep); font: 700 0.68rem/1 var(--cca-body); letter-spacing: 0.05em; text-transform: uppercase; padding: 6px 11px; border-radius: 999px; }
cc-algeria .cca-body { display: flex; flex-direction: column; flex: 1; padding: 22px 24px 20px; }
cc-algeria .cca-loc { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 0.8rem; color: var(--cca-muted); }
cc-algeria .cca-loc svg { flex: none; }
cc-algeria .cca-name { margin: 8px 0 0; font: 500 1.5rem/1.2 var(--cca-display); color: var(--cca-deep); text-wrap: balance; }
cc-algeria .cca-desc { margin: 12px 0 20px; font-size: 0.93rem; color: var(--cca-muted); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
cc-algeria .cca-more { appearance: none; margin-top: auto; display: flex; justify-content: space-between; align-items: center; width: 100%; border: 0; border-top: 1px solid var(--cca-border); background: none; padding: 14px 0 0; font: 600 0.95rem var(--cca-body); color: var(--cca-primary); cursor: pointer; text-align: left; }
cc-algeria .cca-more:hover { color: var(--cca-deep); }

cc-algeria .cca-skel { background: linear-gradient(90deg, var(--cca-secondary), #eefaf8, var(--cca-secondary)); background-size: 200% 100%; animation: cca-shimmer 1.4s infinite; border-radius: 10px; aspect-ratio: 4 / 4.6; }
@keyframes cca-shimmer { to { background-position: -200% 0; } }
cc-algeria .cca-empty { text-align: center; padding: 48px 0; color: var(--cca-muted); }
cc-algeria .cca-empty button { margin-top: 12px; }

cc-algeria .cca-btn { appearance: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--cca-primary); border-radius: 999px; padding: 11px 20px; font: 600 0.95rem/1 var(--cca-body); cursor: pointer; text-decoration: none; transition: background .2s, color .2s; }
cc-algeria .cca-btn-solid { background: var(--cca-primary); color: #fff; }
cc-algeria .cca-btn-solid:hover { background: var(--cca-deep); border-color: var(--cca-deep); }
cc-algeria .cca-btn-line { background: transparent; color: var(--cca-deep); }
cc-algeria .cca-btn-line:hover { background: var(--cca-secondary); }

cc-algeria .cca-overlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 16px; background: rgba(0, 37, 41, 0.6); }
cc-algeria .cca-overlay[hidden] { display: none; }
cc-algeria .cca-dialog { position: relative; width: 100%; max-width: 880px; max-height: 92vh; max-height: 92dvh; overflow-y: auto; background: var(--cca-card); border-radius: 12px; outline: none; }
cc-algeria .cca-x { position: absolute; right: 14px; top: 14px; z-index: 2; width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid var(--cca-border); border-radius: 50%; background: var(--cca-card); color: var(--cca-fg); cursor: pointer; }
cc-algeria .cca-d-top { padding: 32px 32px 0; }
cc-algeria .cca-d-loc { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin: 0; padding-right: 40px; font-size: 0.85rem; color: var(--cca-primary); }
cc-algeria .cca-d-loc a { color: inherit; font-weight: 600; }
cc-algeria .cca-tag { display: inline-block; background: var(--cca-secondary); color: var(--cca-deep); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
cc-algeria .cca-d-title { margin: 10px 0 0; padding-right: 40px; font: 500 clamp(1.8rem, 4vw, 2.5rem)/1.12 var(--cca-display); color: var(--cca-deep); text-wrap: balance; }
cc-algeria .cca-d-desc { margin: 16px 0 0; font-size: 1rem; color: var(--cca-fg); opacity: 0.85; white-space: pre-line; }
cc-algeria .cca-d-gal { padding: 24px 32px 0; }
cc-algeria .cca-stage { position: relative; aspect-ratio: 16 / 10; border-radius: 8px; overflow: hidden; background: var(--cca-secondary); }
cc-algeria .cca-stage img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
cc-algeria .cca-nav { position: absolute; inset-inline: 12px; bottom: 12px; display: flex; justify-content: space-between; pointer-events: none; }
cc-algeria .cca-nav button { pointer-events: auto; width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 8px; background: rgba(255, 255, 255, 0.92); color: var(--cca-fg); cursor: pointer; }
cc-algeria .cca-cap { display: flex; justify-content: space-between; gap: 10px; margin: 8px 0 0; font-size: 0.78rem; color: var(--cca-muted); }
cc-algeria .cca-cap a { color: inherit; }
cc-algeria .cca-thumbs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
cc-algeria .cca-thumbs button { width: 80px; height: 56px; padding: 0; border: 1px solid var(--cca-border); border-radius: 6px; overflow: hidden; background: var(--cca-secondary); cursor: pointer; opacity: 0.55; }
cc-algeria .cca-thumbs button[aria-pressed="true"] { opacity: 1; outline: 2px solid var(--cca-primary); outline-offset: 2px; }
cc-algeria .cca-thumbs img { display: block; width: 100%; height: 100%; object-fit: cover; }
cc-algeria .cca-dialog { padding-bottom: 28px; }
cc-algeria .cca-d-foot { display: flex; justify-content: flex-end; margin: 26px 0 -28px; padding: 18px 32px; border-top: 1px solid var(--cca-border); background: #effaf8; }
@media (max-width: 620px) {
  cc-algeria .cca-d-top, cc-algeria .cca-d-gal { padding-left: 20px; padding-right: 20px; }
  cc-algeria .cca-d-top { padding-top: 24px; }
  cc-algeria .cca-d-foot { padding-left: 20px; padding-right: 20px; }
}
cc-algeria :focus-visible { outline: 3px solid var(--cca-accent); outline-offset: 2px; }
cc-algeria [hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  cc-algeria *, cc-algeria *::before, cc-algeria *::after { transition: none !important; animation: none !important; }
}
`;

  const PIN =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  const ARROW =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  const CHEV_L =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  const CHEV_R =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  const CLOSE =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  const SEARCH =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

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
  function imageUrl(value, width) {
    if (!value) return "";
    const v = typeof value === "object" ? value.url || value.src || "" : String(value);
    const m = v.match(/^wix:image:\/\/v1\/([^/#]+)/);
    if (m) {
      const id = m[1];
      if (!width) return `https://static.wixstatic.com/media/${id}`;
      const h = Math.round(width * 0.75);
      return `https://static.wixstatic.com/media/${id}/v1/fill/w_${width},h_${h},al_c,q_80,enc_auto/${id}`;
    }
    return v;
  }

  function normalize(raw) {
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error(`<${TAG}> could not read the monuments attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    if (!Array.isArray(list)) return [];
    return list
      .filter((m) => m && m.title && m.published !== false)
      .map((m, i) => {
        const photos = [];
        if (m.coverImage) photos.push({ src: m.coverImage, credit: m.image1Credit || "" });
        if (m.image2) photos.push({ src: m.image2, credit: m.image2Credit || "" });
        return {
          id: String(m._id || m.slug || `m${i}`),
          title: String(m.title),
          location: m.location || "",
          mapsUrl: m.mapsUrl || "",
          description: m.description || "",
          guideText: m.guideText || "",
          category: m.category || "",
          unesco: m.unesco === true,
          guideUrl: m.guideUrl || "",
          order: typeof m.order === "number" ? m.order : i + 1,
          photos,
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  class CcAlgeria extends HTMLElement {
    static get observedAttributes() {
      return ["monuments", "heading", "eyebrow", "guide-label"];
    }

    constructor() {
      super();
      this._items = null;
      this._filter = "all";
      this._query = "";
      this._current = null;
      this._photo = 0;
    }

    connectedCallback() {
      ensureAssets();
      if (!this._built) this._build();
      this._readData();
    }

    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === "monuments") this._readData();
      else if (name === "guide-label") {
        if (this._items) this._renderGrid();
      } else this._renderHead();
    }

    // Lets page code pass the array directly instead of an attribute.
    set monuments(value) {
      this._items = normalize(value);
      if (this._built) this._renderAll();
    }

    get monuments() {
      return this._items || [];
    }

    _readData() {
      if (!this.hasAttribute("monuments")) {
        if (this._items) this._renderAll();
        else this._renderLoading();
        return;
      }
      this._items = normalize(this.getAttribute("monuments"));
      this._renderAll();
    }

    _build() {
      this._built = true;
      this.innerHTML = `
        <div class="cca">
          <div class="cca-head" data-head hidden></div>
          <div class="cca-bar">
            <div class="cca-filters" role="group" aria-label="Filter monuments" data-filters></div>
            <label class="cca-search">${SEARCH}<input type="search" placeholder="Find a place…" aria-label="Search monuments" data-search></label>
          </div>
          <div class="cca-grid" data-grid aria-live="polite"></div>
          <div class="cca-empty" data-empty hidden>
            <p>No places match your search.</p>
            <button type="button" class="cca-btn cca-btn-line" data-clear>Clear filters</button>
          </div>
          <div class="cca-overlay" data-overlay hidden>
            <div class="cca-dialog" role="dialog" aria-modal="true" aria-labelledby="cca-d-title" tabindex="-1" data-dialog>
              <button type="button" class="cca-x" aria-label="Close" data-close>${CLOSE}</button>
              <div class="cca-d-top">
                <p class="cca-d-loc" data-d-loc></p>
                <h3 class="cca-d-title" id="cca-d-title" data-d-title></h3>
                <p class="cca-d-desc" data-d-desc></p>
              </div>
              <div class="cca-d-gal" data-d-gal>
                <div class="cca-stage">
                  <img alt="" data-d-img>
                  <div class="cca-nav" data-d-nav>
                    <button type="button" aria-label="Previous photo" data-prev>${CHEV_L}</button>
                    <button type="button" aria-label="Next photo" data-next>${CHEV_R}</button>
                  </div>
                </div>
                <p class="cca-cap"><span data-d-count></span><a target="_blank" rel="noopener" data-d-credit>Photo credit</a></p>
                <div class="cca-thumbs" data-d-thumbs></div>
              </div>
              <div class="cca-d-foot" data-d-foot>
                <a class="cca-btn cca-btn-solid" target="_blank" rel="noopener" data-d-guide></a>
              </div>
            </div>
          </div>
        </div>`;

      const $ = (s) => this.querySelector(s);
      this._el = {
        head: $("[data-head]"),
        filters: $("[data-filters]"),
        search: $("[data-search]"),
        grid: $("[data-grid]"),
        empty: $("[data-empty]"),
        overlay: $("[data-overlay]"),
        dialog: $("[data-dialog]"),
        dLoc: $("[data-d-loc]"),
        dTitle: $("[data-d-title]"),
        dDesc: $("[data-d-desc]"),
        dGal: $("[data-d-gal]"),
        dImg: $("[data-d-img]"),
        dNav: $("[data-d-nav]"),
        dCount: $("[data-d-count]"),
        dCredit: $("[data-d-credit]"),
        dThumbs: $("[data-d-thumbs]"),
        dGuide: $("[data-d-guide]"),
        dFoot: $("[data-d-foot]"),
      };

      this._el.filters.addEventListener("click", (e) => {
        const b = e.target.closest("[data-cat]");
        if (!b) return;
        this._filter = b.dataset.cat;
        this._renderFilters();
        this._renderGrid();
      });
      this._el.search.addEventListener("input", (e) => {
        this._query = e.target.value.trim().toLowerCase();
        this._renderGrid();
      });
      $("[data-clear]").addEventListener("click", () => {
        this._filter = "all";
        this._query = "";
        this._el.search.value = "";
        this._renderFilters();
        this._renderGrid();
      });
      this._el.grid.addEventListener("click", (e) => {
        const b = e.target.closest("[data-open]");
        if (b) this._open(b.dataset.open, b);
      });
      this._el.overlay.addEventListener("click", (e) => {
        if (e.target === this._el.overlay) this._close();
      });
      $("[data-close]").addEventListener("click", () => this._close());
      $("[data-prev]").addEventListener("click", () => this._show(this._photo - 1));
      $("[data-next]").addEventListener("click", () => this._show(this._photo + 1));
      this._el.dThumbs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-i]");
        if (b) this._show(Number(b.dataset.i));
      });
      this._onKey = (e) => {
        if (this._el.overlay.hidden) return;
        if (e.key === "Escape") this._close();
        else if (e.key === "ArrowLeft") this._show(this._photo - 1);
        else if (e.key === "ArrowRight") this._show(this._photo + 1);
        else if (e.key === "Tab") this._trapFocus(e);
      };
      document.addEventListener("keydown", this._onKey);
      this._renderHead();
    }

    disconnectedCallback() {
      if (this._onKey) document.removeEventListener("keydown", this._onKey);
      document.body.style.overflow = "";
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
        (eyebrow ? `<p class="cca-eyebrow">${esc(eyebrow)}</p>` : "") +
        (heading ? `<h2 class="cca-title">${esc(heading)}</h2>` : "");
    }

    _renderLoading() {
      this._el.filters.innerHTML = "";
      this._el.grid.innerHTML = Array.from({ length: 6 }, () => '<div class="cca-skel" aria-hidden="true"></div>').join("");
      this._el.empty.hidden = true;
    }

    _renderAll() {
      this._renderFilters();
      this._renderGrid();
    }

    _renderFilters() {
      const cats = [...new Set(this.monuments.map((m) => m.category).filter(Boolean))];
      if (this._filter !== "all" && !cats.includes(this._filter)) this._filter = "all";
      const chips = [["all", "All places"], ...cats.map((c) => [c, c])];
      this._el.filters.innerHTML =
        cats.length > 1
          ? chips
              .map(
                ([value, label]) =>
                  `<button type="button" class="cca-chip" data-cat="${esc(value)}" aria-pressed="${value === this._filter}">${esc(label)}</button>`,
              )
              .join("")
          : "";
    }

    _visible() {
      return this.monuments.filter(
        (m) =>
          (this._filter === "all" || m.category === this._filter) &&
          (!this._query || `${m.title} ${m.location} ${m.description} ${m.guideText}`.toLowerCase().includes(this._query)),
      );
    }

    _renderGrid() {
      const list = this._visible();
      const label = this.getAttribute("guide-label") || "Student Guide";
      this._el.grid.innerHTML = list
        .map((m) => {
          const cover = m.photos[0];
          const badge = m.unesco ? "UNESCO World Heritage" : m.category;
          return `
          <article class="cca-card">
            <div class="cca-media">
              ${cover ? `<img src="${esc(imageUrl(cover.src, 800))}" alt="${esc(m.title)}" loading="lazy" width="800" height="600">` : ""}
              ${badge ? `<span class="cca-badge">${esc(badge)}</span>` : ""}
            </div>
            <div class="cca-body">
              ${m.location ? `<p class="cca-loc">${PIN}${esc(m.location)}</p>` : ""}
              <h3 class="cca-name">${esc(m.title)}</h3>
              <p class="cca-desc">${esc(m.description)}</p>
              <button type="button" class="cca-more" data-open="${esc(m.id)}" aria-haspopup="dialog">${esc(label)} ${ARROW}</button>
            </div>
          </article>`;
        })
        .join("");
      this._el.empty.hidden = list.length > 0 || this.monuments.length === 0;
    }

    _open(id, opener) {
      const m = this.monuments.find((x) => x.id === id);
      if (!m) return;
      this._current = m;
      this._opener = opener || null;
      const e = this._el;
      e.dLoc.innerHTML =
        (m.location ? `${PIN}<span>${esc(m.location)}</span>` : "") +
        (m.unesco ? '<span class="cca-tag">UNESCO World Heritage Site</span>' : "") +
        (m.mapsUrl ? `<a href="${esc(m.mapsUrl)}" target="_blank" rel="noopener">View on map</a>` : "");
      e.dTitle.textContent = m.title;
      // The popup shows the Student Guide text; the short description is for the card.
      const text = m.guideText || m.description;
      e.dDesc.textContent = text;
      e.dDesc.hidden = !text;
      e.dGal.hidden = m.photos.length === 0;
      e.dNav.hidden = m.photos.length < 2;
      e.dThumbs.hidden = m.photos.length < 2;
      e.dThumbs.innerHTML = m.photos
        .map(
          (p, i) =>
            `<button type="button" data-i="${i}" aria-label="Show photo ${i + 1}"><img src="${esc(imageUrl(p.src, 240))}" alt="" loading="lazy"></button>`,
        )
        .join("");
      const label = this.getAttribute("guide-label") || "Student Guide";
      // The footer only appears once a monument has a Student Guide link in the CMS.
      if (m.guideUrl) {
        e.dFoot.hidden = false;
        e.dGuide.href = m.guideUrl;
        e.dGuide.textContent = label;
      } else {
        e.dFoot.hidden = true;
        e.dGuide.removeAttribute("href");
      }
      this._show(0);
      e.overlay.hidden = false;
      document.body.style.overflow = "hidden";
      e.dialog.scrollTop = 0;
      e.dialog.focus();
      this.dispatchEvent(new CustomEvent("open", { detail: { id: m.id, title: m.title }, bubbles: true, composed: true }));
    }

    _show(i) {
      const m = this._current;
      if (!m || m.photos.length === 0) return;
      const n = m.photos.length;
      this._photo = ((i % n) + n) % n;
      const p = m.photos[this._photo];
      const e = this._el;
      e.dImg.src = imageUrl(p.src);
      e.dImg.alt = `${m.title}, photo ${this._photo + 1}`;
      e.dCount.textContent = n > 1 ? `${this._photo + 1} / ${n}` : "";
      e.dCredit.hidden = !p.credit;
      if (p.credit) e.dCredit.href = p.credit;
      e.dThumbs.querySelectorAll("[data-i]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.i) === this._photo)));
    }

    _close() {
      this._el.overlay.hidden = true;
      document.body.style.overflow = "";
      if (this._opener && this._opener.isConnected) this._opener.focus();
      this._current = null;
    }

    _trapFocus(e) {
      const nodes = [...this._el.dialog.querySelectorAll("a[href], button:not([hidden])")].filter(
        (n) => n.offsetParent !== null,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === this._el.dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  customElements.define(TAG, CcAlgeria);
})();
