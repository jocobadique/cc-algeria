// Wix page code for the Events page, which holds two custom elements:
//   #customElement1  <cc-events>  the program cards, from "Events" and "Sessions"
//   #customElement2  <cc-impact>  the impact numbers, from "Impact"
// Change the IDs if the elements have different ones in Studio.
//
// Order sets the card and tile order. Each program gets its rows from the
// "Sessions" collection (matched on the Program reference) as `sessions`.
// An Impact item with an empty Value shows "Coming soon".
import wixData from "wix-data";

// Date fields come back as "YYYY-MM-DD"; a Date object is turned into the
// same form from its local date, so it doesn't shift a day in UTC.
function dayKey(value) {
  if (!(value instanceof Date)) return value;
  const pad = (n) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

async function load(collection, sortField, limit) {
  try {
    const { items } = await wixData.query(collection).ascending(sortField).limit(limit).find();
    return items;
  } catch (err) {
    console.error(`Could not load ${collection}`, err);
    return [];
  }
}

$w.onReady(async () => {
  const [events, sessions, impact] = await Promise.all([
    load("Events", "order", 100),
    load("Sessions", "date", 1000),
    load("Impact", "order", 100),
  ]);
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
  const items = events.map((e) => ({ ...e, sessions: byProgram[e._id] || [] }));
  $w("#customElement1").setAttribute("events", JSON.stringify(items));
  $w("#customElement2").setAttribute("impact", JSON.stringify(impact));
});
