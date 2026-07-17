import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// --- Employee ---
const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    department: { type: String, default: "" },
    performance: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type EmployeeDoc = InferSchemaType<typeof employeeSchema> & { _id: mongoose.Types.ObjectId };
export const Employee: Model<EmployeeDoc> =
  (mongoose.models.Employee as Model<EmployeeDoc>) ||
  mongoose.model<EmployeeDoc>("Employee", employeeSchema);

// --- Campaign (Marketing) ---
const campaignSchema = new Schema(
  {
    name: { type: String, required: true },
    channel: { type: String, default: "Email" },
    spend: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    roi: { type: Number, default: 0 },
    leads: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Paused", "Ended"], default: "Active" },
  },
  { timestamps: true },
);
export type CampaignDoc = InferSchemaType<typeof campaignSchema> & { _id: mongoose.Types.ObjectId };
export const Campaign: Model<CampaignDoc> =
  (mongoose.models.Campaign as Model<CampaignDoc>) ||
  mongoose.model<CampaignDoc>("Campaign", campaignSchema);

// --- Task ---
const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    assignee: { type: String, default: "You" },
    due: { type: String, default: "" },
    status: { type: String, enum: ["Todo", "In Progress", "Blocked", "Done"], default: "Todo" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  },
  { timestamps: true },
);
export type TaskDoc = InferSchemaType<typeof taskSchema> & { _id: mongoose.Types.ObjectId };
export const Task: Model<TaskDoc> =
  (mongoose.models.Task as Model<TaskDoc>) || mongoose.model<TaskDoc>("Task", taskSchema);

// --- Calendar Event ---
const calendarEventSchema = new Schema(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true },
);
export type CalendarEventDoc = InferSchemaType<typeof calendarEventSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const CalendarEvent: Model<CalendarEventDoc> =
  (mongoose.models.CalendarEvent as Model<CalendarEventDoc>) ||
  mongoose.model<CalendarEventDoc>("CalendarEvent", calendarEventSchema);

// --- Alert ---
const alertSchema = new Schema(
  {
    level: { type: String, enum: ["critical", "warning", "info"], default: "info" },
    title: { type: String, required: true },
    detail: { type: String, default: "" },
  },
  { timestamps: true },
);
export type AlertDoc = InferSchemaType<typeof alertSchema> & { _id: mongoose.Types.ObjectId };
export const Alert: Model<AlertDoc> =
  (mongoose.models.Alert as Model<AlertDoc>) || mongoose.model<AlertDoc>("Alert", alertSchema);

// --- Insight (AI insights, stored under Analytics domain) ---
const insightSchema = new Schema(
  {
    text: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type InsightDoc = InferSchemaType<typeof insightSchema> & { _id: mongoose.Types.ObjectId };
export const Insight: Model<InsightDoc> =
  (mongoose.models.Insight as Model<InsightDoc>) ||
  mongoose.model<InsightDoc>("Insight", insightSchema);
