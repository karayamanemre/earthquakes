# Earthquakes

A responsive, accessible web application for exploring earthquakes recorded worldwide during the last 24 hours. Data comes directly from the U.S. Geological Survey (USGS).

## Live demo

[Open Earthquakes](https://karayamanemre.github.io/earthquakes/)

## Features

- Live USGS earthquake feed with automatic refresh
- List and interactive Leaflet map views
- Continent and minimum-magnitude filters
- Shareable event detail URLs backed by the USGS event API
- Persistent light and dark themes
- Responsive layout, keyboard-accessible cards and visible loading/error states
- No runtime framework or build step required

## Local development

ES modules must be served over HTTP rather than opened directly from the filesystem.

```sh
git clone https://github.com/karayamanemre/earthquakes.git
cd earthquakes
npm install
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Checks

```sh
npm run check
```

The test suite covers representative continent coordinates, the international date line, magnitude filtering and malformed API entries.

## Technology

- Modern JavaScript modules
- CSS custom properties
- [Leaflet](https://leafletjs.com/)
- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
- OpenStreetMap map tiles

## Data and attribution

Earthquake records are provided by the [U.S. Geological Survey](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). Map tiles are provided by OpenStreetMap contributors. This project is not an official USGS product.

## Author

Emre Karayaman — [GitHub](https://github.com/karayamanemre)

## License

[MIT](LICENSE) © Emre Karayaman
