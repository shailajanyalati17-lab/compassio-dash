import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const orderSchema = new Schema(
  {
    customer: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    product: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Shipped", "Refunded"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      default: "Unpaid",
    },
    date: { type: String, default: "" },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: mongoose.Types.ObjectId };

export const Order: Model<OrderDoc> =
  (mongoose.models.Order as Model<OrderDoc>) || mongoose.model<OrderDoc>("Order", orderSchema);
