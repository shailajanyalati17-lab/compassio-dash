import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, Calendar } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LineTrend, AreaTrend, BarTrend, CompareBars, DonutPie } from "@/components/charts/Charts";
import { kpis, salesTrend, revenueTrend, customerGrowth, monthlyCompare, productMix, aiInsights } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Business KPIs, revenue and profit analysis, growth metrics, and AI insights."
        icon={BarChart3}
        actions={
          <>
            <button className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-accent text-sm inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Last 12 months
            </button>
            <button onClick={() => toast.success("Exported CSV")} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Revenue" value={kpis.revenue.value} delta={kpis.revenue.delta} prefix="$" series={kpis.revenue.series} />
        <KpiCard label="Profit" value={kpis.profit.value} delta={kpis.profit.delta} prefix="$" series={kpis.profit.series} accent="success" />
        <KpiCard label="Customers" value={kpis.customers.value} delta={kpis.customers.delta} series={kpis.customers.series} accent="info" />
        <KpiCard label="Growth" value={12} delta={2.1} suffix="%" accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2"><H t="Revenue trend" /><AreaTrend data={revenueTrend} color="var(--chart-1)" /></Card>
        <Card><H t="Product performance" /><DonutPie data={productMix} /></Card>
        <Card><H t="Sales" /><LineTrend data={salesTrend} color="var(--chart-2)" /></Card>
        <Card><H t="Customer growth" /><AreaTrend data={customerGrowth} color="var(--chart-3)" /></Card>
        <Card><H t="YoY comparison" /><CompareBars data={monthlyCompare} /></Card>
        <Card className="lg:col-span-3"><H t="Profit distribution" /><BarTrend data={kpis.profit.series} color="var(--chart-4)" /></Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3"><Badge tone="info">AI Insights</Badge><span className="text-sm font-medium">What BizPilot AI noticed</span></div>
        <ul className="grid md:grid-cols-2 gap-3">
          {aiInsights.map((t, i) => (
            <li key={i} className="rounded-xl border border-border bg-card/50 p-3 text-sm">{t}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function H({ t }: { t: string }) { return <div className="text-sm font-medium mb-3">{t}</div>; }
