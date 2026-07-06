import { createFileRoute } from "@tanstack/react-router";
import { Boxes, AlertTriangle } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AreaTrend } from "@/components/charts/Charts";
import { inventory, kpis, forecast } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const lowStock = inventory.filter((i) => i.stock < 200 && i.stock > 0);
  const outOfStock = inventory.filter((i) => i.stock === 0);

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Warehouse status, low stock, out of stock, reorder suggestions, suppliers and forecasts."
        icon={Boxes}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Units" value={kpis.inventory.value} delta={kpis.inventory.delta} series={kpis.inventory.series} />
        <KpiCard label="Low stock" value={lowStock.length} delta={-1.2} accent="warning" />
        <KpiCard label="Out of stock" value={outOfStock.length} delta={2.0} accent="destructive" />
        <KpiCard label="Suppliers" value={4} delta={0.0} accent="info" />
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3"><AlertTriangle className="h-4 w-4 text-warning" /><div className="text-sm font-medium">Reorder suggestions</div></div>
        <div className="grid md:grid-cols-2 gap-3">
          {lowStock.concat(outOfStock).map((i) => (
            <div key={i.sku} className="rounded-xl border border-border p-3 flex items-center gap-3">
              <div className="flex-1"><div className="text-sm font-medium">{i.name}</div><div className="text-xs text-muted-foreground">{i.sku} · {i.supplier}</div></div>
              <Badge tone={i.stock === 0 ? "destructive" : "warning"}>{i.reorder}</Badge>
              <button onClick={() => toast.success(`Reorder placed for ${i.name}`)} className="h-8 px-3 rounded-md bg-[image:var(--gradient-primary)] text-white text-xs font-medium">Reorder</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2"><H t="Inventory forecast" /><AreaTrend data={forecast.inventory} color="var(--chart-2)" /></Card>
        <Card>
          <H t="Suppliers" />
          <ul className="space-y-2">
            {["Northwind","Contoso","Fabrikam","Adventure Works"].map((s) => (
              <li key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition">
                <span className="text-sm">{s}</span><Badge tone="success">Active</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <H t="Warehouse stock" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">SKU</th><th className="pr-4 font-medium">Product</th>
                <th className="pr-4 font-medium">Category</th><th className="pr-4 font-medium">Stock</th>
                <th className="pr-4 font-medium">Supplier</th><th className="pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((i) => (
                <tr key={i.sku} className="border-b border-border/50 hover:bg-accent/40 cursor-pointer">
                  <td className="py-3 pr-4 font-mono text-xs">{i.sku}</td>
                  <td className="pr-4 font-medium">{i.name}</td>
                  <td className="pr-4 text-muted-foreground">{i.category}</td>
                  <td className="pr-4 tabular-nums">{i.stock}</td>
                  <td className="pr-4 text-muted-foreground">{i.supplier}</td>
                  <td className="pr-4"><Badge tone={i.stock === 0 ? "destructive" : i.stock < 50 ? "warning" : "success"}>{i.reorder}</Badge></td>
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
