/*! cc-impact v1.7.0 */
/*
 * <cc-impact> — Classic Compass impact numbers.
 * A Wix custom element for the Classic Compass Wix Studio site
 * (classiccompass.org), built like <cc-videos>.
 *
 * Data: the Wix page code queries the "Impact" CMS collection and passes the
 * items in as JSON on the `impact` attribute:
 *   $w('#customElement1').setAttribute('impact', JSON.stringify(items))
 *
 * Each item is one number: the number itself (`value`, free text such as
 * "60", "approx. 50" or "75%"), the label under it and an optional detail
 * line (program and dates). Items with the same `group` are shown together
 * under that group's name (an H3, below the section's H2, whether that is
 * native Wix text or the `heading` attribute); items without a group come
 * first, with no heading.
 *
 * An item with an empty value is drawn as a placeholder tile ("Coming soon"),
 * so the labels can go live before the numbers are known and the client only
 * has to type the number in the CMS later. Unchecked Published hides an item.
 *
 * Program overviews (the Impact page): the page code can also pass the
 * "Events" items on the `programs` attribute. Each program with impact fields
 * (`sponsor`, `impactFacts`, `impactPoints`; facts and points one per line)
 * gets a card with its cover image, venue, name, sponsor, facts as chips and
 * points as a list. The page reads: ungrouped numbers, then the programs, then
 * the grouped numbers (the target outcomes).
 *
 * It renders into the light DOM (not a shadow root) so the numbers and labels
 * are part of the page for search engines. All styles are scoped under
 * `cc-impact` and prefixed `cci-`.
 *
 * Optional attributes:
 *   heading          — a heading above the numbers (leave empty when the Wix page has its own)
 *   eyebrow          — small label above the heading
 *   pending-label    — text on a tile with no number yet (default "Coming soon")
 *   programs-heading — heading above the program cards (none by default)
 *   heading-level    — level of the group and programs headings, 2 or 3 (default 3,
 *                      for a section under a native H2; use 2 on a page whose H1 is the
 *                      only heading above). Program names are one level below.
 */
