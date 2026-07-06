import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./auth.login";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    setLoading(false);
    toast.success("Reset link sent (demo)");
    setTimeout(() => navigate({ to: "/auth/reset" }), 900);
  }

  return (
    <div className="animate-scale-in">
      <h1 className="text-3xl font-display font-semibold tracking-tight">Forgot your password?</h1>
      <p className="text-sm text-muted-foreground mt-2">Enter your email and we'll send you a reset link.</p>

      {sent ? (
        <div className="mt-8 rounded-xl border border-success/40 bg-success/10 p-4 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
          <div>
            <div className="font-medium">Check your inbox</div>
            <div className="text-sm text-muted-foreground">A reset link has been sent to {email}.</div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[image:var(--gradient-primary)] text-white font-medium glow-primary hover:brightness-110 transition inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      )}

      <p className="text-sm text-center text-muted-foreground mt-6">
        Remembered it? <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
