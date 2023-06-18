import { getUserByUserId } from "../services/userProfileService.js";
import { getModelByModelId } from "../services/modelProfileService.js";
import {
  insertChat,
  getChatHistoryByConvId,
} from "../services/chatHistoryService.js";
import {
  createConversation,
  getConv,
  updateConv,
} from "../services/conversationService.js";
import {
  is_response_include_forbidden_words,
  return_postpone_words,
  return_greeting_words,
  return_greeting_words_by_model_id,
} from "../util.js";
import ChatClient from "../chatgpt-client.js";

export const sendMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const user_id = req.body.user_id;
    const model_id = req.body.model_id;
    var user = await getUserByUserId(user_id);
    console.log("current user id is: " + user_id);
    var model = await getModelByModelId(model_id);
    const model_gender = model.model_type;
    var chat_client = new ChatClient(user.user_name, model.model_name);
    console.warn(
      "current chat_client options is: " +
        JSON.stringify(chat_client.client.options)
    );
    const condition = { user_id: user_id, model_id: model_id };
    var conv = await getConv(condition);
    console.log(`conv is ${conv.conv_id}, msg is ${conv.last_msg_id}`);
    var response = await chat_client.send_message(
      message,
      conv.conv_id,
      conv.last_msg_id
    );
    // TODO: implement bulk insertion
    await insertChat({
      conv_id: conv.conv_id,
      message: message,
      is_user: true,
    });
    console.log(response);
    var res_message = response.response;
    if (is_response_include_forbidden_words(res_message)) {
      console.log("Reinit ChatGPT since AI GF ends role play.");
      var reinit_res = await chat_client.reinit_conv(
        conv.conv_id,
        response.messageId,
        model_id
      );
      // resend message to conv
      response = await chat_client.send_message(
        message,
        conv.conv_id,
        reinit_res.messageId
      );
    }

    var new_msg = response.response;
    if (is_response_include_forbidden_words(new_msg)) {
      // Still contains forbidden word.
      new_msg = return_postpone_words(model_gender);
    }

    conv.conv_id = response.conversationId;
    conv.last_msg_id = response.messageId;
    await updateConv(condition, conv);
    await insertChat({
      conv_id: conv.conv_id,
      message: new_msg,
      is_user: false,
    });
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
    const model_gender = model.model_type;
    var user_name = "用户";
    if (user && user.user_name) {
      user_name = user.user_name;
    }
    var chat_client = new ChatClient(user_name, model.model_name);
    // check if user has an existing conv
    var cond = {
      user_id: user_id,
      model_id: model_id,
    };
    var existing_conv = await getConv(cond);
    if (existing_conv != null) {
      // find an existing conv
      var conv = existing_conv.conv_id;
      var chat_history = await getChatHistoryByConvId(conv);
      var return_chat_history = chat_history; //.slice(-10);
      if (!return_chat_history) {
        return_chat_history = [];
      }
      // console.log(chat_history);
      const return_mes = await return_greeting_words_by_model_id(model_id);
      // TODO: make insertChat and return a transaction
      await chat_client.reinit_conv(
        conv,
        existing_conv.last_msg_id,
        model_id,
        chat_history
      );
      await insertChat({ conv_id: conv, message: return_mes, is_user: false });
      // get the last 10 chat history
      res.json({
        message: return_mes,
        status: "success",
        user_id: user_id,
        model_id: model_id,
        chat_history: return_chat_history,
      });
      return;
    }
    // init a new converstation for a new user
    var response = await chat_client.init_conv(model_id);
    console.log(response);
    // retry if response contains forbidden words
    if (is_response_include_forbidden_words(response.response)) {
      response = await chat_client.init_conv(model_id);
    }

    var msg = response.response;
    // if still contains forbidden words, return a greeting message
    if (is_response_include_forbidden_words(msg)) {
      msg = return_greeting_words(model_gender);
    }
    var conv = {
      user_id: user_id,
      model_id: model_id,
      conv_id: response.conversationId,
      last_msg_id: response.messageId,
    };
    await createConversation(conv);
    await insertChat({
      conv_id: response.conversationId,
      message: msg,
      is_user: false,
    });
    res.json({
      message: msg,
      status: "success",
      user_id: user_id,
      model_id: model_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
