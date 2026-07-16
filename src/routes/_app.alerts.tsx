import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { PageHeader, Card } from "@/components/layout/PageHeader";
import { alerts as seed } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/alerts")({
  component: AlertsPage,
});

const iconOf = { critical: AlertCircle, warning: AlertTriangle, info: Info } as const;
const toneOf = {
  critical: "border-destructive/40 bg-destructive/10 text-destructive",
  warning: "border-warning/40 bg-warning/10 text-warning",
  info: "border-info/40 bg-info/10 text-info",
} as const;

function AlertsPage() {
  const [items, setItems] = useState(seed);
  const [acked, setAcked] = useState<number[]>([]);

  const remove = (id: number) => setItems((xs) => xs.filter((x) => x.id !== id));
  const ack = (id: number) => {
    setAcked((a) => [...a, id]);
    toast.success("Alert acknowledged");
    setTimeout(() => remove(id), 400);
  };
  const dismiss = (id: number) => {
    toast.info("Alert dismissed");
    remove(id);
  };

  return (
    <>
      <PageHeader
        title="Alerts"
        description="Low stock, revenue drops, spikes, fraud detection and business risks."
        icon={ShieldAlert}
      />

      {items.length === 0 ? (
        <Card className="text-center py-16">
          <CheckCircle2 className="h-10 w-10 mx-auto text-success mb-3" />
          <div className="text-lg font-display font-semibold">All clear</div>
          <div className="text-sm text-muted-foreground mt-1">No active alerts right now.</div>
          <button
            onClick={() => { setItems(seed); setAcked([]); }}
            className="mt-4 h-9 px-4 rounded-lg border border-border hover:bg-accent text-sm"
          >
            Reload demo alerts
          </button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((a) => {
            const Icon = iconOf[a.level as keyof typeof iconOf];
            const isAcked = acked.includes(a.id);
            return (
              <Card key={a.id} className={`!p-0 overflow-hidden transition ${isAcked ? "opacity-50" : ""}`}>
                <div className={`border-l-4 ${toneOf[a.level as keyof typeof toneOf]} p-4 flex items-start gap-3`}>
                  <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.detail}</div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => ack(a.id)}
                        disabled={isAcked}
                        className="h-8 px-3 rounded-md bg-[image:var(--gradient-primary)] text-white text-xs font-medium disabled:opacity-60"
                      >
                        {isAcked ? "Acknowledged" : "Acknowledge"}
                      </button>
                      <button
                        onClick={() => dismiss(a.id)}
                        className="h-8 px-3 rounded-md border border-border text-xs hover:bg-accent"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
