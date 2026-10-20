//#region node_modules/.nitro/vite/services/ssr/assets/cache-DRKENOVj.js
var EVENTS = "myevent.events.v1";
var TICKETS = "myevent.tickets.v1";
function readCache(key) {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function writeCache(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
var cacheKeys = {
	EVENTS,
	TICKETS
};
//#endregion
export { readCache as n, writeCache as r, cacheKeys as t };
