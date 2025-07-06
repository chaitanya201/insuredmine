import centralController from "../../helpers/general/centralController.js";
import { Worker } from "worker_threads";

import fs from "fs";
import { SERVER_CONFIG } from "../../config/server.config.js";

export const uploadPolicyFile = centralController(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    const worker = new Worker(SERVER_CONFIG.WORKER_FILE, {
      workerData: { filePath },
    });

    worker.on("message", (msg) => {
      console.log("message from worker:", msg);
      if (msg.status === "success") {
        res.status(200).json({
          message: "File processed and data uploaded successfully!",
          details: msg.data,
        });
      } else if (msg.status === "error") {
        console.error("Worker error:", msg.error);
        res
          .status(500)
          .json({ message: "Error processing file.", error: msg.error });
      }
    });

    worker.on("error", (err) => {
      console.error("Worker thread error:", err);
      res
        .status(500)
        .json({ message: "Worker thread failed.", error: err.message });
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      // // Clean up the uploaded file after processing to save space
      // fs.unlink(filePath, (err) => {
      //   if (err) console.error("Failed to delete uploaded file:", err);
      // });
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
