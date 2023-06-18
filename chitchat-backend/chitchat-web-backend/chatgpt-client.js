import { KeyvFile } from 'keyv-file';
import ChatGPTClient from '@waylaidwanderer/chatgpt-api';
import * as fs from "fs";
import dotenv from 'dotenv';
import { getChatHistoryByConvId } from "./services/chatHistoryService.js";
import { getModelByModelId } from "./services/modelProfileService.js";
import { model } from 'mongoose';
import axios from 'axios';
dotenv.config();
// require('dotenv').config();

const MAX_PROMPT_TOKEN = 3095;
var file_prefix = process.env.ON_SERVER == 'true' ? process.env.SERVER_FILE_PATH : "./";
const initial_model_ids = ['0', '1', '2', '3', '4', '5', '6', '7'];
const external_model_ids = ['1001'];

var clientOptions = {
    // (Optional) Support for a reverse proxy for the completions endpoint (private API server).
    // Warning: This will expose your `openaiApiKey` to a third party. Consider the risks before using this.
    // reverseProxyUrl: 'https://chatgpt.hato.ai/completions',
    // (Optional) Parameters as described in https://platform.openai.com/docs/api-reference/completions
    modelOptions: {
        // You can override the model name and any other parameters here.
        model: 'gpt-3.5-turbo',
        // Set max_tokens here to override the default max_tokens of 1000 for the completion.
        max_tokens: 1000,
    },
    // (Optional) Davinci models have a max context length of 4097 tokens, but you may need to change this for other models.
    // maxContextTokens: 4097,
    // (Optional) You might want to lower this to save money if using a paid model like `text-davinci-003`.
    // Earlier messages will be dropped until the prompt is within the limit.
    maxPromptTokens: MAX_PROMPT_TOKEN,
    promptPrefix: "请开始扮演角色，但不要说你在角色扮演, 也不要询问对方是否需要帮助。",
    // (Optional) Set a custom name for the user
    userLabel: '男朋友',
    // (Optional) Set a custom name for ChatGPT
    chatGptLabel: '女朋友',
    // (Optional) Set to true to enable `console.debug()` logging
    debug: false,
};

const cacheOptions = {
    // Options for the Keyv cache, see https://www.npmjs.com/package/keyv
    // This is used for storing conversations, and supports additional drivers (conversations are stored in memory by default)
    // For example, to use a JSON file (`npm i keyv-file`) as a database:
    store: new KeyvFile({ filename: 'cache.json' }),
};



export default class ChatClient {
  constructor(user_name, model_name) {
    var tmp_clientOptions = Object.assign({}, clientOptions);
    tmp_clientOptions.userLabel = user_name;
    tmp_clientOptions.chatGptLabel = model_name;
    var api_keys = process.env.OPENAI_APIKEY.split(",");
    var api_key = api_keys[Math.floor(Math.random()*api_keys.length)];
    this.client = new ChatGPTClient(api_key, tmp_clientOptions, cacheOptions);
    this.client.clientOptions = tmp_clientOptions;
    this.user_name = user_name;
    this.model_name = model_name;
    console.log("Chat client inited!");
  }

  async read_init_prompt(model_id) {
    if (initial_model_ids.includes(model_id)) {
      const text = fs.readFileSync(`${file_prefix}initial-prompt-${model_id}.txt`, 'utf8'); 
      console.log("Inital prompt is: " + text);
      return text;
    }
    var model = await getModelByModelId(model_id);
    const init_prompt = model.model_metadata.initial_prompt;
    if (!init_prompt) {
      throw new Error("Init prompt not found for model " + model_id);
    }
    console.log("Inital prompt is: " + init_prompt);
    return init_prompt;
  }

  // Initialize first conv for a new user
  async init_conv(model_id) {
    try {
      var text = await this.read_init_prompt(model_id);
      if (external_model_ids.includes(model_id)) {
        text = 'Hi';  
      }
      return await this.client.sendMessage(text);
    } catch (err) {
      console.error("Error initiating conversation:", err);
      return null;
    }
  }

  async send_message(msg, conv_id, last_msg_id, model_id) {
    if (external_model_ids.includes(model_id)) {
      return await this.sendExternalMessage(msg);
    }
    var count = this.client.getTokenCountForMessage(msg);
    if (count > MAX_PROMPT_TOKEN - 100) {
      return this.sendSplitMessage(msg, conv_id, last_msg_id);
    }
    return await this.client.sendMessage(msg, { conversationId: conv_id, parentMessageId: last_msg_id });
  }

  async sendExternalMessage(msg) {
    try {
      await axios.post('https://callannie.azurewebsites.net/api/callannie', {
        query: msg,
      })
        .then(function (response) {
          console.log(JSON.stringify(response));
          return response.message;
      });
    } catch (error) {
      throw error;
    }
  }

  // Resend the initial prompt to an exitsing conv
  async reinit_conv(conv_id, last_msg_id, model_id, chat_history=null) {
    // Fix the Invalid Encoding error handling.
    const text = await this.read_init_prompt(model_id);
    if (chat_history == null) {
      var chat_history = await getChatHistoryByConvId(conv_id);
    }
    // TODO: add summary of the chat history if token is above the limit
    var reinit_prompt = text + "之前的聊天记录如下：\n" + this.build_prompt_by_history(chat_history);
    if (external_model_ids.includes(model_id)) {
      reinit_prompt = 'Hi';
    }
    return await this.send_message(reinit_prompt, conv_id, last_msg_id, model_id);
  }

  dfs_split_prompt(prompt, prompt_array) {
    var token_count = this.client.getTokenCountForMessage(prompt);
    if (token_count <= MAX_PROMPT_TOKEN - 100) {
      prompt_array.push(prompt);
    } else {
      var middle = Math.floor(prompt.length / 2);
      var before = prompt.lastIndexOf(' ', middle);
      var after = prompt.indexOf(' ', middle + 1);
  
      if (middle - before < after - middle) {
          middle = before;
      } else {
          middle = after;
      }
      var s1 = prompt.substr(0, middle);
      var s2 = prompt.substr(middle + 1);
      this.dfs_split_prompt(s1, prompt_array);
      this.dfs_split_prompt(s2, prompt_array);
    }
  }
  async sendSplitMessage(prompt, conv_id, last_msg_id) {
    var prompt_array = [];
    this.dfs_split_prompt(`${prompt}`, prompt_array);
    // Fix the prompt to let chatgpt better handling long message.
    var starting_prompt = `现在我有一条长消息分${prompt_array.length}次发给你。收到消息之后只需要回答：'收到'。最后我会发送'发送完毕，请回答。'，然后你再回答。`
    var response = await this.client.sendMessage(starting_prompt, { conversationId: conv_id, parentMessageId: last_msg_id });
    for (var i = 0; i < prompt_array.length; i++) {
      console.log("*********\n");
      console.log(`第${i+1}条消息是：${prompt_array[i]}`);
      response = await this.client.sendMessage(prompt_array[i], { conversationId: conv_id, parentMessageId: response.messageId });
      console.log("*********\n");
      console.log(`第${i+1}条消息的回复是：${response.response}`);
    }
    
    return await this.client.sendMessage("发送完毕，请回答。", { conversationId: conv_id, parentMessageId: response.messageId });
  }

  build_prompt_by_history(chat_history) {
    var prompt = '';
    chat_history.forEach(chat => {
      var character = chat.is_user ? `${this.user_name}:` : `${this.model_name}：`;
      var line = `${character} ${chat.message}\n`;
      prompt = prompt + line;
    });
    console.log(prompt);
    return prompt;
  }
}
