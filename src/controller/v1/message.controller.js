import { ScheduledMessageModel } from "../../db/models/index.js";
import centralController from "../../helpers/general/centralController.js";
import { saveScheduledMessageSchema } from "../../validators/message.js";

export const saveScheduledMessage = centralController(async (req, res) => {
  try {
    const parsedBody = saveScheduledMessageSchema.safeParse(req.body || {});
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsedBody.error.errors,
      });
    }
    const { message, date, time } = parsedBody.data;

    const combinedDateTimeStr = `${date}T${time}:00`;
    const scheduleTime = new Date(combinedDateTimeStr);

    const scheduledMessage = new ScheduledMessageModel({
      message,
      scheduleTime,
      insertedAt: new Date(),
    });

    await scheduledMessage.save();

    return res.status(201).json({
      message: "Scheduled message created successfully.",
      data: scheduledMessage,
    });
  } catch (error) {
    console.error("Error saving scheduled message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
