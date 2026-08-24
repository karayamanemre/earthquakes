import test from "node:test";
import assert from "node:assert/strict";
import { filterEarthquakes, isPointInContinent } from "../js/continents.js";

test("recognizes representative points on every continent", () => {
  assert.equal(isPointInContinent(40.7, -74, "north-america"), true);
  assert.equal(isPointInContinent(-23.5, -46.6, "south-america"), true);
  assert.equal(isPointInContinent(48.8, 2.3, "europe"), true);
  assert.equal(isPointInContinent(-1.3, 36.8, "africa"), true);
  assert.equal(isPointInContinent(35.7, 139.7, "asia"), true);
  assert.equal(isPointInContinent(-33.9, 151.2, "oceania"), true);
});

test("supports Oceania on both sides of the international date line", () => {
  assert.equal(isPointInContinent(-20, 175, "oceania"), true);
  assert.equal(isPointInContinent(-20, -175, "oceania"), true);
});

test("filters by both region and magnitude", () => {
  const events = [
    { properties: { mag: 5 }, geometry: { coordinates: [151.2, -33.9, 10] } },
    { properties: { mag: 2 }, geometry: { coordinates: [150, -30, 5] } },
    { properties: { mag: 6 }, geometry: { coordinates: [-74, 40.7, 8] } },
  ];
  assert.equal(filterEarthquakes(events, "oceania", 4.5).length, 1);
});

test("ignores malformed events", () => {
  assert.deepEqual(filterEarthquakes([{ properties: {}, geometry: null }], "all"), []);
});
