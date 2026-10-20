import { o as __toESM } from "../_runtime.mjs";
import { S as useNavigate, Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-7j6tLPt1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Register() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		const res = await authClient.signUp.email({
			name,
			email,
			password
		});
		setBusy(false);
		if (res.error) setError(res.error.message ?? "Could not create the account.");
		else navigate({ to: "/profile" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-bg px-5 py-10 text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-5xl leading-none",
				children: "Create your pass"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Name, email, and a password of at least 8 characters."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
						required: true,
						placeholder: "Name",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
						type: "email",
						required: true,
						placeholder: "Email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-2xl border border-line bg-surface px-4 py-3",
						type: "password",
						required: true,
						minLength: 8,
						placeholder: "Password",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-primary",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "w-full rounded-full bg-ink py-3 font-medium text-bg",
						type: "submit",
						children: busy ? "Creating…" : "Register"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-6 text-center text-sm",
				children: "Already have an account"
			})
		]
	});
}
//#endregion
export { Register as component };
