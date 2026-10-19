// Wix page code for the Events page. Change #customElement1 if the custom
// element has a different ID in Studio.
//
// Reads the "Events" CMS collection and hands the items to <cc-events>.
// Order sets the card order.
import wixData from "wix-data";

$w.onReady(async () => {
  const events = $w("#customElement1");
  let items = [];
  try {
    ({ items } = await wixData.query("Events").ascending("order").limit(100).find());
  } catch (err) {
    console.error("Could not load Events", err);
  }
  events.setAttribute("events", JSON.stringify(items));
});
