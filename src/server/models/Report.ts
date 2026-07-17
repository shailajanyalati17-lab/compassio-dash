import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const reportSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: "monthly" },
    period: { type: String, default: "" },
    revenue: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type ReportDoc = InferSchemaType<typeof reportSchema> & { _id: mongoose.Types.ObjectId };

export const Report: Model<ReportDoc> =
  (mongoose.models.Report as Model<ReportDoc>) ||
  mongoose.model<ReportDoc>("Report", reportSchema);
