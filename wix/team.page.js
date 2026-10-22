// Wix page code for the team section on the homepage. Change #customElement1
// if the custom element has a different ID in Studio. If the homepage already
// has page code, add the query to its $w.onReady instead of a second one.
//
// Reads the "Team" CMS collection and hands the items to <cc-team>.
// Founder puts a member in the wide card on top; Order sets the rest.
import wixData from "wix-data";

$w.onReady(async () => {
  const team = $w("#customElement1");
  let items = [];
  try {
    ({ items } = await wixData.query("Team").ascending("order").limit(100).find());
  } catch (err) {
    console.error("Could not load Team", err);
  }
  team.setAttribute("team", JSON.stringify(items));
});
