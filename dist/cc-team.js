/*! cc-team v1.7.1 */
/*
 * <cc-team> — Classic Compass "Our Team" grid for the homepage.
 * A Wix custom element for the Classic Compass Wix Studio site
 * (classiccompass.org), built like <cc-partners>.
 *
 * Data: the Wix page code queries the "Team" CMS collection and passes the
 * items in as JSON on the `team` attribute:
 *   $w('#customElement1').setAttribute('team', JSON.stringify(items))
 * The photo can be a Wix image URI (wix:image://v1/...) or a plain URL.
 *
 * The founder (Founder checked) gets a full-width card on top; everyone else
 * follows in a 3-column grid. Long bios are cut to a few lines with a toggle
 * to read the rest; the full text is always in the page.
 *
 * It renders into the light DOM (not a shadow root) so names and bios are
 * part of the page for search engines. All styles are scoped under `cc-team`
 * and prefixed `cct-`.
 *
 * Optional attributes:
 *   heading    — a heading above the grid (leave empty when the Wix page has its own)
 *   eyebrow    — small label above the heading
 *   more-label — text of the toggle that opens a long bio (default "Read more")
 *   less-label — text of the toggle that closes it again (default "Show less")
 *   link-label — text for a member's link when Link Label is empty (default "Learn more")
 */
