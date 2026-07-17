import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const businessSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    industry: { type: String, default: "SaaS" },
    currency: { type: String, default: "USD" },
    timezone: { type: String, default: "UTC" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export type BusinessDoc = InferSchemaType<typeof businessSchema> & { _id: mongoose.Types.ObjectId };

export const Business: Model<BusinessDoc> =
  (mongoose.models.Business as Model<BusinessDoc>) ||
  mongoose.model<BusinessDoc>("Business", businessSchema);
