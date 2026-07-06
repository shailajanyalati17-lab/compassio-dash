import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: isAuthenticated ? "/dashboard" : "/auth/login", replace: true });
    }, 30);
    return () => clearTimeout(t);
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen grid place-items-center hero-bg">
      <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
        <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] animate-pulse-glow" />
        Loading BizPilot AI…
      </div>
    </div>
  );
}
