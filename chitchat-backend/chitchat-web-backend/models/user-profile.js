import mongoose, { Schema } from "mongoose";
 
const userProfileSchema = new Schema({
  user_id: String,
  user_name: String,
  wechat_id: String,
  current_model_id: String,
  email: String,
  phone: String,
  gender: String,
  city: String,
  birthday: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
 
export const UserModel = mongoose.model("UserProfile", userProfileSchema);