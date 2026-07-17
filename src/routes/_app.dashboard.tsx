import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Sparkles, DollarSign, ShoppingCart, TrendingUp, Package, Users, Boxes, UserCog, Download, Filter, ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { LineTrend, AreaTrend, BarTrend, CompareBars, DonutPie } from "@/components/charts/Charts";
import { kpis, salesTrend, revenueTrend, customerGrowth, monthlyCompare, productMix, aiInsights, notifications, tasks } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function exportOverview() {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines: string[] = [];
  lines.push("Metric,Value,Delta %");
  lines.push(["Revenue", kpis.revenue.value, kpis.revenue.delta].map(esc).join(","));
  lines.push(["Sales", kpis.sales.value, kpis.sales.delta].map(esc).join(","));
  lines.push(["Profit", kpis.profit.value, kpis.profit.delta].map(esc).join(","));
  lines.push(["Orders", kpis.orders.value, kpis.orders.delta].map(esc).join(","));
  lines.push(["Customers", kpis.customers.value, kpis.customers.delta].map(esc).join(","));
  lines.push("");
  lines.push("Month,Sales,Revenue");
  salesTrend.forEach((s, i) => lines.push([s.name, s.value, revenueTrend[i]?.value ?? 0].map(esc).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "dashboard-overview.csv";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success("Overview exported");
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [range, setRange] = useState<3 | 6 | 12>(12);
  const rangedSales = salesTrend.slice(-range);

  return (
    <>
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 mb-6 hero-bg border border-border animate-fade-in">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-float" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              All systems nominal
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-display font-semibold tracking-tight">
              {greet}, <span className="gradient-text">{user?.name?.split(" ")[0] ?? "Founder"}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Here's what BizPilot AI noticed today — revenue is trending 12% ahead of forecast and 3 customers need attention.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportOverview} className="h-10 px-4 rounded-lg border border-border bg-card/70 hover:bg-accent text-sm inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </button>
            <button onClick={() => navigate({ to: "/ai-assistant" })} className="h-10 px-4 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary hover:brightness-110 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* AI summary */}
      <Card className="mb-6 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center glow-primary shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-medium">AI Assistant summary</div>
              <Badge tone="info">Live</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              {aiInsights.slice(0, 3).map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">▸</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => navigate({ to: "/ai-assistant" })} className="hidden md:inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Open assistant <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </Card>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Revenue" value={kpis.revenue.value} delta={kpis.revenue.delta} prefix="$" series={kpis.revenue.series} icon={DollarSign} accent="primary" onClick={() => navigate({ to: "/analytics" })} />
        <KpiCard label="Sales" value={kpis.sales.value} delta={kpis.sales.delta} series={kpis.sales.series} icon={ShoppingCart} accent="info" onClick={() => navigate({ to: "/sales" })} />
        <KpiCard label="Profit" value={kpis.profit.value} delta={kpis.profit.delta} prefix="$" series={kpis.profit.series} icon={TrendingUp} accent="success" onClick={() => navigate({ to: "/finance" })} />
        <KpiCard label="Orders" value={kpis.orders.value} delta={kpis.orders.delta} series={kpis.orders.series} icon={Package} accent="warning" onClick={() => navigate({ to: "/orders" })} />
        <KpiCard label="Customers" value={kpis.customers.value} delta={kpis.customers.delta} series={kpis.customers.series} icon={Users} accent="primary" onClick={() => navigate({ to: "/customers" })} />
        <KpiCard label="Inventory" value={kpis.inventory.value} delta={kpis.inventory.delta} series={kpis.inventory.series} icon={Boxes} accent="info" onClick={() => navigate({ to: "/inventory" })} />
        <KpiCard label="Employees" value={kpis.employees.value} delta={kpis.employees.delta} series={kpis.employees.series} icon={UserCog} accent="success" onClick={() => navigate({ to: "/employees" })} />
        <KpiCard label="Avg ROI" value={4} delta={5.1} suffix=".5x" icon={TrendingUp} accent="warning" onClick={() => navigate({ to: "/marketing" })} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Sales trend</div>
              <div className="text-xs text-muted-foreground">Last {range} months</div>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
              {([3, 6, 12] as const).map((r) => (
                <button
                  key={r}
                  onClick={(e) => { e.stopPropagation(); setRange(r); }}
                  className={`text-xs px-2.5 py-1 rounded-md transition ${range === r ? "bg-[image:var(--gradient-primary)] text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {r}M
                </button>
              ))}
              <button
                onClick={(e) => { e.stopPropagation(); navigate({ to: "/sales" }); }}
                className="text-xs px-2.5 py-1 rounded-md text-primary hover:underline inline-flex items-center gap-1"
              >
                Explore <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          <LineTrend data={rangedSales} color="var(--chart-1)" />
        </Card>
        <Card onClick={() => navigate({ to: "/analytics" })}>
          <ChartHeader title="Product mix" hint="Revenue share" />
          <DonutPie data={productMix} />
        </Card>

        <Card onClick={() => navigate({ to: "/analytics" })}>
          <ChartHeader title="Revenue" hint="Monthly" />
          <BarTrend data={revenueTrend} color="var(--chart-2)" />
        </Card>
        <Card onClick={() => navigate({ to: "/customers" })}>
          <ChartHeader title="Customer growth" hint="Cumulative" />
          <AreaTrend data={customerGrowth} color="var(--chart-3)" />
        </Card>
        <Card onClick={() => navigate({ to: "/analytics" })}>
          <ChartHeader title="This year vs last" hint="Monthly comparison" />
          <CompareBars data={monthlyCompare} />
        </Card>
      </div>

      {/* Two-column: recent activity + tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <ChartHeader title="Recent notifications" cta={{ label: "View all", onClick: () => navigate({ to: "/notifications" }) }} />
          <ul className="divide-y divide-border">
            {notifications.slice(0, 5).map((n) => (
              <li key={n.id} className="py-3 flex items-start gap-3">
                <div className={`h-2 w-2 mt-2 rounded-full ${n.unread ? "bg-primary animate-pulse" : "bg-muted"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <ChartHeader title="Your tasks" cta={{ label: "Open", onClick: () => navigate({ to: "/tasks" }) }} />
          <ul className="space-y-2">
            {tasks.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition">
                <input type="checkbox" className="rounded border-border bg-transparent" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.due} · {t.assignee}</div>
                </div>
                <Badge tone={t.priority === "High" ? "destructive" : t.priority === "Medium" ? "warning" : "default"}>{t.priority}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function ChartHeader({ title, hint, cta }: { title: string; hint?: string; cta?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="text-sm font-medium">{title}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {cta ? (
        <button onClick={(e) => { e.stopPropagation(); cta.onClick(); }} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
          {cta.label} <ArrowRight className="h-3 w-3" />
        </button>
      ) : (
        <button onClick={(e) => e.stopPropagation()} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <Filter className="h-3 w-3" /> Filter
        </button>
      )}
    </div>
  );
}
