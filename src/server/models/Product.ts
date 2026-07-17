import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, default: "General", index: true },
    price: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },
    supplier: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: mongoose.Types.ObjectId };

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) ||
  mongoose.model<ProductDoc>("Product", productSchema);
