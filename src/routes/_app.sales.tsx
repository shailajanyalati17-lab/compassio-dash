import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, Search, Download, FileSpreadsheet } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LineTrend, BarTrend } from "@/components/charts/Charts";
import { kpis, salesTrend, revenueTrend, orders, invoices, topProducts } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/sales")({
  component: SalesPage,
});

type Order = (typeof orders)[number];

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportSalesExcel(rows: Order[]) {
  const head = `<tr><th>Order</th><th>Customer</th><th>Product</th><th>Total</th><th>Status</th><th>Date</th></tr>`;
  const body = rows.map((o) => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.product}</td><td>${o.total}</td><td>${o.status}</td><td>${o.date}</td></tr>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table border="1">${head}${body}</table></body></html>`;
  download("sales.xls", html, "application/vnd.ms-excel");
  toast.success("Excel downloaded");
}

function exportSalesPDF(rows: Order[]) {
  const body = rows.map((o) => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.product}</td><td>$${o.total.toLocaleString()}</td><td>${o.status}</td><td>${o.date}</td></tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Sales Report</title>
    <style>body{font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#0f172a;padding:32px;max-width:900px;margin:auto}h1{margin:0 0 4px}.meta{color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:24px}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#f8fafc;font-weight:600}.brand{color:#6366f1;font-weight:600;margin-bottom:16px}@media print{body{padding:0}}</style>
    </head><body><div class="brand">BizPilot AI</div><h1>Sales Report</h1><div class="meta">Generated ${new Date().toLocaleString()}</div>
    <table><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>${body}</tbody></table>
    <script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`;
  const w = window.open("", "_blank");
  if (!w) { toast.error("Popup blocked — allow popups to export PDF"); return; }
  w.document.write(html); w.document.close();
  toast.success("PDF ready");
}

function SalesPage() {
  const [q, setQ] = useState("");
  const rows = orders.filter((o) => (o.customer + o.product + o.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Sales"
        description="Sales dashboard, invoices, orders, returns, top products, and regional performance."
        icon={ShoppingCart}
        actions={
          <>
            <button onClick={() => exportSalesPDF(rows)} className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-accent text-sm inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> PDF
            </button>
            <button onClick={() => exportSalesExcel(rows)} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Sales" value={kpis.sales.value} delta={kpis.sales.delta} series={kpis.sales.series} />
        <KpiCard label="Revenue" value={kpis.revenue.value} delta={kpis.revenue.delta} prefix="$" series={kpis.revenue.series} accent="success" />
        <KpiCard label="Avg order" value={98} delta={4.2} prefix="$" accent="info" />
        <KpiCard label="Returns" value={42} delta={-8.1} accent="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2"><H t="Monthly revenue" /><BarTrend data={revenueTrend} color="var(--chart-2)" /></Card>
        <Card><H t="Sales trend" /><LineTrend data={salesTrend} color="var(--chart-1)" /></Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-medium">Orders</div>
            <div className="text-xs text-muted-foreground">{rows.length} results</div>
          </div>
          <div className="flex items-center h-9 rounded-lg border border-border bg-card/60 px-3 w-full sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders..." className="flex-1 bg-transparent outline-none px-2 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Order</th><th className="pr-4 font-medium">Customer</th>
                <th className="pr-4 font-medium">Product</th><th className="pr-4 font-medium">Total</th>
                <th className="pr-4 font-medium">Status</th><th className="pr-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} onClick={() => toast.info(`Opening ${o.id}`)} className="border-b border-border/50 hover:bg-accent/40 transition cursor-pointer">
                  <td className="py-3 pr-4 font-medium">{o.id}</td>
                  <td className="pr-4">{o.customer}</td>
                  <td className="pr-4 text-muted-foreground">{o.product}</td>
                  <td className="pr-4 tabular-nums">${o.total.toLocaleString()}</td>
                  <td className="pr-4"><Badge tone={o.status === "Paid" ? "success" : o.status === "Refunded" ? "destructive" : "info"}>{o.status}</Badge></td>
                  <td className="pr-4 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <H t="Top products" />
          <ul className="space-y-2">
            {topProducts.slice(0, 5).map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-xs font-bold">#{i + 1}</div>
                <div className="flex-1"><div className="text-sm font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.category}</div></div>
                <div className="text-sm tabular-nums">${p.revenue.toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <H t="Recent invoices" />
          <ul className="space-y-2">
            {invoices.slice(0, 6).map((v) => (
              <li key={v.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition">
                <div className="flex-1"><div className="text-sm font-medium">{v.id}</div><div className="text-xs text-muted-foreground">{v.customer} · {v.date}</div></div>
                <div className="text-sm tabular-nums">${v.amount.toLocaleString()}</div>
                <Badge tone={v.status === "Paid" ? "success" : v.status === "Overdue" ? "destructive" : "warning"}>{v.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function H({ t }: { t: string }) { return <div className="text-sm font-medium mb-3">{t}</div>; }
