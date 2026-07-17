import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    plan: { type: String, enum: ["Free", "Pro", "Enterprise"], default: "Free" },
    ltv: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "churn-risk", "dormant"], default: "active" },
    phone: { type: String, default: "" },
    joined: { type: String, default: "" },
  },
  { timestamps: true },
);

export type CustomerDoc = InferSchemaType<typeof customerSchema> & { _id: mongoose.Types.ObjectId };

export const Customer: Model<CustomerDoc> =
  (mongoose.models.Customer as Model<CustomerDoc>) ||
  mongoose.model<CustomerDoc>("Customer", customerSchema);
