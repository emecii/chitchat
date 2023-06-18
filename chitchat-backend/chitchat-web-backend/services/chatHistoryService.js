import { ChatHistoryModel } from "../models/chat-history.js";
import { updateConvTime } from "./conversationService.js";

export async function insertChat(chat) {
    updateConvTime(chat.conv_id);
    return await ChatHistoryModel.create(chat);
}
export async function getChatHistoryByConvId(conv_id) {
    return await ChatHistoryModel.find({conv_id: conv_id});
}