import { EVENT_URL, FEED_URL } from "./config.js";

async function requestJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/geo+json, application/json" } });
  if (!response.ok) throw new Error(`USGS request failed with status ${response.status}`);
  const data = await response.json();
  if (!data || !Array.isArray(data.features) && data.type !== "Feature") throw new Error("USGS returned an unexpected response");
  return data;
}

export async function getRecentEarthquakes() { return requestJson(FEED_URL); }

export async function getEarthquake(id) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id || "")) throw new Error("This event link is invalid");
  return requestJson(`${EVENT_URL}/${encodeURIComponent(id)}.geojson`);
}
