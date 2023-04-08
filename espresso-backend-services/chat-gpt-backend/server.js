// const bodyParser = require("body-parser");
// const express = require("express");
import express from "express";
import bodyParser from "body-parser";
import ChatClient from "./chatgpt-client.js";
import { createConversation, getConv, updateConv, deleteConv } from "./services/conversationService.js";
import { insertUser, getUserByUserId} from "./services/userProfileService.js";
import { insertModel, getModelByModelId, getModelsByModelType } from "./services/modelProfileService.js";
import { insertChat, getChatHistoryByConvId } from "./services/chatHistoryService.js";
import { connect } from "./mongo.js";
import { model, mongoose } from "mongoose";
import { ObjectId } from 'mongodb';
import cors from "cors";
import { is_response_include_forbidden_words, return_postpone_words, return_greeting_words, build_context } from "./util.js";
import { authRoutes } from "./routes/auth.route.js";
import { storeChat, searchChat } from "./embeddings.js";

const app = express();
app.use(cors({
    origin: '*'
}));
const port = 3000;

// connect mongo client
connect();

// Body parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to handle incoming messages
app.post("/send-message", async (req, res) => {
  
  const message = req.body.message;
  const user_id = req.body.user_id;
  const model_id = req.body.model_id;
  var user = await getUserByUserId(user_id);
  var model = await getModelByModelId(model_id);
  const model_gender = model.model_type;
  var chat_client = new ChatClient(user.user_name, model.model_name);
  const condition = { 'user_id': user_id, 'model_id': model_id };
  var conv = await getConv(condition);
  
  try {
    console.log(`conv is ${conv.conv_id}, msg is ${conv.last_msg_id}`);
    var context = await searchChat(user_id, model_id, message, 10);
    var context_history = "";
    if (context) {
      console.log('Building context history...');
      context_history = build_context(context);
    }
    var response = await chat_client.send_message(`Q:${message} ${context_history}`, conv.conv_id, conv.last_msg_id);
    // TODO: implement bulk insertion
    await insertChat({conv_id: conv.conv_id, message: message, is_user: true});
    await storeChat(user_id, model_id, `${user.user_name}: ${message}`);
    console.log(response);
    var res_message = response.response;
    await storeChat(user_id, model_id, `${model.model_name}: ${res_message}`);
    if (is_response_include_forbidden_words(res_message)) {
        console.log("Reinit ChatGPT since AI GF ends role play.");
        var reinit_res = await chat_client.reinit_conv(conv.conv_id, response.messageId, model_id);
        // resend message to conv
        response = await chat_client.send_message(message, conv.conv_id, reinit_res.messageId);
    }

    var new_msg = response.response;
    if (is_response_include_forbidden_words(new_msg)) {
        // Still contains forbidden word.
        new_msg = return_postpone_words(model_gender);
    }

    conv.conv_id = response.conversationId;
    conv.last_msg_id = response.messageId;
    await updateConv(condition, conv);
    await insertChat({conv_id: conv.conv_id, message: new_msg, is_user: false});
    res.json({ message: new_msg, status: "success",
               user_id: user_id, model_id: model_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route when a new user join chat
app.post("/join-chat", async (req, res) => {
  const user_id = req.body.user_id;
  const model_id = req.body.model_id;
  var user = await getUserByUserId(user_id);
  var model = await getModelByModelId(model_id);
  const model_gender = model.model_type;
  var chat_client = new ChatClient(user.user_name, model.model_name);
  // check if user has an existing conv
  var cond = {
    user_id: user_id,
    model_id: model_id
  }
  var existing_conv = await getConv(cond);
  if (existing_conv != null) {
    // find an existing conv
    var conv = existing_conv.conv_id;
    var chat_history = await getChatHistoryByConvId(conv);
    var return_chat_history = chat_history.slice(-10);
    if (!return_chat_history) {
        return_chat_history = [];
    }
    // console.log(chat_history);
    const return_mes = return_greeting_words(model_gender);
    // TODO: make insertChat and return a transaction
    await chat_client.reinit_conv(conv, existing_conv.last_msg_id, model_id, chat_history);
    await insertChat({conv_id: conv, message: return_mes, is_user: false});
    // get the last 10 chat history
    res.json({ message: return_mes, status: "success",
               user_id: user_id, model_id: model_id, 
               chat_history: return_chat_history});
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
    last_msg_id: response.messageId
  };
  
  try {
    await createConversation(conv);
    await insertChat({conv_id: response.conversationId, message: msg, is_user: false});
    res.json({ message: msg, status: "success",
              user_id: user_id, model_id: model_id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route when fetching all model profile
app.get("/model-profile", async (req, res) => {
  const gender = req.query.gender;

  try {
    var models = await getModelsByModelType(gender);
    res.json({ data: models, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});
// Route when creating a new model profile
app.post("/model-profile", async (req, res) => {
  const model_id = req.body.model_id;
  const model_name = req.body.model_name;
  const model_type = req.body.model_type;
  const model_metadata = req.body.model_metadata;
  const model = {
    model_id: model_id,
    model_name: model_name,
    model_type: model_type,
    model_metadata: model_metadata
  }
  var existing_model = await getModelByModelId(model_id);
  if (existing_model) {
    res.status(409).json({ error: 'Model already existed!'});
    return;
  }
  try {
    await insertModel(model);
    res.json({ message: `model ${model_name} added!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/user-profile/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  var user = await getUserByUserId(user_id);
  if (user) {
    res.json({ message: `user ${user.user_name} found!`, data: user, status: "success" });
  } else {
    res.status(404).json({ error: 'User not found!'});
  }
});

// Route when creating a new user profile
app.post("/user-profile", async (req, res) => {
  const user_id = req.body.user_id;
  const user_name = req.body.user_name;
  const gender = req.body.gender;
  const user = {
    user_id: user_id,
    user_name: user_name,
    gender: gender
  }
  var existing_user = await getUserByUserId(user_id);
  if (existing_user) {
    res.status(409).json({ error: 'User already existed!'});
    return;
  }
  try {
    await insertUser(user);
    res.json({ message: `user ${user_name} added!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});