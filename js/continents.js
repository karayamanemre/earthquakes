const regions = {
  "north-america": [
    [[-168, 7], [-168, 72], [-52, 84], [-52, 46], [-82, 7]],
    [[-118, 7], [-77, 7], [-77, 33], [-118, 33]],
  ],
  "south-america": [[[-82, 13], [-34, 13], [-34, -56], [-76, -56], [-82, -20]]],
  europe: [[[-25, 34], [45, 34], [60, 60], [31, 72], [-25, 72]]],
  africa: [[[-18, 37], [16, 37], [52, 12], [52, -35], [18, -35], [-18, 15]]],
  asia: [
    [[25, 1], [180, 1], [180, 78], [60, 82], [25, 45]],
    [[-180, 45], [-168, 45], [-168, 72], [-180, 72]],
  ],
  oceania: [
    [[110, 0], [180, 0], [180, -50], [110, -50]],
    [[-180, 0], [-110, 0], [-110, -50], [-180, -50]],
  ],
};

function pointInPolygon(longitude, latitude, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j];
    const intersects = yi > latitude !== yj > latitude && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function isPointInContinent(latitude, longitude, continent) {
  if (continent === "all") return true;
  return (regions[continent] || []).some((polygon) => pointInPolygon(longitude, latitude, polygon));
}

export function filterEarthquakes(earthquakes, continent, minimumMagnitude = -10) {
  return earthquakes.filter((earthquake) => {
    const coordinates = earthquake?.geometry?.coordinates;
    const magnitude = Number(earthquake?.properties?.mag);
    return Array.isArray(coordinates) && Number.isFinite(magnitude) && magnitude >= minimumMagnitude && isPointInContinent(coordinates[1], coordinates[0], continent);
  });
}
