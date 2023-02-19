const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const earthquakeList = document.getElementById('earthquake-list');
const pagination = document.querySelector('.pagination');
const loader = document.getElementById('loader');

let currentPage = 1;
let earthquakesPerPage = 20;

fetch(apiUrl)
	.then(response => response.json())
	.then(data => {
		const earthquakes = data.features;
		const numPages = Math.ceil(earthquakes.length / earthquakesPerPage);
		const pageNumbers = Array.from({length: numPages}, (_, i) => i + 1);
		showPage(earthquakes, currentPage);

		pagination.innerHTML = pageNumbers.map(pageNumber => `
			<li class="page-item${pageNumber === currentPage ? ' active' : ''} mr-1">
				<a class="page-link py-2 px-4 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-500" href="#${pageNumber}">${pageNumber}</a>
			</li>
		`).join('');

		pagination.addEventListener('click', event => {
			event.preventDefault();
			const pageNumber = parseInt(event.target.getAttribute('href').substring(1));
			showPage(earthquakes, pageNumber);
			currentPage = pageNumber;
			updatePagination();
		});

		earthquakeList.addEventListener('click', event => {
			const target = event.target.closest('.earthquake');
			if (target) {
				const earthquake = earthquakes.find(earthquake => earthquake.id === target.id);
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
	})
	.catch(error => {
		console.error(error);
	});

function showPage(earthquakes, pageNumber) {
	const startIndex = (pageNumber - 1) * earthquakesPerPage;
	const endIndex = startIndex + earthquakesPerPage;
	const displayedEarthquakes = earthquakes.slice(startIndex, endIndex);

	earthquakeList.innerHTML = displayedEarthquakes.map(earthquake => {
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
			<div class="${earthquakeClass} bg-gray-200 m-4 hover:shadow-lg transition duration-500 ease-in-out" id="${earthquake.id}">
				<h2>${magnitude} - ${location}</h2>
				<p>${time}</p>
			</div>
		`;
	}).join('');
}

function updatePagination() {
	const pageLinks = pagination.querySelectorAll('.page-link');
	pageLinks.forEach(pageLink => {
		const pageNumber = parseInt(pageLink.getAttribute('href').substring(1));
		pageLink.parentElement.classList.toggle('active', pageNumber === currentPage);
	});
}
