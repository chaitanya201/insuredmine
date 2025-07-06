import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const UserAccountModel = mongoose.model("UserAccount", userAccountSchema);
export default UserAccountModel;
