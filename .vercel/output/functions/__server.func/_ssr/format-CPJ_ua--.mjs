//#region node_modules/.nitro/vite/services/ssr/assets/format-CPJ_ua--.js
function money(cents) {
	if (!cents) return "Free";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function when(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(d);
}
//#endregion
export { when as n, money as t };
