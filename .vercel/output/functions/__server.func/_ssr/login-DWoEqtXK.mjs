import { o as __toESM } from "../_runtime.mjs";
import { S as useNavigate, Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-CIzqETqd.mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DWoEqtXK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [resetNote, setResetNote] = (0, import_react.useState)("");
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		const res = await authClient.signIn.email({
			email,
			password
		});
		setBusy(false);
		if (res.error) setError(res.error.message ?? "Could not sign in.");
		else navigate({ to: "/" });
	}
	async function forgot() {
		setResetNote("");
		if (!email) {
			setResetNote("Type your email first.");
			return;
		}
		if ((await authClient.requestPasswordReset({
			email,
			redirectTo: "/login"
		})).error) setResetNote("Password email isn’t connected here. Sign in with the password you chose, or create a new account.");
		else setResetNote("If that inbox is real, a reset link is on its way.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-bg px-5 py-10 text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-5xl leading-none",
				children: "Welcome back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Sign in to hold tickets on this phone and online."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-6 space-y-3",
					children: [
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
							className: "w-full rounded-full bg-primary py-3 font-medium text-primary-ink",
							type: "submit",
							children: busy ? "Signing in…" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: forgot,
					className: "mt-3 text-sm text-muted underline",
					children: "Forgot password"
				}),
				resetNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: resetNote
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-6 h-px bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						className: "w-full rounded-full border border-line bg-surface py-3",
						children: ["Continue with ", p.label]
					}, p.providerId))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/register",
				className: "mt-6 text-center text-sm",
				children: "New here? Create an account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-3 text-center text-sm text-muted",
				children: "Browse without an account"
			})
		]
	});
}
//#endregion
export { Login as component };
