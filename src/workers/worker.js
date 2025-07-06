import { workerData, parentPort } from "worker_threads";
import xlsx from "xlsx";
import {
  UserModel,
  AgentModel,
  UserAccountModel,
  PolicyCategoryModel,
  PolicyCarrierModel,
  PolicyInfoModel,
} from "../db/models/index.js";
import fs from "fs";
import { connectToDatabase } from "../db/config/connection.js";
import mongoose from "mongoose";
import { SERVER_CONFIG } from "../config/server.config.js";
import { policyRowSchema } from "../validators/policy.js";

connectToDatabase();
(async () => {
  const workbook = xlsx.readFile(workerData.filePath);
  const sheet = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
    { raw: false }
  );
  let count = 0;
  let errorCount = 0;
  let successCount = 0;

  console.log("Processing rows...");
  console.log("Total rows to process:", sheet.length);
  let session;

  if (!SERVER_CONFIG.DB_URL.includes("localhost")) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    for (const row of sheet) {
      count++;

      const { error, success } = policyRowSchema.safeParse(row);

      if (!success) {
        errorCount++;
        console.error(
          "skipping row due to validation error:",
          row,
          " error:",
          error
        );
        continue;
      }

      const agent = await AgentModel.findOneAndUpdate(
        { name: row.agent },
        { name: row.agent },
        { upsert: true, new: true, ...(session ? { session } : {}) }
      );

      const user = await UserModel.findOneAndUpdate(
        { email: row.email },
        {
          firstName: row.firstname,
          dob: new Date(row.dob),
          address: row.address,
          phoneNo: row.phone,
          state: row.state,
          zipcode: row.zip,
          email: row.email,
          gender: row.gender || "",
          userType: row.userType,
        },
        { upsert: true, new: true, ...(session ? { session } : {}) }
      );

      const account = await UserAccountModel.findOneAndUpdate(
        { name: row.account_name, userId: user._id },
        { name: row.account_name, userId: user._id },
        { upsert: true, new: true, ...(session ? { session } : {}) }
      );

      const category = await PolicyCategoryModel.findOneAndUpdate(
        { name: row.category_name },
        { name: row.category_name },
        { upsert: true, new: true, ...(session ? { session } : {}) }
      );

      const carrier = await PolicyCarrierModel.findOneAndUpdate(
        { name: row.company_name },
        { name: row.company_name },
        { upsert: true, new: true, ...(session ? { session } : {}) }
      );

      const existingPolicy = PolicyInfoModel.findOne({
        policyNumber: row.policy_number,
      });
      if (session) {
        existingPolicy.session(session);
      }
      const finalPolicy = await existingPolicy;

      if (!finalPolicy) {
        await PolicyInfoModel.create(
          [
            {
              policyNumber: row.policy_number,
              policyStartDate: new Date(row.policy_start_date),
              policyEndDate: new Date(row.policy_end_date),
              premiumAmount: row.premium_amount,
              policyType: row.policy_type,
              policyMode: row.policy_mode,
              producer: row.producer,
              userId: user._id,
              policyCategoryId: category._id,
              companyCarrierId: carrier._id,
            },
          ],
          session && { session }
        );
      }
      successCount++;

      console.log("row processed", count, ":", row.policy_number);
    }
    if (successCount === 0) {
      parentPort.postMessage({
        status: "error",
        error: "No valid rows found in the file.",
      });
      return;
    }
    parentPort.postMessage({
      status: "success",
      data: `Processed ${count} rows in total — ${successCount} succeeded, ${errorCount} failed.`,
    });
    if (session) await session.commitTransaction();
  } catch (error) {
    console.log("Error processing row:", count, error);
    if (session) await session.abortTransaction();
    parentPort.postMessage({
      status: "error",
      error: `Error processing row ${count}: ${error.message}`,
    });
  } finally {
    if (session) await session.endSession();
    mongoose.disconnect();
  }
  console.log("row processed", count);
})();
