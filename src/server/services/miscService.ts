import { connectDB } from "../config/db";
import { Employee, Campaign, Task, CalendarEvent, Alert, Insight } from "../models/misc";
import { notFound } from "../utils/apiError";
import { toDTO, toDTOList } from "../utils/serialize";

// --- Employees ---
export async function listEmployees() {
  await connectDB();
  return toDTOList(await Employee.find().sort({ createdAt: 1 }));
}
export async function createEmployee(input: any) {
  await connectDB();
  return toDTO(await Employee.create(input));
}
export async function updateEmployee(id: string, patch: any) {
  await connectDB();
  const doc = await Employee.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!doc) throw notFound("Employee not found");
  return toDTO(doc);
}
export async function deleteEmployee(id: string) {
  await connectDB();
  const doc = await Employee.findByIdAndDelete(id);
  if (!doc) throw notFound("Employee not found");
  return { success: true, id };
}

// --- Campaigns ---
export async function listCampaigns() {
  await connectDB();
  return toDTOList(await Campaign.find().sort({ createdAt: 1 }));
}
export async function createCampaign(input: any) {
  await connectDB();
  return toDTO(await Campaign.create(input));
}
export async function updateCampaign(id: string, patch: any) {
  await connectDB();
  const doc = await Campaign.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!doc) throw notFound("Campaign not found");
  return toDTO(doc);
}
export async function deleteCampaign(id: string) {
  await connectDB();
  const doc = await Campaign.findByIdAndDelete(id);
  if (!doc) throw notFound("Campaign not found");
  return { success: true, id };
}

// --- Tasks ---
export async function listTasks() {
  await connectDB();
  return toDTOList(await Task.find().sort({ createdAt: 1 }));
}
export async function createTask(input: any) {
  await connectDB();
  return toDTO(await Task.create(input));
}
export async function updateTask(id: string, patch: any) {
  await connectDB();
  const doc = await Task.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!doc) throw notFound("Task not found");
  return toDTO(doc);
}
export async function deleteTask(id: string) {
  await connectDB();
  const doc = await Task.findByIdAndDelete(id);
  if (!doc) throw notFound("Task not found");
  return { success: true, id };
}

// --- Calendar Events ---
export async function listEvents() {
  await connectDB();
  return toDTOList(await CalendarEvent.find().sort({ date: 1 }));
}
export async function createEvent(input: { date: string; title: string }) {
  await connectDB();
  return toDTO(await CalendarEvent.create(input));
}
export async function deleteEvent(id: string) {
  await connectDB();
  const doc = await CalendarEvent.findByIdAndDelete(id);
  if (!doc) throw notFound("Event not found");
  return { success: true, id };
}

// --- Alerts ---
export async function listAlerts() {
  await connectDB();
  return toDTOList(await Alert.find().sort({ createdAt: -1 }));
}

// --- Insights ---
export async function listInsights() {
  await connectDB();
  const rows = await Insight.find().sort({ order: 1 });
  return rows.map((r) => r.text);
}
