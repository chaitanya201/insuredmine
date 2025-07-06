import { ScheduledMessageModel } from "../db/models/index.js";
import schedule from "node-schedule";

async function startScheduler() {
  schedule.scheduleJob("*/1 * * * *", async () => {
    console.log("Scheduler: Checking for pending messages...");
    try {
      const now = new Date();
      const messagesToProcess = await ScheduledMessageModel.find({
        status: "pending",
        scheduleTime: { $lte: now },
      });

      if (messagesToProcess.length > 0) {
        console.log(
          `Scheduler: Found ${messagesToProcess.length} messages to process.`
        );
        for (const msg of messagesToProcess) {
          console.log(
            `Scheduler: Processing message "${msg.message}" scheduled for ${msg.scheduleTime}`
          );

          msg.status = "completed";
          msg.insertedAt = new Date();
          await msg.save();
          console.log(
            `Scheduler: Message "${msg.message}" processed and status updated.`
          );
        }
      } else {
        console.log("Scheduler: No pending messages found.");
      }
    } catch (error) {
      console.error("Scheduler: Error processing scheduled messages:", error);
    }
  });
  console.log("Message scheduler started. Checking for messages every minute.");
}

export { startScheduler };
