// Wix page code for the Impact page. Change #customElement1 if the custom
// element has a different ID in Studio.
//
// Reads the "Impact" collection (the numbers and target outcomes) and the
// "Events" collection (each program's Sponsor, Key Facts and Overview Points)
// and hands both to <cc-impact>. Order sets the tile and card order; an Impact
// item with an empty Value shows "Coming soon", and a program with no impact
// fields gets no card.
import wixData from "wix-data";

async function load(collection) {
  try {
    const { items } = await wixData.query(collection).ascending("order").limit(100).find();
    return items;
  } catch (err) {
    console.error(`Could not load ${collection}`, err);
    return [];
  }
}

$w.onReady(async () => {
  const [impact, programs] = await Promise.all([load("Impact"), load("Events")]);
  const element = $w("#customElement1");
  element.setAttribute("programs", JSON.stringify(programs));
  element.setAttribute("impact", JSON.stringify(impact));
});
