import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { useState } from "react";
import { toast } from "sonner";
import { useLang, LANG_LABELS, type Lang } from "@/lib/i18n";
import { downloadBlob } from "@/lib/export-utils";
import { customers, orders, invoices } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

const tabs = ["General","Notifications","Security","Privacy","API Keys","Company","Billing"] as const;

function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("General");
  const { lang, setLang, t } = useLang();
  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace, security, keys and preferences." icon={SettingsIcon} />
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-xs px-3 py-1.5 rounded-full border transition ${tab === t ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-accent"}`}>{t}</button>
        ))}
      </div>

      <Card>
        {tab === "General" && (
          <div className="space-y-4">
            <Row label="Theme"><Badge tone="info">Dark (BizPilot)</Badge></Row>
            <Row label="Language"><select className="h-9 rounded-lg border border-border bg-card px-3 text-sm"><option>English (US)</option><option>English (UK)</option><option>Español</option><option>Deutsch</option></select></Row>
            <Row label="Timezone"><select className="h-9 rounded-lg border border-border bg-card px-3 text-sm"><option>UTC</option><option>America/New_York</option><option>Europe/Berlin</option><option>Asia/Tokyo</option></select></Row>
          </div>
        )}
        {tab === "Notifications" && (
          <div className="space-y-3">
            {["Revenue alerts","Inventory alerts","Marketing alerts","Employee alerts","Weekly digest"].map((n) => (
              <Row key={n} label={n}><Toggle defaultChecked /></Row>
            ))}
          </div>
        )}
        {tab === "Security" && (
          <div className="space-y-3">
            <Row label="Two-factor auth"><Toggle defaultChecked /></Row>
            <Row label="Session timeout"><select className="h-9 rounded-lg border border-border bg-card px-3 text-sm"><option>1 hour</option><option>4 hours</option><option>24 hours</option></select></Row>
            <button onClick={() => toast.success("Password change email sent")} className="h-9 px-3 rounded-lg border border-border hover:bg-accent text-sm">Change password</button>
          </div>
        )}
        {tab === "Privacy" && (
          <div className="space-y-3">
            <Row label="Data sharing (analytics)"><Toggle /></Row>
            <Row label="Personalized AI suggestions"><Toggle defaultChecked /></Row>
            <button onClick={() => toast.success("Export requested")} className="h-9 px-3 rounded-lg border border-border hover:bg-accent text-sm">Request data export</button>
          </div>
        )}
        {tab === "API Keys" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input readOnly value="bp_live_••••••••••••4a2f" className="flex-1 h-10 rounded-lg border border-border bg-card px-3 text-sm font-mono" />
              <button onClick={() => toast.success("Copied")} className="h-10 px-3 rounded-lg border border-border hover:bg-accent text-sm">Copy</button>
              <button onClick={() => toast.success("Rotated")} className="h-10 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium">Rotate</button>
            </div>
            <div className="text-xs text-muted-foreground">Keys are shown once. Store them securely.</div>
          </div>
        )}
        {tab === "Company" && (
          <div className="space-y-3">
            <Row label="Company name"><input defaultValue="BizPilot Inc." className="h-9 w-64 rounded-lg border border-border bg-card px-3 text-sm" /></Row>
            <Row label="Industry"><input defaultValue="SaaS" className="h-9 w-64 rounded-lg border border-border bg-card px-3 text-sm" /></Row>
            <Row label="Employees"><input defaultValue="128" className="h-9 w-64 rounded-lg border border-border bg-card px-3 text-sm" /></Row>
          </div>
        )}
        {tab === "Billing" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-medium">Business plan</div><div className="text-xs text-muted-foreground">$99/mo · Renews Dec 6, 2025</div></div>
              <button onClick={() => toast.info("Redirecting to billing…")} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium">Manage billing</button>
            </div>
            <div className="text-xs text-muted-foreground">Next invoice: $99.00</div>
          </div>
        )}
      </Card>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 py-2"><div className="text-sm">{label}</div><div>{children}</div></div>;
}
function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn((v) => !v)} className={`h-6 w-11 rounded-full relative transition ${on ? "bg-[image:var(--gradient-primary)]" : "bg-muted"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}
