import { ConversationModel } from "../models/conversation.js";

export async function createConversation(conv) {
    return await ConversationModel.create(conv);
}
export async function getConv(condition) {
    return await ConversationModel.findOne(condition);
}

export async function updateConv(condition, conv) {
    return await ConversationModel.findOneAndUpdate(condition, conv);
}

export async function deleteConv(condition) {
    return await ConversationModel.findOneAndDelete(condition);
};

export async function getConvsByUser(user_id) {
    const sortOrder = { "updatedAt": -1 };
    return await ConversationModel.find({user_id: user_id}).sort(sortOrder);
}

// Update the conversation update time
export async function updateConvTime(conv_id) {
    var conv = await ConversationModel.findOne({conv_id: conv_id});
    conv.updatedAt = Date.now();
    return await ConversationModel.findOneAndUpdate({conv_id: conv_id}, conv); 
}
