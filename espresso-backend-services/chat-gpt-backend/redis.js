import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const MAX_SEARCH_RESULTS = 1000;

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

async function performSearch(index, ...query) {
  try {
    // Return the first MAX_SEARCH_RESULTS matching documents.
    const searchResults = await redis.call('FT.SEARCH', index, query, 'LIMIT', '0', MAX_SEARCH_RESULTS);

    // An empty search result looks like [ 0 ].
    if (searchResults.length === 1) {
      console.log(`No results for index: ${index}, query: ${query}`);
      return [];
    }

    // Actual results look like:
    //
    // [ 3, 'hashKey', ['fieldName', 'fieldValue', ...],
    //      'hashKey', ['fieldName, 'fieldValue', ...], ... ]

    const results = [];
    for (let n = 2; n < searchResults.length; n += 2) {
      const result = {};
      const fieldNamesAndValues = searchResults[n];

      for (let m = 0; m < fieldNamesAndValues.length; m += 2) {
        const k = fieldNamesAndValues[m];
        const v = fieldNamesAndValues[m + 1];
        result[k] = v;
      }

      results.push(result);
    }

    return results;
  } catch (e) {
    // A malformed query or unknown index etc causes an exception type error.
    console.log(`Invalid search request for index: ${index}, query: ${query}`);
    console.log(e);
    return [];
  }
};

export async function createIndexIfNeeded (index, embeddingSize) {
  try {
    await redis.call('FT.INFO', index);
  } catch (e) {
    if (e.message === 'Unknown Index name') {
      console.log(`Creating index: ${index}`);
      await redis.call('FT.CREATE', index, 'ON', 'HASH', 'PREFIX', '1', `${index}:`, 'SCHEMA', 'embedding', 'VECTOR', 'FLAT', 6, 'TYPE', 'FLOAT32', 'DIM', embeddingSize, 'DISTANCE_METRIC', 'L2', 'TEXT', 'text');
    } else {  
      throw e;
    }
  }
};

export async function storeEmbeddings(index, embeddings, text) {
  const pipeline = redis.pipeline();
  const fields = ['embedding', vectorToBinary(embeddings), 'text', text];
  pipeline.call('HSET', index, fields);
  await pipeline.exec();
};

export async function searchClosestEmbeddings(indexName, embedding, topK) {
  const binaryVector = vectorToBinary(embedding);
  const query = `*=>[KNN ${topK} @embedding $BLOB AS my_scores]`;
  const results = await performSearch(indexName, query, "PARAMS", 2, "BLOB", binaryVector, "SORTBY", "my_scores", "DIALECT", 2);
  const query_result = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const text = result.text;
    query_result.push(text); 
  }
  return query_result;
};

function vectorToBinary(vector) {
  const float32Array = new Float32Array(vector);
  const buffer = Buffer.from(float32Array.buffer);
  return buffer;
}


export default {
  getClient: () => redis,
};