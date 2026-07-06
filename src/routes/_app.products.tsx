import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { BarTrend, DonutPie } from "@/components/charts/Charts";
import { topProducts, productMix, revenueTrend } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Products table, categories, top performers, stock availability and analytics."
        icon={Package}
        actions={<button onClick={() => toast.success("New product created")} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2"><Plus className="h-4 w-4" /> New product</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2"><H t="Revenue by month" /><BarTrend data={revenueTrend} color="var(--chart-1)" /></Card>
        <Card><H t="Category mix" /><DonutPie data={productMix} /></Card>
      </div>

      <Card>
        <H t="All products" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Product</th><th className="pr-4 font-medium">Category</th>
                <th className="pr-4 font-medium">Sold</th><th className="pr-4 font-medium">Revenue</th>
                <th className="pr-4 font-medium">Stock</th><th className="pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.name} onClick={() => toast.info(`Opening ${p.name}`)} className="border-b border-border/50 hover:bg-accent/40 cursor-pointer">
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="pr-4 text-muted-foreground">{p.category}</td>
                  <td className="pr-4 tabular-nums">{p.sold.toLocaleString()}</td>
                  <td className="pr-4 tabular-nums">${p.revenue.toLocaleString()}</td>
                  <td className="pr-4 tabular-nums">{p.stock}</td>
                  <td className="pr-4"><Badge tone={p.stock === 0 ? "destructive" : p.stock < 50 ? "warning" : "success"}>{p.stock === 0 ? "Out" : p.stock < 50 ? "Low" : "In stock"}</Badge></td>
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
