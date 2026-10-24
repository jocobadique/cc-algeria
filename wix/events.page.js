// Wix page code for the Events page. Change #customElement1 if the custom
// element has a different ID in Studio.
//
// Reads the "Events" CMS collection and hands the items to <cc-events>.
// Order sets the card order. Each program gets its rows from the "Sessions"
// collection (matched on the Program reference) as `sessions`.
import wixData from "wix-data";

// Date fields come back as "YYYY-MM-DD"; a Date object is turned into the
// same form from its local date, so it doesn't shift a day in UTC.
function dayKey(value) {
  if (!(value instanceof Date)) return value;
  const pad = (n) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

$w.onReady(async () => {
  const events = $w("#customElement1");
  let items = [];
  let sessions = [];
  try {
    ({ items } = await wixData.query("Events").ascending("order").limit(100).find());
  } catch (err) {
    console.error("Could not load Events", err);
  }
  try {
    ({ items: sessions } = await wixData.query("Sessions").ascending("date").limit(1000).find());
  } catch (err) {
    console.error("Could not load Sessions", err);
  }
  const byProgram = {};
  sessions.forEach((s) => {
    const id = s.program && typeof s.program === "object" ? s.program._id : s.program;
    (byProgram[id] = byProgram[id] || []).push({
      title: s.title,
      date: dayKey(s.date),
      time: s.time,
      description: s.description,
      link: s.link,
    });
  });
  items = items.map((e) => ({ ...e, sessions: byProgram[e._id] || [] }));
  events.setAttribute("events", JSON.stringify(items));
});
