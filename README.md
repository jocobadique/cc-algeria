# cc-algeria

`<cc-algeria>`: the monument explorer for the Classic Compass "Algeria Initiative" page, built as a Wix custom element for the Classic Compass Wix Studio site (`classiccompass.org/algeria`). It shows the monuments from the site's **Monuments** CMS collection as cards with category filters and search, and opens a details popup with a photo gallery, photo credits, a map link and the Student Guide link.

The page's hero, intro text and the QR-code paragraph stay as native Wix text so they keep their SEO. This element covers the monument grid only.

The repo also holds two more elements built the same way, each for its own page (see [Events and Partners](#events-and-partners)):

- `<cc-events>`: the programs from the **Events** collection, as cards with venue filters and a details popup with a photo gallery and the program's dated sessions from the **Sessions** collection.
- `<cc-partners>`: the partners from the **Partners** collection, as logo cards with collaboration details and a website link.
- `<cc-team>`: the team section on the homepage, from the **Team** collection: a wide card for the founder, then a card per member with photo, eyebrow, name and bio.
- `<cc-videos>`: the educational videos on the homepage, from the **Videos** collection: a card per YouTube playlist with image, title, description and a Watch Playlist button.

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

## Events and Partners

Same setup as the monuments: a Custom Element with a Server URL (same repo and tag, different file), plus page code that reads the collection and passes the items as JSON. Page headings and intro text stay native Wix text.

| Element | Server URL file | Tag name | Page code | Attribute |
| --- | --- | --- | --- | --- |
| Events | `dist/cc-events.js` | `cc-events` | `wix/events.page.js` | `events` |
| Our Partners | `dist/cc-partners.js` | `cc-partners` | `wix/partners.page.js` | `partners` |

Events collection:

| Field | Key | Used for |
| --- | --- | --- |
| Program Name | `title` | Card and popup heading |
| Venue | `venue` | Pin line, and the filter buttons (shown when there is more than one venue) |
| Audience | `audience` | Card badge and popup label, when set |
| Description | `description` | Card text (3 lines) and popup text |
| Cover Image | `coverImage` | Card image and first popup photo; without one the card shows a teal panel with the program's initial |
| Gallery | `gallery` | More popup photos (media gallery field; videos are skipped) |
| Order | `order` | Card order |

Sessions collection (one row per dated session; the page code attaches each program's rows to it as `sessions`):

| Field | Key | Used for |
| --- | --- | --- |
| Session Title | `title` | Session heading in the popup |
| Program | `program` | Reference to the Events item the session belongs to |
| Date | `date` | Date block and order. Sessions from today on are listed first under "Upcoming sessions" (soonest first), and the card shows "Next: <date>"; earlier ones follow under "Past sessions" (newest first, 4 shown until "Show all") |
| Time | `time` | Free text after the date, for example "6:00 - 7:30 pm" |
| Description | `description` | Session text, when set |
| Event Link | `link` | "Event page" link (opens the library's event page in a new tab), when set |

Partners collection:

| Field | Key | Used for |
| --- | --- | --- |
| Partner Name | `title` | Card heading |
| Logo | `logo` | Fitted (not cropped) on a white panel; without one the card shows the name's initials |
| Collaboration Details | `collaboration` | Card text |
| Website | `website` | "Visit website" link, shown only when set |
| Order | `order` | Card order |

### Homepage: Our Team and Educational Videos

Same setup, with two elements on the homepage and one page code file for both, `wix/home.page.js`:

| Element | Server URL file | Tag name | Element ID in the page code | Attribute |
| --- | --- | --- | --- | --- |
| Our Team | `dist/cc-team.js` | `cc-team` | `#customElement1` | `team` |
| Educational Videos | `dist/cc-videos.js` | `cc-videos` | `#customElement2` | `videos` |

Each section's heading stays native Wix text above its element, and so do the YouTube channel boxes under the playlists ("100+ Educational Videos", "New Videos every week").

Team collection:

| Field | Key | Used for |
| --- | --- | --- |
| Name | `title` | Card heading |
| Eyebrow | `eyebrow` | Small label above the name |
| Bio | `bio` | Card text. Long bios are cut to 6 lines with a "Read more" toggle; the full text is always in the page |
| Photo | `photo` | Shown whole (fitted, not cropped), standing on the bottom edge of the photo area, since the photos are cutouts in many shapes; without one the card shows the name's initial |
| Founder | `isFounder` | Puts the member in the wide mint card on top |
| Link URL / Link Label | `linkUrl`, `linkLabel` | A link under the bio (new tab), when Link URL is set |
| Order | `order` | Card order |

Optional attributes: `eyebrow` and `heading`, `more-label` and `less-label` (bio toggle, default "Read more" and "Show less"), `link-label` (used when Link Label is empty, default "Learn more").

Videos collection (one item per playlist; the client adds new ones here):

| Field | Key | Used for |
| --- | --- | --- |
| Playlist Title | `title` | Card heading. A line break is kept, for a title in two languages |
| Description | `description` | Card text. Blank lines between paragraphs are kept |
| Image | `image` | Card image, cropped to 16:9 (1600 × 900 fits exactly); without one the card shows a teal panel |
| YouTube Link | `link` | The Watch Playlist button and the image, opening in a new tab; without one the card has no button |
| Order | `order` | Card order |

Optional attributes: `eyebrow` and `heading`, `button-label` (default "Watch Playlist", as on the original page).

### Events and Partners attributes

Optional attributes: `eyebrow` and `heading` on both. On `cc-events`: `more-label` (card button, default "View Details"), `upcoming-label` and `past-label` (session list headings, default "Upcoming sessions" and "Past sessions"), `link-label` (session link, default "Event page"). On `cc-partners`: `link-label` (default "Visit website").

### Cards overlapping the header

Both elements can paint a full-width band behind their top so the cards overlap the native header above, like the band on the Events and Partners pages:

- `band`: the band color, for example `#d9f5f2` (the header section's mint).
- `band-depth`: how far the band reaches into the first row of cards, in pixels (default `140`).

The band is sized in pixels from the layout, so it stays in place when a filter leaves fewer cards, at every breakpoint and with any number of items. In Studio:

1. Give the header section (H1 and intro) the band color as its background.
2. Give the cards section a plain background (no gradient), for example `#f7fdfd`.
3. Make the element the first thing in the cards section. The band runs up to the top of the section to cover its top margin, so anything above the element in that section would be painted over.
4. Set `band` (and `band-depth` if needed) in the element's attributes.

## How it renders

- Light DOM, not a shadow root, so the monument names and descriptions are part of the page. Styles are injected once into `<head>` and scoped under `cc-algeria` with `cca-` class names, so they don't affect the rest of the site.
- Colors follow the redesign's teal theme and can be overridden with CSS variables on the element (`--cca-primary`, `--cca-deep`, `--cca-accent`, and so on).
- Fonts (Fraunces for headings, Poppins for body text to match the site) load from Google Fonts on the page.
- Wix image fields (`wix:image://v1/...`) are turned into `static.wixstatic.com` URLs, resized for cards and thumbnails.
- Until data arrives it shows placeholder cards. Grid: 3 columns, 2 below 1000px, 1 below 640px.
- The Studio editor doesn't run page code, so in the editor the elements stay on their placeholder cards. The cards appear in Preview and on the published site.
- The popup closes with Escape, the close button or a click outside it, keeps keyboard focus inside while open, and returns focus to the card's button. It fires an `open` event (`{ id, title }`) if the page code wants to track it.

## Develop

- Edit the elements in `src/`.
- `python build.py v1.1.0` writes every `src/cc-*.js` to `dist/` with a version banner. Commit `dist/`, tag the commit, push the tag, then update the tag in the Server URLs.
- `preview.html`, `preview-events.html`, `preview-partners.html`, `preview-team.html` and `preview-videos.html` stand in for the Wix pages: they load `sample-monuments.json`, `sample-events.json` (with `sample-sessions.json`), `sample-partners.json`, `sample-team.json` and `sample-videos.json` (exports of the CMS collections) the same way the page code does. Serve the folder (for example `npx serve .`) and open them, since they fetch the JSON.
- `node shoot.cjs 375,768,1366` saves full-page and popup screenshots to `shots/` (needs `npm i playwright`).
