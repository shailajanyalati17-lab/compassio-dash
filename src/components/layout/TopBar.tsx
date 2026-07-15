import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Search, Sparkles, Command, Sun, Moon, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { notifications } from "@/lib/mock-data";

type SearchItem = { label: string; to: string; hint?: string; keywords?: string };

const SEARCH_INDEX: SearchItem[] = [
  { label: "Dashboard", to: "/dashboard", hint: "Overview & KPIs", keywords: "home kpi overview" },
  { label: "Analytics", to: "/analytics", hint: "Charts & insights", keywords: "charts insights reports" },
  { label: "Sales", to: "/sales", keywords: "deals pipeline revenue" },
  { label: "Customers", to: "/customers", keywords: "users clients accounts crm" },
  { label: "Products", to: "/products", keywords: "catalog sku" },
  { label: "Inventory", to: "/inventory", keywords: "stock warehouse" },
  { label: "Orders", to: "/orders", keywords: "purchases checkout" },
  { label: "Finance", to: "/finance", keywords: "revenue profit expenses" },
  { label: "Marketing", to: "/marketing", keywords: "campaigns ads roi" },
  { label: "Employees", to: "/employees", keywords: "team staff hr people" },
  { label: "Forecasting", to: "/forecasting", keywords: "prediction ai future" },
  { label: "AI Assistant", to: "/ai-assistant", keywords: "chat ask ai copilot" },
  { label: "Reports", to: "/reports", keywords: "export pdf" },
  { label: "Notifications", to: "/notifications", keywords: "alerts inbox" },
  { label: "Alerts", to: "/alerts", keywords: "warnings issues" },
  { label: "Calendar", to: "/calendar", keywords: "events schedule" },
  { label: "Tasks", to: "/tasks", keywords: "todo work" },
  { label: "Settings", to: "/settings", keywords: "preferences config" },
  { label: "Profile", to: "/profile", keywords: "account me" },
];

export function TopBar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => n.unread).length;
  const crumb = pathname.split("/").filter(Boolean).slice(-1)[0] ?? "dashboard";

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = term
      ? SEARCH_INDEX.filter((i) =>
          (i.label + " " + (i.keywords ?? "") + " " + i.to).toLowerCase().includes(term)
        )
      : SEARCH_INDEX.slice(0, 8);
    return list.slice(0, 8);
  }, [q]);

  useEffect(() => { setActive(0); }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onClick); };
  }, []);

  function go(to: string) {
    setOpen(false);
    setQ("");
    navigate({ to });
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const r = results[active]; if (r) go(r.to); }
  }

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 md:px-6 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="min-w-0 flex-1 flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>BizPilot</span>
          <span>/</span>
          <span className="text-foreground capitalize">{crumb.replace(/-/g, " ")}</span>
        </div>
      </div>

      <div ref={wrapRef} className="hidden lg:block relative">
        <div className="flex items-center gap-2 h-9 w-80 rounded-lg border border-border bg-card/60 px-3 text-sm focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40 transition">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onInputKey}
            placeholder="Search pages, customers, products…"
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden xl:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-96 rounded-xl border border-border bg-popover shadow-elegant overflow-hidden animate-scale-in">
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              {q ? `Results for "${q}"` : "Jump to"}
            </div>
            {results.length === 0 ? (
              <div className="px-3 py-6 text-sm text-muted-foreground text-center">No matches found</div>
            ) : (
              <ul className="max-h-80 overflow-auto py-1">
                {results.map((r, i) => (
                  <li key={r.to}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.to)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition ${
                        i === active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                      }`}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">
                        <span className="font-medium">{r.label}</span>
                        {r.hint && <span className="ml-2 text-xs text-muted-foreground">{r.hint}</span>}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Link
        to="/ai-assistant"
        className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary hover:brightness-110 transition"
      >
        <Sparkles className="h-4 w-4" />
        Ask AI
      </Link>

      <button
        onClick={toggle}
        className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-accent transition"
        aria-label="Toggle theme"
        title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <button
        onClick={() => navigate({ to: "/notifications" })}
        className="relative h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-accent transition"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-[10px] font-bold grid place-items-center text-white animate-pulse-glow">
            {unread}
          </span>
        )}
      </button>

      <button
        onClick={() => navigate({ to: "/profile" })}
        className="h-9 w-9 shrink-0 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-sm font-semibold text-white hover:scale-105 transition"
        aria-label="Profile"
      >
        {user?.name?.[0]?.toUpperCase() ?? "U"}
      </button>
    </header>
  );
}
