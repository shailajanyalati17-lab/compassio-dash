import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const expenseSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Payroll", "Marketing", "Infrastructure", "Operations", "Software", "Other"],
      default: "Other",
    },
    amount: { type: Number, default: 0 },
    vendor: { type: String, default: "" },
    status: { type: String, enum: ["Paid", "Due", "Overdue"], default: "Due" },
    date: { type: String, default: "" },
    year: { type: Number },
    month: { type: Number },
  },
  { timestamps: true },
);

export type ExpenseDoc = InferSchemaType<typeof expenseSchema> & { _id: mongoose.Types.ObjectId };

export const Expense: Model<ExpenseDoc> =
  (mongoose.models.Expense as Model<ExpenseDoc>) ||
  mongoose.model<ExpenseDoc>("Expense", expenseSchema);
