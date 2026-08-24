import { getRecentEarthquakes } from "./api.js";
import { filterEarthquakes } from "./continents.js";
import { eventDetailsUrl, formatMagnitude, magnitudeLevel } from "./format.js";
import { initTheme } from "./theme.js";
import { setUpdateSummary, showError, showLoading } from "./ui.js";

const status=document.querySelector("#status"), selector=document.querySelector("#continent-selector"), count=document.querySelector("#result-count"), updated=document.querySelector("#last-updated");
let allEvents=[],generatedAt=Date.now();
const map=L.map("map").setView([0,0],2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'Map data © <a href="https://openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
const markerLayer=L.layerGroup().addTo(map);
function markerColor(level){return level==="major"?"#ed5b36":level==="moderate"?"#f8c451":"#79a974";}
function renderMap(){
  markerLayer.clearLayers(); const events=filterEarthquakes(allEvents,selector.value);
  events.forEach((event)=>{const [longitude,latitude]=event.geometry.coordinates,mag=Number(event.properties.mag),level=magnitudeLevel(mag);const marker=L.circleMarker([latitude,longitude],{radius:Math.max(4,Math.min(18,(mag+2)*1.8)),fillColor:markerColor(level),color:"#182019",weight:1,fillOpacity:.82});const popup=document.createElement("div");popup.className="map-popup";popup.append(Object.assign(document.createElement("strong"),{textContent:event.properties.place||"Location unavailable"}),Object.assign(document.createElement("span"),{textContent:`Magnitude ${formatMagnitude(mag)} · `}));const link=Object.assign(document.createElement("a"),{href:eventDetailsUrl(event.id),textContent:"Details →"});popup.append(link);marker.bindPopup(popup).addTo(markerLayer);});
  status.hidden=true; setUpdateSummary(count,updated,events.length,generatedAt);
}
async function loadEvents(){showLoading(status,"Loading earthquake markers…");try{const data=await getRecentEarthquakes();allEvents=data.features;generatedAt=data.metadata?.generated||Date.now();renderMap();}catch(error){console.error(error);showError(status,"The earthquake markers are unavailable","The base map is ready, but we could not load the latest USGS earthquake data.",loadEvents);}}
selector.addEventListener("change",renderMap);initTheme();loadEvents();