(() => {
  const TAG = "cc-impact";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-impact {
  --cci-card: #ffffff;
  --cci-pending-bg: #ffffff;
  --cci-fg: #0f2a2c;
  --cci-primary: #008381;
  --cci-deep: #003c40;
  --cci-secondary: #d9f5f2;
  --cci-accent: #8ce5d3;
  --cci-muted: #426566;
  --cci-border: #cce4e2;
  --cci-display: "Fraunces", Georgia, "Times New Roman", serif;
  --cci-body: "Poppins", "Segoe UI", system-ui, sans-serif;
  display: block;
  color: var(--cci-fg);
  font-family: var(--cci-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
cc-impact *, cc-impact *::before, cc-impact *::after { box-sizing: border-box; }
cc-impact .cci-head { margin: 0 auto 52px; max-width: 760px; text-align: center; }
cc-impact .cci-eyebrow { margin: 0 0 12px; font: 600 0.78rem/1.4 var(--cci-body); letter-spacing: 0.22em; text-transform: uppercase; color: var(--cci-primary); }
cc-impact .cci-title { margin: 0; font: 500 clamp(1.9rem, 3.4vw, 2.9rem)/1.12 var(--cci-display); color: var(--cci-deep); text-wrap: balance; }

cc-impact .cci-group + .cci-group { margin-top: 56px; }
cc-impact .cci-group-title { max-width: none; margin: 0 0 24px; text-align: center; font: 500 clamp(1.4rem, 2.4vw, 1.9rem)/1.2 var(--cci-display); color: var(--cci-deep); text-wrap: balance; }

/* Flex rather than grid so a short last row sits in the middle. */
cc-impact .cci-grid { --cci-cols: 4; --cci-gap: 24px; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--cci-gap); }
cc-impact .cci-tile { flex: 0 1 calc((100% - (var(--cci-cols) - 1) * var(--cci-gap)) / var(--cci-cols)); min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 30px 26px 28px; background: var(--cci-card); border-radius: 24px; border-top: 4px solid var(--cci-primary); box-shadow: 0 20px 50px -24px rgba(0, 60, 64, 0.35); }
@media (max-width: 1000px) { cc-impact .cci-grid { --cci-cols: 2 !important; } }
@media (max-width: 560px) {
  cc-impact .cci-grid { --cci-cols: 1 !important; --cci-gap: 14px; }
  cc-impact .cci-group + .cci-group { margin-top: 40px; }
  cc-impact .cci-tile { padding: 20px 22px; gap: 4px; border-radius: 20px; }
  cc-impact .cci-value { font-size: 2.2rem; }
  cc-impact .cci-detail { padding-top: 10px; }
  cc-impact .cci-pending { margin: 0 0 6px; }
}

cc-impact .cci-value { margin: 0; font: 600 clamp(2.4rem, 4vw, 3.2rem)/1.05 var(--cci-display); color: var(--cci-primary); overflow-wrap: anywhere; }
cc-impact .cci-label { margin: 0; font: 500 1rem/1.45 var(--cci-body); color: var(--cci-deep); }
cc-impact .cci-detail { margin: 4px 0 0; padding-top: 12px; border-top: 1px solid var(--cci-border); font-size: 0.85rem; line-height: 1.5; color: var(--cci-muted); white-space: pre-line; }

/* A tile whose number isn't known yet. */
cc-impact .cci-tile.is-pending { background: var(--cci-pending-bg); border-top-color: var(--cci-accent); box-shadow: none; outline: 1.5px dashed var(--cci-border); outline-offset: -1.5px; }
cc-impact .cci-pending { align-self: flex-start; margin: 6px 0 10px; display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: var(--cci-secondary); color: var(--cci-deep); font: 600 0.78rem/1.2 var(--cci-body); letter-spacing: 0.08em; text-transform: uppercase; }
cc-impact .cci-pending::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--cci-primary); animation: cci-pulse 1.8s ease-in-out infinite; }
@keyframes cci-pulse { 50% { opacity: 0.3; } }

/* Program overviews: a wide card per program, photo on the left. */
cc-impact .cci-progs { display: grid; gap: 28px; }
cc-impact .cci-prog { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); min-width: 0; background: var(--cci-card); border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px -24px rgba(0, 60, 64, 0.35); }
cc-impact .cci-prog-media { position: relative; min-height: 280px; background: linear-gradient(135deg, var(--cci-primary), var(--cci-deep)); }
cc-impact .cci-prog-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
cc-impact .cci-prog-mono { position: absolute; inset: 0; display: grid; place-items: center; font: italic 600 4.5rem/1 var(--cci-display); color: var(--cci-accent); }
cc-impact .cci-prog-body { display: flex; flex-direction: column; gap: 14px; padding: 34px 38px 36px; min-width: 0; }
cc-impact .cci-prog-venue { margin: 0; display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--cci-muted); }
cc-impact .cci-prog-name { max-width: none; margin: 0; font: 600 clamp(1.4rem, 2.2vw, 1.75rem)/1.2 var(--cci-display); color: var(--cci-deep); text-wrap: balance; }
cc-impact .cci-prog-sponsor { margin: 0; display: flex; align-items: flex-start; gap: 8px; font: 600 0.9rem/1.45 var(--cci-body); color: var(--cci-primary); }
cc-impact .cci-prog-sponsor svg { flex: none; margin-top: 2px; }
cc-impact .cci-facts { margin: 2px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
cc-impact .cci-facts li { margin: 0; padding: 6px 13px; border-radius: 999px; background: var(--cci-secondary); color: var(--cci-deep); font: 500 0.82rem/1.3 var(--cci-body); }
cc-impact .cci-points { margin: 4px 0 0; padding: 0; list-style: none; }
cc-impact .cci-points li { position: relative; margin: 0; padding-left: 20px; font-size: 0.95rem; line-height: 1.6; color: var(--cci-muted); }
cc-impact .cci-points li + li { margin-top: 8px; }
cc-impact .cci-points li::before { content: ""; position: absolute; left: 2px; top: 0.62em; width: 7px; height: 7px; border-radius: 50%; background: var(--cci-accent); }
@media (max-width: 860px) {
  cc-impact .cci-prog { grid-template-columns: 1fr; }
  cc-impact .cci-prog-media { min-height: 0; aspect-ratio: 16 / 9; }
}
@media (max-width: 560px) {
  cc-impact .cci-progs { gap: 20px; }
  cc-impact .cci-prog { border-radius: 22px; }
  cc-impact .cci-prog-body { padding: 24px 22px 26px; gap: 12px; }
}

cc-impact .cci-skel { flex: 0 1 calc((100% - (var(--cci-cols) - 1) * var(--cci-gap)) / var(--cci-cols)); min-height: 180px; border-radius: 24px; background: linear-gradient(90deg, var(--cci-secondary), #eefaf8, var(--cci-secondary)); background-size: 200% 100%; animation: cci-shimmer 1.4s infinite; }
@keyframes cci-shimmer { to { background-position: -200% 0; } }
cc-impact [hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  cc-impact *, cc-impact *::before, cc-impact *::after { transition: none !important; animation: none !important; }
}
`;

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

  // Columns that leave the fewest tiles alone on the last row: 5 -> 3 + 2, 7 -> 4 + 3.
  const columns = (n) => (n <= 4 ? Math.max(n, 1) : n % 4 === 0 || n % 4 === 3 ? 4 : 3);

  const PIN =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  const AWARD =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.9 7 22l5-3 5 3-1.5-8.1"/></svg>';

  // wix:image://v1/<mediaId>/<name>#originWidth=..  ->  a 4:3 crop from static.wixstatic.com
  function imageUrl(value, width) {
    if (!value) return "";
    const v = typeof value === "object" ? value.url || value.src || "" : String(value);
    const m = v.match(/^wix:image:\/\/v1\/([^/#]+)/);
    if (m) {
      const id = m[1];
      const h = Math.round(width * 0.75);
      return `https://static.wixstatic.com/media/${id}/v1/fill/w_${width},h_${h},al_c,q_80,enc_auto/${id}`;
    }
    return v;
  }

  // A CMS text field with one entry per line; a leading "-" or "•" is dropped.
  const lines = (text) =>
    String(text || "")
      .split(/\r?\n/)
      .map((l) => l.replace(/^\s*[-•]\s*/, "").trim())
      .filter(Boolean);

  function parse(raw, name) {
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error(`<${TAG}> could not read the ${name} attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    return Array.isArray(list) ? list : [];
  }

  // Events items; only programs with at least one impact field get a card.
  function normalizePrograms(raw) {
    return parse(raw, "programs")
      .filter((v) => v && v.title)
      .map((v, i) => ({
        id: String(v._id || `p${i}`),
        title: String(v.title),
        venue: v.venue || "",
        image: v.coverImage || "",
        sponsor: v.sponsor ? String(v.sponsor).trim() : "",
        facts: lines(v.impactFacts),
        points: lines(v.impactPoints),
        order: typeof v.order === "number" ? v.order : i + 1,
      }))
      .filter((p) => p.sponsor || p.facts.length || p.points.length)
      .sort((a, b) => a.order - b.order);
  }

  function normalize(raw) {
    return parse(raw, "impact")
      .filter((v) => v && v.title && v.published !== false)
      .map((v, i) => ({
        id: String(v._id || `i${i}`),
        title: String(v.title),
        value: v.value == null ? "" : String(v.value).trim(),
        detail: v.detail || "",
        group: v.group ? String(v.group).trim() : "",
        order: typeof v.order === "number" ? v.order : i + 1,
      }))
      .sort((a, b) => a.order - b.order);
  }

  class CcImpact extends HTMLElement {
    static get observedAttributes() {
      return ["impact", "programs", "heading", "eyebrow", "pending-label", "programs-heading", "heading-level"];
    }

    constructor() {
      super();
      this._items = null;
      this._programs = [];
    }

    connectedCallback() {
      ensureAssets();
      if (!this._built) this._build();
      this._readData();
    }

    attributeChangedCallback(name) {
      if (!this._built) return;
      if (name === "impact" || name === "programs") this._readData();
      else if (name === "heading" || name === "eyebrow") this._renderHead();
      else if (this._items) this._renderGroups();
    }

    // Let page code pass the arrays directly instead of attributes.
    set impact(value) {
      this._items = normalize(value);
      if (this._built) this._renderGroups();
    }

    get impact() {
      return this._items || [];
    }

    set programs(value) {
      this._programs = normalizePrograms(value);
      if (this._built && this._items) this._renderGroups();
    }

    get programs() {
      return this._programs;
    }

    _readData() {
      if (this.hasAttribute("programs")) this._programs = normalizePrograms(this.getAttribute("programs"));
      if (!this.hasAttribute("impact")) {
        if (this._items) this._renderGroups();
        else this._renderLoading();
        return;
      }
      this._items = normalize(this.getAttribute("impact"));
      this._renderGroups();
    }

    _build() {
      this._built = true;
      this.innerHTML = `
        <div class="cci-head" data-head hidden></div>
        <div data-groups aria-live="polite"></div>`;
      this._el = {
        head: this.querySelector("[data-head]"),
        groups: this.querySelector("[data-groups]"),
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
        (eyebrow ? `<p class="cci-eyebrow">${esc(eyebrow)}</p>` : "") +
        (heading ? `<h2 class="cci-title">${esc(heading)}</h2>` : "");
    }

    _renderLoading() {
      this._el.groups.innerHTML = `<div class="cci-grid">${'<div class="cci-skel" aria-hidden="true"></div>'.repeat(4)}</div>`;
    }

    _renderTiles(items, pending) {
      return items
        .map((item) => {
          const value = item.value
            ? `<p class="cci-value">${esc(item.value)}</p>`
            : `<p class="cci-pending">${esc(pending)}</p>`;
          return `
          <div class="cci-tile${item.value ? "" : " is-pending"}">
            ${value}
            <p class="cci-label">${esc(item.title)}</p>
            ${item.detail ? `<p class="cci-detail">${esc(item.detail)}</p>` : ""}
          </div>`;
        })
        .join("");
    }

    _renderPrograms(level) {
      const h = `h${level + 1}`;
      return this._programs
        .map(
          (p) => `
          <article class="cci-prog">
            <div class="cci-prog-media">
              ${p.image ? `<img src="${esc(imageUrl(p.image, 960))}" alt="" loading="lazy">` : `<span class="cci-prog-mono" aria-hidden="true">${esc(p.title.charAt(0))}</span>`}
            </div>
            <div class="cci-prog-body">
              ${p.venue ? `<p class="cci-prog-venue">${PIN}<span>${esc(p.venue)}</span></p>` : ""}
              <${h} class="cci-prog-name">${esc(p.title)}</${h}>
              ${p.sponsor ? `<p class="cci-prog-sponsor">${AWARD}<span>${esc(p.sponsor)}</span></p>` : ""}
              ${p.facts.length ? `<ul class="cci-facts">${p.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
              ${p.points.length ? `<ul class="cci-points">${p.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
            </div>
          </article>`
        )
        .join("");
    }

    _renderGroups() {
      const pending = this.getAttribute("pending-label") || "Coming soon";
      const level = this.getAttribute("heading-level") === "2" ? 2 : 3;
      const h = `h${level}`;
      const section = (title, body) => `
        <section class="cci-group">
          ${title ? `<${h} class="cci-group-title">${esc(title)}</${h}>` : ""}
          ${body}
        </section>`;
      // Groups in the order of their first item; the ungrouped numbers lead.
      const groups = new Map([["", []]]);
      this.impact.forEach((item) => {
        if (!groups.has(item.group)) groups.set(item.group, []);
        groups.get(item.group).push(item);
      });
      const parts = [...groups]
        .filter(([, items]) => items.length)
        .map(([name, items]) =>
          section(name, `<div class="cci-grid" style="--cci-cols: ${columns(items.length)}">${this._renderTiles(items, pending)}</div>`)
        );
      // Program cards go after the ungrouped numbers, before the grouped ones.
      if (this._programs.length) {
        const at = groups.get("").length ? 1 : 0;
        parts.splice(at, 0, section(this.getAttribute("programs-heading"), `<div class="cci-progs">${this._renderPrograms(level)}</div>`));
      }
      this._el.groups.innerHTML = parts.join("");
    }
  }

  customElements.define(TAG, CcImpact);
})();
