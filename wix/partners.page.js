// Wix page code for the Our Partners page. Change #customElement1 if the
// custom element has a different ID in Studio.
//
// Reads the "Partners" CMS collection and hands the items to <cc-partners>.
// Order sets the card order.
import wixData from "wix-data";

$w.onReady(async () => {
  const partners = $w("#customElement1");
  let items = [];
  try {
    ({ items } = await wixData.query("Partners").ascending("order").limit(100).find());
  } catch (err) {
    console.error("Could not load Partners", err);
  }
  partners.setAttribute("partners", JSON.stringify(items));
});
