import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events-api";
import { money, when } from "@/lib/format";

export function EventCard({ event }: { event: EventItem }) {
  const left = Math.max(0, event.capacity - event.sold);
  return (
    <Link
      to="/event/$eventId"
      params={{ eventId: String(event.id) }}
      className="block overflow-hidden rounded-card border border-line bg-surface shadow-[var(--shadow)]"
    >
      <div className={`tone-${event.tone} flex h-28 items-end p-4 text-primary-ink`}>
        <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium tracking-wide text-white">
          {event.category}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl leading-tight">{event.title}</h2>
          <span className="shrink-0 text-sm font-medium text-primary">{money(event.priceCents)}</span>
        </div>
        <p className="text-sm text-muted">{when(event.startAt)}</p>
        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPin className="size-4" /> {event.location}
        </p>
        <p className="text-xs text-muted">
          {event.status === "published" ? `${left} spots left` : event.status} · {event.organizer}
        </p>
      </div>
    </Link>
  );
}
