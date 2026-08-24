import { getEarthquake } from "./api.js";
import { formatDate, formatDepth, formatMagnitude } from "./format.js";
import { initTheme } from "./theme.js";
import { showError, showLoading } from "./ui.js";

const status=document.querySelector("#status"),content=document.querySelector("#detail-content"),id=new URLSearchParams(location.search).get("id");
async function loadEvent(){
  showLoading(status,"Loading event details…");
  try{const event=await getEarthquake(id),properties=event.properties||{},coordinates=event.geometry?.coordinates;if(!Array.isArray(coordinates))throw new Error("This event has no coordinates");const [longitude,latitude,depth]=coordinates;
    document.title=`${properties.place||"Earthquake"} — Earthquake details`;document.querySelector("#event-id").textContent=`USGS EVENT · ${event.id}`;document.querySelector("#earthquake-location").textContent=properties.place||"Location unavailable";document.querySelector("#earthquake-time").textContent=formatDate(properties.time);document.querySelector("#earthquake-magnitude").textContent=formatMagnitude(properties.mag);document.querySelector("#earthquake-depth").textContent=formatDepth(depth);document.querySelector("#earthquake-coordinates").textContent=`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;document.querySelector("#earthquake-tsunami").textContent=properties.tsunami===1?"Issued":"Not issued";document.querySelector("#magnitude-badge").textContent=formatMagnitude(properties.mag);document.querySelector("#usgs-link").href=properties.url||`https://earthquake.usgs.gov/earthquakes/eventpage/${encodeURIComponent(event.id)}`;
    const map=L.map("map").setView([latitude,longitude],6);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'Map data © <a href="https://openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);L.circleMarker([latitude,longitude],{radius:12,fillColor:"#ed5b36",color:"#182019",weight:2,fillOpacity:.9}).addTo(map).bindPopup(properties.place||"Earthquake epicenter").openPopup();
    status.hidden=true;
  }catch(error){console.error(error);showError(status,"Event not found",id?"This USGS event may no longer be available. Check the link or return to the recent event list.":"No event ID was included in this link.",loadEvent);}
}
document.querySelector("#share-button").addEventListener("click",async()=>{const feedback=document.querySelector("#share-feedback");try{await navigator.clipboard.writeText(location.href);feedback.textContent="Link copied.";}catch{feedback.textContent="Copy the URL from your address bar.";}});
initTheme();loadEvent();
