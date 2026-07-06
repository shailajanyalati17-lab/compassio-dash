import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { orders } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="All orders across channels — search, filter and open details." icon={Receipt} />
      <Card>
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
              {orders.map((o) => (
                <tr key={o.id} onClick={() => toast.info(`Opening ${o.id}`)} className="border-b border-border/50 hover:bg-accent/40 cursor-pointer transition">
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
    </>
  );
}
