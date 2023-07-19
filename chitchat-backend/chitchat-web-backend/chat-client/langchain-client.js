import { OpenAI } from "langchain/llms";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { getChatHistoryByConvId } from "../services/chatHistoryService.js";
import { findById } from "../services/userServices.js";
import { getConvByConvId } from "../services/conversationService.js";
import { getModelByModelId } from "../services/modelProfileService.js";
import { templates } from "./templates/prompt-templates.js";
import RedisMemory from "./memory/redis-memory.js";
import ChatClient from "./chat-client.js";
import pkg from "uuid";
const { v4: uuidv4 } = pkg;
import dotenv from "dotenv";
dotenv.config();
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

class LangChainClient extends ChatClient {
  constructor(conv_id, model_id) {
    super();
    var api_keys = process.env.OPENAI_APIKEY.split(",");
    var api_key = api_keys[Math.floor(Math.random() * api_keys.length)];
    // set env variable
    process.env.OPENAI_API_KEY = api_key;
    this.llm = new OpenAI({});
    this.memory = new RedisMemory(conv_id);
    this.model_id = model_id;
  }

  async join_chat(user_id, model_id) {
    try {
      // check if model exists
      var model = await getModelByModelId(model_id);
      if (model == null) {
        throw new Error("Model not found");
      }
      // check if user exists
      var user = await findById(user_id);
      if (user == null) {
        throw new Error("User not found");
      }
      var cond = {
        user_id: user_id,
        model_id: model_id,
      };
      var existing_conv = await getConv(cond);
      if (existing_conv != null) {
        // find an existing conv
        var conv = existing_conv.conv_id;
        var chat_history = await getChatHistoryByConvId(conv);
        var return_chat_history = chat_history;
        if (!return_chat_history) {
          return_chat_history = [];
        }
        const return_mes = await return_greeting_words_by_model_id(model_id);
        // TODO: make insertChat and return a transaction
        await this.init_conv();
        var last_msg_time = chat_history.updatedAt;
        var now = Date.now();
        // if the last message was sent more than 1 day ago
        if (now - last_msg_time > 86400000) {
          // send a greeting message
          await insertChat({
            conv_id: conv,
            message: return_mes,
            is_user: false,
          });
          return {
            message: return_mes,
            return_chat_history: return_chat_history,
          };
        }
        return { return_chat_history: return_chat_history };
      }
      console.log("Initiating new conversation...");
      this.init_conv();
      var conv = {
        user_id: user_id,
        model_id: model_id,
        conv_id: uuidv4(),
      };
      await createConversation(conv);
      await insertChat({
        conv_id: conv.conv_id,
        message: msg,
        is_user: false,
      });
      return {
        message: msg,
        return_chat_history: [],
      };
    } catch (err) {
      console.error("Error joining chat", err);
      return null;
    }
  }

  async init_conv() {
    var chat = new ChatOpenAI({
      streaming: true,
      verbose: true,
      modelName: "gpt-3.5-turbo",
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          channel.publish({
            data: {
              event: "response",
              token: token,
              interactionId,
            },
          });
        },
        async handleLLMEnd(result) {
          channel.publish({
            data: {
              event: "responseEnd",
              token: "END",
              interactionId,
            },
          });
        },
      }),
    });
    var promptTemplate = new PromptTemplate({
      template: templates.qaTemplate,
      inputVariables: [
        "relationship",
        "favorability",
        "morality",
        "senseOfHumor",
        "age",
        "user_name",
        "model_name",
        "occupation",
        "location",
        "hometown",
        "language",
        "personality",
        "appearance",
        "hobbies",
        "dislikes",
        "greeting",
        "otherPatterns",
        "conversationHistory",
        // "context", TODO: add context
        "question",
      ],
    });
    this.chain = new LLMChain({
      prompt: promptTemplate,
      llm: chat,
      memory: this.memory,
    });
  }

  async send_message(msg) {
    // logic to send a message in the conversation
    try {
      var modelProfile = await getModelByModelId(this.model_id);
      var convProfile = await getConvByConvId(this.conv_id);

      const res = await this.chain.call({
        relationship: convProfile.relationship,
        favorability: convProfile.favorability,
        morality: modelProfile.morality,
        senseOfHumor: modelProfile.senseOfHumor,
        age: modelProfile.age,
        user_name: convProfile.user_name,
        model_name: convProfile.model_name,
        occupation: modelProfile.occupation,
        location: modelProfile.location,
        hometown: modelProfile.location,
        language: modelProfile.language,
        personality: modelProfile.personality,
        appearance: modelProfile.appearance,
        conversationHistory,
        summary,
        msg,
      });
      console.log("Response is: " + res);
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async send_chat_message(message, user_id, model_id) {
    return this.send_message(message);
  }
}

export default LangChainClient;
