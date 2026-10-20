import { o as __toESM } from "./_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Route$1 } from "./_ssr/router-DuMA-HBB.mjs";
import { o as getEvent, t as Shell } from "./_ssr/events-api-B5GImu_H.mjs";
import { n as when, t as money } from "./_ssr/format-CPJ_ua--.mjs";
import { n as readCache, t as cacheKeys } from "./_ssr/cache-DRKENOVj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_eventId-CUvghIjD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Detail() {
	const { eventId } = Route$1.useParams();
	const [event, setEvent] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = Number(eventId);
		const cached = readCache(cacheKeys.EVENTS)?.find((e) => e.id === id) ?? null;
		if (cached) setEvent(cached);
		getEvent({ data: id }).then((row) => {
			if (row) setEvent(row);
			else if (!cached) setMissing(true);
		}).catch(() => {
			if (!cached) setMissing(true);
		});
	}, [eventId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		!event && !missing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Loading…"
		}),
		missing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "That event isn’t on this device." }),
		event && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `tone-${event.tone} h-40 rounded-card` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm uppercase tracking-widest text-muted",
				children: event.category
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-none",
				children: event.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					when(event.startAt),
					" – ",
					when(event.endAt)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: event.location
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 leading-relaxed",
				children: event.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					"Hosted by ",
					event.organizer,
					" · ",
					Math.max(0, event.capacity - event.sold),
					" of ",
					event.capacity,
					" left"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-3xl",
					children: money(event.priceCents)
				}), event.status === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/checkout/$eventId",
					params: { eventId: String(event.id) },
					className: "rounded-full bg-primary px-5 py-3 font-medium text-primary-ink",
					children: event.priceCents ? "Get a ticket" : "Reserve a seat"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted",
					children: "Not open"
				})]
			})
		] })
	] });
}
//#endregion
export { Detail as component };