(() => {
  const TAG = "cc-team";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-team {
  --cct-card: #ffffff;
  --cct-fg: #0f2a2c;
  --cct-primary: #008381;
  --cct-deep: #003c40;
  --cct-secondary: #d9f5f2;
  --cct-accent: #8ce5d3;
  --cct-muted: #426566;
  --cct-border: #cce4e2;
  --cct-display: "Fraunces", Georgia, "Times New Roman", serif;
  --cct-body: "Poppins", "Segoe UI", system-ui, sans-serif;
  display: block;
  color: var(--cct-fg);
  font-family: var(--cct-body);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
cc-team *, cc-team *::before, cc-team *::after { box-sizing: border-box; }
cc-team .cct-head { margin: 0 0 40px; }
cc-team .cct-head .cct-eyebrow { margin-bottom: 10px; }
cc-team .cct-title { margin: 0; font: 500 clamp(1.9rem, 3.4vw, 2.9rem)/1.12 var(--cct-display); color: var(--cct-deep); text-wrap: balance; }

cc-team .cct-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
@media (max-width: 960px) { cc-team .cct-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { cc-team .cct-grid { grid-template-columns: 1fr; } }

cc-team .cct-card { display: flex; flex-direction: column; gap: 22px; min-width: 0; padding: 28px; background: var(--cct-card); border: 1px solid var(--cct-border); border-radius: 28px; transition: transform .2s, box-shadow .2s; }
cc-team .cct-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -20px rgba(0, 60, 64, 0.35); }
cc-team .cct-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
/* The photos are cutouts on white or transparent backgrounds in many shapes
   (head and shoulders, full figure, a monogram), so each is shown whole,
   standing on the bottom edge of a white area, not cropped. */
cc-team .cct-photo { flex: none; position: relative; height: 230px; border-bottom: 1px solid var(--cct-border); }
cc-team .cct-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; display: block; }
cc-team .cct-mono { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); width: 112px; height: 112px; border-radius: 50%; background: var(--cct-secondary); color: var(--cct-deep); display: grid; place-items: center; font: italic 500 2.8rem/1 var(--cct-display); }
cc-team .cct-eyebrow { margin: 0; font: 600 0.78rem/1.4 var(--cct-body); letter-spacing: 0.2em; text-transform: uppercase; color: var(--cct-primary); }
cc-team .cct-name { margin: 6px 0 0; font: 600 1.85rem/1.12 var(--cct-display); color: var(--cct-deep); text-wrap: balance; }
cc-team .cct-bio { margin: 12px 0 0; font-size: 0.95rem; color: var(--cct-muted); white-space: pre-line; }
cc-team .cct-bio.is-clamped { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 6; overflow: hidden; }
cc-team .cct-toggle { align-self: flex-start; margin: 8px 0 0; padding: 0; border: 0; background: none; font: 600 0.9rem var(--cct-body); color: var(--cct-primary); cursor: pointer; }
cc-team .cct-toggle:hover, cc-team .cct-link:hover { color: var(--cct-deep); }
cc-team .cct-link { margin-top: auto; padding-top: 14px; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; font: 600 0.95rem var(--cct-body); color: var(--cct-primary); text-decoration: none; }

/* Founder: a full-width card in the mint, photo beside the text. */
cc-team .cct-founder { grid-column: 1 / -1; flex-direction: row; align-items: center; gap: 40px; padding: 36px 40px; background: var(--cct-secondary); border-color: transparent; }
cc-team .cct-founder .cct-photo { width: 300px; height: 300px; border: 0; }
cc-team .cct-founder .cct-photo img { object-position: center; transition: opacity .25s; }
cc-team .cct-photo img[data-trim]:not(.is-ready) { opacity: 0; }
cc-team .cct-founder .cct-mono { top: 50%; bottom: auto; transform: translate(-50%, -50%); width: 70%; height: 70%; background: #fff; font-size: 4rem; }
@media (max-width: 960px) { cc-team .cct-founder .cct-photo { width: 240px; height: 240px; } }
cc-team .cct-founder .cct-name { font-size: clamp(2.2rem, 4vw, 2.8rem); }
cc-team .cct-founder .cct-bio { font-size: 1.02rem; color: var(--cct-fg); opacity: .82; max-width: 62ch; }
@media (max-width: 640px) {
  cc-team .cct-card { padding: 24px; }
  cc-team .cct-founder { flex-direction: column; align-items: flex-start; gap: 18px; padding: 28px 24px; }
  cc-team .cct-photo { height: 210px; }
  cc-team .cct-founder .cct-photo { align-self: center; width: 220px; height: 220px; }
}

cc-team .cct-skel { background: linear-gradient(90deg, var(--cct-secondary), #eefaf8, var(--cct-secondary)); background-size: 200% 100%; animation: cct-shimmer 1.4s infinite; border-radius: 28px; min-height: 280px; }
cc-team .cct-skel.cct-founder { min-height: 220px; }
@keyframes cct-shimmer { to { background-position: -200% 0; } }
cc-team :focus-visible { outline: 3px solid var(--cct-accent); outline-offset: 2px; }
cc-team [hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  cc-team *, cc-team *::before, cc-team *::after { transition: none !important; animation: none !important; }
}
`;

  const ARROW =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

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
  // fitted inside a size x size box, not cropped.
  function photoUrl(value, size) {
    if (!value) return "";
    const v = typeof value === "object" ? value.url || value.src || "" : String(value);
    const m = v.match(/^wix:image:\/\/v1\/([^/#]+)/);
    if (m) {
      const id = m[1];
      return `https://static.wixstatic.com/media/${id}/v1/fit/w_${size},h_${size},q_85,enc_auto/${id}`;
    }
    return v;
  }

  // Some photos come with wide transparent margins (Silvia's round graphic
  // fills only the middle two thirds), which makes them look small in the
  // founder box. Cut the margins off and show the trimmed copy. Without CORS
  // the canvas can't be read, and the photo is shown as it is.
  function trimTransparent(img) {
    const done = () => img.classList.add("is-ready");
    if (img.dataset.trimmed) return done();
    img.dataset.trimmed = "1";
    try {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const alpha = ctx.getImageData(0, 0, w, h).data;
      let top = h, left = w, right = -1, bottom = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (alpha[(y * w + x) * 4 + 3] > 8) {
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            bottom = y;
          }
        }
      }
      const cw = right - left + 1;
      const ch = bottom - top + 1;
      if (right < 0 || (cw > w * 0.95 && ch > h * 0.95)) return done();
      const out = document.createElement("canvas");
      out.width = cw;
      out.height = ch;
      out.getContext("2d").drawImage(canvas, left, top, cw, ch, 0, 0, cw, ch);
      out.toBlob((blob) => {
        if (!blob) return done();
        img.addEventListener("load", done, { once: true });
        img.src = URL.createObjectURL(blob);
      });
    } catch (err) {
      done();
    }
  }

  function normalize(raw) {
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error(`<${TAG}> could not read the team attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    if (!Array.isArray(list)) return [];
    return list
      .filter((m) => m && m.title)
      .map((m, i) => ({
        id: String(m._id || m.slug || `m${i}`),
        title: String(m.title),
        eyebrow: m.eyebrow || "",
        bio: m.bio || "",
        photo: m.photo || "",
        linkUrl: m.linkUrl || "",
        linkLabel: m.linkLabel || "",
        founder: m.isFounder === true,
        order: typeof m.order === "number" ? m.order : i + 1,
      }))
      .sort((a, b) => b.founder - a.founder || a.order - b.order);
  }

  class CcTeam extends HTMLElement {
    static get observedAttributes() {
      return ["team", "heading", "eyebrow", "more-label", "less-label", "link-label"];
    }

    constructor() {
      super();
      this._items = null;
    }

    connectedCallback() {
      ensureAssets();
      if (!this._built) this._build();
      this._readData();
      // Whether a bio needs its toggle depends on the card width and the fonts.
      this._ro = new ResizeObserver(() => this._fitBios());
      this._ro.observe(this);
      if (document.fonts) document.fonts.ready.then(() => this._fitBios());
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
    }

    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === "team") this._readData();
      else if (name === "heading" || name === "eyebrow") this._renderHead();
      else if (this._items) this._renderGrid();
    }

    // Lets page code pass the array directly instead of an attribute.
    set team(value) {
      this._items = normalize(value);
      if (this._built) this._renderGrid();
    }

    get team() {
      return this._items || [];
    }

    _readData() {
      if (!this.hasAttribute("team")) {
        if (this._items) this._renderGrid();
        else this._renderLoading();
        return;
      }
      this._items = normalize(this.getAttribute("team"));
      this._renderGrid();
    }

    _build() {
      this._built = true;
      this.innerHTML = `
        <div class="cct-head" data-head hidden></div>
        <div class="cct-grid" data-grid aria-live="polite"></div>`;
      this._el = {
        head: this.querySelector("[data-head]"),
        grid: this.querySelector("[data-grid]"),
      };
      this._el.grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".cct-toggle");
        if (btn) this._toggle(btn);
      });
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
        (eyebrow ? `<p class="cct-eyebrow">${esc(eyebrow)}</p>` : "") +
        (heading ? `<h2 class="cct-title">${esc(heading)}</h2>` : "");
    }

    _renderLoading() {
      this._el.grid.innerHTML =
        '<div class="cct-skel cct-founder" aria-hidden="true"></div>' +
        Array.from({ length: 3 }, () => '<div class="cct-skel" aria-hidden="true"></div>').join("");
    }

    _renderGrid() {
      const more = this.getAttribute("more-label") || "Read more";
      const fallbackLink = this.getAttribute("link-label") || "Learn more";
      this._el.grid.innerHTML = this.team
        .map((m) => {
          const size = m.founder ? 640 : 480;
          const bioId = `cct-bio-${m.id}`;
          return `
          <article class="cct-card${m.founder ? " cct-founder" : ""}">
            <div class="cct-photo">
              ${m.photo ? `<img${m.founder ? ' crossorigin="anonymous" data-trim' : ""} src="${esc(photoUrl(m.photo, size))}" alt="${esc(m.title)}" loading="lazy">` :`<span class="cct-mono" aria-hidden="true">${esc(m.title[0])}</span>`}
            </div>
            <div class="cct-text">
              ${m.eyebrow ? `<p class="cct-eyebrow">${esc(m.eyebrow)}</p>` : ""}
              <h3 class="cct-name">${esc(m.title)}</h3>
              ${m.bio ? `<p class="cct-bio${m.founder ? "" : " is-clamped"}" id="${esc(bioId)}">${esc(m.bio)}</p>` : ""}
              ${m.bio && !m.founder ? `<button class="cct-toggle" type="button" aria-expanded="false" aria-controls="${esc(bioId)}" hidden>${esc(more)}</button>` : ""}
              ${m.linkUrl ? `<a class="cct-link" href="${esc(m.linkUrl)}" target="_blank" rel="noopener">${esc(m.linkLabel || fallbackLink)} ${ARROW}</a>` : ""}
            </div>
          </article>`;
        })
        .join("");
      this._el.grid.querySelectorAll("img[data-trim]").forEach((img) => {
        if (img.complete) {
          if (img.naturalWidth) trimTransparent(img);
          else img.classList.add("is-ready");
        } else {
          img.addEventListener("load", () => trimTransparent(img), { once: true });
          img.addEventListener("error", () => img.classList.add("is-ready"), { once: true });
        }
      });
      this._fitBios();
    }

    // Shows the toggle only on bios that are actually cut off at this width.
    _fitBios() {
      if (!this._el) return;
      this._el.grid.querySelectorAll(".cct-toggle").forEach((btn) => {
        if (btn.getAttribute("aria-expanded") === "true") return;
        const bio = btn.previousElementSibling;
        btn.hidden = bio.scrollHeight <= bio.clientHeight + 1;
      });
    }

    _toggle(btn) {
      const bio = btn.previousElementSibling;
      const open = btn.getAttribute("aria-expanded") !== "true";
      bio.classList.toggle("is-clamped", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? this.getAttribute("less-label") || "Show less" : this.getAttribute("more-label") || "Read more";
    }
  }

  customElements.define(TAG, CcTeam);
})();
