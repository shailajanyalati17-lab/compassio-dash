import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Printer, FileSpreadsheet, FileType } from "lucide-react";
import { PageHeader, Card } from "@/components/layout/PageHeader";
import { toast } from "sonner";
import {
  kpis,
  salesTrend,
  revenueTrend,
  customerGrowth,
  monthlyCompare,
  productMix,
  topProducts,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

type Row = (string | number)[];
type ReportDef = {
  title: string;
  desc: string;
  freq: string;
  columns: string[];
  rows: Row[];
};

const money = (n: number) => `$${n.toLocaleString()}`;

const reports: ReportDef[] = [
  {
    title: "Daily report",
    desc: "Yesterday's revenue, orders, alerts.",
    freq: "Daily",
    columns: ["Metric", "Value", "Δ vs prev"],
    rows: [
      ["Revenue", money(kpis.revenue.value), `${kpis.revenue.delta}%`],
      ["Sales", kpis.sales.value, `${kpis.sales.delta}%`],
      ["Profit", money(kpis.profit.value), `${kpis.profit.delta}%`],
      ["Orders", kpis.orders.value, `${kpis.orders.delta}%`],
      ["Customers", kpis.customers.value, `${kpis.customers.delta}%`],
    ],
  },
  {
    title: "Weekly report",
    desc: "7-day performance across all KPIs.",
    freq: "Weekly",
    columns: ["Month", "Sales", "Revenue"],
    rows: salesTrend.slice(-7).map((s, i) => [s.name, s.value, revenueTrend.slice(-7)[i]?.value ?? 0]),
  },
  {
    title: "Monthly report",
    desc: "MoM comparison + AI narrative.",
    freq: "Monthly",
    columns: ["Month", "This year", "Last year"],
    rows: monthlyCompare.map((m) => [m.name, m.value, m.value2 ?? 0]),
  },
  {
    title: "Quarterly report",
    desc: "Board-ready summary and forecasts.",
    freq: "Quarterly",
    columns: ["Quarter", "Revenue", "Customers"],
    rows: [
      ["Q1", revenueTrend.slice(0, 3).reduce((s, x) => s + x.value, 0), customerGrowth.slice(0, 3).reduce((s, x) => s + x.value, 0)],
      ["Q2", revenueTrend.slice(3, 6).reduce((s, x) => s + x.value, 0), customerGrowth.slice(3, 6).reduce((s, x) => s + x.value, 0)],
      ["Q3", revenueTrend.slice(6, 9).reduce((s, x) => s + x.value, 0), customerGrowth.slice(6, 9).reduce((s, x) => s + x.value, 0)],
      ["Q4", revenueTrend.slice(9, 12).reduce((s, x) => s + x.value, 0), customerGrowth.slice(9, 12).reduce((s, x) => s + x.value, 0)],
    ],
  },
  {
    title: "Annual report",
    desc: "Year in review with cohort analysis.",
    freq: "Annual",
    columns: ["Product", "Category", "Sold", "Revenue", "Stock"],
    rows: topProducts.map((p) => [p.name, p.category, p.sold, money(p.revenue), p.stock]),
  },
  {
    title: "Marketing ROI",
    desc: "Channel + campaign breakdown.",
    freq: "Monthly",
    columns: ["Channel", "Share %"],
    rows: productMix.map((p) => [p.name, p.value]),
  },
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

function toCSV(r: ReportDef) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [r.columns.map(esc).join(","), ...r.rows.map((row) => row.map(esc).join(","))];
  return lines.join("\n");
}

function toXLS(r: ReportDef) {
  // Excel-friendly HTML table; opens cleanly in Excel/Numbers/Sheets as .xls
  const head = r.columns.map((c) => `<th>${c}</th>`).join("");
  const body = r.rows
    .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("");
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${r.title}</title></head><body><h2>${r.title}</h2><p>${r.desc}</p><table border="1" cellspacing="0" cellpadding="4"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;
}

function openPDF(r: ReportDef) {
  const head = r.columns.map((c) => `<th>${c}</th>`).join("");
  const body = r.rows
    .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${r.title}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#0f172a;padding:32px;max-width:900px;margin:auto}
      h1{margin:0 0 4px;font-size:24px}
      .desc{color:#64748b;margin-bottom:24px}
      .meta{font-size:12px;color:#64748b;margin-bottom:24px;text-transform:uppercase;letter-spacing:.1em}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th,td{padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:left}
      th{background:#f8fafc;font-weight:600;color:#334155}
      tr:nth-child(even) td{background:#fafafa}
      .brand{display:flex;align-items:center;gap:8px;color:#6366f1;font-weight:600;margin-bottom:16px}
      .brand span{width:24px;height:24px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:6px;display:inline-block}
      @media print{body{padding:0}}
    </style></head><body>
    <div class="brand"><span></span> BizPilot AI</div>
    <h1>${r.title}</h1>
    <div class="desc">${r.desc}</div>
    <div class="meta">${r.freq} · Generated ${new Date().toLocaleString()}</div>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
    </body></html>`;
  const w = window.open("", "_blank");
  if (!w) { toast.error("Popup blocked — allow popups to export PDF"); return; }
  w.document.write(html);
  w.document.close();
}

function printReport(r: ReportDef) {
  openPDF(r);
}

function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate and download daily, weekly, monthly, quarterly and annual reports."
        icon={FileText}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.title}>
            <div className="text-sm font-medium">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            <div className="text-[10px] uppercase tracking-widest text-primary mt-2">{r.freq}</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <button
                onClick={() => { openPDF(r); toast.success(`${r.title}: PDF ready`); }}
                className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"
              >
                <FileType className="h-3 w-3" /> PDF
              </button>
              <button
                onClick={() => { download(`${slug(r.title)}.xls`, toXLS(r), "application/vnd.ms-excel"); toast.success(`${r.title}: XLS downloaded`); }}
                className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"
              >
                <FileSpreadsheet className="h-3 w-3" /> XLS
              </button>
              <button
                onClick={() => { download(`${slug(r.title)}.csv`, toCSV(r), "text/csv;charset=utf-8"); toast.success(`${r.title}: CSV downloaded`); }}
                className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"
              >
                <Download className="h-3 w-3" /> CSV
              </button>
              <button
                onClick={() => printReport(r)}
                className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"
              >
                <Printer className="h-3 w-3" /> Print
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
