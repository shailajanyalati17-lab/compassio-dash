const { Schema, model, Types } = require("mongoose");

const inventorySchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true, index: true },
    quantity: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 10, min: 0 },
    lastRestocked: { type: Date },
  },
  { timestamps: true }
);

module.exports = model("Inventory", inventorySchema);
