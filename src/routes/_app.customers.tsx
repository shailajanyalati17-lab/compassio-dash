import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Download } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AreaTrend, DonutPie } from "@/components/charts/Charts";
import { customers, customerGrowth, kpis } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const [q, setQ] = useState("");
  const rows = customers.filter((c) => (c.name + c.email + c.plan).toLowerCase().includes(q.toLowerCase()));
  const segMix = [
    { name: "Enterprise", value: 27, color: "var(--chart-1)" },
    { name: "Pro", value: 48, color: "var(--chart-2)" },
    { name: "Free", value: 25, color: "var(--chart-3)" },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        description="Directory, segmentation, lifetime value, churn prediction, feedback and satisfaction."
        icon={Users}
        actions={<button onClick={() => toast.success("Exported customers")} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2"><Download className="h-4 w-4" /> Export</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Customers" value={kpis.customers.value} delta={kpis.customers.delta} series={kpis.customers.series} />
        <KpiCard label="Avg LTV" value={6280} delta={4.4} prefix="$" accent="success" />
        <KpiCard label="Churn risk" value={3} delta={-1.2} accent="warning" />
        <KpiCard label="CSAT" value={92} delta={1.8} suffix="%" accent="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2"><H t="Customer growth" /><AreaTrend data={customerGrowth} color="var(--chart-3)" /></Card>
        <Card><H t="Segmentation" /><DonutPie data={segMix} /></Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="text-sm font-medium">Customer directory</div>
          <div className="flex items-center h-9 rounded-lg border border-border bg-card/60 px-3 w-full sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent outline-none px-2 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Customer</th><th className="pr-4 font-medium">Plan</th>
                <th className="pr-4 font-medium">LTV</th><th className="pr-4 font-medium">Orders</th>
                <th className="pr-4 font-medium">Status</th><th className="pr-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} onClick={() => toast.info(`Opening ${c.name}`)} className="border-b border-border/50 hover:bg-accent/40 cursor-pointer transition">
                  <td className="py-3 pr-4 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-[10px] font-semibold text-white">{c.name[0]}</div>
                    <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                  </td>
                  <td className="pr-4"><Badge tone={c.plan === "Enterprise" ? "info" : c.plan === "Pro" ? "success" : "default"}>{c.plan}</Badge></td>
                  <td className="pr-4 tabular-nums">${c.ltv.toLocaleString()}</td>
                  <td className="pr-4 tabular-nums">{c.orders}</td>
                  <td className="pr-4"><Badge tone={c.status === "active" ? "success" : c.status === "churn-risk" ? "destructive" : "warning"}>{c.status}</Badge></td>
                  <td className="pr-4 text-muted-foreground">{c.joined}</td>
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
