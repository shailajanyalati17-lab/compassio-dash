const { Schema, model, Types } = require("mongoose");

const saleSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    orderId: { type: Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = model("Sale", saleSchema);
