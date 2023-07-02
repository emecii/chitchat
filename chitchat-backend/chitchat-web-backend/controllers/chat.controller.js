import { getUserByUserId } from "../services/userProfileService.js";
import { getModelByModelId } from "../services/modelProfileService.js";
import ChatClientFactory from "../chat-client/chat-client-factory.js";
import { ChatClientType } from "../chat-client/chat-client-factory.js";

export const sendMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const user_id = req.body.user_id;
    const model_id = req.body.model_id;
    var user = await getUserByUserId(user_id);
    var model = await getModelByModelId(model_id);
    var chat_client = ChatClientFactory.createChatClient(
      ChatClientType.CHATGPT,
      user.user_name,
      model.model_name,
      model_id
    );
    var new_msg = await chat_client.send_chat_message(message, user_id, model_id);
    res.json({
      message: new_msg,
      status: "success",
      user_id: user_id,
      model_id: model_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinChat = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const model_id = req.body.model_id;
    var user = await getUserByUserId(user_id);
    var model = await getModelByModelId(model_id);
    var chat_client = ChatClientFactory.createChatClient(
      ChatClientType.CHATGPT,
      user.user_name,
      model.model_name,
      model_id
    );
    var joinChatRes = await chat_client.join_chat(user_id, model_id);
    res.json({
      message: joinChatRes.message,
      status: "success",
      user_id: user_id,
      model_id: model_id,
      chat_history: joinChatRes.return_chat_history,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
