# cc-algeria

`<cc-algeria>`: the monument explorer for the Classic Compass "Algeria Initiative" page, built as a Wix custom element for the Classic Compass Wix Studio site (`classiccompass.org/algeria`). It shows the monuments from the site's **Monuments** CMS collection as cards with category filters and search, and opens a details popup with a photo gallery, photo credits, a map link and the Student Guide link.

The page's hero, intro text and the QR-code paragraph stay as native Wix text so they keep their SEO. This element covers the monument grid only.

## Use in Wix Studio

Add a **Custom Element** to the page, set its source to **Server URL**, and enter:

- **Server URL:** `https://cdn.jsdelivr.net/gh/<github-owner>/cc-algeria@<tag>/dist/cc-algeria.js`
- **Tag name:** `cc-algeria`

Pin a tag (for example `v1.0.0`) so a change only goes live when the URL in Studio is updated.

Then paste `wix/algeria.page.js` into the page's code. It queries the Monuments collection (Published only, sorted by Order) and passes the items to the element as JSON on its `monuments` attribute. Change `#customElement1` if the element has a different ID.

The page code also sets the page's structured data (a schema.org `ItemList` of `TouristAttraction` entries with name, description, location and photos) through `wix-seo-frontend`. The element draws the cards in the browser, so this is how the monuments reach the HTML Wix renders for search engines. Check it with Google's Rich Results Test on the published page.

### Page hero

The hero above the grid (title, intro and the QR-code line) is native Wix text, so it stays in the HTML Wix renders. It is styled by `wix/algeria-hero.css`, appended to the site's `global.css` in Studio (Code > CSS). In `global.css`, Studio prefixes every class with `wixui-`, so target rich text with `.rich-text__text`, not `.wixui-rich-text__text`. The classes are set on the elements in Studio (code panel > CSS Classes); the file's header lists which element gets which. The section's deep-teal background (`#003c40`, photo at 35% opacity), the stack margins per breakpoint and the H1 tag are set in Studio itself.

Optional attributes, set in the element's settings in Studio:

- `eyebrow` and `heading`: a label and heading above the grid. Leave them empty when the Wix page has its own heading.
- `guide-label`: the text of the card button that opens the popup, also used for the popup's guide link when `guideUrl` is set (default "Student Guide", as on the original page).

## Content (Monuments collection)

| Field | Key | Used for |
| --- | --- | --- |
| Name | `title` | Card and popup heading |
| Location | `location` | Pin line on the card and popup |
| Maps Link | `mapsUrl` | "View on map" in the popup |
| Description | `description` | Card text (3 lines); popup text when Student Guide Text is empty |
| Student Guide Text | `guideText` | Popup text: the client's copy from the original page's Student Guide lightboxes |
| Category | `category` | Filter buttons, built from whatever categories exist |
| UNESCO Site | `unesco` | Card badge and popup label |
| Cover Image / Gallery Image 2 | `coverImage`, `image2` | Card image and popup gallery |
| Cover Image Credit / Gallery Image 2 Credit | `image1Credit`, `image2Credit` | "Photo credit" link per photo |
| Student Guide Link | `guideUrl` | Popup button, shown only when set |
| Order | `order` | Card order |
| Published | `published` | Unchecked items are hidden |

Editors change content in the CMS; nothing in this repo needs to change for new monuments.

## How it renders

- Light DOM, not a shadow root, so the monument names and descriptions are part of the page. Styles are injected once into `<head>` and scoped under `cc-algeria` with `cca-` class names, so they don't affect the rest of the site.
- Colors follow the redesign's teal theme and can be overridden with CSS variables on the element (`--cca-primary`, `--cca-deep`, `--cca-accent`, and so on).
- Fonts (Fraunces for headings, Poppins for body text to match the site) load from Google Fonts on the page.
- Wix image fields (`wix:image://v1/...`) are turned into `static.wixstatic.com` URLs, resized for cards and thumbnails.
- Until data arrives it shows placeholder cards. Grid: 3 columns, 2 below 1000px, 1 below 640px.
- The popup closes with Escape, the close button or a click outside it, keeps keyboard focus inside while open, and returns focus to the card's button. It fires an `open` event (`{ id, title }`) if the page code wants to track it.

## Develop

- Edit `src/cc-algeria.js`.
- `python build.py v1.0.0` writes `dist/cc-algeria.js` with a version banner. Commit `dist/`, tag the commit, push the tag, then update the tag in the Server URL.
- `preview.html` stands in for the Wix page: it loads `sample-monuments.json` (an export of the CMS collection) the same way the page code does. Serve the folder (for example `npx serve .`) and open it, since it fetches the JSON.
- `node shoot.cjs 375,768,1366` saves full-page and popup screenshots to `shots/` (needs `npm i playwright`).
