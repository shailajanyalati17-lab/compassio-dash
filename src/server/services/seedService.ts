import { connectDB } from "../config/db";
import { Product } from "../models/Product";
import { Customer } from "../models/Customer";
import { Order } from "../models/Order";
import { Sale } from "../models/Sale";
import { Inventory } from "../models/Inventory";
import { Expense } from "../models/Expense";
import { Notification } from "../models/Notification";
import { Employee, Campaign, Task, CalendarEvent, Alert, Insight } from "../models/misc";

const MONTHS = 12;

const BASE_PRODUCTS = [
  { name: "Nimbus Pro", category: "SaaS", sold: 1284, revenue: 96420, stock: 320, price: 75, cost: 30, supplier: "Northwind" },
  { name: "Atlas Cloud", category: "Enterprise", sold: 942, revenue: 141300, stock: 45, price: 150, cost: 60, supplier: "Contoso" },
  { name: "Pulse Analytics", category: "Add-on", sold: 812, revenue: 24360, stock: 780, price: 30, cost: 12, supplier: "Fabrikam" },
  { name: "Vector API", category: "Developer", sold: 601, revenue: 18030, stock: 0, price: 30, cost: 9, supplier: "Adventure Works" },
  { name: "Beacon SEO", category: "Marketing", sold: 512, revenue: 15360, stock: 128, price: 30, cost: 10, supplier: "Northwind" },
  { name: "Ledger Books", category: "Finance", sold: 402, revenue: 12060, stock: 6, price: 30, cost: 11, supplier: "Contoso" },
];

const CUSTOMER_NAMES = [
  "Amelia Chen","Marcus Rivera","Priya Shah","Ethan Novak","Sofia Lang","Jonas Weiss",
  "Yuki Tanaka","Noah Reyes","Isabelle Roux","Omar Haddad","Elena Petrov","Kai Andersen",
  "Layla Osei","Diego Marín","Nora Lindgren","Ravi Menon","Chloe Dubois","Aarav Gupta",
  "Mila Kovács","Theo Blake","Zara Hussain","Leo Fischer","Ava Nakamura","Adrian Costa",
];

const EMPLOYEE_NAMES = [
  "Sarah Kim","David Patel","Julia Weber","Tom Alvarez","Rin Sato","Ben Novak","Emma Bishop",
  "Luca Romano","Ava Novak","Sam Okafor","Nina Rossi","Mia Johansson","Kojo Mensah","Iris Fournier",
];

