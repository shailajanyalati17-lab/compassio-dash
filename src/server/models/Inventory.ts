import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const inventorySchema = new Schema(
  {
    sku: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    stock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 50 },
    supplier: { type: String, default: "" },
  },
  { timestamps: true },
);

export type InventoryDoc = InferSchemaType<typeof inventorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Inventory: Model<InventoryDoc> =
  (mongoose.models.Inventory as Model<InventoryDoc>) ||
  mongoose.model<InventoryDoc>("Inventory", inventorySchema);
