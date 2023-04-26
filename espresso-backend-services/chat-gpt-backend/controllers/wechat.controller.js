import dotenv from 'dotenv';
import axios from 'axios';
import { randomBytes, createHash } from 'crypto';


dotenv.config();
const appId = process.env.WECHAT_APP_ID;
const appSecret = process.env.WECHAT_APP_SECRET;

let accessToken = null;
let jsapiTicket = null;

async function updateAccessToken() {
  try {
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);
    accessToken = response.data.access_token;
    console.log('Access token updated:', accessToken);
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}

async function updateJsapiTicket() {
  try {
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`);
    jsapiTicket = response.data.ticket;
    console.log('Jsapi ticket updated:', jsapiTicket);
  } catch (error) {
    console.error('Error fetching jsapi ticket:', error);
  }
}

async function updateTokens() {
  await updateAccessToken();
  await updateJsapiTicket();
}

updateTokens();
setInterval(updateTokens, 7000 * 1000);

export async function get_wechat_config(req, res) {
  const nonceStr = randomBytes(16).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000);
  const url = req.query.url;

  const signatureString = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  const signature = createHash('sha1').update(signatureString).digest('hex');

  res.status(200).json({
    appId,
    timestamp,
    nonceStr,
    signature
  });
}