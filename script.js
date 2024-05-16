const apiUrl =
	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const earthquakeListElement = document.getElementById("earthquake-list");
const paginationElement = document.getElementById("pagination");
const loadingSpinner = document.getElementById("loading-spinner");
const continentSelector = document.getElementById("continent-selector");
const noEarthquakesText = "No earthquakes found for the selected continent.";

loadingSpinner.classList.remove("hidden");

let currentPage = 1;
let selectedContinent = "all";
const earthquakesPerPage = 20;

function fetchEarthquakes() {
	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			let earthquakes = data.features;
			if (selectedContinent !== "all") {
				earthquakes = earthquakes.filter((earthquake) => {
					const latitude = earthquake.geometry.coordinates[1];
					const longitude = earthquake.geometry.coordinates[0];
					return isPointInContinent(latitude, longitude, selectedContinent);
				});
			}
			const numPages = Math.ceil(earthquakes.length / earthquakesPerPage);
			const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);

			if (earthquakes.length === 0) {
				earthquakeListElement.innerHTML = `<p>${noEarthquakesText}</p>`;
				paginationElement.innerHTML = "";
				return;
			}

			showPage(earthquakes, currentPage);

			function createPageLink(pageNumber) {
				const activeClass = pageNumber === currentPage ? "active" : "";
				return `
          <li class="page-item ${activeClass}">
            <a class="page-link p-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-500" href="#page-${pageNumber}">${pageNumber}</a>
          </li>
        `;
			}

			function handlePageLinkClick(event) {
				event.preventDefault();
				const pageNumber = parseInt(
					event.target.getAttribute("href").substring(6)
				);
				showPage(earthquakes, pageNumber);
				currentPage = pageNumber;
				updatePagination();
			}

			paginationElement.innerHTML = pageNumbers.map(createPageLink).join("");
			paginationElement.addEventListener("click", handlePageLinkClick);

			earthquakeListElement.addEventListener("click", (event) => {
				const target = event.target.closest(".earthquake");
				if (target) {
					const earthquake = earthquakes.find((e) => e.id === target.id);
					const properties = earthquake.properties;
					const location = properties.place;
					const time = new Date(properties.time).toLocaleString();
					const magnitude = properties.mag;
					const depth = earthquake.geometry.coordinates[2];
					const tsunamiWarning = properties.tsunami;
					const [longitude, latitude] = earthquake.geometry.coordinates;
					localStorage.setItem("location", location);
					localStorage.setItem("time", time);
					localStorage.setItem("magnitude", magnitude);
					localStorage.setItem("depth", depth);
					localStorage.setItem("latitude", latitude);
					localStorage.setItem("longitude", longitude);
					localStorage.setItem("eventId", earthquake.id);
					localStorage.setItem("tsunami", tsunamiWarning);
					window.location.href = "details.html";
				}
			});
			loadingSpinner.classList.add("hidden");
		})
		.catch((error) => {
			console.error(error);
			loadingSpinner.classList.add("hidden");
		});

	function showPage(earthquakes, pageNumber) {
		const startIndex = (pageNumber - 1) * earthquakesPerPage;
		const endIndex = startIndex + earthquakesPerPage;
		const displayedEarthquakes = earthquakes.slice(startIndex, endIndex);
		window.scrollTo(0, 0);
		earthquakeListElement.innerHTML = displayedEarthquakes
			.map((earthquake) => {
				const properties = earthquake.properties;
				const magnitude = properties.mag;
				const location = properties.place;
				const time = new Date(properties.time).toLocaleString();
				const earthquakeClass =
					magnitude >= 6
						? "earthquake bg-black text-white card p-3"
						: magnitude >= 4
						? "earthquake bg-gray-400 card p-3"
						: "earthquake card p-3";
				return `
          <div class="${earthquakeClass} cursor-pointer bg-gray-300 mb-4 hover:drop-shadow-md transition duration-500 ease-in-out rounded-lg" id="${
					earthquake.id
				}">
            <h2 class="font-bold">Magnitude: ${parseFloat(magnitude).toFixed(
							2
						)}</h2><h3 class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-current-location" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
						<path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
						<path d="M12 2l0 2" />
						<path d="M12 20l0 2" />
						<path d="M20 12l2 0" />
						<path d="M2 12l2 0" />
					</svg><span class="ml-2">${location}</span></h3>
            <p class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-calendar-month" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						<path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
						<path d="M16 3v4" />
						<path d="M8 3v4" />
						<path d="M4 11h16" />
						<path d="M7 14h.013" />
						<path d="M10.01 14h.005" />
						<path d="M13.01 14h.005" />
						<path d="M16.015 14h.005" />
						<path d="M13.015 17h.005" />
						<path d="M7.01 17h.005" />
						<path d="M10.01 17h.005" />
					</svg><span class="ml-2">${time}</span></p>
          </div>
        `;
			})
			.join("");
	}

	function updatePagination() {
		const pageLinks = document.querySelectorAll(".page-link");
		pageLinks.forEach((pageLink) => {
			const pageNumber = parseInt(pageLink.getAttribute("href").substring(6));
			const pageItem = pageLink.parentNode;
			if (pageNumber === currentPage) {
				pageItem.classList.add("active");
			} else {
				pageItem.classList.remove("active");
			}
		});
	}

	function isPointInContinent(latitude, longitude, continent) {
		switch (continent) {
			case "north-america":
				return (
					latitude > 7.5 &&
					latitude < 84.0 &&
					longitude > -172.5 &&
					longitude < -47.5
				);
			case "south-america":
				return (
					latitude > -56.0 &&
					latitude < 12.0 &&
					longitude > -90.0 &&
					longitude < -35.0
				);
			case "europe":
				return (
					latitude > 34.0 &&
					latitude < 72.0 &&
					longitude > -25.0 &&
					longitude < 45.0
				);
			case "africa":
				return (
					latitude > -38.0 &&
					latitude < 38.0 &&
					longitude > -26.0 &&
					longitude < 60.0
				);
			case "asia":
				return (
					latitude > 0.0 &&
					latitude < 70.0 &&
					longitude > 25.0 &&
					longitude < 180.0
				);
			case "oceania":
				return (
					latitude > -50.0 &&
					latitude < 0.0 &&
					longitude > 110.0 &&
					longitude < -180.0
				);
			default:
				return true;
		}
	}

	function handleContinentChange(event) {
		selectedContinent = event.target.value;
		currentPage = 1;
		fetchEarthquakes();
	}
	continentSelector.addEventListener("change", handleContinentChange);
}

fetchEarthquakes();
setInterval(fetchEarthquakes, 300000);
