import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/mock-data";

const axis = { stroke: "oklch(0.55 0.02 260)", fontSize: 11 } as const;
const grid = { stroke: "oklch(0.28 0.02 265 / 0.6)", strokeDasharray: "3 3" } as const;
const tooltip = {
  contentStyle: {
    background: "oklch(0.20 0.022 265)",
    border: "1px solid oklch(1 0 0 / 0.08)",
    borderRadius: 12,
    color: "oklch(0.97 0.005 260)",
    fontSize: 12,
  },
  cursor: { fill: "oklch(1 0 0 / 0.03)" },
} as const;

export function LineTrend({ data, dataKey = "value", color = "var(--chart-1)" }: { data: SeriesPoint[]; dataKey?: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="name" {...axis} tickLine={false} axisLine={false} />
        <YAxis {...axis} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaTrend({ data, color = "var(--chart-2)" }: { data: SeriesPoint[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey="name" {...axis} tickLine={false} axisLine={false} />
        <YAxis {...axis} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#areaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarTrend({ data, color = "var(--chart-1)" }: { data: SeriesPoint[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="name" {...axis} tickLine={false} axisLine={false} />
        <YAxis {...axis} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CompareBars({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="name" {...axis} tickLine={false} axisLine={false} />
        <YAxis {...axis} tickLine={false} axisLine={false} />
        <Tooltip {...tooltip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="This year" dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        <Bar name="Last year" dataKey="value2" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutPie({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip {...tooltip} />
        <Pie data={data} dataKey="value" innerRadius={65} outerRadius={100} paddingAngle={3} stroke="none">
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
