let endpoint = 'http://localhost:3000';
let front_endpoint = 'http://localhost:3001';
const env = process.env.NODE_ENV;
const is_dev = process.env.REACT_APP_DEV_SERVER;
if (is_dev === 'true') {
  // dev server
  endpoint = 'https://chitchat-ai-backend-dev.onrender.com';
  front_endpoint = 'https://chitchat-ai-dev.onrender.com';
} else if (env === 'production') {
  endpoint = 'https://chitchat-ai-backend.onrender.com';
  front_endpoint = 'https://chitchat-ai-mm27.onrender.com';
} else {
  console.log('Localhost is running');
}

export const ENDPOINT = endpoint;
export const FRONT_ENDPOINT = front_endpoint;
