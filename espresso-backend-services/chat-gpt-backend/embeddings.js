import { createIndexIfNeeded, storeEmbeddings, searchClosestEmbeddings } from './redis.js';
import { getOpenAiApiKey } from './util.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Set up OpenAI API key
const OPENAI_API_KEY = getOpenAiApiKey();

export async function storeChat(user_id, model_id, message) {
    const embeddings = await generateEmbeddings(message);
    console.log(embeddings);
    if (embeddings) {
        const now = Date.now();
        const index = `${user_id.toLowerCase()}-${model_id}`;
        const keyName = `${index}:${now}`;
        console.log('Storing embeddings in key: ');
        console.log(keyName);
        createIndexIfNeeded(index, embeddings.length);
        storeEmbeddings(keyName, embeddings, message);
    } else {
        console.error('Error generating embeddings');
    }
}

export async function searchChat(user_id, model_id, message, topK) {

    const embeddings = await generateEmbeddings(message);
    if (embeddings) {
        const indexName = `${user_id.toLowerCase()}-${model_id}`;
        console.log('Searching closest embeddings in index: ');
        console.log(indexName);
        const queryResponse = await searchClosestEmbeddings(indexName, embeddings, topK);
        return queryResponse;
    } else {
        console.error('Error generating embeddings');
        return null;
    }
}



// Function to generate embeddings using OpenAI's Embedding API
async function generateEmbeddings(content, engine = 'text-embedding-ada-002') {
  const embeddingEndpoint = 'https://api.openai.com/v1/embeddings';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  };

  const data = {
    'input': content,
    'model': engine,
  };

  try {
    const response = await axios.post(embeddingEndpoint, data, { headers: headers });
    if (response.data.data && response.data.data.length > 0) {
      const vector = response.data.data[0].embedding;
      return vector;
    } else {
      throw new Error('No response from OpenAI Embedding API');
    }
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return null;
  }
}

// (async () => {
//   // Example usage
//   const content = 'This is an example text for generating embeddings.';
//   const embeddings = await generateEmbeddings(content);
//   console.log('Generated embeddings:', embeddings);
// })();
