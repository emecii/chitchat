import mongoose, { Schema } from "mongoose";
 
const userTagsSchema = new Schema({
  user_id: String,
  user_tags: [String],
  user_mbti_tag: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
 
export const UserTagsModel = mongoose.model("UserTags", userTagsSchema);
