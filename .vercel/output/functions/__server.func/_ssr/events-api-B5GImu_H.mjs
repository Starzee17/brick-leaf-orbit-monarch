import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, p as useRouterState, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { a as Plus, c as CalendarDays, i as Sun, o as Moon, r as Ticket, t as UserRound } from "../_libs/lucide-react.mjs";
import { t as authMiddleware } from "./middleware-C7HIzWoI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-api-B5GImu_H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useOnline() {
	const [online, setOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const sync = () => setOnline(navigator.onLine);
		sync();
		window.addEventListener("online", sync);
		window.addEventListener("offline", sync);
		return () => {
			window.removeEventListener("online", sync);
			window.removeEventListener("offline", sync);
		};
	}, []);
	return online;
}
function useTheme() {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const next = localStorage.getItem("myevent.theme") === "dark";
		setDark(next);
		document.documentElement.dataset.theme = next ? "dark" : "light";
	}, []);
	function toggle() {
		const next = !dark;
		setDark(next);
		document.documentElement.dataset.theme = next ? "dark" : "light";
		localStorage.setItem("myevent.theme", next ? "dark" : "light");
	}
	return {
		dark,
		toggle
	};
}
var tabs = [
	{
		to: "/",
		label: "Discover",
		icon: CalendarDays
	},
	{
		to: "/tickets",
		label: "Tickets",
		icon: Ticket
	},
	{
		to: "/create",
		label: "Create",
		icon: Plus
	},
	{
		to: "/profile",
		label: "Profile",
		icon: UserRound
	}
];
function Shell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const online = useOnline();
	const theme = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-screen w-full max-w-lg bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-3 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display text-2xl leading-none tracking-tight",
					children: "My Event"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Toggle dark mode",
					onClick: theme.toggle,
					className: "grid size-11 place-items-center rounded-full border border-line bg-surface",
					children: theme.dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" })
				})]
			}),
			!online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "bg-forest px-4 py-2 text-center text-sm text-primary-ink",
				children: "Offline — saved events and tickets still open. Buying a ticket needs a connection."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 pb-28 pt-4",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-1/2 z-20 flex w-full max-w-lg -translate-x-1/2 justify-around border-t border-line bg-surface px-2 py-2",
				children: tabs.map((tab) => {
					const active = tab.to === "/" ? path === "/" : path.startsWith(tab.to);
					const Icon = tab.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: `flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 text-xs ${active ? "bg-ink text-bg" : "text-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), tab.label]
					}, tab.to);
				})
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listEvents = createServerFn({ method: "GET" }).handler(createSsrRpc("2084b7008c9ec58b4eb469711a729a42dd1d37e4446be5c87a86883808f84eeb"));
var listCategories = createServerFn({ method: "GET" }).handler(createSsrRpc("32fe69355c2ea602a488d2aa3cce6b089cf0dc663a8ee9941e8b50a20b9c70f3"));
var getEvent = createServerFn({ method: "GET" }).validator((id) => Number(id)).handler(createSsrRpc("4d2b45aff15a88d51be79b7fc4bedc54b775eacb5c97104b1c60aef383df0b31"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("053fce5c75fc7a9a032a23b5dbe89661f603532d7a6a4e7455f322a7564ab395"));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	displayName: String(input.displayName ?? "").trim().slice(0, 80),
	phone: String(input.phone ?? "").trim().slice(0, 32),
	bio: String(input.bio ?? "").trim().slice(0, 280)
})).handler(createSsrRpc("b346cfaeaa570ac4091c7ffc0de3a8fb79707f1e470fbb97908d9aa8b2d012cb"));
var myTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8e94c339119602ecd51a5e0f44e52c4d3cca748d8e65277b1173c16e147a315f"));
var myPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7a2e7fc024959af8b7658ddfd6eee264d2982b261d74c5993ffd02fdc6e23c8a"));
var purchaseTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	eventId: Number(input.eventId),
	last4: String(input.last4 ?? "").replace(/\D/g, "").slice(-4)
})).handler(createSsrRpc("cf7fb82f421bbc4d9edef7ecd80c34df812e973d73352b099b45e73744332e1e"));
var createEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	title: String(input.title ?? "").trim().slice(0, 80),
	description: String(input.description ?? "").trim().slice(0, 600),
	startAt: String(input.startAt ?? ""),
	endAt: String(input.endAt ?? ""),
	location: String(input.location ?? "").trim().slice(0, 120),
	categoryId: Number(input.categoryId),
	priceDollars: Math.max(0, Math.round(Number(input.priceDollars) * 100) / 100),
	capacity: Math.max(1, Math.min(5e3, Math.round(Number(input.capacity))))
})).handler(createSsrRpc("1028514e52a73e2e2cb6ab7c4aec08581242e1a9ccba0ecc9e8eaa3bd60e837d"));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ae14965737adb62e61972fee86726a7fd180b79541b32eb0cb9176df5417dcfd"));
var adminPeople = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("441c29d3b56bbcbdc49beab3b4e1ee5c2a07f0e8fb615b6d186fe77cbb7dfe90"));
var setRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input.userId ?? ""),
	role: input.role === "admin" || input.role === "organizer" ? input.role : "user"
})).handler(createSsrRpc("b9e4f18e75b456c21170f8e6700287caef7aff03d46c03e7b203f77680c83065"));
var setEventStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	eventId: Number(input.eventId),
	status: input.status === "cancelled" || input.status === "draft" ? input.status : "published"
})).handler(createSsrRpc("006fd7345f8f369e529824d078fd0811648c00d8de92ea6c1fde688e6b268b42"));
var adminPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("54d1c09ff6ba2d8955c0575e2730936549f9c3f726b0fe37259880ea366fcfcc"));
var refundPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => Number(id)).handler(createSsrRpc("1863a95af6604c0bcb2935504b45d2bcf4f557d937f44a2465164137a7e18354"));
//#endregion
export { useOnline as _, createEvent as a, listCategories as c, myTickets as d, purchaseTicket as f, setRole as g, setEventStatus as h, adminPeople as i, listEvents as l, saveProfile as m, adminOverview as n, getEvent as o, refundPayment as p, adminPayments as r, getMe as s, Shell as t, myPayments as u };
