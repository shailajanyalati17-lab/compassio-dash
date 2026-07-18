const { Schema, model, Types } = require("mongoose");

const analyticsSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    date: { type: Date, required: true, index: true },
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    customers: { type: Number, default: 0 },
    topProducts: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        name: String,
        qty: Number,
        revenue: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Analytics", analyticsSchema);
