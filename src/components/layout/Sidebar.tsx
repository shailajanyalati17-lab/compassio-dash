import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BarChart3, ShoppingCart, Users, Package, Boxes, Receipt,
  Wallet, Megaphone, UserCog, TrendingUp, Sparkles, FileText, Bell, ShieldAlert,
  Calendar, ListChecks, Settings, User as UserIcon, LogOut, Zap, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

const groups: { label: string; items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/forecasting", label: "Forecasting", icon: TrendingUp },
      { to: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
    ],
  },
  {
    label: "Commerce",
    items: [
      { to: "/sales", label: "Sales", icon: ShoppingCart },
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/products", label: "Products", icon: Package },
      { to: "/inventory", label: "Inventory", icon: Boxes },
      { to: "/orders", label: "Orders", icon: Receipt },
    ],
  },
  {
    label: "Operate",
    items: [
      { to: "/finance", label: "Finance", icon: Wallet },
      { to: "/marketing", label: "Marketing", icon: Megaphone },
      { to: "/employees", label: "Employees", icon: UserCog },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/alerts", label: "Alerts", icon: ShieldAlert },
      { to: "/calendar", label: "Calendar", icon: Calendar },
      { to: "/tasks", label: "Tasks", icon: ListChecks },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/profile", label: "Profile", icon: UserIcon },
    ],
  },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "hidden md:flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-lg grid place-items-center bg-[image:var(--gradient-primary)] glow-primary transition-transform group-hover:scale-110">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-semibold text-sm">BizPilot</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">AI</div>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((g) => (
          <div key={g.label}>
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground/70">{g.label}</div>
            )}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.to || pathname.startsWith(it.to + "/");
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.06)]"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                    >
                      <span className={cn(
                        "relative grid place-items-center h-7 w-7 rounded-md",
                        active ? "bg-[image:var(--gradient-primary)] text-white" : "bg-transparent"
                      )}>
                        <Icon className="h-4 w-4" />
                        {active && <span className="absolute inset-0 rounded-md ring-1 ring-white/20" />}
                      </span>
                      {!collapsed && <span className="truncate">{it.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3 rounded-lg p-2", !collapsed && "bg-sidebar-accent/50")}>
          <div className="h-9 w-9 shrink-0 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user?.name ?? "Guest"}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email ?? "-"}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => { logout(); navigate({ to: "/auth/login" }); }}
              className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
