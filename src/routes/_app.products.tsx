import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus, X } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { BarTrend, DonutPie } from "@/components/charts/Charts";
import { topProducts, productMix, revenueTrend } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: ProductsPage,
});

type Product = { name: string; category: string; sold: number; revenue: number; stock: number };

function ProductsPage() {
  const [items, setItems] = useState<Product[]>(topProducts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Product>({ name: "", category: "", sold: 0, revenue: 0, stock: 0 });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setItems((prev) => [{ ...form }, ...prev]);
    toast.success(`${form.name} added`);
    setOpen(false);
    setForm({ name: "", category: "", sold: 0, revenue: 0, stock: 0 });
  };

  return (
    <>
      <PageHeader
        title="Products"
        description="Products table, categories, top performers, stock availability and analytics."
        icon={Package}
        actions={<button onClick={() => setOpen(true)} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2"><Plus className="h-4 w-4" /> New product</button>}
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
              {items.map((p) => (
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

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">New product</div>
              <button type="button" onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <Field label="Name"><input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="Nimbus Pro X" /></Field>
              <Field label="Category"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="SaaS" /></Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Sold"><input type="number" min={0} value={form.sold} onChange={(e) => setForm({ ...form, sold: Number(e.target.value) })} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" /></Field>
                <Field label="Revenue"><input type="number" min={0} value={form.revenue} onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" /></Field>
                <Field label="Stock"><input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm" /></Field>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-9 px-3 rounded-lg border border-border hover:bg-accent text-sm">Cancel</button>
              <button type="submit" className="h-9 px-4 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary">Create product</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
function H({ t }: { t: string }) { return <div className="text-sm font-medium mb-3">{t}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs text-muted-foreground mb-1">{label}</div>{children}</label>;
}
