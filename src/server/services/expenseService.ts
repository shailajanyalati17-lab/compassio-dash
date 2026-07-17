import { connectDB } from "../config/db";
import { Expense } from "../models/Expense";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export type ExpenseInput = {
  title: string;
  category?: string;
  amount?: number;
  vendor?: string;
  status?: string;
  date?: string;
};

export async function listExpenses(params: { category?: string } = {}) {
  await connectDB();
  const query: any = {};
  if (params.category && params.category !== "all") query.category = params.category;
  const items = await Expense.find(query).sort({ createdAt: -1 });
  return toDTOList(items);
}

export async function createExpense(input: ExpenseInput) {
  await connectDB();
  const date = input.date ? new Date(input.date) : new Date();
  const doc = await Expense.create({
    ...input,
    date: date.toISOString().slice(0, 10),
    year: date.getFullYear(),
    month: date.getMonth(),
  });
  return toDTO(doc);
}

export async function updateExpense(id: string, patch: Partial<ExpenseInput>) {
  await connectDB();
  const doc = await Expense.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) throw notFound("Expense not found");
  return toDTO(doc);
}

export async function deleteExpense(id: string) {
  await connectDB();
  const doc = await Expense.findByIdAndDelete(id);
  if (!doc) throw notFound("Expense not found");
  return { success: true, id };
}

export async function expenseBreakdown() {
  await connectDB();
  const rows = await Expense.aggregate([
    { $group: { _id: "$category", value: { $sum: "$amount" } } },
    { $sort: { value: -1 } },
  ]);
  const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  return rows.map((r, i) => ({ name: r._id || "Other", value: Math.round(r.value), color: palette[i % 5] }));
}
