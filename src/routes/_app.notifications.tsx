import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Check } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { notifications as seed } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();
  const shown = items.filter((n) => filter === "all" || n.type === filter);
  const unread = items.filter((n) => n.unread).length;

  const targetOf = (type: string) => ({
    revenue: "/analytics", inventory: "/inventory", customer: "/customers",
    marketing: "/marketing", employee: "/employees",
  }[type] || "/dashboard") as "/analytics" | "/inventory" | "/customers" | "/marketing" | "/employees" | "/dashboard";

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${unread} unread — revenue, inventory, customer, marketing and employee alerts.`}
        icon={Bell}
        actions={
          <button onClick={() => { setItems((it) => it.map((n) => ({ ...n, unread: false }))); toast.success("All marked as read"); }} className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-accent text-sm inline-flex items-center gap-2">
            <Check className="h-4 w-4" /> Mark all read
          </button>
        }
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {["all","revenue","inventory","customer","marketing","employee"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"}`}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card>
        <ul className="divide-y divide-border">
          {shown.map((n) => (
            <li key={n.id}
              onClick={() => { setItems((it) => it.map((x) => x.id === n.id ? { ...x, unread: false } : x)); navigate({ to: targetOf(n.type) }); }}
              className="py-3 flex items-start gap-3 cursor-pointer hover:bg-accent/40 rounded-lg px-2 transition">
              <div className={`h-2 w-2 mt-2 rounded-full ${n.unread ? "bg-primary animate-pulse" : "bg-muted"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{n.title}</div>
                  <Badge tone="info">{n.type}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
