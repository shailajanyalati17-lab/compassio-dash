import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { SeriesPoint } from "@/lib/mock-data";

function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  const start = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const step = (t: number) => {
      if (start.current === null) start.current = t;
      const p = Math.min(1, (t - start.current) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export function KpiCard({
  label, value, delta, prefix, suffix, series, onClick, icon: Icon, accent = "primary",
}: {
  label: string;
  value: number;
  delta: number;
  prefix?: string;
  suffix?: string;
  series?: SeriesPoint[];
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "success" | "warning" | "info" | "destructive";
}) {
  const animated = useCountUp(value);
  const up = delta >= 0;
  const accentMap: Record<string, string> = {
    primary: "var(--chart-1)",
    success: "var(--chart-3)",
    warning: "var(--chart-4)",
    info: "var(--chart-2)",
    destructive: "var(--chart-5)",
  };
  const stroke = accentMap[accent];
  const gid = `spark-${label.replace(/\s/g, "")}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative text-left card-elevated rounded-2xl p-5 overflow-hidden transition-all w-full",
        "hover:-translate-y-0.5 hover:ring-1 hover:ring-primary/40 hover:shadow-[0_20px_60px_-20px_oklch(0_0_0_/_0.7)] cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
        </div>
        <span className={cn(
          "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
          up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
        )}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <div className="flex items-baseline gap-1 relative z-10">
        {prefix && <span className="text-lg text-muted-foreground">{prefix}</span>}
        <span className="text-3xl font-semibold font-display tracking-tight tabular-nums">
          {animated.toLocaleString()}
        </span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {series && (
        <div className="h-14 -mx-5 -mb-5 mt-2 opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} fill={`url(#${gid})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),oklch(0.72_0.18_265_/_0.08),transparent_40%)]" />
    </button>
  );
}
