import mongoose from "mongoose";
import { SERVER_CONFIG } from "../../config/server.config.js";

export const connectToDatabase = async () => {
  try {
    const dbUri = SERVER_CONFIG.DB_URL;
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
