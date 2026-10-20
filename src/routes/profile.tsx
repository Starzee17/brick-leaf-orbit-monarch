import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMe, myPayments, saveProfile, type PaymentItem, type Profile } from "@/lib/events-api";
import { money, when } from "@/lib/format";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!user) return;
    getMe()
      .then((p) => {
        setProfile(p);
        setName(p.displayName);
        setPhone(p.phone);
        setBio(p.bio);
      })
      .catch(() => setNote("Could not load your profile. Try again online."));
    myPayments().then(setPayments).catch(() => setPayments([]));
  }, [user]);

  if (isPending) return <Shell><p className="text-sm text-muted">Checking your pass…</p></Shell>;
  if (!user) return <RedirectToSignIn />;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setNote("");
    try {
      await saveProfile({ data: { displayName: name, phone, bio } });
      setNote("Saved.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <Shell>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl leading-none">{name || "Your profile"}</h1>
          <p className="mt-1 text-sm text-muted">{profile?.email}</p>
          <p className="text-xs uppercase tracking-widest text-forest">{profile?.role}</p>
        </div>
        <UserButton />
      </div>
      {profile?.role === "admin" && (
        <Link to="/admin" className="mt-4 inline-flex rounded-full bg-forest px-4 py-2 text-sm text-primary-ink">
          Open admin desk
        </Link>
      )}
      <form onSubmit={save} className="mt-5 space-y-3">
        <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="w-full rounded-2xl border border-line bg-surface px-4 py-3" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        <textarea className="w-full rounded-2xl border border-line bg-surface px-4 py-3" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio" />
        <button className="rounded-full bg-ink px-5 py-3 text-bg" type="submit">Save profile</button>
        {note && <p className="text-sm text-muted">{note}</p>}
      </form>
      <h2 className="mt-8 font-display text-2xl">Payments</h2>
      <ul className="mt-2 space-y-2">
        {payments.map((p) => (
          <li key={p.id} className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span>{p.title}</span>
              <span>{money(p.amountCents)}</span>
            </div>
            <p className="text-muted">{p.status}{p.last4 ? ` · •••• ${p.last4}` : ""} · {when(p.createdAt)}</p>
          </li>
        ))}
        {!payments.length && <li className="text-sm text-muted">No payments yet.</li>}
      </ul>
      
    </Shell>
  );
}
