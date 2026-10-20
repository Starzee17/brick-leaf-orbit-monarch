import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as setRole, h as setEventStatus, i as adminPeople, l as listEvents, n as adminOverview, p as refundPayment, r as adminPayments, s as getMe, t as Shell } from "./events-api-B5GImu_H.mjs";
import { r as useCurrentUserState, t as RedirectToSignIn } from "./gates-2M-357rF.mjs";
import { n as when, t as money } from "./format-CPJ_ua--.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BjnLVwNR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Admin() {
	const { user, isPending } = useCurrentUserState();
	const [role, setRoleName] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [stats, setStats] = (0, import_react.useState)({
		events: 0,
		people: 0,
		tickets: 0,
		revenueCents: 0
	});
	const [events, setEvents] = (0, import_react.useState)([]);
	const [people, setPeople] = (0, import_react.useState)([]);
	const [pays, setPays] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	async function load() {
		const me = await getMe();
		setRoleName(me.role);
		if (me.role !== "admin") return;
		const [o, ev, pe, pa] = await Promise.all([
			adminOverview(),
			listEvents(),
			adminPeople(),
			adminPayments()
		]);
		setStats(o);
		setEvents(ev);
		setPeople(pe);
		setPays(pa);
	}
	(0, import_react.useEffect)(() => {
		if (!user) return;
		load().catch((err) => setError(err instanceof Error ? err.message : "Admin data failed."));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Checking your pass…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl leading-none",
			children: "Admin desk"
		}),
		role && role !== "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm",
			children: [
				"Your role is ",
				role,
				". The first account to open the app becomes admin."
			]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-primary",
			children: error
		}),
		role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto",
				children: [
					"overview",
					"events",
					"people",
					"payments"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(key),
					className: `rounded-full px-4 py-2 text-sm capitalize ${tab === key ? "bg-ink text-bg" : "border border-line"}`,
					children: key
				}, key))
			}),
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [
					["Events", stats.events],
					["People", stats.people],
					["Tickets", stats.tickets],
					["Revenue", money(stats.revenueCents)]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-card border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: value
					})]
				}, String(label)))
			}),
			tab === "events" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-surface p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: ev.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								ev.status,
								" · ",
								ev.sold,
								"/",
								ev.capacity
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							children: [
								"published",
								"draft",
								"cancelled"
							].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-full border border-line px-3 py-1 capitalize",
								onClick: () => setEventStatus({ data: {
									eventId: ev.id,
									status
								} }).then(load),
								children: status
							}, status))
						})
					]
				}, ev.id))
			}),
			tab === "people" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-surface p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: p.displayName || p.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								p.email,
								" · ",
								p.role
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							children: [
								"user",
								"organizer",
								"admin"
							].map((next) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-full border border-line px-3 py-1 capitalize",
								onClick: () => setRole({ data: {
									userId: p.userId,
									role: next
								} }).then(load).catch((err) => setError(err instanceof Error ? err.message : "Failed")),
								children: next
							}, next))
						})
					]
				}, p.userId))
			}),
			tab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: pays.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-surface p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(p.amountCents) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								p.email,
								" · ",
								p.status,
								" · ",
								p.last4 ? `•••• ${p.last4}` : "free",
								" · ",
								when(p.createdAt)
							]
						}),
						p.status === "paid" && p.amountCents > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 rounded-full border border-line px-3 py-1",
							onClick: () => refundPayment({ data: p.id }).then(load),
							children: "Refund"
						})
					]
				}, p.id))
			})
		] })
	] });
}
//#endregion
export { Admin as component };
