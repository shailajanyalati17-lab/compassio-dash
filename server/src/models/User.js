const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner"], default: "owner" },
    businessId: { type: Types.ObjectId, ref: "Business" },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
