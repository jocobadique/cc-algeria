/*! cc-events v1.3.1 */
/*
 * <cc-events> — Classic Compass "Events" program explorer.
 * A Wix custom element for the Classic Compass Wix Studio site
 * (classiccompass.org), built like <cc-algeria>.
 *
 * Data: the Wix page code queries the "Events" CMS collection and passes
 * the items in as JSON on the `events` attribute:
 *   $w('#customElement1').setAttribute('events', JSON.stringify(items))
 * Image fields can be Wix image URIs (wix:image://v1/...) or plain URLs; the
 * optional `gallery` field is a Wix media gallery (an array of { src }).
 * Each event can carry a `sessions` array (the page code attaches the
 * program's rows from the "Sessions" collection): { title, date (YYYY-MM-DD),
 * time, description, link }. The popup lists upcoming sessions first, then
 * past ones, newest first.
 *
 * It renders into the light DOM (not a shadow root) so the program names
 * and descriptions are part of the page for search engines. All styles are
 * scoped under `cc-events` and prefixed `cce-` so they don't touch the site.
 *
 * Optional attributes:
 *   heading    — a heading above the grid (leave empty when the Wix page has its own)
 *   eyebrow    — small label above the heading
 *   more-label — text for the card button that opens the popup (default "View Details")
 *   upcoming-label, past-label — headings of the popup's session lists
 *                (default "Upcoming sessions", "Past sessions")
 *   link-label — text for a session's event page link (default "Event page")
 *   band       — a color (like #d9f5f2) for a full-width band behind the filters
 *                and the top of the cards, so they overlap the header above.
 *                It runs up to the top of the Wix section, so the element
 *                should be the first thing in its section.
 *   band-depth — how far the band reaches into the first row of cards, in
 *                pixels (default 140). Being in pixels, it stays put when a
 *                filter leaves fewer cards.
 */
