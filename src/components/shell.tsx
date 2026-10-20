import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Moon, Plus, Share2, Smartphone, Sun, Ticket, UserRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  return online;
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("myevent.theme");
    const next = stored === "dark";
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("myevent.theme", next ? "dark" : "light");
  }
  return { dark, toggle };
}

const tabs = [
  { to: "/", label: "Discover", icon: CalendarDays },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/create", label: "Create", icon: Plus },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const online = useOnline();
  const theme = useTheme();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installHint, setInstallHint] = useState("");
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(window.matchMedia("(display-mode: standalone)").matches);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    if (!installEvent) {
      setInstallHint("In Chrome, open the menu and choose Install app or Add to Home screen.");
      return;
    }
    await installEvent.prompt();
    setInstallEvent(null);
  }

  async function share() {
    const url = window.location.origin;
    try {
      if (navigator.share) await navigator.share({ title: "My Event", text: "Get My Event on your phone", url });
      else {
        await navigator.clipboard.writeText(url);
        setInstallHint("Link copied. Send it to your friends.");
      }
    } catch {
      setInstallHint(url);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg bg-bg text-ink">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-3 backdrop-blur">
        <Link to="/" className="font-display text-2xl leading-none tracking-tight">
          My Event
        </Link>
        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={theme.toggle}
          className="grid size-11 place-items-center rounded-full border border-line bg-surface"
        >
          {theme.dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
      </header>
      {!online && (
        <p className="bg-forest px-4 py-2 text-center text-sm text-primary-ink">
          Offline — saved events and tickets still open. Buying a ticket needs a connection.
        </p>
      )}
      {!standalone && (
        <div className="mx-4 mt-3 flex flex-col gap-2 rounded-card border border-line bg-surface p-3">
          <p className="text-sm">After you publish, open the public link in Chrome on Android and install it. This preview cannot be downloaded by other phones.</p>
          <div className="flex gap-2">
            <button type="button" onClick={install} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm text-bg">
              <Smartphone className="size-4" /> Install
            </button>
            <button type="button" onClick={share} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-3 text-sm">
              <Share2 className="size-4" /> Share link
            </button>
          </div>
          {installHint && <p className="text-xs text-muted">{installHint}</p>}
        </div>
      )}
      <main className="px-4 pb-28 pt-4">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-lg -translate-x-1/2 justify-around border-t border-line bg-surface px-2 py-2">
        {tabs.map((tab) => {
          const active = tab.to === "/" ? path === "/" : path.startsWith(tab.to);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 text-xs ${
                active ? "bg-ink text-bg" : "text-muted"
              }`}
            >
              <Icon className="size-5" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
