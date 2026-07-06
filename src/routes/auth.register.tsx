import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Field } from "./auth.login";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name || "Founder", email, password);
      toast.success("Account created — welcome!");
      navigate({ to: "/dashboard", replace: true });
    } catch { toast.error("Registration failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-scale-in">
      <h1 className="text-3xl font-display font-semibold tracking-tight">Start your free workspace</h1>
      <p className="text-sm text-muted-foreground mt-2">14-day trial. No credit card required.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field icon={User} label="Full name" value={name} onChange={setName} placeholder="Alex Morgan" />
        <Field icon={Mail} label="Work email" type="email" value={email} onChange={setEmail} placeholder="alex@company.com" />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg bg-[image:var(--gradient-primary)] text-white font-medium glow-primary hover:brightness-110 transition inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
