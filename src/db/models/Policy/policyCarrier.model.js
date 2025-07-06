import mongoose from "mongoose";

const policyCarrierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const PolicyCarrierModel = mongoose.model("PolicyCarrier", policyCarrierSchema);

export default PolicyCarrierModel;
