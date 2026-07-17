import { connectDB } from "../config/db";
import { Order } from "../models/Order";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export type OrderInput = {
  customer: string;
  product: string;
  quantity?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
};

export async function listOrders(params: { search?: string; status?: string } = {}) {
  await connectDB();
  const query: any = {};
  if (params.search) {
    query.$or = [
      { customer: { $regex: params.search, $options: "i" } },
      { product: { $regex: params.search, $options: "i" } },
    ];
  }
  if (params.status && params.status !== "all") query.status = params.status;
  const items = await Order.find(query).sort({ createdAt: -1 });
  return toDTOList(items);
}

export async function getOrder(id: string) {
  await connectDB();
  const doc = await Order.findById(id);
  if (!doc) throw notFound("Order not found");
  return toDTO(doc);
}

export async function createOrder(input: OrderInput) {
  await connectDB();
  const doc = await Order.create({
    ...input,
    date: new Date().toISOString().slice(0, 10),
  });
  return toDTO(doc);
}

export async function updateOrder(id: string, patch: Partial<OrderInput>) {
  await connectDB();
  const doc = await Order.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) throw notFound("Order not found");
  return toDTO(doc);
}

export async function deleteOrder(id: string) {
  await connectDB();
  const doc = await Order.findByIdAndDelete(id);
  if (!doc) throw notFound("Order not found");
  return { success: true, id };
}
