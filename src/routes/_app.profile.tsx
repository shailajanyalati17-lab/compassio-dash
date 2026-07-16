import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User as UserIcon, Camera, LogOut, X, Download, CreditCard } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import { invoices } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [billingOpen, setBillingOpen] = useState(false);

  // Compute a live renewal date (30 days from now) so it stays current
  const renew = new Date();
  renew.setDate(renew.getDate() + 30);
  const renewLabel = renew.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <PageHeader title="Profile" description="Your photo, business info, subscription, billing, and activity." icon={UserIcon} />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center text-3xl font-semibold text-white">{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
              <button onClick={() => toast.success("Upload photo (demo)")} className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card border border-border grid place-items-center hover:bg-accent">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <div className="text-lg font-display font-semibold">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>

          <div className="space-y-3">
            <Row label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" /></Row>
            <Row label="Company"><input value={company} onChange={(e) => setCompany(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm" /></Row>
            <Row label="Email"><input readOnly value={user?.email ?? ""} className="h-9 w-full rounded-lg border border-border bg-card/40 px-3 text-sm text-muted-foreground" /></Row>
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={() => { updateUser({ name, company }); toast.success("Profile saved"); }} className="h-10 px-4 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary">Save changes</button>
            <button onClick={() => { logout(); navigate({ to: "/auth/login" }); }} className="h-10 px-4 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive text-sm inline-flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="text-sm font-medium mb-2">Subscription</div>
            <div className="text-2xl font-semibold gradient-text font-display">Business</div>
            <div className="text-xs text-muted-foreground mt-1">$99/mo · Renews {renewLabel}</div>
            <button onClick={() => setBillingOpen(true)} className="mt-4 w-full h-9 rounded-lg border border-border hover:bg-accent text-sm inline-flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" /> Manage billing
            </button>
          </Card>
          <Card>
            <div className="text-sm font-medium mb-2">Recent activity</div>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>Signed in from Chrome · 2m ago</li>
              <li>Exported analytics report · 1h ago</li>
              <li>Approved campaign "Winter SaaS" · 3h ago</li>
              <li>Updated profile info · yesterday</li>
            </ul>
          </Card>
        </div>
      </div>

      {billingOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setBillingOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <div className="text-lg font-display font-semibold">Manage billing</div>
                <div className="text-xs text-muted-foreground">Business plan · Renews {renewLabel}</div>
              </div>
              <button onClick={() => setBillingOpen(false)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <div className="text-xs text-muted-foreground">Payment method</div>
                  <div className="mt-1 font-medium">Visa •••• 4242</div>
                  <button onClick={() => toast.success("Card updated (demo)")} className="mt-2 text-xs text-primary hover:underline">Update card</button>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-xs text-muted-foreground">Billing email</div>
                  <div className="mt-1 font-medium truncate">{user?.email}</div>
                  <button onClick={() => toast.info("Email change sent")} className="mt-2 text-xs text-primary hover:underline">Change</button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Invoices</div>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-accent/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium">Invoice</th>
                        <th className="text-left px-3 font-medium">Date</th>
                        <th className="text-left px-3 font-medium">Amount</th>
                        <th className="text-left px-3 font-medium">Status</th>
                        <th className="px-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.slice(0, 6).map((inv) => (
                        <tr key={inv.id} className="border-t border-border">
                          <td className="py-2 px-3 font-mono text-xs">{inv.id}</td>
                          <td className="px-3 text-muted-foreground">{inv.date}</td>
                          <td className="px-3 tabular-nums">${inv.amount.toLocaleString()}</td>
                          <td className="px-3"><Badge tone={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "destructive" : "warning"}>{inv.status}</Badge></td>
                          <td className="px-3 text-right">
                            <button onClick={() => toast.success(`Downloaded ${inv.id}.pdf`)} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                              <Download className="h-3 w-3" /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => { toast.success("Plan changed to Enterprise (demo)"); }} className="h-9 px-4 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm">Upgrade plan</button>
                <button onClick={() => toast.info("Subscription paused")} className="h-9 px-4 rounded-lg border border-border hover:bg-accent text-sm">Pause</button>
                <button onClick={() => toast.error("Cancellation scheduled")} className="h-9 px-4 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive text-sm">Cancel plan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</div>{children}</div>;
}
