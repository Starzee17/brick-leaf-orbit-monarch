import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, useOnline } from "@/components/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getEvent, purchaseTicket, refreshPayment, type EventItem } from "@/lib/events-api";
import { money } from "@/lib/format";

export const Route = createFileRoute("/checkout/$eventId")({ component: Checkout });

const WALLETS = [
  { id: "btcpay", label: "BTCPay" },
  { id: "airtel", label: "Airtel" },
  { id: "mtn", label: "MTN" },
  { id: "zamtel", label: "Zamtel" },
] as const;

function Checkout() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const online = useOnline();
  const { user, isPending } = useCurrentUserState();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState<(typeof WALLETS)[number]["id"]>("btcpay");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getEvent({ data: Number(eventId) }).then(setEvent).catch(() => setEvent(null));
  }, [eventId]);

  if (isPending) return <Shell><p className="text-sm text-muted">Checking your pass…</p></Shell>;
  if (!user) return <RedirectToSignIn />;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!online) {
      setError("You’re offline. Reconnect to send a mobile-money request.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await purchaseTicket({
        data: { eventId: Number(eventId), phone, provider: event && event.priceCents > 0 ? provider : "" },
      });
      if (result.status === "paid") {
        navigate({ to: "/tickets" });
        return;
      }
      setPaymentId(result.paymentId ?? null);
      setNote(result.message ?? "Approve the payment, then check status.");
      if (result.checkoutUrl) window.open(result.checkoutUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  async function check() {
    if (!paymentId) return;
    setBusy(true);
    setError("");
    try {
      const result = await refreshPayment({ data: paymentId });
      if (result.status === "paid") navigate({ to: "/tickets" });
      else if (result.status === "failed") setError("The wallet declined the payment. No ticket was issued.");
      else setNote("Still waiting for approval on your phone.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check the payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <h1 className="font-display text-4xl leading-none">Checkout</h1>
      {event && (
        <>
          <p className="mt-2 text-sm text-muted">{event.title}</p>
          <p className="mt-1 font-display text-3xl">{money(event.priceCents).replace("$", "ZMW ")}</p>
          <form onSubmit={pay} className="mt-5 space-y-3">
            {event.priceCents > 0 && (
              <>
                <p className="text-sm text-muted">
                  BTCPay Server is free and open source. Bitcoin and Lightning are confirmed on its invoice. Airtel, MTN, and Zamtel still use their own merchant APIs. A ticket is issued only after the provider marks the payment paid.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {WALLETS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setProvider(w.id)}
                      className={`rounded-2xl border px-2 py-3 text-sm ${provider === w.id ? "border-ink bg-ink text-bg" : "border-line bg-surface"}`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                {provider !== "btcpay" && (
                <input
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3"
                />
                )}
              </>
            )}
            {note && <p className="text-sm text-forest">{note}</p>}
            {error && <p className="text-sm text-primary">{error}</p>}
            <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-medium text-primary-ink" type="submit">
              {busy ? "Working…" : event.priceCents ? "Request payment" : "Reserve free seat"}
            </button>
            {paymentId && (
              <button disabled={busy} type="button" onClick={check} className="w-full rounded-full border border-line py-3">
                Check status
              </button>
            )}
          </form>
        </>
      )}
    </Shell>
  );
}
