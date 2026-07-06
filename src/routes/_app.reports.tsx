import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Printer, FileSpreadsheet, FileType } from "lucide-react";
import { PageHeader, Card } from "@/components/layout/PageHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const reports = [
  { title: "Daily report", desc: "Yesterday's revenue, orders, alerts.", freq: "Daily" },
  { title: "Weekly report", desc: "7-day performance across all KPIs.", freq: "Weekly" },
  { title: "Monthly report", desc: "MoM comparison + AI narrative.", freq: "Monthly" },
  { title: "Quarterly report", desc: "Board-ready summary and forecasts.", freq: "Quarterly" },
  { title: "Annual report", desc: "Year in review with cohort analysis.", freq: "Annual" },
  { title: "Marketing ROI", desc: "Channel + campaign breakdown.", freq: "Monthly" },
];

function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Generate and download daily, weekly, monthly, quarterly and annual reports." icon={FileText} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.title}>
            <div className="text-sm font-medium">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            <div className="text-[10px] uppercase tracking-widest text-primary mt-2">{r.freq}</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <button onClick={() => toast.success(`${r.title}: PDF`)} className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"><FileType className="h-3 w-3" /> PDF</button>
              <button onClick={() => toast.success(`${r.title}: Excel`)} className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"><FileSpreadsheet className="h-3 w-3" /> XLS</button>
              <button onClick={() => toast.success(`${r.title}: CSV`)} className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"><Download className="h-3 w-3" /> CSV</button>
              <button onClick={() => window.print()} className="h-9 rounded-lg border border-border hover:bg-accent inline-flex items-center justify-center gap-1 text-xs"><Printer className="h-3 w-3" /> Print</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
