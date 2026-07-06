import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@bizpilot.ai");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to BizPilot AI");
      navigate({ to: "/dashboard", replace: true });
    } catch { toast.error("Could not sign in"); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-scale-in">
      <h1 className="text-3xl font-display font-semibold tracking-tight">Sign in to your workspace</h1>
      <p className="text-sm text-muted-foreground mt-2">Enter any email + password. This is a live demo.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded border-border bg-card" defaultChecked /> Remember me
          </label>
          <Link to="/auth/forgot" className="text-primary hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg bg-[image:var(--gradient-primary)] text-white font-medium glow-primary hover:brightness-110 transition inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
        </button>

        <div className="relative py-2 text-center">
          <div className="absolute inset-0 top-1/2 border-t border-border" />
          <span className="relative bg-background px-2 text-xs uppercase tracking-widest text-muted-foreground">or</span>
        </div>

        <button type="button" onClick={() => { toast.info("SSO demo — signing you in"); onSubmit(new Event("submit") as unknown as React.FormEvent); }}
          className="w-full h-11 rounded-lg border border-border bg-card hover:bg-accent transition text-sm font-medium">
          Continue with Google
        </button>

        <p className="text-sm text-center text-muted-foreground">
          New to BizPilot? <Link to="/auth/register" className="text-primary hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export function Field({
  icon: Icon, label, type = "text", value, onChange, placeholder,
}: { icon?: React.ComponentType<{ className?: string }>; label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      <div className="mt-1.5 flex items-center h-11 rounded-lg border border-border bg-card/60 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground mx-3" />}
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none pr-3 text-sm placeholder:text-muted-foreground"
          required
        />
      </div>
    </label>
  );
}
