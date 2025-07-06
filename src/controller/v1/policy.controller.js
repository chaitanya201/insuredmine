import centralController from "../../helpers/general/centralController.js";
import { Worker } from "worker_threads";

import { SERVER_CONFIG } from "../../config/server.config.js";
import { getPolicyInfoSchema } from "../../validators/policy.js";
import { PolicyInfoModel, UserModel } from "../../db/models/index.js";

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

export const getPolicyInfo = centralController(async (req, res, next) => {
  const parsedBody = getPolicyInfoSchema.safeParse(req.params);
  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: parsedBody.error.errors,
    });
  }
  const { username } = parsedBody.data;
  const user = await UserModel.findOne({
    firstName: { $regex: username, $options: "i" },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const policies = await PolicyInfoModel.find({ userId: user._id })
    .populate("userId", "firstName email")
    .populate("policyCategoryId", "name")
    .populate("companyCarrierId", "name");

  if (!policies || policies.length === 0) {
    return res.status(404).json({ message: "No policies found for this user" });
  }
  return res.status(200).json({
    message: "Policies retrieved successfully",
    data: policies,
  });
});

export const aggregatedPolicyByEachUser = centralController(
  async (req, res, next) => {
    const policies = await PolicyInfoModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $group: {
          _id: "$userDetails._id",
          firstName: { $first: "$userDetails.firstName" },
          email: { $first: "$userDetails.email" },
          totalPolicies: { $sum: 1 },
          totalPremiumAmount: { $sum: "$premiumAmount" },
          policyTypes: { $addToSet: "$policyType" },
          carriers: { $addToSet: "$companyCarrierId" },
        },
      },
      {
        $lookup: {
          from: "policycarriers",
          localField: "carriers",
          foreignField: "_id",
          as: "carrierDetails",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstName: 1,
          email: 1,
          totalPolicies: 1,
          totalPremiumAmount: 1,
          policyTypes: 1,
          carrierNames: "$carrierDetails.name",
        },
      },
    ]);
    if (!policies || policies.length === 0) {
      return res.status(404).json({ message: "No policies found" });
    }

    return res.status(200).json({
      message: "Aggregated policy data retrieved successfully",
      data: policies,
    });
  }
);
