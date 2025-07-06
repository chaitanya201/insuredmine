import mongoose from "mongoose";

const policyCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const PolicyCategoryModel = mongoose.model(
  "PolicyCategory",
  policyCategorySchema
);

export default PolicyCategoryModel;
