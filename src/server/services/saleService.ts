import { connectDB } from "../config/db";
import { Sale } from "../models/Sale";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export type SaleInput = {
  product?: string;
  channel?: string;
  units?: number;
  revenue?: number;
  profit?: number;
  date?: string;
};

export async function listSales() {
  await connectDB();
  const items = await Sale.find().sort({ date: -1 }).limit(200);
  return toDTOList(items);
}

export async function createSale(input: SaleInput) {
  await connectDB();
  const date = input.date ? new Date(input.date) : new Date();
  const doc = await Sale.create({
    ...input,
    date,
    year: date.getFullYear(),
    month: date.getMonth(),
  });
  return toDTO(doc);
}

export async function updateSale(id: string, patch: Partial<SaleInput>) {
  await connectDB();
  const doc = await Sale.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) throw notFound("Sale not found");
  return toDTO(doc);
}

export async function deleteSale(id: string) {
  await connectDB();
  const doc = await Sale.findByIdAndDelete(id);
  if (!doc) throw notFound("Sale not found");
  return { success: true, id };
}

// Monthly revenue/profit/units series for charts (current year).
export async function salesSeries() {
  await connectDB();
  const rows = await Sale.aggregate([
    {
      $group: {
        _id: "$month",
        revenue: { $sum: "$revenue" },
        profit: { $sum: "$profit" },
        units: { $sum: "$units" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const byMonth = new Map(rows.map((r) => [r._id, r]));
  return MONTHS.map((name, i) => {
    const r = byMonth.get(i);
    return {
      name,
      value: Math.round(r?.revenue ?? 0),
      value2: Math.round(r?.profit ?? 0),
      units: Math.round(r?.units ?? 0),
    };
  });
}
