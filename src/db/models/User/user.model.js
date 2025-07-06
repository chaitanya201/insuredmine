import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    userType: { type: String, default: "", enum: ["Active Client"] },
    email: { type: String, required: true, unique: true },
    gender: {
      type: String,
      default: "",
      enum: ["Male", "Female", "Other", ""],
    },
    dob: { type: Date, default: "" },
    address: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    state: { type: String, default: "" },
    zipcode: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
