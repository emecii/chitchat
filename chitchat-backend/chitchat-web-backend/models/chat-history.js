import mongoose, { Schema } from "mongoose";
 
const chatHistorySchema = new Schema({
  conv_id: String,
  message: String,
  is_user: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
 
export const ChatHistoryModel = mongoose.model("ChatHistory", chatHistorySchema);