export async function seedDatabase() {
  await connectDB();

  await Promise.all([
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Order.deleteMany({}),
    Sale.deleteMany({}),
    Inventory.deleteMany({}),
    Expense.deleteMany({}),
    Notification.deleteMany({}),
    Employee.deleteMany({}),
    Campaign.deleteMany({}),
    Task.deleteMany({}),
    CalendarEvent.deleteMany({}),
    Alert.deleteMany({}),
    Insight.deleteMany({}),
  ]);

  const year = new Date().getFullYear();

  // Products
  const products = await Product.insertMany(
    BASE_PRODUCTS.map((p) => ({
      ...p,
      sku: p.name.split(" ").map((w) => w[0]).join("").toUpperCase() + "-" + Math.floor(100 + Math.random() * 900),
      status: "active",
    })),
  );

  // Inventory mirrors products
  await Inventory.insertMany(
    products.map((p) => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      productId: p._id,
      stock: p.stock,
      reorderLevel: 50,
      supplier: p.supplier,
    })),
  );

  // Customers
  const customers = await Customer.insertMany(
    CUSTOMER_NAMES.map((name, i) => ({
      name,
      email: `user${i + 1}@compassio.ai`,
      plan: ["Free", "Pro", "Enterprise"][i % 3],
      ltv: Math.round(2000 + ((i * 733) % 15000)),
      orders: 3 + ((i * 7) % 40),
      status: ["active", "active", "active", "churn-risk", "active", "dormant"][i % 6],
      joined: `${year - 1}-${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
      createdAt: new Date(year, i % 12, ((i * 3) % 27) + 1),
    })),
  );

  // Orders (spread across the year)
  const orderDocs = Array.from({ length: 40 }, (_, i) => {
    const product = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
    const qty = 1 + (i % 5);
    return {
      customer: customers[i % customers.length].name,
      customerId: customers[i % customers.length]._id,
      product: product.name,
      productId: products[i % products.length]._id,
      quantity: qty,
      total: Math.round(product.price * qty),
      status: ["Paid", "Pending", "Shipped", "Refunded", "Paid", "Paid"][i % 6],
      paymentStatus: ["Paid", "Unpaid", "Paid", "Refunded"][i % 4],
      date: `${year}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      createdAt: new Date(year, i % 12, (i % 27) + 1),
    };
  });
  await Order.insertMany(orderDocs);

  // Sales (monthly, per product) — drives revenue/profit/units charts
  const saleDocs: any[] = [];
  for (let m = 0; m < MONTHS; m++) {
    for (const p of BASE_PRODUCTS) {
      const units = Math.round((p.sold / MONTHS) * (0.7 + Math.sin(m * 0.8) * 0.3 + Math.random() * 0.3));
      const revenue = units * p.price;
      const profit = units * (p.price - p.cost);
      saleDocs.push({
        product: p.name,
        channel: ["Direct", "Partner", "Online", "Reseller"][m % 4],
        units,
        revenue,
        profit,
        year,
        month: m,
        date: new Date(year, m, 15),
      });
    }
  }
  await Sale.insertMany(saleDocs);

  // Expenses
  const expenseCats = ["Payroll", "Marketing", "Infrastructure", "Operations", "Software"];
  const expenseDocs: any[] = [];
  for (let m = 0; m < MONTHS; m++) {
    for (const cat of expenseCats) {
      expenseDocs.push({
        title: `${cat} — ${MONTHS_SHORT[m]}`,
        category: cat,
        amount: Math.round(2000 + Math.random() * 12000),
        vendor: ["Contoso", "Northwind", "Fabrikam", "Adventure Works"][m % 4],
        status: ["Paid", "Due", "Overdue", "Paid"][m % 4],
        date: `${year}-${String(m + 1).padStart(2, "0")}-05`,
        year,
        month: m,
      });
    }
  }
  await Expense.insertMany(expenseDocs);

  // Employees
  await Employee.insertMany(
    EMPLOYEE_NAMES.map((name, i) => ({
      name,
      role: ["Engineer", "Designer", "PM", "Sales", "Support", "Marketing", "Finance"][i % 7],
      department: ["Engineering", "Design", "Product", "Sales", "Support", "Marketing", "Finance"][i % 7],
      performance: 60 + ((i * 17) % 40),
      attendance: 88 + ((i * 3) % 12),
    })),
  );

  // Campaigns
  await Campaign.insertMany([
    { name: "Winter SaaS Launch", channel: "Email", spend: 12400, revenue: 68200, roi: 4.5, leads: 421, status: "Active" },
    { name: "LinkedIn Enterprise", channel: "Social", spend: 8200, revenue: 41800, roi: 4.1, leads: 132, status: "Active" },
    { name: "Google Search - Brand", channel: "SEM", spend: 5600, revenue: 22400, roi: 3.0, leads: 289, status: "Paused" },
    { name: "Retarget Cart", channel: "Display", spend: 2100, revenue: 9800, roi: 3.7, leads: 78, status: "Active" },
    { name: "Q4 Webinar Series", channel: "Content", spend: 3200, revenue: 15600, roi: 3.9, leads: 214, status: "Ended" },
  ]);

  // Tasks
  await Task.insertMany([
    { title: "Review Q4 forecast with finance", assignee: "You", due: "Today", status: "In Progress", priority: "High" },
    { title: "Approve Winter campaign budget", assignee: "Marcus R.", due: "Tomorrow", status: "Todo", priority: "Medium" },
    { title: "Restock Vector API", assignee: "Ops", due: "Nov 12", status: "Blocked", priority: "High" },
    { title: "1:1 with Sarah Kim", assignee: "You", due: "Nov 13", status: "Todo", priority: "Low" },
    { title: "Publish monthly business review", assignee: "You", due: "Nov 20", status: "Todo", priority: "Medium" },
  ]);

  // Calendar events
  await CalendarEvent.insertMany([
    { date: `${year}-07-06`, title: "Board meeting" },
    { date: `${year}-07-09`, title: "Vendor call — Contoso" },
    { date: `${year}-07-15`, title: "Product launch: Nimbus Pro 2.0" },
    { date: `${year}-07-20`, title: "Marketing sync" },
    { date: `${year}-07-23`, title: "All-hands" },
    { date: `${year}-07-29`, title: "Q3 close prep" },
  ]);

  // Alerts
  await Alert.insertMany([
    { level: "critical", title: "Vector API out of stock", detail: "0 units — losing ~$180/hr in demand." },
    { level: "warning", title: "Revenue drop in EU-West", detail: "Down 7% vs 7-day average." },
    { level: "info", title: "Sales spike in NA-East", detail: "+22% vs baseline in the last 3 hours." },
    { level: "critical", title: "Fraud pattern detected on ORD-9017", detail: "Unusual velocity + mismatched geo." },
    { level: "warning", title: "Unusual bulk order from CUS-1012", detail: "10x typical basket size." },
    { level: "info", title: "Business risk: single-supplier exposure", detail: "62% of stock from Contoso." },
  ]);

  // Notifications
  await Notification.insertMany([
    { type: "revenue", title: "Revenue up 12% this week", body: "Q4 pace is 8% ahead of forecast.", unread: true },
    { type: "inventory", title: "Low stock: Ledger Books", body: "Only 6 units remaining.", unread: true },
    { type: "customer", title: "3 churn-risk customers detected", body: "AI flagged decreased activity.", unread: true },
    { type: "marketing", title: "Winter SaaS Launch hit 421 leads", body: "ROI 4.5x — consider scaling budget.", unread: false },
    { type: "employee", title: "Sarah Kim closed a $42k deal", body: "Enterprise expansion — Atlas Cloud.", unread: false },
    { type: "revenue", title: "Refunds spiked 4% — check Vector API", body: "Anomaly detected by AI.", unread: false },
  ]);

  // Insights
  await Insight.insertMany([
    { order: 0, text: "Revenue is trending 12% ahead of your Q4 forecast — driven by Atlas Cloud expansion in EU-West." },
    { order: 1, text: "3 customers show churn signals (login drop, support tickets rising). Suggested action: personalized outreach this week." },
    { order: 2, text: "Vector API stockouts are costing an estimated $4,300/day in missed revenue." },
    { order: 3, text: "Winter SaaS Launch is your best-ROI campaign (4.5x). Consider reallocating 20% of paused SEM budget." },
    { order: 4, text: "Profit margin improved 1.8pp month-over-month due to lower support cost per customer." },
  ]);

  return { success: true, seededAt: new Date().toISOString() };
}

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
