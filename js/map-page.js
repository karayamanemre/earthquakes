import { getRecentEarthquakes } from "./api.js";
import { filterEarthquakes } from "./continents.js";
import { eventDetailsUrl, formatMagnitude, magnitudeLevel } from "./format.js";
import { initTheme } from "./theme.js";
import { setUpdateSummary, showError, showLoading } from "./ui.js";

const status=document.querySelector("#status"), panel=document.querySelector("#map-panel"), selector=document.querySelector("#continent-selector"), count=document.querySelector("#result-count"), updated=document.querySelector("#last-updated");
let allEvents=[],generatedAt=Date.now(),map,markerLayer;
function markerColor(level){return level==="major"?"#ed5b36":level==="moderate"?"#f8c451":"#79a974";}
function refreshMapSize(){requestAnimationFrame(()=>requestAnimationFrame(()=>map?.invalidateSize({animate:false,pan:false})));}
function renderMap(){
  status.hidden=true; panel.hidden=false;
  if(!map){map=L.map("map",{worldCopyJump:true}).setView([18,10],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',maxZoom:18,updateWhenIdle:true,keepBuffer:3}).addTo(map);markerLayer=L.layerGroup().addTo(map);}
  markerLayer.clearLayers(); const events=filterEarthquakes(allEvents,selector.value);
  events.forEach((event)=>{const [longitude,latitude]=event.geometry.coordinates,mag=Number(event.properties.mag),level=magnitudeLevel(mag);const marker=L.circleMarker([latitude,longitude],{radius:Math.max(4,Math.min(18,(mag+2)*1.8)),fillColor:markerColor(level),color:"#182019",weight:1,fillOpacity:.82});const popup=document.createElement("div");popup.className="map-popup";popup.append(Object.assign(document.createElement("strong"),{textContent:event.properties.place||"Location unavailable"}),Object.assign(document.createElement("span"),{textContent:`Magnitude ${formatMagnitude(mag)} · `}));const link=Object.assign(document.createElement("a"),{href:eventDetailsUrl(event.id),textContent:"Details →"});popup.append(link);marker.bindPopup(popup).addTo(markerLayer);});
  setUpdateSummary(count,updated,events.length,generatedAt); refreshMapSize();
}
async function loadEvents(){showLoading(status,"Building the activity map…");panel.hidden=true;try{const data=await getRecentEarthquakes();allEvents=data.features;generatedAt=data.metadata?.generated||Date.now();renderMap();}catch(error){console.error(error);showError(status,"The map is unavailable","We could not load the latest USGS earthquake data.",loadEvents);}}
selector.addEventListener("change",renderMap);initTheme();loadEvents();
