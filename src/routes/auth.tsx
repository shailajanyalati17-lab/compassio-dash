import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground overflow-hidden">
      {/* Left: form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10 animate-fade-in">
        <div className="flex items-center gap-2 mb-10">
          <div className="h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow-primary">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display font-semibold">BizPilot</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI</div>
          </div>
        </div>
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex relative hero-bg overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="max-w-md animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live business intelligence
            </div>
            <h2 className="text-4xl font-display font-semibold tracking-tight leading-tight">
              Turn your business data into <span className="gradient-text">decisions in seconds.</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-sm">
              AI-native analytics for revenue, sales, customers, inventory, marketing, and forecasting — all in one command center.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg animate-slide-up">
            {[
              { k: "128k", l: "Revenue this quarter" },
              { k: "8.9k", l: "Active customers" },
              { k: "4.5x", l: "Marketing ROI" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-xl p-4">
                <div className="text-2xl font-semibold font-display gradient-text">{s.k}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
