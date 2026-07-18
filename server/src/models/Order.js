const { Schema, model, Types } = require("mongoose");

const orderItemSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    customerId: { type: Types.ObjectId, ref: "Customer" },
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "shipped", "refunded", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
