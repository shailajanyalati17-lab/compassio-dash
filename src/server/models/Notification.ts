import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["revenue", "inventory", "customer", "marketing", "employee", "system"],
      default: "system",
    },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type NotificationDoc = InferSchemaType<typeof notificationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Notification: Model<NotificationDoc> =
  (mongoose.models.Notification as Model<NotificationDoc>) ||
  mongoose.model<NotificationDoc>("Notification", notificationSchema);
