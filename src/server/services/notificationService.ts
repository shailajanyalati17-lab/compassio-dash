import { connectDB } from "../config/db";
import { Notification } from "../models/Notification";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export async function listNotifications() {
  await connectDB();
  const items = await Notification.find().sort({ createdAt: -1 }).limit(50);
  return toDTOList(items);
}

export async function createNotification(input: {
  type?: string;
  title: string;
  body?: string;
}) {
  await connectDB();
  const doc = await Notification.create(input);
  return toDTO(doc);
}

export async function markRead(id: string) {
  await connectDB();
  const doc = await Notification.findByIdAndUpdate(id, { $set: { unread: false } }, { new: true });
  if (!doc) throw notFound("Notification not found");
  return toDTO(doc);
}

export async function markAllRead() {
  await connectDB();
  await Notification.updateMany({ unread: true }, { $set: { unread: false } });
  return { success: true };
}

export async function deleteNotification(id: string) {
  await connectDB();
  const doc = await Notification.findByIdAndDelete(id);
  if (!doc) throw notFound("Notification not found");
  return { success: true, id };
}
