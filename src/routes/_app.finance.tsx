import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AreaTrend, BarTrend, LineTrend } from "@/components/charts/Charts";
import { kpis, revenueTrend, salesTrend, invoices } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/finance")({
  component: FinancePage,
});

function FinancePage() {
  return (
    <>
      <PageHeader title="Finance" description="Income, expenses, profit, cash flow, taxes, invoices and reports." icon={Wallet} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Income" value={kpis.revenue.value} delta={kpis.revenue.delta} prefix="$" series={kpis.revenue.series} accent="success" />
        <KpiCard label="Expenses" value={86070} delta={4.2} prefix="$" accent="warning" />
        <KpiCard label="Profit" value={kpis.profit.value} delta={kpis.profit.delta} prefix="$" series={kpis.profit.series} />
        <KpiCard label="Cash flow" value={31240} delta={9.6} prefix="$" accent="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2"><H t="Income vs expenses" /><BarTrend data={revenueTrend} color="var(--chart-1)" /></Card>
        <Card><H t="Cash flow" /><AreaTrend data={salesTrend} color="var(--chart-3)" /></Card>
        <Card className="lg:col-span-3"><H t="Profit trend" /><LineTrend data={kpis.profit.series} color="var(--chart-4)" /></Card>
      </div>

      <Card>
        <H t="Invoices" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Invoice</th><th className="pr-4 font-medium">Customer</th>
                <th className="pr-4 font-medium">Amount</th><th className="pr-4 font-medium">Status</th><th className="pr-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((v) => (
                <tr key={v.id} className="border-b border-border/50 hover:bg-accent/40 cursor-pointer">
                  <td className="py-3 pr-4 font-medium">{v.id}</td>
                  <td className="pr-4">{v.customer}</td>
                  <td className="pr-4 tabular-nums">${v.amount.toLocaleString()}</td>
                  <td className="pr-4"><Badge tone={v.status === "Paid" ? "success" : v.status === "Overdue" ? "destructive" : "warning"}>{v.status}</Badge></td>
                  <td className="pr-4 text-muted-foreground">{v.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
function H({ t }: { t: string }) { return <div className="text-sm font-medium mb-3">{t}</div>; }
