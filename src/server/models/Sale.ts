import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// A Sale is a realized revenue event, bucketed by month for analytics.
const saleSchema = new Schema(
  {
    product: { type: String, default: "" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    channel: { type: String, default: "Direct" },
    units: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    year: { type: Number, index: true },
    month: { type: Number, index: true }, // 0-11
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type SaleDoc = InferSchemaType<typeof saleSchema> & { _id: mongoose.Types.ObjectId };

export const Sale: Model<SaleDoc> =
  (mongoose.models.Sale as Model<SaleDoc>) || mongoose.model<SaleDoc>("Sale", saleSchema);
