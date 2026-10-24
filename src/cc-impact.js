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
 * under that group's name; items without a group come first, with no heading.
 *
 * An item with an empty value is drawn as a placeholder tile ("Coming soon"),
 * so the labels can go live before the numbers are known and the client only
 * has to type the number in the CMS later. Unchecked Published hides an item.
 *
 * It renders into the light DOM (not a shadow root) so the numbers and labels
 * are part of the page for search engines. All styles are scoped under
 * `cc-impact` and prefixed `cci-`.
 *
 * Optional attributes:
 *   heading       — a heading above the numbers (leave empty when the Wix page has its own)
 *   eyebrow       — small label above the heading
 *   pending-label — text on a tile with no number yet (default "Coming soon")
 */
(() => {
  const TAG = "cc-impact";
  if (customElements.get(TAG)) return;

  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Poppins:wght@400;500;600;700&display=swap";

  const CSS = `
cc-impact {
  --cci-card: #ffffff;
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
cc-impact .cci-tile.is-pending { background: rgba(255, 255, 255, 0.6); border-top-color: var(--cci-accent); box-shadow: none; outline: 1.5px dashed var(--cci-border); outline-offset: -1.5px; }
cc-impact .cci-pending { align-self: flex-start; margin: 6px 0 10px; display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: var(--cci-secondary); color: var(--cci-deep); font: 600 0.78rem/1.2 var(--cci-body); letter-spacing: 0.08em; text-transform: uppercase; }
cc-impact .cci-pending::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--cci-primary); animation: cci-pulse 1.8s ease-in-out infinite; }
@keyframes cci-pulse { 50% { opacity: 0.3; } }

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

  function normalize(raw) {
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch (err) {
        console.error(`<${TAG}> could not read the impact attribute`, err);
        return [];
      }
    }
    if (list && Array.isArray(list.items)) list = list.items;
    if (!Array.isArray(list)) return [];
    return list
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
      return ["impact", "heading", "eyebrow", "pending-label"];
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
      if (name === "impact") this._readData();
      else if (name === "pending-label") {
        if (this._items) this._renderGroups();
      } else this._renderHead();
    }

    // Lets page code pass the array directly instead of an attribute.
    set impact(value) {
      this._items = normalize(value);
      if (this._built) this._renderGroups();
    }

    get impact() {
      return this._items || [];
    }

    _readData() {
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

    _renderGroups() {
      const pending = this.getAttribute("pending-label") || "Coming soon";
      // Groups in the order of their first item; the ungrouped numbers lead.
      const groups = new Map([["", []]]);
      this.impact.forEach((item) => {
        if (!groups.has(item.group)) groups.set(item.group, []);
        groups.get(item.group).push(item);
      });
      const heading = this.getAttribute("heading") ? "h3" : "h2";
      this._el.groups.innerHTML = [...groups]
        .filter(([, items]) => items.length)
        .map(([name, items]) => {
          const tiles = items
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
          return `
          <section class="cci-group">
            ${name ? `<${heading} class="cci-group-title">${esc(name)}</${heading}>` : ""}
            <div class="cci-grid" style="--cci-cols: ${columns(items.length)}">${tiles}</div>
          </section>`;
        })
        .join("");
    }
  }

  customElements.define(TAG, CcImpact);
})();
