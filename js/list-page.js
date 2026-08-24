import { getRecentEarthquakes } from "./api.js";
import { EVENTS_PER_PAGE, REFRESH_INTERVAL } from "./config.js";
import { filterEarthquakes } from "./continents.js";
import { eventDetailsUrl, formatDate, formatMagnitude, magnitudeLevel } from "./format.js";
import { initTheme } from "./theme.js";
import { setUpdateSummary, showError, showLoading } from "./ui.js";

const elements = {
  list: document.querySelector("#earthquake-list"), status: document.querySelector("#status"), continent: document.querySelector("#continent-selector"), magnitude: document.querySelector("#magnitude-selector"),
  count: document.querySelector("#result-count"), updated: document.querySelector("#last-updated"), pagination: document.querySelector("#pagination-nav"), previous: document.querySelector("#previous-page"), next: document.querySelector("#next-page"), pageStatus: document.querySelector("#page-status"),
};
let allEvents = []; let filteredEvents = []; let currentPage = 1; let generatedAt = Date.now();

function createCard(event) {
  const link = document.createElement("a"); link.className = "earthquake-card"; link.href = eventDetailsUrl(event.id);
  const magnitude = Number(event.properties.mag); const level = magnitudeLevel(magnitude);
  const badge = Object.assign(document.createElement("span"),{className:`magnitude ${level}`,textContent:formatMagnitude(magnitude)});
  badge.setAttribute("aria-label",`Magnitude ${formatMagnitude(magnitude)}`);
  const copy = document.createElement("span"); copy.className = "event-copy";
  const depth = Number(event.geometry.coordinates[2]);
  copy.append(Object.assign(document.createElement("h3"),{textContent:event.properties.place || "Location unavailable"}),Object.assign(document.createElement("p"),{textContent:`${formatDate(event.properties.time)} · ${Number.isFinite(depth) ? `${depth.toFixed(1)} km deep` : "Depth unavailable"}`}));
  const arrow = Object.assign(document.createElement("span"),{className:"card-arrow",textContent:"→"}); arrow.setAttribute("aria-hidden","true");
  link.append(badge,copy,arrow); return link;
}

function render() {
  const pageCount = Math.max(1,Math.ceil(filteredEvents.length/EVENTS_PER_PAGE)); currentPage = Math.min(Math.max(currentPage,1),pageCount);
  const events = filteredEvents.slice((currentPage-1)*EVENTS_PER_PAGE,currentPage*EVENTS_PER_PAGE);
  elements.list.replaceChildren(...events.map(createCard)); elements.status.hidden = events.length > 0;
  if (!events.length) { elements.status.hidden=false; elements.status.className="status-panel"; elements.status.replaceChildren(Object.assign(document.createElement("h2"),{textContent:"No matching events"}),Object.assign(document.createElement("p"),{textContent:"Try another continent or lower the minimum magnitude."})); }
  elements.pagination.hidden = filteredEvents.length <= EVENTS_PER_PAGE; elements.previous.disabled=currentPage===1; elements.next.disabled=currentPage===pageCount; elements.pageStatus.textContent=`Page ${currentPage} of ${pageCount}`;
  setUpdateSummary(elements.count,elements.updated,filteredEvents.length,generatedAt);
}

function applyFilters() { currentPage=1; filteredEvents=filterEarthquakes(allEvents,elements.continent.value,Number(elements.magnitude.value)); render(); }
async function loadEvents() {
  showLoading(elements.status,"Connecting to the USGS feed…");
  try { const data=await getRecentEarthquakes(); allEvents=data.features; generatedAt=data.metadata?.generated||Date.now(); applyFilters(); }
  catch(error){ console.error(error); elements.list.replaceChildren(); elements.pagination.hidden=true; showError(elements.status,"The feed is unavailable","We could not load the latest USGS earthquake data.",loadEvents); }
}
elements.continent.addEventListener("change",applyFilters); elements.magnitude.addEventListener("change",applyFilters);
elements.previous.addEventListener("click",()=>{currentPage-=1;render();scrollTo({top:document.querySelector("#results-heading").offsetTop-100,behavior:"smooth"});});
elements.next.addEventListener("click",()=>{currentPage+=1;render();scrollTo({top:document.querySelector("#results-heading").offsetTop-100,behavior:"smooth"});});
initTheme(); loadEvents(); setInterval(loadEvents,REFRESH_INTERVAL);
