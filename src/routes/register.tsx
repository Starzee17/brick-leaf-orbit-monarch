import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await authClient.signUp.email({ name, email, password });
    setBusy(false);
    if (res.error) setError(res.error.message ?? "Could not create the account.");
    else navigate({ to: "/profile" });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center bg-bg px-5 py-10 text-ink">
      <p className="font-display text-5xl leading-none">Create your pass</p>
      <p className="mt-2 text-sm text-muted">Name, email, and a password of at least 8 characters.</p>
      {!authEnabled ? (
        <p className="mt-6 text-sm">Sign-in is disabled.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-primary">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-ink py-3 font-medium text-bg" type="submit">
            {busy ? "Creating…" : "Register"}
          </button>
        </form>
      )}
      <Link to="/login" className="mt-6 text-center text-sm">
        Already have an account
      </Link>
    </main>
  );
}
