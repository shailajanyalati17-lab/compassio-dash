import { connectDB } from "../config/db";
import { Inventory } from "../models/Inventory";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export type InventoryInput = {
  sku: string;
  name: string;
  category?: string;
  stock?: number;
  reorderLevel?: number;
  supplier?: string;
};

function withReorder(dto: any) {
  const level = dto.reorderLevel ?? 50;
  dto.reorder =
    dto.stock < Math.min(50, level)
      ? "Reorder now"
      : dto.stock < Math.max(200, level * 4)
        ? "Monitor"
        : "OK";
  return dto;
}

export async function listInventory(params: { search?: string } = {}) {
  await connectDB();
  const query: any = {};
  if (params.search) query.name = { $regex: params.search, $options: "i" };
  const items = await Inventory.find(query).sort({ stock: 1 });
  return toDTOList(items).map(withReorder);
}

export async function lowStock() {
  await connectDB();
  const items = await Inventory.find({ $expr: { $lt: ["$stock", "$reorderLevel"] } }).sort({ stock: 1 });
  return toDTOList(items).map(withReorder);
}

export async function createInventory(input: InventoryInput) {
  await connectDB();
  const doc = await Inventory.create(input);
  return withReorder(toDTO(doc));
}

export async function updateInventory(id: string, patch: Partial<InventoryInput>) {
  await connectDB();
  const doc = await Inventory.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) throw notFound("Inventory item not found");
  return withReorder(toDTO(doc));
}

export async function deleteInventory(id: string) {
  await connectDB();
  const doc = await Inventory.findByIdAndDelete(id);
  if (!doc) throw notFound("Inventory item not found");
  return { success: true, id };
}
