import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as MapPin } from "../_libs/lucide-react.mjs";
import { c as listCategories, l as listEvents, t as Shell } from "./events-api-B5GImu_H.mjs";
import { n as when, t as money } from "./format-CPJ_ua--.mjs";
import { n as readCache, r as writeCache, t as cacheKeys } from "./cache-DRKENOVj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-pjvCF90w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EventCard({ event }) {
	const left = Math.max(0, event.capacity - event.sold);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/event/$eventId",
		params: { eventId: String(event.id) },
		className: "block overflow-hidden rounded-card border border-line bg-surface shadow-[var(--shadow)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `tone-${event.tone} flex h-28 items-end p-4 text-primary-ink`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-black/25 px-3 py-1 text-xs font-medium tracking-wide text-white",
				children: event.category
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight",
						children: event.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-sm font-medium text-primary",
						children: money(event.priceCents)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: when(event.startAt)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }),
						" ",
						event.location
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						event.status === "published" ? `${left} spots left` : event.status,
						" · ",
						event.organizer
					]
				})
			]
		})]
	});
}
function Home() {
	const [events, setEvents] = (0, import_react.useState)(() => readCache(cacheKeys.EVENTS) ?? []);
	const [cats, setCats] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const [paid, setPaid] = (0, import_react.useState)("all");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		listEvents().then((rows) => {
			setEvents(rows);
			writeCache(cacheKeys.EVENTS, rows);
			setError("");
		}).catch(() => {
			if (!readCache(cacheKeys.EVENTS)) setError("Could not load events. Saved copies will show when you have them.");
		});
		listCategories().then((rows) => setCats(rows.map((c) => c.name))).catch(() => setCats([]));
	}, []);
	const shown = (0, import_react.useMemo)(() => {
		return events.filter((e) => {
			if (e.status !== "published" && e.status !== "cancelled") return false;
			if (cat !== "All" && e.category !== cat) return false;
			if (paid === "free" && e.priceCents > 0) return false;
			if (paid === "paid" && e.priceCents === 0) return false;
			return `${e.title} ${e.location} ${e.description}`.toLowerCase().includes(q.trim().toLowerCase());
		});
	}, [
		events,
		q,
		cat,
		paid
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-4xl leading-none",
			children: "What’s on"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Browse now. Your tickets stay on this phone if the signal drops."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search title or place",
			className: "mt-4 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base outline-none"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-2 overflow-x-auto pb-1",
			children: ["All", ...cats].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setCat(name),
				className: `shrink-0 rounded-full px-4 py-2 text-sm ${cat === name ? "bg-ink text-bg" : "border border-line bg-surface"}`,
				children: name
			}, name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-2",
			children: [
				"all",
				"free",
				"paid"
			].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setPaid(key),
				className: `rounded-full px-3 py-1.5 text-sm capitalize ${paid === key ? "bg-primary text-primary-ink" : "text-muted"}`,
				children: key
			}, key))
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-primary",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [shown.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { event }, event.id)), !shown.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-muted",
				children: "Nothing matches that filter."
			})]
		})
	] });
}
//#endregion
export { Home as component };
