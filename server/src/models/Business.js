const { Schema, model, Types } = require("mongoose");

const businessSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Business", businessSchema);
