import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "langchain/stores/message/redis";
import dotenv from "dotenv";

dotenv.config();


class RedisMemory {
  constructor(conv_id) {
    this.memory = new BufferMemory({
      inputKey : "question",
      memoryKey: "conversationHistory",
      chatHistory: new RedisChatMessageHistory({
        sessionId: conv_id,
        // sessionTTL: 300,  // uncomment to enable session expiry
        config: {
          url: process.env.REDIS_URL, 
        },
      }),
    });
  }

  getMemory() {
    return this.memory;
  }
}

export default RedisMemory;
