import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as myTickets, t as Shell } from "./events-api-B5GImu_H.mjs";
import { r as useCurrentUserState, t as RedirectToSignIn } from "./gates-2M-357rF.mjs";
import { n as when } from "./format-CPJ_ua--.mjs";
import { n as readCache, r as writeCache, t as cacheKeys } from "./cache-DRKENOVj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tickets-BdxJy0-L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketMark({ code }) {
	const cells = [];
	let n = 0;
	for (const ch of code) n = n * 33 + ch.charCodeAt(0) >>> 0;
	for (let i = 0; i < 121; i++) {
		n = n * 1664525 + 1013904223 >>> 0;
		cells.push((n & 3) !== 0 || i % 11 === 0 || Math.floor(i / 11) % 11 === 0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-11 gap-0.5 rounded-xl bg-ink p-3",
		"aria-hidden": true,
		children: cells.map((on, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `aspect-square rounded-[2px] ${on ? "bg-bg" : "bg-transparent"}` }, i))
	});
}
function Tickets() {
	const { user, isPending } = useCurrentUserState();
	const [rows, setRows] = (0, import_react.useState)(() => readCache(cacheKeys.TICKETS) ?? []);
	const [open, setOpen] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		myTickets().then((list) => {
			setRows(list);
			writeCache(cacheKeys.TICKETS, list);
		}).catch(() => {});
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Checking your pass…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl leading-none",
			children: "Your tickets"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Saved on this device, so the door code works without signal."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-3",
			children: [rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen(open === t.id ? null : t.id),
				className: "w-full rounded-card border border-line bg-surface p-4 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: t.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-tight",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							when(t.startAt),
							" · ",
							t.location
						]
					}),
					open === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketMark, { code: t.code }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center font-medium tracking-[0.2em]",
							children: t.code
						})]
					})
				]
			}, t.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "py-8 text-center text-sm text-muted",
				children: [
					"No tickets yet. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "underline",
						children: "Find something"
					}),
					"."
				]
			})]
		})
	] });
}
//#endregion
export { Tickets as component };
