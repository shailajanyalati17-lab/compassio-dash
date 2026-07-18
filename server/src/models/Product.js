const { Schema, model, Types } = require("mongoose");

const productSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, default: 0, min: 0 },
    category: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
