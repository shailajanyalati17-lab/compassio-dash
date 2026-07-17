import { connectDB } from "../config/db";
import { Sale } from "../models/Sale";
import { Order } from "../models/Order";
import { Customer } from "../models/Customer";
import { Product } from "../models/Product";
import { Inventory } from "../models/Inventory";
import { Expense } from "../models/Expense";
import { Employee } from "../models/misc";
import { toDTOList } from "../utils/serialize";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type Point = { name: string; value: number; value2?: number };

function monthArray(map: Map<number, number>, secondary?: Map<number, number>): Point[] {
  return MONTHS.map((name, i) => ({
    name,
    value: Math.round(map.get(i) ?? 0),
    ...(secondary ? { value2: Math.round(secondary.get(i) ?? 0) } : {}),
  }));
}

function delta(series: Point[]): number {
  const nonZero = series.filter((p) => p.value > 0);
  if (nonZero.length < 2) return 0;
  const last = series[series.length - 1].value;
  const prev = series[series.length - 2].value || 1;
  return Math.round(((last - prev) / prev) * 1000) / 10;
}

async function saleMonthMaps() {
  const rows = await Sale.aggregate([
    {
      $group: {
        _id: "$month",
        revenue: { $sum: "$revenue" },
        profit: { $sum: "$profit" },
        units: { $sum: "$units" },
      },
    },
  ]);
  const revenue = new Map<number, number>();
  const profit = new Map<number, number>();
  const units = new Map<number, number>();
  for (const r of rows) {
    revenue.set(r._id, r.revenue);
    profit.set(r._id, r.profit);
    units.set(r._id, r.units);
  }
  return { revenue, profit, units };
}

async function orderMonthMap() {
  const rows = await Order.aggregate([
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
  ]);
  const map = new Map<number, number>();
  for (const r of rows) map.set(r._id - 1, r.count);
  return map;
}

async function customerMonthMap() {
  const rows = await Customer.aggregate([
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  // Cumulative growth
  const map = new Map<number, number>();
  let running = 0;
  for (let i = 0; i < 12; i++) {
    const found = rows.find((r) => r._id - 1 === i);
    running += found?.count ?? 0;
    if (running > 0) map.set(i, running);
  }
  return map;
}

export async function getDashboard() {
  await connectDB();
  const [
    sales,
    orderMap,
    custGrowth,
    revenueAgg,
    profitAgg,
    ordersCount,
    customersCount,
    productsCount,
    inventoryAgg,
    employeesCount,
    expenseAgg,
    recentOrders,
    recentCustomers,
    lowStockItems,
    topProducts,
  ] = await Promise.all([
    saleMonthMaps(),
    orderMonthMap(),
    customerMonthMap(),
    Sale.aggregate([{ $group: { _id: null, total: { $sum: "$revenue" } } }]),
    Sale.aggregate([{ $group: { _id: null, total: { $sum: "$profit" } } }]),
    Order.countDocuments(),
    Customer.countDocuments(),
    Product.countDocuments(),
    Inventory.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]),
    Employee.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Order.find().sort({ createdAt: -1 }).limit(6),
    Customer.find().sort({ createdAt: -1 }).limit(6),
    Inventory.find({ $expr: { $lt: ["$stock", "$reorderLevel"] } }).sort({ stock: 1 }).limit(6),
    Product.find().sort({ revenue: -1 }).limit(6),
  ]);

  const revenueSeries = monthArray(sales.revenue, sales.profit);
  const profitSeries = monthArray(sales.profit);
  const salesSeries = monthArray(sales.units);
  const ordersSeries = monthArray(orderMap);
  const customerSeries = monthArray(custGrowth);
  const inventoryTotal = inventoryAgg[0]?.total ?? 0;
  const revenueTotal = revenueAgg[0]?.total ?? 0;
  const profitTotal = profitAgg[0]?.total ?? 0;
  const salesUnits = [...sales.units.values()].reduce((a, b) => a + b, 0);

  return {
    kpis: {
      revenue: { value: Math.round(revenueTotal), delta: delta(revenueSeries), series: revenueSeries },
      sales: { value: salesUnits, delta: delta(salesSeries), series: salesSeries },
      profit: { value: Math.round(profitTotal), delta: delta(profitSeries), series: profitSeries },
      orders: { value: ordersCount, delta: delta(ordersSeries), series: ordersSeries },
      customers: { value: customersCount, delta: delta(customerSeries), series: customerSeries },
      inventory: { value: inventoryTotal, delta: 0, series: monthArray(sales.units) },
      employees: { value: employeesCount, delta: 0, series: customerSeries },
    },
    expensesTotal: Math.round(expenseAgg[0]?.total ?? 0),
    productsCount,
    charts: {
      revenue: revenueSeries,
      sales: salesSeries,
      profit: profitSeries,
      orders: ordersSeries,
      customerGrowth: customerSeries,
    },
    recentOrders: toDTOList(recentOrders),
    recentCustomers: toDTOList(recentCustomers),
    lowStock: toDTOList(lowStockItems),
    topProducts: toDTOList(topProducts),
  };
}

// Forecast: naive projection using average growth of the last known months.
export async function getForecast() {
  await connectDB();
  const sales = await saleMonthMaps();
  const custGrowth = await customerMonthMap();

  function project(map: Map<number, number>): Point[] {
    const base = MONTHS.map((name, i) => ({ name, value: Math.round(map.get(i) ?? 0) }));
    const known = base.filter((p) => p.value > 0);
    const avg = known.length ? known.reduce((a, b) => a + b.value, 0) / known.length : 0;
    const growth = 1.06;
    let last = known.length ? known[known.length - 1].value : avg;
    return base.map((p) => {
      if (p.value > 0) return p;
      last = Math.round(last * growth || avg);
      return { name: p.name, value: last };
    });
  }

  return {
    revenue: project(sales.revenue),
    profit: project(sales.profit),
    sales: project(sales.units),
    customers: project(custGrowth),
    demand: project(sales.units),
    inventory: project(sales.units),
  };
}
