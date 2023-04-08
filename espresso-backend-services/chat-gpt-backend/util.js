import dotenv from 'dotenv';
dotenv.config();

const postpone_words_list_female = ["哎呀...人家不知道嘛...洗澡去了88~", "手机信号不好，等会儿再聊！", "emmmm", "啊咧？", "哎呀，你好无聊呀~换个话题不"];
const greeting_words_list_female = ["哼，现在才想起来找人家。你今天过得怎么样呀？", "这么久没有和你聊天，有点想你呢。", "哈咯，有什么有趣的事情和我分享吗?", "你去哪儿了？怎么不接电话。", "嘿，最近怎么样呀？"];
const postpone_words_list_male = ["容我三思..", "手机信号不好，等会儿再聊！", "emmmm", "什么？", "这个有点触及我知识的盲区了。"];
const greeting_words_list_male = ["你今天过得怎么样？", "这么久没有和你聊天，有点想你呢。", "哈咯，有什么有趣的事情和我分享吗?", "你去哪儿了？怎么不接电话。", "嘿，最近怎么样呀？"];

export function build_chat_history_for_frontend(chat_history) {
    var chat_history_for_frontend = [];
    chat_history.forEach(chat => {
    
  });
  return chat_history_for_frontend;
}

export function return_postpone_words(gender) {
    if (gender == 'W') {
        return postpone_words_list_female[Math.floor(Math.random()*postpone_words_list_female.length)];
    }
    return postpone_words_list_male[Math.floor(Math.random()*postpone_words_list_male.length)];
}

export function return_greeting_words(gender) {
    if (gender == 'W') {
        return greeting_words_list_female[Math.floor(Math.random()*greeting_words_list_female.length)];
    }
    return greeting_words_list_male[Math.floor(Math.random()*greeting_words_list_male.length)];
}

export function is_response_include_forbidden_words(res_message) {
    if (res_message.includes('ChatGPT') || res_message.includes('AI') ||
        res_message.includes('语言模型') || res_message.includes('很抱歉') || 
        res_message.includes('机器人') || res_message.includes('没有情感')){
            return true;
        }
}

export function build_context(context) {
    var context_for_message = '';
    context_for_message += '\n 你们之前的一些聊天信息如下：\n';
    
    for (var chat of context) {
        context_for_message += chat + '\n';
    }
    return context_for_message;
}

export function getOpenAiApiKey() {
    var api_keys = process.env.OPENAI_APIKEY.split(",");
    var api_key = api_keys[Math.floor(Math.random()*api_keys.length)];
    return api_key;
}