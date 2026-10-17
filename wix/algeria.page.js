// Wix page code for the Algeria Initiative page. Change #customElement1 if the
// custom element has a different ID in Studio.
//
// Reads the "Monuments" CMS collection and hands the items to <cc-algeria>.
// Monuments with Published unchecked are left out; Order sets the card order.
//
// It also sets the page's structured data (JSON-LD) from the same items. The
// element draws the cards in the browser, so this is what puts the monuments
// in the HTML Wix renders for search engines. It uses only the client's text
// (name, description, location, photos), not the fields added for the redesign.
import wixData from "wix-data";
import wixSeoFrontend from "wix-seo-frontend";

// wix:image://v1/<mediaId>/<name>#originWidth=..  ->  https://static.wixstatic.com/media/<mediaId>
function imageUrl(value) {
  const m = String(value || "").match(/^wix:image:\/\/v1\/([^/#]+)/);
  return m ? `https://static.wixstatic.com/media/${m[1]}` : "";
}

function structuredData(items) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "The Algeria Monument Project",
      itemListElement: items.map((m, i) => {
        const place = { "@type": "TouristAttraction", name: m.title };
        if (m.description) place.description = m.description;
        if (m.location) place.address = m.location;
        const images = [m.coverImage, m.image2].map(imageUrl).filter(Boolean);
        if (images.length) place.image = images;
        return { "@type": "ListItem", position: i + 1, item: place };
      }),
    },
  ];
}

$w.onReady(async () => {
  const algeria = $w("#customElement1");
  let items = [];
  try {
    ({ items } = await wixData
      .query("Monuments")
      .eq("published", true)
      .ascending("order")
      .limit(100)
      .find());
  } catch (err) {
    console.error("Could not load Monuments", err);
  }
  algeria.setAttribute("monuments", JSON.stringify(items));
  // Awaited inside onReady so the server render includes it.
  if (items.length) {
    await wixSeoFrontend.setStructuredData(structuredData(items)).catch((err) => console.error("Could not set structured data", err));
  }
});
