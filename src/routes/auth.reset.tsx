import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./auth.login";

export const Route = createFileRoute("/auth/reset")({
  component: ResetPage,
});

function ResetPage() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) return toast.error("Passwords don't match");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Password updated");
    navigate({ to: "/auth/login" });
  }

  return (
    <div className="animate-scale-in">
      <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest mb-3">
        <ShieldCheck className="h-4 w-4" /> Password reset
      </div>
      <h1 className="text-3xl font-display font-semibold tracking-tight">Set a new password</h1>
      <p className="text-sm text-muted-foreground mt-2">Choose something strong — 8+ characters, mix of letters and numbers.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field icon={Lock} label="New password" type="password" value={pw} onChange={setPw} placeholder="••••••••" />
        <Field icon={Lock} label="Confirm password" type="password" value={pw2} onChange={setPw2} placeholder="••••••••" />
        <button
          type="submit" disabled={loading}
          className="w-full h-11 rounded-lg bg-[image:var(--gradient-primary)] text-white font-medium glow-primary hover:brightness-110 transition inline-flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </button>
        <p className="text-sm text-center text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}
