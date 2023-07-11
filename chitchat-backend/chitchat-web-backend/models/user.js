
import mongoose, { Schema } from "mongoose";

const userModelSchema = new Schema(
  {
    id: String,
    username: String,
    phone: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    role: {
     type: String,
     enum: ["ADMIN","USER", "GUEST"],
     default:"USER",
    },
    birthday: Date,
    gender: {
      type: String,
      enum: ["M","F", "U", "O"],
      default:"U",
    },
    profileUrl: String,
    phoneOtp: String,
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    // not yet implemented
    city: String,
    wechatId: String,
    currentModelId: String,
    email: String,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userModelSchema);