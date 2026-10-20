import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetNote, setResetNote] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await authClient.signIn.email({ email, password });
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
    const res = await authClient.requestPasswordReset({
      email,
      redirectTo: "/login",
    });
    if (res.error) {
      setResetNote("Password email isn’t connected here. Sign in with the password you chose, or create a new account.");
    } else {
      setResetNote("If that inbox is real, a reset link is on its way.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-bg px-5 py-10 text-ink">
      <p className="font-display text-5xl leading-none">Welcome back</p>
      <p className="mt-2 text-sm text-muted">Sign in to hold tickets on this phone and online.</p>
      {!authEnabled ? (
        <p className="mt-6 text-sm">Sign-in is disabled.</p>
      ) : (
        <>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-sm text-primary">{error}</p>}
            <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-medium text-primary-ink" type="submit">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <button type="button" onClick={forgot} className="mt-3 text-sm text-muted underline">
            Forgot password
          </button>
          {resetNote && <p className="mt-2 text-sm text-muted">{resetNote}</p>}
          <div className="my-6 h-px bg-line" />
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-full border border-line bg-surface py-3"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        </>
      )}
      <Link to="/register" className="mt-6 text-center text-sm">
        New here? Create an account
      </Link>
      <Link to="/" className="mt-3 text-center text-sm text-muted">
        Browse without an account
      </Link>
    </main>
  );
}
