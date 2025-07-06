import mongoose from "mongoose";

const scheduledMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    scheduleTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    insertedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ScheduledMessage = mongoose.model(
  "ScheduledMessage",
  scheduledMessageSchema
);
export default ScheduledMessage;
