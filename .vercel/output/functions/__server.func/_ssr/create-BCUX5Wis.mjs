import { o as __toESM } from "../_runtime.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as createEvent, c as listCategories, t as Shell } from "./events-api-B5GImu_H.mjs";
import { r as useCurrentUserState, t as RedirectToSignIn } from "./gates-2M-357rF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-BCUX5Wis.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Create() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [cats, setCats] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [startAt, setStartAt] = (0, import_react.useState)("");
	const [endAt, setEndAt] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)(0);
	const [price, setPrice] = (0, import_react.useState)("0");
	const [capacity, setCapacity] = (0, import_react.useState)("50");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		listCategories().then((rows) => {
			setCats(rows);
			if (rows[0]) setCategoryId(rows[0].id);
		}).catch(() => setCats([]));
	}, []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Checking your pass…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function submit(e) {
		e.preventDefault();
		setError("");
		try {
			const res = await createEvent({ data: {
				title,
				description,
				location,
				startAt,
				endAt,
				categoryId,
				priceDollars: Number(price),
				capacity: Number(capacity)
			} });
			navigate({
				to: "/event/$eventId",
				params: { eventId: String(res.id) }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not publish.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl leading-none",
			children: "New event"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Anyone signed in can host. Admins can later cancel or refund."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "mt-5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					required: true,
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					placeholder: "Title",
					value: title,
					onChange: (e) => setTitle(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					required: true,
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					rows: 4,
					placeholder: "What happens",
					value: description,
					onChange: (e) => setDescription(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					required: true,
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					placeholder: "Place",
					value: location,
					onChange: (e) => setLocation(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Starts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "datetime-local",
						className: "mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink",
						value: startAt,
						onChange: (e) => setStartAt(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Ends", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "datetime-local",
						className: "mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink",
						value: endAt,
						onChange: (e) => setEndAt(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
					value: categoryId,
					onChange: (e) => setCategoryId(Number(e.target.value)),
					children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.name
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "rounded-2xl border border-line bg-surface px-4 py-3",
						inputMode: "decimal",
						placeholder: "Price USD",
						value: price,
						onChange: (e) => setPrice(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "rounded-2xl border border-line bg-surface px-4 py-3",
						inputMode: "numeric",
						placeholder: "Capacity",
						value: capacity,
						onChange: (e) => setCapacity(e.target.value)
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "w-full rounded-full bg-primary py-3 font-medium text-primary-ink",
					type: "submit",
					children: "Publish"
				})
			]
		})
	] });
}
//#endregion
export { Create as component };
