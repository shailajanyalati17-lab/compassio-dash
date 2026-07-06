import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { BarTrend } from "@/components/charts/Charts";
import { campaigns, revenueTrend } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/marketing")({
  component: MarketingPage,
});

function MarketingPage() {
  return (
    <>
      <PageHeader
        title="Marketing"
        description="Campaign dashboard, email, social, lead generation and ROI analytics."
        icon={Megaphone}
        actions={<button onClick={() => toast.success("New campaign created")} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2"><Plus className="h-4 w-4" /> New campaign</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Leads" value={1134} delta={12.4} accent="primary" />
        <KpiCard label="Spend" value={31500} delta={-3.1} prefix="$" accent="warning" />
        <KpiCard label="Attributed rev" value={157800} delta={18.9} prefix="$" accent="success" />
        <KpiCard label="Avg ROI" value={4} delta={5.0} suffix=".2x" accent="info" />
      </div>

      <Card className="mb-6"><H t="Campaign revenue" /><BarTrend data={revenueTrend} color="var(--chart-2)" /></Card>

      <Card>
        <H t="Campaigns" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Campaign</th><th className="pr-4 font-medium">Channel</th>
                <th className="pr-4 font-medium">Spend</th><th className="pr-4 font-medium">Revenue</th>
                <th className="pr-4 font-medium">ROI</th><th className="pr-4 font-medium">Leads</th><th className="pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name} onClick={() => toast.info(`Opening ${c.name}`)} className="border-b border-border/50 hover:bg-accent/40 cursor-pointer">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="pr-4 text-muted-foreground">{c.channel}</td>
                  <td className="pr-4 tabular-nums">${c.spend.toLocaleString()}</td>
                  <td className="pr-4 tabular-nums">${c.revenue.toLocaleString()}</td>
                  <td className="pr-4 tabular-nums text-success">{c.roi.toFixed(1)}x</td>
                  <td className="pr-4 tabular-nums">{c.leads}</td>
                  <td className="pr-4"><Badge tone={c.status === "Active" ? "success" : c.status === "Paused" ? "warning" : "default"}>{c.status}</Badge></td>
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
