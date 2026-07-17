import { connectDB } from "../config/db";
import { Product } from "../models/Product";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export type ProductInput = {
  name: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  sku?: string;
  supplier?: string;
  image?: string;
  description?: string;
};

export async function listProducts(params: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
} = {}) {
  await connectDB();
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 50));
  const query: any = {};
  if (params.search) query.name = { $regex: params.search, $options: "i" };
  if (params.category && params.category !== "all") query.category = params.category;

  const [items, total] = await Promise.all([
    Product.find(query).sort({ revenue: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    items: toDTOList(items),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

export async function getProduct(id: string) {
  await connectDB();
  const doc = await Product.findById(id);
  if (!doc) throw notFound("Product not found");
  return toDTO(doc);
}

export async function createProduct(input: ProductInput) {
  await connectDB();
  const sku =
    input.sku ||
    input.name.split(" ").map((w) => w[0]).join("").toUpperCase() +
      "-" +
      Math.floor(100 + Math.random() * 900);
  const doc = await Product.create({ ...input, sku });
  return toDTO(doc);
}

export async function updateProduct(id: string, patch: Partial<ProductInput>) {
  await connectDB();
  const doc = await Product.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) throw notFound("Product not found");
  return toDTO(doc);
}

export async function deleteProduct(id: string) {
  await connectDB();
  const doc = await Product.findByIdAndDelete(id);
  if (!doc) throw notFound("Product not found");
  return { success: true, id };
}

// Product mix (share of revenue by category) for the dashboard donut chart.
export async function productMix() {
  await connectDB();
  const rows = await Product.aggregate([
    { $group: { _id: "$category", value: { $sum: "$revenue" } } },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);
  const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  return rows.map((r, i) => ({ name: r._id || "Other", value: Math.round(r.value), color: palette[i % 5] }));
}
