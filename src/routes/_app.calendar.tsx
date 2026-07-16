import { createFileRoute } from "@tanstack/react-router";
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { calendarEvents } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [month, setMonth] = useState(new Date(2026, 6, 1));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startOffset = first.getDay();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - startOffset + 1;
    return d > 0 && d <= days ? d : null;
  });

  const evByDay = (d: number) => {
    const ymd = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return calendarEvents.filter((e) => e.date === ymd);
  };

  return (
    <>
      <PageHeader title="Calendar" description="Team calendar, meetings, launches and reviews." icon={CalIcon} />
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-display font-semibold">
            {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-accent"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-accent"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs uppercase text-muted-foreground mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => (
            <div key={i} className={`min-h-24 rounded-lg border ${d ? "border-border bg-card/40" : "border-transparent"} p-2 text-xs`}>
              {d && (
                <>
                  <div className="text-muted-foreground">{d}</div>
                  <div className="mt-1 space-y-1">
                    {evByDay(d).map((e) => (
                      <div key={e.title} className="truncate rounded-md px-1.5 py-0.5 bg-primary/15 text-primary">{e.title}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6">
        <div className="text-sm font-medium mb-3">Upcoming events</div>
        <ul className="space-y-2">
          {calendarEvents.map((e) => (
            <li key={e.title} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition">
              <Badge tone="info">{e.date}</Badge>
              <span className="text-sm">{e.title}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
