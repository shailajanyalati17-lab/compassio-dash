import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { LineTrend, AreaTrend, BarTrend } from "@/components/charts/Charts";
import { forecast, aiInsights } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/forecasting")({
  component: ForecastingPage,
});

function ForecastingPage() {
  return (
    <>
      <PageHeader title="Forecasting" description="Sales, revenue, inventory, demand, customer growth and profit predictions." icon={TrendingUp} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card><H t="Sales forecast" /><LineTrend data={forecast.sales} color="var(--chart-1)" /></Card>
        <Card><H t="Revenue forecast" /><AreaTrend data={forecast.revenue} color="var(--chart-2)" /></Card>
        <Card><H t="Inventory forecast" /><BarTrend data={forecast.inventory} color="var(--chart-3)" /></Card>
        <Card><H t="Demand forecast" /><LineTrend data={forecast.demand} color="var(--chart-4)" /></Card>
        <Card><H t="Customer growth forecast" /><AreaTrend data={forecast.customers} color="var(--chart-5)" /></Card>
        <Card><H t="Profit forecast" /><BarTrend data={forecast.profit} color="var(--chart-1)" /></Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3"><Badge tone="info">AI Predictions</Badge></div>
        <ul className="grid md:grid-cols-2 gap-3">{aiInsights.map((t, i) => <li key={i} className="rounded-xl border border-border p-3 text-sm">{t}</li>)}</ul>
      </Card>
    </>
  );
}
function H({ t }: { t: string }) { return <div className="text-sm font-medium mb-3">{t}</div>; }
