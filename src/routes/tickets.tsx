import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TicketMark } from "@/components/mark";
import { Shell } from "@/components/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cacheKeys, readCache, writeCache } from "@/lib/cache";
import { myTickets, type TicketItem } from "@/lib/events-api";
import { when } from "@/lib/format";

export const Route = createFileRoute("/tickets")({ component: Tickets });

function Tickets() {
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<TicketItem[]>(() => readCache<TicketItem[]>(cacheKeys.TICKETS) ?? []);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    myTickets()
      .then((list) => {
        setRows(list);
        writeCache(cacheKeys.TICKETS, list);
      })
      .catch(() => {
        /* keep cache */
      });
  }, [user]);

  if (isPending) return <Shell><p className="text-sm text-muted">Checking your pass…</p></Shell>;
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell>
      <h1 className="font-display text-4xl leading-none">Your tickets</h1>
      <p className="mt-2 text-sm text-muted">Saved on this device, so the door code works without signal.</p>
      <div className="mt-5 space-y-3">
        {rows.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setOpen(open === t.id ? null : t.id)}
            className="w-full rounded-card border border-line bg-surface p-4 text-left"
          >
            <p className="text-xs uppercase tracking-widest text-muted">{t.status}</p>
            <p className="font-display text-2xl leading-tight">{t.title}</p>
            <p className="text-sm text-muted">{when(t.startAt)} · {t.location}</p>
            {open === t.id && (
              <div className="mt-4">
                <TicketMark code={t.code} />
                <p className="mt-2 text-center font-medium tracking-[0.2em]">{t.code}</p>
              </div>
            )}
          </button>
        ))}
        {!rows.length && (
          <p className="py-8 text-center text-sm text-muted">
            No tickets yet. <Link to="/" className="underline">Find something</Link>.
          </p>
        )}
      </div>
    </Shell>
  );
}
