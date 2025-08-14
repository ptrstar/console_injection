// NTNU Go console injection
const events = [
  "Hike #1 (Advanced)",
  "Hike #2 (Advanced)"
];

let lastBothFull = true;

async function checkSpots() {
  const now = new Date().toLocaleTimeString();
  let results = [];

  for (const eventName of events) {
    try {
      const url = `/api/events/isEventSignupFull/?event_name=${encodeURIComponent(eventName)}`;
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();
      results.push({ eventName, data });
    } catch (err) {
      results.push({ eventName, error: err });
    }
  }

  const bothFull = results.every(r => r.data && r.data.is_full === true);

  if (bothFull) {
    if (lastBothFull) {
      console.clear();
    }
    lastBothFull = true;
  } else {
    lastBothFull = false;
  }

  results.forEach(r => {
    if (r.error) {
      console.error(`[${now}] Error checking ${r.eventName}:`, r.error);
    } else if (r.data.is_full === false) {
      console.log(
        `[${now}] %c${r.eventName} has a spot!`,
        "color: green; font-weight: bold;"
      );
      console.log("API response:", r.data);
    } else {
      console.log(`[${now}] ${r.eventName} is still full.`);
      console.log("API response:", r.data);
    }
  });
}

checkSpots();
setInterval(checkSpots, 10000);
