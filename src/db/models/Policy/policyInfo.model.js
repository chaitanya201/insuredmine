import mongoose from "mongoose";

const policyInfoSchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true },
    premiumAmount: { type: Number, required: true },
    policyType: {
      type: String,
    },
    policyMode: {
      type: Number,
    },
    producer: {
      type: String,
    },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    policyCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCategory",
      required: true,
    },
    companyCarrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCarrier",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PolicyInfoModel = mongoose.model("PolicyInfo", policyInfoSchema);
export default PolicyInfoModel;
