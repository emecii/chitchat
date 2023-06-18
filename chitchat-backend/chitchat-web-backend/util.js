import { getModelByModelId } from "./services/modelProfileService.js";
import * as fs from "fs";
var file_prefix =
  process.env.ON_SERVER == "true" ? process.env.SERVER_FILE_PATH : "./";

const postpone_words_list_female = [
  "哎呀...人家不知道嘛...洗澡去了88~",
  "手机信号不好，等会儿再聊！",
  "emmmm",
  "啊咧？",
  "哎呀，你好无聊呀~换个话题不",
];
const greeting_words_list_female = [
  "哼，现在才想起来找人家。你今天过得怎么样呀？",
  "这么久没有和你聊天，有点想你呢。",
  "哈咯，有什么有趣的事情和我分享吗?",
  "你去哪儿了？怎么不接电话。",
  "嘿，最近怎么样呀？",
];
const postpone_words_list_male = [
  "容我三思..",
  "手机信号不好，等会儿再聊！",
  "emmmm",
  "什么？",
  "这个有点触及我知识的盲区了。",
];
const greeting_words_list_male = [
  "你今天过得怎么样？",
  "好久不见，上次我们聊得很开心，这次有什么新鲜事想跟我分享吗？",
  "哈咯，有什么有趣的事情和我分享吗?",
  "自从上次聊天后，我一直想问你一个问题：你对星座有什么看法？",
  "嘿，最近怎么样呀？",
  "上次跟你聊天真的很愉快，这次我们可以谈谈你的兴趣爱好",
  "你好，上次我们聊得很开心，这次我们可以聊聊下一次的旅行计划",
];
const forbidden_words_list = [
  "ChatGPT",
  "AI",
  "语言模型",
  "很抱歉",
  "机器人",
  "没有情感",
  "程序",
  "角色扮演",
  "帮助",
  "帮忙",
];

export function createInitPrompt(data) {
  var init_prompt = fs.readFileSync(`${file_prefix}self-prompt2.txt`, "utf8");
  const replaced = init_prompt
    .replace("{$gender}", data.gender)
    .replace("{$age}", data.age)
    .replace("{$name}", data.name)
    .replace("{$relationship}", data.relationship)
    .replace("{$occupation}", data.occupation)
    .replace("{$personality}", data.personality.join(", "))
    .replace("{$hobbies}", data.hobbies.join(", "))
    .replace("{$freq_chats}", join_frequnet_chat(data.freq_chats))
    .replace("{$other_patterns}", data.other_patterns)
    .replace("{$greetings}", data.greetings)
    .replace("{$goodwill}", data.greetings)
    .replace("{$moralSense}", data.moralSense)
    .replace("{$humor}", data.humor)
    .replace("{$city}", data.city)
    .replace("{$hometown}", data.hometown)
    .replace("{$dislike}", data.dislike);
  return replaced;
}

export function build_chat_history_for_frontend(chat_history) {
  var chat_history_for_frontend = [];
  chat_history.forEach((chat) => {});
  return chat_history_for_frontend;
}

export function return_postpone_words(gender) {
  if (gender == "W") {
    return postpone_words_list_female[
      Math.floor(Math.random() * postpone_words_list_female.length)
    ];
  }
  return postpone_words_list_male[
    Math.floor(Math.random() * postpone_words_list_male.length)
  ];
}

export function return_greeting_words(gender) {
  if (gender == "W") {
    return greeting_words_list_female[
      Math.floor(Math.random() * greeting_words_list_female.length)
    ];
  }
  return greeting_words_list_male[
    Math.floor(Math.random() * greeting_words_list_male.length)
  ];
}

export async function return_greeting_words_by_model_id(model_id) {
  var model = await getModelByModelId(model_id);
  var greetings = model.model_metadata.greetings;
  if (greetings) {
    return greetings;
  }
  return return_greeting_words(model.model_type);
}

export function is_response_include_forbidden_words(res_message) {
  // if forbidden_words_list includes res_message, return true
  for (var i = 0; i < forbidden_words_list.length; i++) {
    if (res_message.includes(forbidden_words_list[i])) {
      return true;
    }
  }
}

export function join_frequnet_chat(chats) {
  var new_chats = [];
  for (var i = 0; i < chats.length; i++) {
    var num = i + 1;
    if (chats[i]) {
      new_chats.push(`${num}: "${chats[i]}"`);
    }
  }
  return new_chats.join("，");
}
