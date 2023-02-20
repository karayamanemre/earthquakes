const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const mapElement = document.getElementById('map');

let earthquakes = [];

function fetchEarthquakes() {
fetch(apiUrl)
.then(response => response.json())
.then(data => {
earthquakes = data.features;
showMap();
})
.catch(error => {
console.error(error);
});
}

function isTouchDevice() {
return 'ontouchstart' in window || navigator.maxTouchPoints;
}

function showMap() {
const map = L.map(mapElement).setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data © <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
}).addTo(map);

earthquakes.forEach(earthquake => {
const properties = earthquake.properties;
const magnitude = properties.mag;
const location = properties.place;
const [longitude, latitude] = earthquake.geometry.coordinates;
const marker = L.circleMarker([latitude, longitude], {
  radius: magnitude * 2,
  fillColor: 'red',
  color: 'black',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}).addTo(map);

const popupText = `<strong>${location}</strong><br />Magnitude: ${magnitude}`;
marker.bindPopup(popupText);

if (isTouchDevice()) {
  marker.on('click', function(e) {
    localStorage.setItem('location', location);
    localStorage.setItem('time', new Date(properties.time).toLocaleString());
    localStorage.setItem('magnitude', magnitude);
    localStorage.setItem('depth', earthquake.geometry.coordinates[2]);
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('eventId', earthquake.id);
    localStorage.setItem('tsunami', properties.tsunami);
    window.location.href = 'details.html';
  });
} else {
  marker.on('mouseover', function(e) {
    this.openPopup();
  });
  marker.on('mouseout', function(e) {
    this.closePopup();
  });
  marker.on('click', function(e) {
    localStorage.setItem('location', location);
    localStorage.setItem('time', new Date(properties.time).toLocaleString());
    localStorage.setItem('magnitude', magnitude);
    localStorage.setItem('depth', earthquake.geometry.coordinates[2]);
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('eventId', earthquake.id);
    localStorage.setItem('tsunami', properties.tsunami);
    window.location.href = 'details.html';
  });
}
});
}

fetchEarthquakes();