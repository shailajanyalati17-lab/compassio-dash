const { Schema, model, Types } = require("mongoose");

const customerSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("Customer", customerSchema);
