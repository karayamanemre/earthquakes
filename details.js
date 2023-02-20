const locationEl = document.getElementById('earthquake-location');
const timeEl = document.getElementById('earthquake-time');
const magnitudeEl = document.getElementById('earthquake-magnitude');
const depthEl = document.getElementById('earthquake-depth');
const tsunamiEl = document.getElementById('earthquake-tsunami');
const linkEl = document.createElement('a');
const earthquakeLocation = localStorage.getItem('location');
const tsunamiWarning = localStorage.getItem('tsunami');
let latitude = parseFloat(localStorage.getItem('latitude')) || 0;
let longitude = parseFloat(localStorage.getItem('longitude')) || 0;
const eventId = localStorage.getItem('eventId');

locationEl.textContent = earthquakeLocation;

const map = L.map('map').setView([latitude, longitude], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);
L.marker([latitude, longitude]).addTo(map);

locationEl.textContent = earthquakeLocation;
timeEl.textContent = localStorage.getItem('time');
magnitudeEl.textContent = `Magnitude: ${parseFloat(localStorage.getItem('magnitude')).toFixed(2)}`;
depthEl.textContent = `Depth: ${localStorage.getItem('depth')} km`;
tsunamiEl.textContent = `Tsunami Warning: ${tsunamiWarning === '1' ? 'Yes' : 'No'}`;
linkEl.innerHTML = `<a href="https://earthquake.usgs.gov/earthquakes/eventpage/${eventId}" target="_blank">USGS Earthquake Details</a>`;

document.querySelector('.card').appendChild(linkEl);
