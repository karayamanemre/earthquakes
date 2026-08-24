export function formatMagnitude(value) { const number = Number(value); return Number.isFinite(number) ? number.toFixed(2) : "Unknown"; }
export function formatDepth(value) { const number = Number(value); return Number.isFinite(number) ? `${number.toFixed(2)} km` : "Unknown"; }
export function formatDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Time unavailable" : new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(date); }
export function magnitudeLevel(value) { return value >= 6 ? "major" : value >= 4 ? "moderate" : "minor"; }
export function eventDetailsUrl(id) { return `details.html?id=${encodeURIComponent(id)}`; }
