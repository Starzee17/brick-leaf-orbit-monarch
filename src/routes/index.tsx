import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import { Shell } from "@/components/shell";
import { cacheKeys, readCache, writeCache } from "@/lib/cache";
import { listCategories, listEvents, type EventItem } from "@/lib/events-api";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [events, setEvents] = useState<EventItem[]>(() => readCache<EventItem[]>(cacheKeys.EVENTS) ?? []);
  const [cats, setCats] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [paid, setPaid] = useState<"all" | "free" | "paid">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    listEvents()
      .then((rows) => {
        setEvents(rows);
        writeCache(cacheKeys.EVENTS, rows);
        setError("");
      })
      .catch(() => {
        if (!readCache(cacheKeys.EVENTS)) setError("Could not load events. Saved copies will show when you have them.");
      });
    listCategories()
      .then((rows) => setCats(rows.map((c) => c.name)))
      .catch(() => setCats([]));
  }, []);

  const shown = useMemo(() => {
    return events.filter((e) => {
      if (e.status !== "published" && e.status !== "cancelled") return false;
      if (cat !== "All" && e.category !== cat) return false;
      if (paid === "free" && e.priceCents > 0) return false;
      if (paid === "paid" && e.priceCents === 0) return false;
      const blob = `${e.title} ${e.location} ${e.description}`.toLowerCase();
      return blob.includes(q.trim().toLowerCase());
    });
  }, [events, q, cat, paid]);

  return (
    <Shell>
      <p className="font-display text-4xl leading-none">What’s on</p>
      <p className="mt-2 text-sm text-muted">Browse now. Your tickets stay on this phone if the signal drops.</p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search title or place"
        className="mt-4 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base outline-none"
      />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {["All", ...cats].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setCat(name)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${cat === name ? "bg-ink text-bg" : "border border-line bg-surface"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {(["all", "free", "paid"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPaid(key)}
            className={`rounded-full px-3 py-1.5 text-sm capitalize ${paid === key ? "bg-primary text-primary-ink" : "text-muted"}`}
          >
            {key}
          </button>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-primary">{error}</p>}
      <div className="mt-4 space-y-4">
        {shown.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {!shown.length && <p className="py-10 text-center text-sm text-muted">Nothing matches that filter.</p>}
      </div>
    </Shell>
  );
}
