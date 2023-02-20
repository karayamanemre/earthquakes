const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const earthquakeListElement = document.getElementById('earthquake-list');
const paginationElement1 = document.getElementById('pagination-1');
const paginationElement2 = document.getElementById('pagination-2');
const loadingSpinner = document.getElementById('loading-spinner');

loadingSpinner.classList.remove('hidden');

let currentPage = 1;
const earthquakesPerPage = 20;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const earthquakes = data.features;
    const numPages = Math.ceil(earthquakes.length / earthquakesPerPage);
    const pageNumbers = Array.from({length: numPages}, (_, i) => i + 1);
    showPage(earthquakes, currentPage);

    function createPageLink(pageNumber) {
      const activeClass = pageNumber === currentPage ? 'active' : '';
      return `
        <li class="page-item ${activeClass}">
          <a class="page-link p-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-500" href="#page-${pageNumber}">${pageNumber}</a>
        </li>
      `;
    }

    function handlePageLinkClick(event) {
      event.preventDefault();
      const pageNumber = parseInt(event.target.getAttribute('href').substring(6));
      showPage(earthquakes, pageNumber);
      currentPage = pageNumber;
      updatePagination();
    }

    paginationElement1.innerHTML = pageNumbers.map(createPageLink).join('');
    paginationElement1.addEventListener('click', handlePageLinkClick);

    paginationElement2.innerHTML = pageNumbers.map(createPageLink).join('');
    paginationElement2.addEventListener('click', handlePageLinkClick);

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
    loadingSpinner.classList.add('hidden'); // Hide the spinner in case of error
  });

function showPage(earthquakes, pageNumber) {
  const startIndex = (pageNumber - 1) * earthquakesPerPage;
  const endIndex = startIndex + earthquakesPerPage;
  const displayedEarthquakes = earthquakes.slice(startIndex, endIndex);
  window.scrollTo(0, 0);
  earthquakeListElement.innerHTML = displayedEarthquakes.map(earthquake => {
    const properties = earthquake.properties;
    const magnitude = properties.mag;
    const location = properties.place;
        const time = new Date(properties.time).toLocaleString();
    const earthquakeClass = magnitude >= 6
      ? 'earthquake bg-black-600 text-white card p-3'
      : magnitude >= 4.5
        ? 'earthquake bg-gray-400 text-gray-800 card p-3'
        : 'earthquake card p-3';
    return `
      <div class="${earthquakeClass} cursor-pointer bg-gray-200 m-4 hover:shadow-lg transition duration-500 ease-in-out" id="${earthquake.id}">
        <h2 class="font-bold">${parseFloat(magnitude).toFixed(2)}</h2><h3>${location}</h3>
        <p>${time}</p>
      </div>
    `;
  }).join('');
}

function updatePagination() {
  const pageLinks = document.querySelectorAll('.page-link');
  pageLinks.forEach(pageLink => {
    const pageNumber = parseInt(pageLink.getAttribute('href').substring(6));
    const pageItem = pageLink.parentNode;
    if (pageNumber === currentPage) {
      pageItem.classList.add('active');
    } else {
      pageItem.classList.remove('active');
    }
  });
}

   
