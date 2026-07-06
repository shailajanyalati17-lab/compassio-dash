import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User as UserIcon, Camera, LogOut } from "lucide-react";
import { PageHeader, Card } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");

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
            <div className="text-xs text-muted-foreground mt-1">$99/mo · Renews Dec 6, 2025</div>
            <button onClick={() => toast.info("Manage billing")} className="mt-4 w-full h-9 rounded-lg border border-border hover:bg-accent text-sm">Manage billing</button>
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
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</div>{children}</div>;
}
