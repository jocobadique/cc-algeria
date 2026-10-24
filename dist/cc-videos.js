/*! cc-videos v1.7.1 */
/*
 * <cc-videos> — Classic Compass "Educational Videos" playlists for the homepage.
 * A Wix custom element for the Classic Compass Wix Studio site
 * (classiccompass.org), built like <cc-partners>.
 *
 * Data: the Wix page code queries the "Videos" CMS collection and passes the
 * items in as JSON on the `videos` attribute:
 *   $w('#customElement2').setAttribute('videos', JSON.stringify(items))
 * The image can be a Wix image URI (wix:image://v1/...) or a plain URL.
 *
 * Each playlist is a card: image, title, description and a button that opens
 * the YouTube link in a new tab. Line breaks in the title and description are
 * kept, so a bilingual title or a second paragraph stays as typed in the CMS.
 *
 * It renders into the light DOM (not a shadow root) so titles and
 * descriptions are part of the page for search engines. All styles are
 * scoped under `cc-videos` and prefixed `ccv-`.
 *
 * Optional attributes:
 *   heading      — a heading above the grid (leave empty when the Wix page has its own)
 *   eyebrow      — small label above the heading
 *   button-label — text of the card button (default "Watch Playlist", as on the original page)
 */
(() => {
  const TAG = "cc-videos";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-videos {
  --ccv-card: #ffffff;
  --ccv-fg: #0f2a2c;
  --ccv-primary: #008381;
  --ccv-deep: #003c40;
  --ccv-secondary: #d9f5f2;
  --ccv-accent: #8ce5d3;
  --ccv-muted: #426566;
  --ccv-border: #cce4e2;
  --ccv-display: "Fraunces", Georgia, "Times New Roman", serif;
  --ccv-body: "Poppins", "Segoe UI", system-ui, sans-serif;
  display: block;
  color: var(--ccv-fg);
  font-family: var(--ccv-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
cc-videos *, cc-videos *::before, cc-videos *::after { box-sizing: border-box; }
cc-videos .ccv-head { margin: 0 auto 52px; max-width: 760px; text-align: center; }
cc-videos .ccv-eyebrow { margin: 0 0 12px; font: 600 0.78rem/1.4 var(--ccv-body); letter-spacing: 0.22em; text-transform: uppercase; color: var(--ccv-primary); }
cc-videos .ccv-title { margin: 0; font: 500 clamp(1.9rem, 3.4vw, 2.9rem)/1.12 var(--ccv-display); color: var(--ccv-deep); text-wrap: balance; }

cc-videos .ccv-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
@media (max-width: 760px) { cc-videos .ccv-grid { grid-template-columns: 1fr; gap: 20px; } }

cc-videos .ccv-card { display: flex; flex-direction: column; min-width: 0; background: var(--ccv-card); border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px -20px rgba(0, 60, 64, 0.35); }
cc-videos .ccv-media { position: relative; display: block; aspect-ratio: 16 / 9; overflow: hidden; background: linear-gradient(135deg, var(--ccv-primary), var(--ccv-deep)); }
cc-videos .ccv-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s; }
cc-videos .ccv-card:hover .ccv-media img { transform: scale(1.04); }
cc-videos .ccv-play { position: absolute; left: 14px; top: 14px; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: rgba(255, 255, 255, 0.92); color: var(--ccv-primary); }
cc-videos .ccv-body { display: flex; flex-direction: column; flex: 1; gap: 12px; padding: 28px; }
cc-videos .ccv-name { margin: 0; font: 600 1.5rem/1.2 var(--ccv-display); color: var(--ccv-deep); white-space: pre-line; text-wrap: balance; }
cc-videos .ccv-desc { margin: 0; font-size: 0.97rem; color: var(--ccv-muted); white-space: pre-line; }
cc-videos .ccv-btn { margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; background: var(--ccv-primary); color: #fff; font: 600 0.95rem/1.2 var(--ccv-body); text-decoration: none; transition: background .2s; }
cc-videos .ccv-btn:hover { background: var(--ccv-deep); }
@media (max-width: 640px) { cc-videos .ccv-body { padding: 24px; } }

cc-videos .ccv-skel { background: linear-gradient(90deg, var(--ccv-secondary), #eefaf8, var(--ccv-secondary)); background-size: 200% 100%; animation: ccv-shimmer 1.4s infinite; border-radius: 28px; min-height: 420px; }
@keyframes ccv-shimmer { to { background-position: -200% 0; } }
cc-videos :focus-visible { outline: 3px solid var(--ccv-accent); outline-offset: 2px; }
cc-videos [hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  cc-videos *, cc-videos *::before, cc-videos *::after { transition: none !important; animation: none !important; }
}
`;

  const PLAY =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';

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

  // wix:image://v1/<mediaId>/<name>#originWidth=..  ->  a 16:9 crop from static.wixstatic.com
  function imageUrl(value, width) {
    if (!value) return "";
    const v = typeof value === "object" ? value.url || value.src || "" : String(value);
    const m = v.match(/^wix:image:\/\/v1\/([^/#]+)/);
    if (m) {
      const id = m[1];
      const h = Math.round((width * 9) / 16);
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
        console.error(`<${TAG}> could not read the videos attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    if (!Array.isArray(list)) return [];
    return list
      .filter((v) => v && v.title)
      .map((v, i) => ({
        id: String(v._id || v.slug || `v${i}`),
        title: String(v.title),
        description: v.description || "",
        image: v.image || "",
        link: v.link || "",
        order: typeof v.order === "number" ? v.order : i + 1,
      }))
      .sort((a, b) => a.order - b.order);
  }

  class CcVideos extends HTMLElement {
    static get observedAttributes() {
      return ["videos", "heading", "eyebrow", "button-label"];
    }

    constructor() {
      super();
      this._items = null;
    }

    connectedCallback() {
      ensureAssets();
      if (!this._built) this._build();
      this._readData();
    }

    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === "videos") this._readData();
      else if (name === "button-label") {
        if (this._items) this._renderGrid();
      } else this._renderHead();
    }

    // Lets page code pass the array directly instead of an attribute.
    set videos(value) {
      this._items = normalize(value);
      if (this._built) this._renderGrid();
    }

    get videos() {
      return this._items || [];
    }

    _readData() {
      if (!this.hasAttribute("videos")) {
        if (this._items) this._renderGrid();
        else this._renderLoading();
        return;
      }
      this._items = normalize(this.getAttribute("videos"));
      this._renderGrid();
    }

    _build() {
      this._built = true;
      this.innerHTML = `
        <div class="ccv-head" data-head hidden></div>
        <div class="ccv-grid" data-grid aria-live="polite"></div>`;
      this._el = {
        head: this.querySelector("[data-head]"),
        grid: this.querySelector("[data-grid]"),
      };
      this._renderHead();
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
        (eyebrow ? `<p class="ccv-eyebrow">${esc(eyebrow)}</p>` : "") +
        (heading ? `<h2 class="ccv-title">${esc(heading)}</h2>` : "");
    }

    _renderLoading() {
      this._el.grid.innerHTML = Array.from({ length: 2 }, () => '<div class="ccv-skel" aria-hidden="true"></div>').join("");
    }

    _renderGrid() {
      const label = this.getAttribute("button-label") || "Watch Playlist";
      this._el.grid.innerHTML = this.videos
        .map((v) => {
          // The image repeats the button's link for mouse users; keyboard and
          // screen-reader users get the one button.
          const media = `
            ${v.image ? `<img src="${esc(imageUrl(v.image, 960))}" alt="" loading="lazy">` : ""}
            <span class="ccv-play">${PLAY}</span>`;
          return `
          <article class="ccv-card">
            ${v.link ? `<a class="ccv-media" href="${esc(v.link)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${media}</a>` : `<div class="ccv-media">${media}</div>`}
            <div class="ccv-body">
              <h3 class="ccv-name">${esc(v.title)}</h3>
              ${v.description ? `<p class="ccv-desc">${esc(v.description)}</p>` : ""}
              ${v.link ? `<a class="ccv-btn" href="${esc(v.link)}" target="_blank" rel="noopener">${PLAY} ${esc(label)}</a>` : ""}
            </div>
          </article>`;
        })
        .join("");
    }
  }

  customElements.define(TAG, CcVideos);
})();
