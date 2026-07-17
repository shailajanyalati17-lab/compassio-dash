import { connectDB } from "../config/db";
import { Customer } from "../models/Customer";
import { Order } from "../models/Order";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export type CustomerInput = {
  name: string;
  email: string;
  plan?: string;
  ltv?: number;
  status?: string;
  phone?: string;
};

export async function listCustomers(params: { search?: string; status?: string } = {}) {
  await connectDB();
  const query: any = {};
  if (params.search) {
    query.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }
  if (params.status && params.status !== "all") query.status = params.status;
  const items = await Customer.find(query).sort({ createdAt: -1 });
  return toDTOList(items);
}

export async function getCustomer(id: string) {
  await connectDB();
  const doc = await Customer.findById(id);
  if (!doc) throw notFound("Customer not found");
  return toDTO(doc);
}

export async function getCustomerHistory(id: string) {
  await connectDB();
  const customer = await Customer.findById(id);
  if (!customer) throw notFound("Customer not found");
  const orders = await Order.find({ customer: customer.name }).sort({ createdAt: -1 });
  return { customer: toDTO(customer), orders: toDTOList(orders) };
}

export async function createCustomer(input: CustomerInput) {
  await connectDB();
  const doc = await Customer.create({
    ...input,
    joined: new Date().toISOString().slice(0, 10),
  });
  return toDTO(doc);
}

export async function updateCustomer(id: string, patch: Partial<CustomerInput>) {
  await connectDB();
  const doc = await Customer.findByIdAndUpdate(id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) throw notFound("Customer not found");
  return toDTO(doc);
}

export async function deleteCustomer(id: string) {
  await connectDB();
  const doc = await Customer.findByIdAndDelete(id);
  if (!doc) throw notFound("Customer not found");
  return { success: true, id };
}
