import { connectDB } from "../config/db";
import { Feedback } from "../models/Feedback";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

export async function listFeedback() {
  await connectDB();
  const items = await Feedback.find().sort({ createdAt: -1 });
  return toDTOList(items);
}

export async function createFeedback(input: {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  rating?: number;
  user?: string;
}) {
  await connectDB();
  const doc = await Feedback.create(input);
  return toDTO(doc);
}

export async function updateFeedbackStatus(id: string, status: string) {
  await connectDB();
  const doc = await Feedback.findByIdAndUpdate(id, { $set: { status } }, { new: true });
  if (!doc) throw notFound("Feedback not found");
  return toDTO(doc);
}

export async function deleteFeedback(id: string) {
  await connectDB();
  const doc = await Feedback.findByIdAndDelete(id);
  if (!doc) throw notFound("Feedback not found");
  return { success: true, id };
}
