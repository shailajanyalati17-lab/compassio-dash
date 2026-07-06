import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { PageHeader, Card } from "@/components/layout/PageHeader";
import { alerts } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/alerts")({
  component: AlertsPage,
});

const iconOf = { critical: AlertCircle, warning: AlertTriangle, info: Info } as const;
const toneOf = { critical: "border-destructive/40 bg-destructive/10 text-destructive", warning: "border-warning/40 bg-warning/10 text-warning", info: "border-info/40 bg-info/10 text-info" } as const;

function AlertsPage() {
  return (
    <>
      <PageHeader title="Alerts" description="Low stock, revenue drops, spikes, fraud detection and business risks." icon={ShieldAlert} />
      <div className="grid md:grid-cols-2 gap-4">
        {alerts.map((a) => {
          const Icon = iconOf[a.level as keyof typeof iconOf];
          return (
            <Card key={a.id} className="!p-0 overflow-hidden">
              <div className={`border-l-4 ${toneOf[a.level as keyof typeof toneOf]} p-4 flex items-start gap-3`}>
                <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.detail}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => toast.success("Alert acknowledged")} className="h-8 px-3 rounded-md bg-[image:var(--gradient-primary)] text-white text-xs font-medium">Acknowledge</button>
                    <button onClick={() => toast.info("Alert dismissed")} className="h-8 px-3 rounded-md border border-border text-xs">Dismiss</button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
