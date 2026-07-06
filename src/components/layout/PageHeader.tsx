import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title, description, icon: Icon, actions,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 animate-fade-in">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="h-11 w-11 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center glow-primary shrink-0">
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("mb-8 animate-slide-up", className)}>{children}</section>;
}

export function Card({ children, className, onClick, interactive }: {
  children: ReactNode; className?: string; onClick?: () => void; interactive?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "card-elevated rounded-2xl p-5 transition-all",
        (interactive || onClick) && "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_oklch(0_0_0_/_0.7)] hover:ring-1 hover:ring-primary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "destructive" | "info" }) {
  const map = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
  } as const;
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", map[tone])}>{children}</span>;
}
