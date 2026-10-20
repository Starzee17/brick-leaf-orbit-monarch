import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  adminOverview,
  adminPayments,
  adminPeople,
  getMe,
  listEvents,
  refundPayment,
  setEventStatus,
  setRole,
  type EventItem,
} from "@/lib/events-api";
import { money, when } from "@/lib/format";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { user, isPending } = useCurrentUserState();
  const [role, setRoleName] = useState("");
  const [tab, setTab] = useState<"overview" | "events" | "people" | "payments">("overview");
  const [stats, setStats] = useState({ events: 0, people: 0, tickets: 0, revenueCents: 0 });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [people, setPeople] = useState<{ userId: string; displayName: string; role: string; email: string }[]>([]);
  const [pays, setPays] = useState<{ id: number; amountCents: number; status: string; last4: string; title: string; createdAt: string; email: string }[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const me = await getMe();
    setRoleName(me.role);
    if (me.role !== "admin") return;
    const [o, ev, pe, pa] = await Promise.all([adminOverview(), listEvents(), adminPeople(), adminPayments()]);
    setStats(o);
    setEvents(ev);
    setPeople(pe);
    setPays(pa);
  }

  useEffect(() => {
    if (!user) return;
    load().catch((err) => setError(err instanceof Error ? err.message : "Admin data failed."));
  }, [user]);

  if (isPending) return <Shell><p className="text-sm text-muted">Checking your pass…</p></Shell>;
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell>
      <h1 className="font-display text-4xl leading-none">Admin desk</h1>
      {role && role !== "admin" && <p className="mt-3 text-sm">Your role is {role}. The first account to open the app becomes admin.</p>}
      {error && <p className="mt-3 text-sm text-primary">{error}</p>}
      {role === "admin" && (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {(["overview", "events", "people", "payments"] as const).map((key) => (
              <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === key ? "bg-ink text-bg" : "border border-line"}`}>
                {key}
              </button>
            ))}
          </div>
          {tab === "overview" && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Events", stats.events],
                ["People", stats.people],
                ["Tickets", stats.tickets],
                ["Revenue", money(stats.revenueCents)],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-card border border-line bg-surface p-4">
                  <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
                  <p className="font-display text-3xl">{value}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "events" && (
            <ul className="mt-4 space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="rounded-2xl border border-line bg-surface p-3 text-sm">
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-muted">{ev.status} · {ev.sold}/{ev.capacity}</p>
                  <div className="mt-2 flex gap-2">
                    {["published", "draft", "cancelled"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="rounded-full border border-line px-3 py-1 capitalize"
                        onClick={() => setEventStatus({ data: { eventId: ev.id, status } }).then(load)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tab === "people" && (
            <ul className="mt-4 space-y-3">
              {people.map((p) => (
                <li key={p.userId} className="rounded-2xl border border-line bg-surface p-3 text-sm">
                  <p className="font-medium">{p.displayName || p.email}</p>
                  <p className="text-muted">{p.email} · {p.role}</p>
                  <div className="mt-2 flex gap-2">
                    {["user", "organizer", "admin"].map((next) => (
                      <button key={next} type="button" className="rounded-full border border-line px-3 py-1 capitalize" onClick={() => setRole({ data: { userId: p.userId, role: next } }).then(load).catch((err) => setError(err instanceof Error ? err.message : "Failed"))}>
                        {next}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tab === "payments" && (
            <ul className="mt-4 space-y-3">
              {pays.map((p) => (
                <li key={p.id} className="rounded-2xl border border-line bg-surface p-3 text-sm">
                  <div className="flex justify-between"><span>{p.title}</span><span>{money(p.amountCents)}</span></div>
                  <p className="text-muted">{p.email} · {p.status} · {p.last4 ? `•••• ${p.last4}` : "free"} · {when(p.createdAt)}</p>
                  {p.status === "paid" && p.amountCents > 0 && (
                    <button type="button" className="mt-2 rounded-full border border-line px-3 py-1" onClick={() => refundPayment({ data: p.id }).then(load)}>
                      Refund
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Shell>
  );
}
