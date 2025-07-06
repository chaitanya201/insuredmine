import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const AgentModel = mongoose.model("Agent", agentSchema);
export default AgentModel;
