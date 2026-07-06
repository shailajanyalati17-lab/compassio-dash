// Central mock dataset for BizPilot AI. Deterministic-ish demo data.

export type SeriesPoint = { name: string; value: number; value2?: number; value3?: number };

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const kpis = {
  revenue: { value: 128450, delta: 12.4, series: buildSeries(12, 8000, 18000) },
  sales: { value: 3421, delta: 8.2, series: buildSeries(12, 200, 500) },
  profit: { value: 42380, delta: 15.1, series: buildSeries(12, 2000, 6000) },
  orders: { value: 1284, delta: -2.3, series: buildSeries(12, 80, 220) },
  customers: { value: 8942, delta: 6.7, series: buildSeries(12, 500, 900) },
  inventory: { value: 12480, delta: -1.1, series: buildSeries(12, 1000, 1400) },
  employees: { value: 128, delta: 3.2, series: buildSeries(12, 100, 140) },
};

function buildSeries(n: number, min: number, max: number): SeriesPoint[] {
  return Array.from({ length: n }, (_, i) => ({
    name: months[i % 12],
    value: Math.round(min + Math.sin(i * 0.9) * (max - min) * 0.35 + (max - min) * 0.5 + ((i * 137) % (max - min)) * 0.15),
    value2: Math.round(min + Math.cos(i * 0.7) * (max - min) * 0.3 + (max - min) * 0.45),
  }));
}

export const salesTrend = buildSeries(12, 4000, 12000);
export const revenueTrend = buildSeries(12, 8000, 18000);
export const customerGrowth = buildSeries(12, 400, 900);
export const monthlyCompare = buildSeries(12, 3000, 9000);

export const productMix = [
  { name: "SaaS Plans", value: 42, color: "var(--chart-1)" },
  { name: "Enterprise", value: 27, color: "var(--chart-2)" },
  { name: "Add-ons", value: 15, color: "var(--chart-3)" },
  { name: "Services", value: 10, color: "var(--chart-4)" },
  { name: "Other", value: 6, color: "var(--chart-5)" },
];

export const topProducts = [
  { name: "Nimbus Pro", category: "SaaS", sold: 1284, revenue: 96420, stock: 320 },
  { name: "Atlas Cloud", category: "Enterprise", sold: 942, revenue: 141300, stock: 45 },
  { name: "Pulse Analytics", category: "Add-on", sold: 812, revenue: 24360, stock: 780 },
  { name: "Vector API", category: "Developer", sold: 601, revenue: 18030, stock: 0 },
  { name: "Beacon SEO", category: "Marketing", sold: 512, revenue: 15360, stock: 128 },
  { name: "Ledger Books", category: "Finance", sold: 402, revenue: 12060, stock: 6 },
];

export const customers = Array.from({ length: 24 }, (_, i) => ({
  id: `CUS-${1000 + i}`,
  name: [
    "Amelia Chen","Marcus Rivera","Priya Shah","Ethan Novak","Sofia Lang",
    "Jonas Weiss","Yuki Tanaka","Noah Reyes","Isabelle Roux","Omar Haddad",
    "Elena Petrov","Kai Andersen","Layla Osei","Diego Marín","Nora Lindgren",
    "Ravi Menon","Chloe Dubois","Aarav Gupta","Mila Kovács","Theo Blake",
    "Zara Hussain","Leo Fischer","Ava Nakamura","Adrian Costa"
  ][i],
  email: `user${i + 1}@bizpilot.ai`,
  plan: ["Free","Pro","Enterprise"][i % 3],
  ltv: Math.round(2000 + (i * 733) % 15000),
  orders: 3 + (i * 7) % 40,
  status: ["active","active","active","churn-risk","active","dormant"][i % 6],
  joined: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
}));

export const orders = Array.from({ length: 20 }, (_, i) => ({
  id: `ORD-${9000 + i}`,
  customer: customers[i % customers.length].name,
  product: topProducts[i % topProducts.length].name,
  total: Math.round(120 + (i * 313) % 4200),
  status: ["Paid","Pending","Shipped","Refunded","Paid","Paid"][i % 6],
  date: `2025-11-${String((i % 27) + 1).padStart(2, "0")}`,
}));

export const invoices = orders.slice(0, 12).map((o) => ({
  id: `INV-${2000 + parseInt(o.id.slice(4))}`,
  customer: o.customer,
  amount: o.total,
  status: ["Paid","Due","Overdue","Paid"][parseInt(o.id.slice(4)) % 4],
  date: o.date,
}));

export const employees = Array.from({ length: 14 }, (_, i) => ({
  id: `EMP-${100 + i}`,
  name: [
    "Sarah Kim","David Patel","Julia Weber","Tom Alvarez","Rin Sato",
    "Ben Novak","Emma Bishop","Luca Romano","Ava Novak","Sam Okafor",
    "Nina Rossi","Mia Johansson","Kojo Mensah","Iris Fournier"
  ][i],
  role: ["Engineer","Designer","PM","Sales","Support","Marketing","Finance"][i % 7],
  department: ["Engineering","Design","Product","Sales","Support","Marketing","Finance"][i % 7],
  performance: 60 + (i * 17) % 40,
  attendance: 88 + (i * 3) % 12,
}));

