const locationEl = document.getElementById('earthquake-location');
const timeEl = document.getElementById('earthquake-time');
const magnitudeEl = document.getElementById('earthquake-magnitude');
const depthEl = document.getElementById('earthquake-depth');
const tsunamiEl = document.getElementById('earthquake-tsunami');
const linkEl = document.createElement('a');
const earthquakeLocation = localStorage.getItem('location');
const tsunamiWarning = localStorage.getItem('tsunami');
let latitude = parseFloat(localStorage.getItem('latitude'));
let longitude = parseFloat(localStorage.getItem('longitude'));
const eventId = localStorage.getItem('eventId');

if (isNaN(latitude)) {
  latitude = 0;
}

if (isNaN(longitude)) {
  longitude = 0;
}

locationEl.textContent = earthquakeLocation;

const map = L.map('map').setView([latitude, longitude], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);
L.marker([latitude, longitude]).addTo(map);

locationEl.textContent = earthquakeLocation;
timeEl.textContent = localStorage.getItem('time');
magnitudeEl.textContent = `Magnitude: ${parseFloat(localStorage.getItem('magnitude')).toFixed(2)}`;
depthEl.textContent = `Depth: ${localStorage.getItem('depth')} km`;
tsunamiEl.textContent = `Tsunami Warning: ${tsunamiWarning === '1' ? 'Yes' : 'No'}`;

const usgsLink = `https://earthquake.usgs.gov/earthquakes/eventpage/${eventId}`;
linkEl.href = usgsLink;
linkEl.target = '_blank';
linkEl.textContent = 'USGS Event Page';

document.querySelector('.card').appendChild(linkEl);
