// const bodyParser = require("body-parser");
// const express = require("express");
import express from "express";
import bodyParser from "body-parser";
import ChatClient from "./chatgpt-client.js";
import * as fs from "fs";
import { createConversation, getConv, updateConv, getConvsByUser } from "./services/conversationService.js";
import { insertUser, getUserByUserId } from "./services/userProfileService.js";
import { insertModel, getModelByModelId, getModelsByFilters, updateModel, updateModelVotes, getSelectedModels } from "./services/modelProfileService.js";
import { insertChat, getChatHistoryByConvId } from "./services/chatHistoryService.js";
import { connect } from "./mongo.js";
import { model, mongoose } from "mongoose";
import { ObjectId } from 'mongodb';
import cors from "cors";
import { is_response_include_forbidden_words, return_postpone_words, return_greeting_words, join_frequnet_chat, return_greeting_words_by_model_id } from "./util.js";
import { authRoutes } from "./routes/auth.route.js";
import { apiRoutes } from "./routes/api.route.js";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const allowedOrigins = [
  'https://chitchat.fans',
  'https://www.chitchat.fans',
  'https://www.chitchat-ai.com',
  'https://chitchat-ai.com',
  'https://chitchat-ai-mm27.onrender.com',
  'https://chitchat-ai-dev.onrender.com',
  'http://localhost:3001',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const errorMsg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(errorMsg), false);
      }

      return callback(null, true);
    },
    credentials: true, // Allow the server to accept cookies from the client
  })
);
const port = 3000;

// connect mongo client
connect();

// Body parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Cookie Parser
app.use(cookieParser());

var file_prefix = process.env.ON_SERVER == 'true' ? process.env.SERVER_FILE_PATH : "./";