(() => {
  const TAG = "cc-events";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-events {
  --cce-bg: #f7fdfd;
  --cce-card: #ffffff;
  --cce-fg: #0f2a2c;
  --cce-primary: #008381;
  --cce-deep: #003c40;
  --cce-secondary: #d9f5f2;
  --cce-accent: #8ce5d3;
  --cce-muted: #426566;
  --cce-border: #cce4e2;
  --cce-display: "Fraunces", Georgia, "Times New Roman", serif;
  --cce-body: "Poppins", "Segoe UI", system-ui, sans-serif;
  display: block;
  color: var(--cce-fg);
  font-family: var(--cce-body);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
cc-events *, cc-events *::before, cc-events *::after { box-sizing: border-box; }
cc-events .cce { width: 100%; }
cc-events[band] { position: relative; }
cc-events[band] .cce-head, cc-events[band] .cce-filters, cc-events[band] .cce-grid { position: relative; }
cc-events .cce-band { position: absolute; left: 0; right: 0; background: var(--cce-band); box-shadow: 0 0 0 100vmax var(--cce-band); clip-path: inset(0 -100vmax); pointer-events: none; }
cc-events .cce-head { margin: 0 0 8px; }
cc-events .cce-eyebrow { margin: 0 0 10px; font: 600 0.78rem/1.3 var(--cce-body); letter-spacing: 0.22em; text-transform: uppercase; color: var(--cce-primary); }
cc-events .cce-title { margin: 0; font: 500 clamp(2rem, 4vw, 3rem)/1.1 var(--cce-display); color: var(--cce-deep); text-wrap: balance; }

cc-events .cce-filters { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 32px; }
cc-events .cce-filters:empty { display: none; }
cc-events .cce-chip { appearance: none; border: 1px solid transparent; background: transparent; color: var(--cce-fg); font: 600 0.9rem/1 var(--cce-body); padding: 10px 16px; border-radius: 999px; cursor: pointer; transition: background .2s, color .2s; }
cc-events .cce-chip:hover { background: var(--cce-secondary); }
cc-events .cce-chip[aria-pressed="true"] { background: var(--cce-deep); color: #fff; }

cc-events .cce-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px 28px; }
@media (max-width: 1000px) { cc-events .cce-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { cc-events .cce-grid { grid-template-columns: 1fr; gap: 28px; } }

cc-events .cce-card { display: flex; flex-direction: column; min-width: 0; background: var(--cce-card); border: 1px solid var(--cce-border); border-radius: 10px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
cc-events .cce-card:hover { transform: translateY(-3px); box-shadow: 0 18px 40px -22px rgba(0, 60, 64, 0.45); }
cc-events .cce-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--cce-secondary); }
cc-events .cce-media img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
cc-events .cce-card:hover .cce-media img { transform: scale(1.04); }
cc-events .cce-ph { display: grid; place-items: center; width: 100%; height: 100%; background: linear-gradient(135deg, var(--cce-deep), var(--cce-primary)); color: var(--cce-accent); font: italic 500 4.5rem/1 var(--cce-display); }
cc-events .cce-badge { position: absolute; left: 14px; top: 14px; background: rgba(255, 255, 255, 0.95); color: var(--cce-deep); font: 700 0.68rem/1 var(--cce-body); letter-spacing: 0.05em; text-transform: uppercase; padding: 6px 11px; border-radius: 999px; }
cc-events .cce-body { display: flex; flex-direction: column; flex: 1; padding: 22px 24px 20px; }
cc-events .cce-loc { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 0.8rem; color: var(--cce-muted); }
cc-events .cce-loc svg { flex: none; }
cc-events .cce-name { margin: 8px 0 0; font: 500 1.5rem/1.2 var(--cce-display); color: var(--cce-deep); text-wrap: balance; }
cc-events .cce-desc { margin: 12px 0 20px; font-size: 0.93rem; color: var(--cce-muted); white-space: pre-line; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
cc-events .cce-next { display: flex; align-items: center; gap: 8px; margin: -6px 0 18px; font-size: 0.85rem; font-weight: 600; color: var(--cce-deep); }
cc-events .cce-next svg { flex: none; color: var(--cce-primary); }
cc-events .cce-more { appearance: none; margin-top: auto; display: flex; justify-content: space-between; align-items: center; width: 100%; border: 0; border-top: 1px solid var(--cce-border); background: none; padding: 14px 0 0; font: 600 0.95rem var(--cce-body); color: var(--cce-primary); cursor: pointer; text-align: left; }
cc-events .cce-more:hover { color: var(--cce-deep); }

cc-events .cce-skel { background: linear-gradient(90deg, var(--cce-secondary), #eefaf8, var(--cce-secondary)); background-size: 200% 100%; animation: cce-shimmer 1.4s infinite; border-radius: 10px; aspect-ratio: 4 / 4.6; }
@keyframes cce-shimmer { to { background-position: -200% 0; } }

cc-events .cce-overlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 16px; background: rgba(0, 37, 41, 0.6); }
cc-events .cce-overlay[hidden] { display: none; }
cc-events .cce-dialog { position: relative; width: 100%; max-width: 880px; max-height: 92vh; max-height: 92dvh; overflow-y: auto; background: var(--cce-card); border-radius: 12px; outline: none; padding-bottom: 28px; }
cc-events .cce-x { position: absolute; right: 14px; top: 14px; z-index: 2; width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid var(--cce-border); border-radius: 50%; background: var(--cce-card); color: var(--cce-fg); cursor: pointer; }
cc-events .cce-d-top { padding: 32px 32px 0; }
cc-events .cce-d-loc { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin: 0; padding-right: 40px; font-size: 0.85rem; color: var(--cce-primary); }
cc-events .cce-tag { display: inline-block; background: var(--cce-secondary); color: var(--cce-deep); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
cc-events .cce-d-title { margin: 10px 0 0; padding-right: 40px; font: 500 clamp(1.8rem, 4vw, 2.5rem)/1.12 var(--cce-display); color: var(--cce-deep); text-wrap: balance; }
cc-events .cce-d-desc { margin: 16px 0 0; font-size: 1rem; color: var(--cce-fg); opacity: 0.85; white-space: pre-line; }
cc-events .cce-d-gal { padding: 24px 32px 0; }
cc-events .cce-stage { position: relative; aspect-ratio: 16 / 10; border-radius: 8px; overflow: hidden; background: var(--cce-secondary); }
cc-events .cce-stage img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
cc-events .cce-stage img.is-tall { object-fit: contain; object-position: center; }
cc-events .cce-nav { position: absolute; inset-inline: 12px; bottom: 12px; display: flex; justify-content: space-between; pointer-events: none; }
cc-events .cce-nav button { pointer-events: auto; width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 8px; background: rgba(255, 255, 255, 0.92); color: var(--cce-fg); cursor: pointer; }
cc-events .cce-cap { margin: 8px 0 0; font-size: 0.78rem; color: var(--cce-muted); }
cc-events .cce-thumbs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
cc-events .cce-thumbs button { width: 80px; height: 56px; padding: 0; border: 1px solid var(--cce-border); border-radius: 6px; overflow: hidden; background: var(--cce-secondary); cursor: pointer; opacity: 0.55; }
cc-events .cce-thumbs button[aria-pressed="true"] { opacity: 1; outline: 2px solid var(--cce-primary); outline-offset: 2px; }
cc-events .cce-thumbs img { display: block; width: 100%; height: 100%; object-fit: cover; }
cc-events .cce-d-ses { padding: 8px 32px 0; }
cc-events .cce-ses-h { margin: 28px 0 4px; font: 600 0.78rem/1.3 var(--cce-body); letter-spacing: 0.18em; text-transform: uppercase; color: var(--cce-primary); }
cc-events .cce-ses-list { list-style: none; margin: 0; padding: 0; }
cc-events .cce-ses { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 18px; padding: 18px 0; border-top: 1px solid var(--cce-border); }
cc-events .cce-ses-list > .cce-ses:first-child { border-top: 0; }
cc-events .cce-cal { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 64px; border-radius: 8px; background: var(--cce-secondary); color: var(--cce-deep); text-align: center; }
cc-events .cce-ses.is-up .cce-cal { background: var(--cce-deep); color: #fff; }
cc-events .cce-cal-m { font: 700 0.68rem/1 var(--cce-body); letter-spacing: 0.08em; text-transform: uppercase; }
cc-events .cce-cal-d { margin-top: 3px; font: 500 1.6rem/1 var(--cce-display); }
cc-events .cce-cal-y { margin-top: 3px; font-size: 0.66rem; opacity: 0.75; }
cc-events .cce-ses-when { margin: 0; font-size: 0.8rem; color: var(--cce-muted); }
cc-events .cce-ses-title { margin: 2px 0 0; font: 500 1.15rem/1.3 var(--cce-display); color: var(--cce-deep); }
cc-events .cce-ses-desc { margin: 8px 0 0; font-size: 0.92rem; color: var(--cce-fg); opacity: 0.85; white-space: pre-line; }
cc-events .cce-ses-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 0.88rem; font-weight: 600; color: var(--cce-primary); text-decoration: none; }
cc-events .cce-ses-link:hover { color: var(--cce-deep); text-decoration: underline; }
cc-events .cce-ses-all { appearance: none; margin: 4px 0 0; padding: 10px 18px; border: 1px solid var(--cce-border); border-radius: 999px; background: none; font: 600 0.88rem var(--cce-body); color: var(--cce-deep); cursor: pointer; }
cc-events .cce-ses-all:hover { background: var(--cce-secondary); }
cc-events .cce-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 620px) {
  cc-events .cce-d-top, cc-events .cce-d-gal, cc-events .cce-d-ses { padding-left: 20px; padding-right: 20px; }
  cc-events .cce-ses { grid-template-columns: 54px minmax(0, 1fr); gap: 14px; }
  cc-events .cce-cal { height: 58px; }
  cc-events .cce-d-top { padding-top: 24px; }
}
cc-events :focus-visible { outline: 3px solid var(--cce-accent); outline-offset: 2px; }
cc-events [hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  cc-events *, cc-events *::before, cc-events *::after { transition: none !important; animation: none !important; }
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
  const CALENDAR =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const EXTERNAL =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

  // Past sessions shown before the "Show all" button.
  const PAST_SHOWN = 4;
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

  // CMS date fields arrive as "YYYY-MM-DD"; Date objects and ISO strings are
  // reduced to the same form. Dates are compared and formatted as calendar
  // days, so the viewer's time zone can't shift them.
  function dayKey(value) {
    if (!value) return "";
    if (value instanceof Date) return isNaN(value) ? "" : value.toISOString().slice(0, 10);
    const v = typeof value === "object" ? value.$date || "" : String(value);
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? m[0] : "";
  }

  function todayKey() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function dayParts(key) {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    const fmt = (o) => new Intl.DateTimeFormat("en-US", { ...o, timeZone: "UTC" }).format(date);
    return {
      month: fmt({ month: "short" }),
      day: String(d),
      year: String(y),
      long: fmt({ weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      short: fmt({ weekday: "short", month: "short", day: "numeric" }),
    };
  }

  function normalizeSessions(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map((s) => ({
        title: s && s.title ? String(s.title) : "",
        date: dayKey(s && s.date),
        time: (s && s.time) || "",
        description: (s && s.description) || "",
        link: (s && s.link) || "",
      }))
      .filter((s) => s.title && s.date);
  }

  function normalize(raw) {
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error(`<${TAG}> could not read the events attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    if (!Array.isArray(list)) return [];
    return list
      .filter((m) => m && m.title)
      .map((m, i) => {
        const photos = [];
        if (m.coverImage) photos.push(m.coverImage);
        // Wix media gallery items are { type, src, title, ... }; videos are skipped.
        if (Array.isArray(m.gallery)) {
          m.gallery.forEach((g) => {
            const src = typeof g === "object" && g ? g.src : g;
            if (src && (!g.type || g.type === "image") && !photos.includes(src)) photos.push(src);
          });
        }
        return {
          id: String(m._id || m.slug || `e${i}`),
          title: String(m.title),
          venue: m.venue || "",
          audience: m.audience || "",
          description: m.description || "",
          order: typeof m.order === "number" ? m.order : i + 1,
          photos,
          sessions: normalizeSessions(m.sessions),
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  class CcEvents extends HTMLElement {
    static get observedAttributes() {
      return ["events", "heading", "eyebrow", "more-label", "upcoming-label", "past-label", "link-label", "band", "band-depth"];
    }

    constructor() {
      super();
      this._items = null;
      this._filter = "all";
      this._current = null;
      this._photo = 0;
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

    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === "events") this._readData();
      else if (name === "band" || name === "band-depth") this._placeBand();
      else if (name === "more-label") {
        if (this._items) this._renderGrid();
      } else if (name === "heading" || name === "eyebrow") this._renderHead();
      else if (this._current) this._renderSessions(this._current);
    }

    // Lets page code pass the array directly instead of an attribute.
    set events(value) {
      this._items = normalize(value);
      if (this._built) this._renderAll();
    }

    get events() {
      return this._items || [];
    }

    _readData() {
      if (!this.hasAttribute("events")) {
        if (this._items) this._renderAll();
        else this._renderLoading();
        return;
      }
      this._items = normalize(this.getAttribute("events"));
      this._renderAll();
    }

    _build() {
      this._built = true;
      this.innerHTML = `
        <div class="cce">
          <div class="cce-band" aria-hidden="true" data-band hidden></div>
          <div class="cce-head" data-head hidden></div>
          <div class="cce-filters" role="group" aria-label="Filter events by venue" data-filters></div>
          <div class="cce-grid" data-grid aria-live="polite"></div>
          <div class="cce-overlay" data-overlay hidden>
            <div class="cce-dialog" role="dialog" aria-modal="true" aria-labelledby="cce-d-title" tabindex="-1" data-dialog>
              <button type="button" class="cce-x" aria-label="Close" data-close>${CLOSE}</button>
              <div class="cce-d-top">
                <p class="cce-d-loc" data-d-loc></p>
                <h3 class="cce-d-title" id="cce-d-title" data-d-title></h3>
                <p class="cce-d-desc" data-d-desc></p>
              </div>
              <div class="cce-d-gal" data-d-gal>
                <div class="cce-stage">
                  <img alt="" data-d-img>
                  <div class="cce-nav" data-d-nav>
                    <button type="button" aria-label="Previous photo" data-prev>${CHEV_L}</button>
                    <button type="button" aria-label="Next photo" data-next>${CHEV_R}</button>
                  </div>
                </div>
                <p class="cce-cap" data-d-count></p>
                <div class="cce-thumbs" data-d-thumbs></div>
              </div>
              <div class="cce-d-ses" data-d-ses></div>
            </div>
          </div>
        </div>`;

      const $ = (s) => this.querySelector(s);
      this._el = {
        band: $("[data-band]"),
        head: $("[data-head]"),
        filters: $("[data-filters]"),
        grid: $("[data-grid]"),
        overlay: $("[data-overlay]"),
        dialog: $("[data-dialog]"),
        dLoc: $("[data-d-loc]"),
        dTitle: $("[data-d-title]"),
        dDesc: $("[data-d-desc]"),
        dGal: $("[data-d-gal]"),
        dImg: $("[data-d-img]"),
        dNav: $("[data-d-nav]"),
        dCount: $("[data-d-count]"),
        dThumbs: $("[data-d-thumbs]"),
        dSes: $("[data-d-ses]"),
      };

      this._el.filters.addEventListener("click", (e) => {
        const b = e.target.closest("[data-venue]");
        if (!b) return;
        this._filter = b.dataset.venue;
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
      // Portrait photos (flyers, whiteboards) are shown whole instead of cropped.
      this._el.dImg.addEventListener("load", () => {
        const img = this._el.dImg;
        img.classList.toggle("is-tall", img.naturalHeight > img.naturalWidth);
      });
      $("[data-prev]").addEventListener("click", () => this._show(this._photo - 1));
      $("[data-next]").addEventListener("click", () => this._show(this._photo + 1));
      this._el.dThumbs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-i]");
        if (b) this._show(Number(b.dataset.i));
      });
      this._el.dSes.addEventListener("click", (e) => {
        const b = e.target.closest("[data-all]");
        if (!b) return;
        const list = b.previousElementSibling;
        list.querySelectorAll(".cce-ses[hidden]").forEach((li) => (li.hidden = false));
        b.remove();
        // Keep keyboard focus on the first session that was hidden.
        const first = list.children[PAST_SHOWN];
        if (first) {
          first.tabIndex = -1;
          first.focus();
        }
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
      if (this._ro) this._ro.disconnect();
      if (this._onResize) window.removeEventListener("resize", this._onResize);
      document.body.style.overflow = "";
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
      this.style.setProperty("--cce-band", color);
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
        (eyebrow ? `<p class="cce-eyebrow">${esc(eyebrow)}</p>` : "") +
        (heading ? `<h2 class="cce-title">${esc(heading)}</h2>` : "");
    }

    _renderLoading() {
      this._el.filters.innerHTML = "";
      this._el.grid.innerHTML = Array.from({ length: 3 }, () => '<div class="cce-skel" aria-hidden="true"></div>').join("");
    }

    _renderAll() {
      this._renderFilters();
      this._renderGrid();
    }

    // One chip per venue, shown only when the events are at more than one venue.
    _renderFilters() {
      const venues = [...new Set(this.events.map((m) => m.venue).filter(Boolean))];
      if (this._filter !== "all" && !venues.includes(this._filter)) this._filter = "all";
      const chips = [["all", "All events"], ...venues.map((v) => [v, v])];
      this._el.filters.innerHTML =
        venues.length > 1
          ? chips
              .map(
                ([value, label]) =>
                  `<button type="button" class="cce-chip" data-venue="${esc(value)}" aria-pressed="${value === this._filter}">${esc(label)}</button>`,
              )
              .join("")
          : "";
    }

    _renderGrid() {
      const list = this.events.filter((m) => this._filter === "all" || m.venue === this._filter);
      const label = this.getAttribute("more-label") || "View Details";
      const today = todayKey();
      this._el.grid.innerHTML = list
        .map((m) => {
          const cover = m.photos[0];
          const next = m.sessions.filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
          return `
          <article class="cce-card">
            <div class="cce-media">
              ${cover ? `<img src="${esc(imageUrl(cover, 800))}" alt="${esc(m.title)}" loading="lazy" width="800" height="600">` : `<div class="cce-ph" aria-hidden="true">${esc(m.title.charAt(0))}</div>`}
              ${m.audience ? `<span class="cce-badge">${esc(m.audience)}</span>` : ""}
            </div>
            <div class="cce-body">
              ${m.venue ? `<p class="cce-loc">${PIN}${esc(m.venue)}</p>` : ""}
              <h3 class="cce-name">${esc(m.title)}</h3>
              <p class="cce-desc">${esc(m.description)}</p>
              ${next ? `<p class="cce-next">${CALENDAR}<span>Next: ${esc(dayParts(next.date).short)}</span></p>` : ""}
              <button type="button" class="cce-more" data-open="${esc(m.id)}" aria-haspopup="dialog">${esc(label)} ${ARROW}</button>
            </div>
          </article>`;
        })
        .join("");
    }

    _open(id, opener) {
      const m = this.events.find((x) => x.id === id);
      if (!m) return;
      this._current = m;
      this._opener = opener || null;
      const e = this._el;
      e.dLoc.innerHTML =
        (m.venue ? `${PIN}<span>${esc(m.venue)}</span>` : "") +
        (m.audience ? `<span class="cce-tag">${esc(m.audience)}</span>` : "");
      e.dTitle.textContent = m.title;
      e.dDesc.textContent = m.description;
      e.dDesc.hidden = !m.description;
      e.dGal.hidden = m.photos.length === 0;
      e.dNav.hidden = m.photos.length < 2;
      e.dThumbs.hidden = m.photos.length < 2;
      e.dThumbs.innerHTML = m.photos
        .map(
          (p, i) =>
            `<button type="button" data-i="${i}" aria-label="Show photo ${i + 1}"><img src="${esc(imageUrl(p, 240))}" alt="" loading="lazy"></button>`,
        )
        .join("");
      this._show(0);
      this._renderSessions(m);
      e.overlay.hidden = false;
      document.body.style.overflow = "hidden";
      e.dialog.scrollTop = 0;
      e.dialog.focus();
      this.dispatchEvent(new CustomEvent("open", { detail: { id: m.id, title: m.title }, bubbles: true, composed: true }));
    }

    // Upcoming sessions (soonest first), then past ones (newest first); only
    // the first PAST_SHOWN past sessions show until "Show all" is pressed.
    _renderSessions(m) {
      const box = this._el.dSes;
      const today = todayKey();
      const byDate = [...m.sessions].sort((a, b) => a.date.localeCompare(b.date));
      const upcoming = byDate.filter((s) => s.date >= today);
      const past = byDate.filter((s) => s.date < today).reverse();
      const linkLabel = this.getAttribute("link-label") || "Event page";
      const item = (s, up, hidden) => {
        const d = dayParts(s.date);
        return `
          <li class="cce-ses${up ? " is-up" : ""}"${hidden ? " hidden" : ""}>
            <div class="cce-cal" aria-hidden="true">
              <span class="cce-cal-m">${esc(d.month)}</span>
              <span class="cce-cal-d">${esc(d.day)}</span>
              <span class="cce-cal-y">${esc(d.year)}</span>
            </div>
            <div>
              <p class="cce-ses-when">${esc(d.long)}${s.time ? ` · ${esc(s.time)}` : ""}</p>
              <h4 class="cce-ses-title">${esc(s.title)}</h4>
              ${s.description ? `<p class="cce-ses-desc">${esc(s.description)}</p>` : ""}
              ${s.link ? `<a class="cce-ses-link" href="${esc(s.link)}" target="_blank" rel="noopener">${esc(linkLabel)} ${EXTERNAL}<span class="cce-sr"> (opens in a new tab)</span></a>` : ""}
            </div>
          </li>`;
      };
      const section = (label, list, up) => {
        if (!list.length) return "";
        const more = !up && list.length > PAST_SHOWN;
        return (
          `<h3 class="cce-ses-h">${esc(label)}</h3>` +
          `<ul class="cce-ses-list">${list.map((s, i) => item(s, up, !up && i >= PAST_SHOWN)).join("")}</ul>` +
          (more ? `<button type="button" class="cce-ses-all" data-all>Show all ${list.length} past sessions</button>` : "")
        );
      };
      box.innerHTML =
        section(this.getAttribute("upcoming-label") || "Upcoming sessions", upcoming, true) +
        section(this.getAttribute("past-label") || "Past sessions", past, false);
      box.hidden = m.sessions.length === 0;
    }

    _show(i) {
      const m = this._current;
      if (!m || m.photos.length === 0) return;
      const n = m.photos.length;
      this._photo = ((i % n) + n) % n;
      const e = this._el;
      e.dImg.src = imageUrl(m.photos[this._photo]);
      e.dImg.alt = `${m.title}, photo ${this._photo + 1}`;
      e.dCount.textContent = n > 1 ? `${this._photo + 1} / ${n}` : "";
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

  customElements.define(TAG, CcEvents);
})();
