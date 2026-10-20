import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { cacheKeys, readCache } from "@/lib/cache";
import { getEvent, type EventItem } from "@/lib/events-api";
import { money, when } from "@/lib/format";

export const Route = createFileRoute("/event/$eventId")({ component: Detail });

function Detail() {
  const { eventId } = Route.useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const id = Number(eventId);
    const cached = readCache<EventItem[]>(cacheKeys.EVENTS)?.find((e) => e.id === id) ?? null;
    if (cached) setEvent(cached);
    getEvent({ data: id })
      .then((row) => {
        if (row) setEvent(row);
        else if (!cached) setMissing(true);
      })
      .catch(() => {
        if (!cached) setMissing(true);
      });
  }, [eventId]);

  return (
    <Shell>
      {!event && !missing && <p className="text-sm text-muted">Loading…</p>}
      {missing && <p>That event isn’t on this device.</p>}
      {event && (
        <article>
          <div className={`tone-${event.tone} h-40 rounded-card`} />
          <p className="mt-4 text-sm uppercase tracking-widest text-muted">{event.category}</p>
          <h1 className="font-display text-4xl leading-none">{event.title}</h1>
          <p className="mt-3 text-sm text-muted">{when(event.startAt)} – {when(event.endAt)}</p>
          <p className="text-sm text-muted">{event.location}</p>
          <p className="mt-4 leading-relaxed">{event.description}</p>
          <p className="mt-3 text-sm text-muted">
            Hosted by {event.organizer} · {Math.max(0, event.capacity - event.sold)} of {event.capacity} left
          </p>
          <div className="mt-6 flex items-center justify-between">
            <span className="font-display text-3xl">{money(event.priceCents)}</span>
            {event.status === "published" ? (
              <Link
                to="/checkout/$eventId"
                params={{ eventId: String(event.id) }}
                className="rounded-full bg-primary px-5 py-3 font-medium text-primary-ink"
              >
                {event.priceCents ? "Get a ticket" : "Reserve a seat"}
              </Link>
            ) : (
              <span className="text-sm text-muted">Not open</span>
            )}
          </div>
        </article>
      )}
    </Shell>
  );
}
