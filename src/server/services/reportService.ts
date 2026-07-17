import { connectDB } from "../config/db";
import { Report } from "../models/Report";
import { Sale } from "../models/Sale";
import { Expense } from "../models/Expense";
import { Order } from "../models/Order";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export async function listReports(params: { type?: string } = {}) {
  await connectDB();
  const query: any = {};
  if (params.type && params.type !== "all") query.type = params.type;
  const items = await Report.find(query).sort({ createdAt: -1 });
  return toDTOList(items);
}

// Generate a report snapshot from live data for a given period type.
export async function generateReport(input: { type: string; title?: string; userId?: string }) {
  await connectDB();
  const [rev, prof, exp, orders] = await Promise.all([
    Sale.aggregate([{ $group: { _id: null, total: { $sum: "$revenue" } } }]),
    Sale.aggregate([{ $group: { _id: null, total: { $sum: "$profit" } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Order.countDocuments(),
  ]);
  const revenue = Math.round(rev[0]?.total ?? 0);
  const expenses = Math.round(exp[0]?.total ?? 0);
  const profit = Math.round(prof[0]?.total ?? revenue - expenses);
  const now = new Date();
  const doc = await Report.create({
    title: input.title || `${input.type[0].toUpperCase()}${input.type.slice(1)} Report`,
    type: input.type,
    period: now.toISOString().slice(0, 10),
    revenue,
    expenses,
    profit,
    orders,
    generatedBy: input.userId,
  });
  return toDTO(doc);
}

export async function deleteReport(id: string) {
  await connectDB();
  const doc = await Report.findByIdAndDelete(id);
  if (!doc) throw notFound("Report not found");
  return { success: true, id };
}
