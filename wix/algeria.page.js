// Wix page code for the Algeria Initiative page. Change #customElement1 if the
// custom element has a different ID in Studio.
//
// Reads the "Monuments" CMS collection and hands the items to <cc-algeria>.
// Monuments with Published unchecked are left out; Order sets the card order.
import wixData from "wix-data";

$w.onReady(async () => {
  const algeria = $w("#customElement1");
  try {
    const { items } = await wixData
      .query("Monuments")
      .eq("published", true)
      .ascending("order")
      .limit(100)
      .find();
    algeria.setAttribute("monuments", JSON.stringify(items));
  } catch (err) {
    console.error("Could not load Monuments", err);
    algeria.setAttribute("monuments", "[]");
  }
});
