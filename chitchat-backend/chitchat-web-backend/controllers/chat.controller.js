import { findById } from "../services/userServices.js";
import { getModelByModelId } from "../services/modelProfileService.js";
import ChatClientFactory from "../chat-client/chat-client-factory.js";
import { ChatClientType } from "../chat-client/chat-client-factory.js";
import dotenv from "dotenv";
dotenv.config();

const allowed_model_string = process.env.ALLOWED_MODEL_IDS;
var allowed_model_ids = [];
if (allowed_model_string) {
  allowed_model_ids = allowed_model_string.split(",");
}

export const sendMessage = async (req, res) => {
  try {
    const message = req.body.message;
    var user_id = req.body.user_id;
    const model_id = req.body.model_id;
    var user = await findById(user_id);
    if (user == null && allowed_model_ids.includes(model_id)) {
      user_id = "mx3ut9pdrs";
      user = await findById(user_id);
    }
    var model = await getModelByModelId(model_id);
    var chat_client = ChatClientFactory.createChatClient(
      ChatClientType.CHATGPT,
      user.username,
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
    var user_id = req.body.user_id;
    const model_id = req.body.model_id;
    var user = await findById(user_id);
    if (user == null && allowed_model_ids.includes(model_id)) {
      user_id = "mx3ut9pdrs";
      user = await findById(user_id);
    }
    var model = await getModelByModelId(model_id);
    var chat_client = ChatClientFactory.createChatClient(
      ChatClientType.LANGCHAIN,
      user.username,
      model.model_name,
      model_id
    );
    var join_chat_res = await chat_client.join_chat(user_id, model_id);
    res.json({
      message: join_chat_res.message,
      status: "success",
      user_id: user_id,
      model_id: model_id,
      chat_history: join_chat_res.return_chat_history,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
