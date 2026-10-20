import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createEvent, listCategories } from "@/lib/events-api";

export const Route = createFileRoute("/create")({ component: Create });

function Create() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [price, setPrice] = useState("0");
  const [capacity, setCapacity] = useState("50");
  const [error, setError] = useState("");

  useEffect(() => {
    listCategories().then((rows) => {
      setCats(rows);
      if (rows[0]) setCategoryId(rows[0].id);
    }).catch(() => setCats([]));
  }, []);

  if (isPending) return <Shell><p className="text-sm text-muted">Checking your pass…</p></Shell>;
  if (!user) return <RedirectToSignIn />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await createEvent({
        data: {
          title,
          description,
          location,
          startAt,
          endAt,
          categoryId,
          priceDollars: Number(price),
          capacity: Number(capacity),
        },
      });
      navigate({ to: "/event/$eventId", params: { eventId: String(res.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish.");
    }
  }

  return (
    <Shell>
      <h1 className="font-display text-4xl leading-none">New event</h1>
      <p className="mt-2 text-sm text-muted">Anyone signed in can host. Admins can later cancel or refund.</p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input required className="w-full rounded-2xl border border-line bg-surface px-4 py-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea required className="w-full rounded-2xl border border-line bg-surface px-4 py-3" rows={4} placeholder="What happens" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input required className="w-full rounded-2xl border border-line bg-surface px-4 py-3" placeholder="Place" value={location} onChange={(e) => setLocation(e.target.value)} />
        <label className="block text-xs text-muted">Starts
          <input required type="datetime-local" className="mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        </label>
        <label className="block text-xs text-muted">Ends
          <input required type="datetime-local" className="mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        </label>
        <select className="w-full rounded-2xl border border-line bg-surface px-4 py-3" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl border border-line bg-surface px-4 py-3" inputMode="decimal" placeholder="Price USD" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input className="rounded-2xl border border-line bg-surface px-4 py-3" inputMode="numeric" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </div>
        {error && <p className="text-sm text-primary">{error}</p>}
        <button className="w-full rounded-full bg-primary py-3 font-medium text-primary-ink" type="submit">Publish</button>
      </form>
    </Shell>
  );
}
