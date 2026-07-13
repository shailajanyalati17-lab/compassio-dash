import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Search, Sparkles, Command, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { notifications } from "@/lib/mock-data";

export function TopBar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => n.unread).length;
  const crumb = pathname.split("/").filter(Boolean).slice(-1)[0] ?? "dashboard";


  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 md:px-6 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="min-w-0 flex-1 flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>BizPilot</span>
          <span>/</span>
          <span className="text-foreground capitalize">{crumb.replace(/-/g, " ")}</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 h-9 w-80 rounded-lg border border-border bg-card/60 px-3 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
        <span className="flex-1">Search anything</span>
        <kbd className="hidden xl:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          <Command className="h-3 w-3" /> K
        </kbd>
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
