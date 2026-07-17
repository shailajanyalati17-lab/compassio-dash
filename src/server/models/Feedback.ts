import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const feedbackSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: { type: String, enum: ["open", "reviewed", "resolved"], default: "open" },
  },
  { timestamps: true },
);

export type FeedbackDoc = InferSchemaType<typeof feedbackSchema> & { _id: mongoose.Types.ObjectId };

export const Feedback: Model<FeedbackDoc> =
  (mongoose.models.Feedback as Model<FeedbackDoc>) ||
  mongoose.model<FeedbackDoc>("Feedback", feedbackSchema);
