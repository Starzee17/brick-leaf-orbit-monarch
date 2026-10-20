import { o as __toESM } from "./_runtime.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as Route$2 } from "./_ssr/router-DuMA-HBB.mjs";
import { _ as useOnline, f as purchaseTicket, o as getEvent, t as Shell } from "./_ssr/events-api-B5GImu_H.mjs";
import { r as useCurrentUserState, t as RedirectToSignIn } from "./_ssr/gates-2M-357rF.mjs";
import { t as money } from "./_ssr/format-CPJ_ua--.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_eventId-CAbfBirA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkout() {
	const { eventId } = Route$2.useParams();
	const navigate = useNavigate();
	const online = useOnline();
	const { user, isPending } = useCurrentUserState();
	const [event, setEvent] = (0, import_react.useState)(null);
	const [card, setCard] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getEvent({ data: Number(eventId) }).then(setEvent).catch(() => setEvent(null));
	}, [eventId]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Checking your pass…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function pay(e) {
		e.preventDefault();
		if (!online) {
			setError("You’re offline. Reconnect to finish checkout.");
			return;
		}
		const digits = card.replace(/\D/g, "");
		if (event && event.priceCents > 0 && digits.length < 12) {
			setError("Use a demo card number, at least 12 digits. Nothing is charged to a real bank.");
			return;
		}
		setBusy(true);
		setError("");
		try {
			await purchaseTicket({ data: {
				eventId: Number(eventId),
				last4: digits.slice(-4)
			} });
			navigate({ to: "/tickets" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Payment failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-4xl leading-none",
		children: "Checkout"
	}), event && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: event.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl",
			children: money(event.priceCents)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Demo checkout — card numbers stay on this form. We only keep the last four digits with your receipt."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: pay,
			className: "mt-5 space-y-3",
			children: [
				event.priceCents > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					autoComplete: "off",
					placeholder: "Card number",
					value: card,
					onChange: (e) => setCard(e.target.value),
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy,
					className: "w-full rounded-full bg-primary py-3 font-medium text-primary-ink",
					type: "submit",
					children: busy ? "Working…" : event.priceCents ? `Pay ${money(event.priceCents)}` : "Reserve free seat"
				})
			]
		})
	] })] });
}
//#endregion
export { Checkout as component };
