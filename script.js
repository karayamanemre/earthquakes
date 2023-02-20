const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const earthquakeListElement = document.getElementById('earthquake-list');
const paginationElement1 = document.getElementById('pagination-1');
const paginationElement2 = document.getElementById('pagination-2');
const loadingSpinner = document.getElementById('loading-spinner');
loadingSpinner.classList.remove('hidden');

let currentPageNumber = 1;
const earthquakesPerPage = 20;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const earthquakes = data.features;
    const numPages = Math.ceil(earthquakes.length / earthquakesPerPage);
    const pageNumbers = Array.from({length: numPages}, (_, i) => i + 1);
    showPage(earthquakes, currentPageNumber);

    paginationElement1.innerHTML = pageNumbers.map(pageNumber => `
      <li class="page-item${pageNumber === currentPageNumber ? ' active' : ''}">
        <a class="page-link p-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-500" href="#${pageNumber}">${pageNumber}</a>
      </li>
    `).join('');

    paginationElement1.addEventListener('click', event => {
      event.preventDefault();
      const pageNumber = parseInt(event.target.getAttribute('href').substring(1));
      showPage(earthquakes, pageNumber);
      currentPageNumber = pageNumber;
      updatePagination();
    });

    paginationElement2.innerHTML = pageNumbers.map(pageNumber => `
      <li class="page-item${pageNumber === currentPageNumber ? ' active' : ''}">
        <a class="page-link p-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-500" href="#${pageNumber}">${pageNumber}</a>
      </li>
    `).join('');

    paginationElement2.addEventListener('click', event => {
      event.preventDefault();
      const pageNumber = parseInt(event.target.getAttribute('href').substring(1));
      showPage(earthquakes, pageNumber);
      currentPageNumber = pageNumber;
      updatePagination();
    });


    earthquakeListElement.addEventListener('click', event => {
      const target = event.target.closest('.earthquake');
      if (target) {
        const earthquake = earthquakes.find(e => e.id === target.id);
        const properties = earthquake.properties;
        const location = properties.place;
        const time = new Date(properties.time).toLocaleString();
        const magnitude = properties.mag;
        const depth = earthquake.geometry.coordinates[2];
        const tsunamiWarning = properties.tsunami;
        const [longitude, latitude] = earthquake.geometry.coordinates;
        localStorage.setItem('location', location);
        localStorage.setItem('time', time);
        localStorage.setItem('magnitude', magnitude);
        localStorage.setItem('depth', depth);
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
        localStorage.setItem('eventId', earthquake.id);
        localStorage.setItem('tsunami', tsunamiWarning);
        window.location.href = 'details.html';
      }
    });
    loadingSpinner.classList.add('hidden');
  })
  .catch(error => {
    console.error(error);
  });

function showPage(earthquakes, pageNumber) {
  const startIndex = (pageNumber - 1) * earthquakesPerPage;
  const endIndex = startIndex + earthquakesPerPage;
  const displayedEarthquakes = earthquakes.slice(startIndex, endIndex);
  window.scrollTo(0, 0);
  earthquakeListElement.innerHTML = displayedEarthquakes.map(e => {
    const properties = e.properties;
    const magnitude = properties.mag;
    const location = properties.place;
    const time = new Date(properties.time).toLocaleString();
    const earthquakeClass = magnitude >= 6
      ? 'earthquake bg-black-600 text-white card p-3'
      : magnitude >= 4.5
        ? 'earthquake bg-gray-400 text-gray-800 card p-3'
        : 'earthquake card p-3';
    return `
      <div class="${earthquakeClass} cursor-pointer bg-gray-200 m-4 hover:shadow-lg transition duration-500 ease-in-out" id="${e.id}">
        <h2 class="font-bold">${parseFloat(magnitude).toFixed(2)}</h2><h3>${location}</h3>
        <p>${time}</p>
      </div>
    `;
  }).join('');
}

function updatePagination() {
  const pageLinks = paginationElement.querySelectorAll('.page-link');
  pageLinks.forEach(pageLink => {
    const pageNumber = parseInt(pageLink.getAttribute('href').substring(1));
    pageLink.parentElement.classList.toggle('active', pageNumber === currentPageNumber);
  });
}