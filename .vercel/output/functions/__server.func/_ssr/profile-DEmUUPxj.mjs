import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as saveProfile, s as getMe, t as Shell, u as myPayments } from "./events-api-B5GImu_H.mjs";
import { n as UserButton, r as useCurrentUserState, t as RedirectToSignIn } from "./gates-2M-357rF.mjs";
import { n as when, t as money } from "./format-CPJ_ua--.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DEmUUPxj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [payments, setPayments] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMe().then((p) => {
			setProfile(p);
			setName(p.displayName);
			setPhone(p.phone);
			setBio(p.bio);
		}).catch(() => setNote("Could not load your profile. Try again online."));
		myPayments().then(setPayments).catch(() => setPayments([]));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Checking your pass…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function save(e) {
		e.preventDefault();
		setNote("");
		try {
			await saveProfile({ data: {
				displayName: name,
				phone,
				bio
			} });
			setNote("Saved.");
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not save.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-none",
					children: name || "Your profile"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: profile?.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-forest",
					children: profile?.role
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
		}),
		profile?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin",
			className: "mt-4 inline-flex rounded-full bg-forest px-4 py-2 text-sm text-primary-ink",
			children: "Open admin desk"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "mt-5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					value: phone,
					onChange: (e) => setPhone(e.target.value),
					placeholder: "Phone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					rows: 3,
					value: bio,
					onChange: (e) => setBio(e.target.value),
					placeholder: "A short bio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-full bg-ink px-5 py-3 text-bg",
					type: "submit",
					children: "Save profile"
				}),
				note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: note
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-2xl",
			children: "Payments"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-2 space-y-2",
			children: [payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-2xl border border-line bg-surface px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(p.amountCents) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: [
						p.status,
						p.last4 ? ` · •••• ${p.last4}` : "",
						" · ",
						when(p.createdAt)
					]
				})]
			}, p.id)), !payments.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "No payments yet."
			})]
		})
	] });
}
//#endregion
export { ProfilePage as component };
