// Wix page code for the homepage, which holds two custom elements:
//   #customElement1  <cc-team>    the team section, from the "Team" collection
//   #customElement2  <cc-videos>  the educational videos, from the "Videos" collection
// Change the IDs if the elements have different ones in Studio. This replaces
// the homepage's page code (it includes what wix/team.page.js did).
//
// Founder puts a team member in the wide card on top; Order sets the order of
// the rest and of the playlists.
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
  const [team, videos] = await Promise.all([load("Team"), load("Videos")]);
  $w("#customElement1").setAttribute("team", JSON.stringify(team));
  $w("#customElement2").setAttribute("videos", JSON.stringify(videos));
});
