import mongoose, { Schema } from "mongoose";
 
const conversationSchema = new Schema({
  user_id: String,
  model_id: String,
  conv_id: String,
  last_msg_id: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
 
export const ConversationModel = mongoose.model("Conversation", conversationSchema);