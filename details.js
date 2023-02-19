const locationEl = document.getElementById('earthquake-location');
const timeEl = document.getElementById('earthquake-time');
const magnitudeEl = document.getElementById('earthquake-magnitude');
const depthEl = document.getElementById('earthquake-depth');
const earthquakeLocation = localStorage.getItem('location');
const tsunamiEl = document.getElementById('earthquake-tsunami');
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

document.getElementById('earthquake-location').textContent = earthquakeLocation;

const map = L.map('map').setView([latitude, longitude], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);
L.marker([latitude, longitude]).addTo(map);

locationEl.textContent = localStorage.getItem('location');
timeEl.textContent = localStorage.getItem('time');
magnitudeEl.textContent = `Magnitude: ${localStorage.getItem('magnitude')}`;
depthEl.textContent = `Depth: ${localStorage.getItem('depth')} km`;
tsunamiEl.textContent = `Tsunami Warning: ${localStorage.getItem('tsunami') === '1' ? 'Yes' : 'No'}`;

const usgsLink = `https://earthquake.usgs.gov/earthquakes/eventpage/${eventId}`;
const linkEl = document.createElement('a');
linkEl.href = usgsLink;
linkEl.target = '_blank';
linkEl.textContent = 'USGS Event Page';

document.querySelector('.card').appendChild(linkEl);
