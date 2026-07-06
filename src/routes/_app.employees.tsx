import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { BarTrend } from "@/components/charts/Charts";
import { employees, kpis } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <>
      <PageHeader title="Employees" description="Employee list, attendance, performance, tasks and productivity analytics." icon={UserCog} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Employees" value={kpis.employees.value} delta={kpis.employees.delta} series={kpis.employees.series} />
        <KpiCard label="Avg attendance" value={94} delta={0.6} suffix="%" accent="success" />
        <KpiCard label="Avg performance" value={82} delta={2.3} suffix="%" accent="info" />
        <KpiCard label="Departments" value={7} delta={0.0} accent="warning" />
      </div>

      <Card className="mb-6"><H t="Productivity trend" /><BarTrend data={kpis.employees.series} color="var(--chart-4)" /></Card>

      <Card>
        <H t="Team" />
        <div className="grid md:grid-cols-2 gap-3">
          {employees.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/40 transition">
              <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-sm font-semibold text-white">{e.name[0]}</div>
              <div className="flex-1"><div className="text-sm font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.role} · {e.department}</div></div>
              <div className="text-right"><div className="text-sm tabular-nums">{e.performance}%</div><div className="text-[10px] text-muted-foreground">performance</div></div>
              <Badge tone={e.attendance >= 95 ? "success" : "warning"}>{e.attendance}%</Badge>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
function H({ t }: { t: string }) { return <div className="text-sm font-medium mb-3">{t}</div>; }