// Route to handle incoming messages
app.post("/send-message", async (req, res) => {

  try {
    const message = req.body.message;
    const user_id = req.body.user_id;
    const model_id = req.body.model_id;
    var user = await getUserByUserId(user_id);
    console.log("current user id is: " + user_id);
    var model = await getModelByModelId(model_id);
    const model_gender = model.model_type;
    var chat_client = new ChatClient(user.user_name, model.model_name);
    console.warn("current chat_client options is: " + JSON.stringify(chat_client.client.options));
    const condition = { 'user_id': user_id, 'model_id': model_id };
    var conv = await getConv(condition);
    console.log(`conv is ${conv.conv_id}, msg is ${conv.last_msg_id}`);
    var response = await chat_client.send_message(message, conv.conv_id, conv.last_msg_id, model_id);
    // TODO: implement bulk insertion
    await insertChat({ conv_id: conv.conv_id, message: message, is_user: true });
    console.log(response);
    var new_msg = "";
    if (model_id != '1001') {
      var res_message = response.response;
      if (is_response_include_forbidden_words(res_message)) {
        console.log("Reinit ChatGPT since AI GF ends role play.");
        var reinit_res = await chat_client.reinit_conv(conv.conv_id, response.messageId, model_id);
        // resend message to conv
        response = await chat_client.send_message(message, conv.conv_id, reinit_res.messageId, model_id);
      }

      new_msg = response.response;
      if (is_response_include_forbidden_words(new_msg)) {
        // Still contains forbidden word.
        new_msg = return_postpone_words(model_gender);
      }
    } else {
      new_msg = response;
    }
    conv.conv_id = response.conversationId;
    conv.last_msg_id = response.messageId;
    await updateConv(condition, conv);
    await insertChat({ conv_id: conv.conv_id, message: new_msg, is_user: false });
    res.json({
      message: new_msg, status: "success",
      user_id: user_id, model_id: model_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route when a new user join chat
app.post("/join-chat", async (req, res) => {
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
      const return_mes = await return_greeting_words_by_model_id(model_id);
      // TODO: make insertChat and return a transaction
      await chat_client.reinit_conv(conv, existing_conv.last_msg_id, model_id, chat_history);
      await insertChat({ conv_id: conv, message: return_mes, is_user: false });
      // get the last 10 chat history
      res.json({
        message: return_mes, status: "success",
        user_id: user_id, model_id: model_id,
        chat_history: return_chat_history
      });
      return;
    }
    // init a new converstation for a new user
    var response = await chat_client.init_conv(model_id);
    console.log(response);
    // skip check for model 1001
    if (model_id != '1001') {
      // retry if response contains forbidden words
      if (is_response_include_forbidden_words(response.response)) {
        response = await chat_client.init_conv(model_id);
      }

      var msg = response.response;
      // if still contains forbidden words, return a greeting message
      if (is_response_include_forbidden_words(msg)) {
        msg = return_greeting_words(model_gender);
      }
    } else {
      msg = response;
    }
    
    var conv = {
      user_id: user_id,
      model_id: model_id,
      conv_id: response.conversationId,
      last_msg_id: response.messageId
    };
    await createConversation(conv);
    await insertChat({ conv_id: response.conversationId, message: msg, is_user: false });
    res.json({
      message: msg, status: "success",
      user_id: user_id, model_id: model_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route when fetching all model profile
app.get("/model-profile", async (req, res) => {
  const { user_id, gender, is_public, model_id, is_selected } = req.query;
  try {
    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (gender) filters.gender = gender;
    if (is_selected !== undefined) filters.is_selected = is_selected === 'true';
    if (is_public !== undefined) filters.is_public = is_public === 'true';
    console.log("model_id", model_id)
    if (model_id) filters.model_id = model_id;
    console.log(JSON.stringify(filters));
    var models;
    if (is_selected === 'true') {
      models = await getSelectedModels(filters);
    } else {
      models = await getModelsByFilters(filters);
    }
    res.json({ data: models, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

// Route when creating a new model profile
app.post("/model-profile", async (req, res) => {
  const model_id = req.body.model_id;
  const user_id = req.body.user_id;
  const model_name = req.body.model_name;
  const model_type = req.body.model_type;
  var model_metadata = req.body.model_metadata;
  const init_prompt = createInitPrompt(model_metadata);
  model_metadata["user_id"] = user_id;
  model_metadata["initial_prompt"] = init_prompt;
  model_metadata["upVote"] = 1;
  model_metadata["downVote"] = 0;
  const model = {
    model_id: model_id,
    model_name: model_name,
    model_type: model_type,
    model_metadata: model_metadata
  }
  var existing_model = await getModelByModelId(model_id);
  if (existing_model) {
    res.status(409).json({ error: 'Model already existed!' });
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
    res.status(404).json({ error: 'User not found!' });
  }
});

// Route when updating an existing model profile
app.put("/model-profile", async (req, res) => {
  const model_id = req.body.model_id;
  const user_id = req.body.user_id;
  const model_name = req.body.model_name;
  const model_type = req.body.model_type;
  var model_metadata = req.body.model_metadata;

  if (!model_id) {
    res.status(400).json({ error: 'Model ID is required!' });
    return;
  }

  const existing_model = await getModelByModelId(model_id);

  if (!existing_model) {
    res.status(404).json({ error: 'Model not found!' });
    return;
  }

  const updatedModel = {
    model_id: model_id,
    user_id: user_id || existing_model.user_id,
    model_name: model_name || existing_model.model_name,
    model_type: model_type || existing_model.model_type,
    model_metadata: model_metadata || existing_model.model_metadata,
  };

  try {
    await updateModel(model_id, updatedModel);
    res.json({ message: `Model ${model_name} updated!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Route for updating upVote and downVote
app.patch("/model-profile/votes", async (req, res) => {
  const model_id = req.body.model_id;
  const upVote = req.body.upVote;
  const downVote = req.body.downVote;

  if (!model_id) {
    res.status(400).json({ error: 'Model ID is required!' });
    return;
  }

  const existing_model = await getModelByModelId(model_id);

  if (!existing_model) {
    res.status(404).json({ error: 'Model not found!' });
    return;
  }

  try {
    await updateModelVotes(model_id, upVote, downVote);
    res.json({ message: `Model ${model_id} votes updated!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(409).json({ error: 'User already existed!' });
    return;
  }
  try {
    await insertUser(user);
    res.json({ message: `user ${user_name} added!`, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch models that chatted by a user
app.get("/chat-models", async (req, res) => {
  try {
    var model_ids = [];
    const user_id = req.query.user_id;
    console.log("user_id is " + user_id);
    if (user_id != undefined && user_id != 'unknown') {
      const convs = await getConvsByUser(user_id);
      model_ids = convs.map(conv => conv.model_id);
    }
    res.json({ data: model_ids, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);

app.use("/api", apiRoutes);

function createInitPrompt(data) {
  var init_prompt = fs.readFileSync(`${file_prefix}self-prompt2.txt`, 'utf8');
  const replaced = init_prompt
    .replace('{$gender}', data.gender)
    .replace('{$age}', data.age)
    .replace('{$name}', data.name)
    .replace('{$relationship}', data.relationship)
    .replace('{$occupation}', data.occupation)
    .replace('{$personality}', data.personality.join(', '))
    .replace('{$hobbies}', data.hobbies.join(', '))
    .replace('{$freq_chats}', join_frequnet_chat(data.freq_chats))
    .replace('{$other_patterns}', data.other_patterns)
    .replace('{$greetings}', data.greetings)
    .replace('{$goodwill}',data.greetings)
    .replace('{$moralSense}',data.moralSense)
    .replace('{$humor}',data.humor)
    .replace('{$city}',data.city)
    .replace('{$hometown}',data.hometown)
    .replace('{$dislike}',data.dislike)
  return replaced;
}
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});