export const inventory = topProducts.map((p) => ({
  sku: p.name.split(" ").map(w => w[0]).join("") + "-" + (Math.floor(Math.random() * 999)).toString().padStart(3, "0"),
  name: p.name,
  category: p.category,
  stock: p.stock,
  reorder: p.stock < 50 ? "Reorder now" : p.stock < 200 ? "Monitor" : "OK",
  supplier: ["Northwind","Contoso","Fabrikam","Adventure Works"][topProducts.indexOf(p) % 4],
}));

export const campaigns = [
  { name: "Winter SaaS Launch", channel: "Email", spend: 12400, revenue: 68200, roi: 4.5, leads: 421, status: "Active" },
  { name: "LinkedIn Enterprise", channel: "Social", spend: 8200, revenue: 41800, roi: 4.1, leads: 132, status: "Active" },
  { name: "Google Search - Brand", channel: "SEM", spend: 5600, revenue: 22400, roi: 3.0, leads: 289, status: "Paused" },
  { name: "Retarget Cart", channel: "Display", spend: 2100, revenue: 9800, roi: 3.7, leads: 78, status: "Active" },
  { name: "Q4 Webinar Series", channel: "Content", spend: 3200, revenue: 15600, roi: 3.9, leads: 214, status: "Ended" },
];

export const notifications = [
  { id: 1, type: "revenue", title: "Revenue up 12% this week", body: "Q4 pace is 8% ahead of forecast.", time: "2m ago", unread: true },
  { id: 2, type: "inventory", title: "Low stock: Ledger Books", body: "Only 6 units remaining.", time: "18m ago", unread: true },
  { id: 3, type: "customer", title: "3 churn-risk customers detected", body: "AI flagged decreased activity.", time: "1h ago", unread: true },
  { id: 4, type: "marketing", title: "Winter SaaS Launch hit 421 leads", body: "ROI 4.5x — consider scaling budget.", time: "3h ago", unread: false },
  { id: 5, type: "employee", title: "Sarah Kim closed a $42k deal", body: "Enterprise expansion — Atlas Cloud.", time: "5h ago", unread: false },
  { id: 6, type: "revenue", title: "Refunds spiked 4% — check Vector API", body: "Anomaly detected by AI.", time: "1d ago", unread: false },
];

export const alerts = [
  { id: 1, level: "critical", title: "Vector API out of stock", detail: "0 units — losing ~$180/hr in demand." },
  { id: 2, level: "warning", title: "Revenue drop in EU-West", detail: "Down 7% vs 7-day average." },
  { id: 3, level: "info", title: "Sales spike in NA-East", detail: "+22% vs baseline in the last 3 hours." },
  { id: 4, level: "critical", title: "Fraud pattern detected on ORD-9017", detail: "Unusual velocity + mismatched geo." },
  { id: 5, level: "warning", title: "Unusual bulk order from CUS-1012", detail: "10x typical basket size." },
  { id: 6, level: "info", title: "Business risk: single-supplier exposure", detail: "62% of stock from Contoso." },
];

export const tasks = [
  { id: 1, title: "Review Q4 forecast with finance", assignee: "You", due: "Today", status: "In Progress", priority: "High" },
  { id: 2, title: "Approve Winter campaign budget", assignee: "Marcus R.", due: "Tomorrow", status: "Todo", priority: "Medium" },
  { id: 3, title: "Restock Vector API", assignee: "Ops", due: "Nov 12", status: "Blocked", priority: "High" },
  { id: 4, title: "1:1 with Sarah Kim", assignee: "You", due: "Nov 13", status: "Todo", priority: "Low" },
  { id: 5, title: "Publish monthly business review", assignee: "You", due: "Nov 20", status: "Todo", priority: "Medium" },
];

export const calendarEvents = [
  { date: "2025-11-10", title: "Board meeting" },
  { date: "2025-11-12", title: "Vendor call — Contoso" },
  { date: "2025-11-15", title: "Product launch: Nimbus Pro 2.0" },
  { date: "2025-11-18", title: "Marketing sync" },
  { date: "2025-11-22", title: "All-hands" },
  { date: "2025-11-28", title: "Q4 close prep" },
];

export const forecast = {
  sales: buildSeries(12, 4000, 14000),
  revenue: buildSeries(12, 8000, 20000),
  inventory: buildSeries(12, 900, 1600),
  demand: buildSeries(12, 300, 900),
  customers: buildSeries(12, 500, 1100),
  profit: buildSeries(12, 2000, 7000),
};

export const aiInsights = [
  "Revenue is trending 12% ahead of your Q4 forecast — driven by Atlas Cloud expansion in EU-West.",
  "3 customers show churn signals (login drop, support tickets rising). Suggested action: personalized outreach this week.",
  "Vector API stockouts are costing an estimated $4,300/day in missed revenue.",
  "Winter SaaS Launch is your best-ROI campaign (4.5x). Consider reallocating 20% of paused SEM budget.",
  "Profit margin improved 1.8pp month-over-month due to lower support cost per customer.",
];
