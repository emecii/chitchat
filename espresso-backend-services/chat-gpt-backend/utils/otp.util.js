import Core from '@alicloud/pop-core';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'querystring';

dotenv.config();
var client = new Core({
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    // securityToken: '<your-sts-token>', // use STS Token
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

var config = {
  method: 'post',
  url: 'https://dfsns.market.alicloudapi.com/data/send_sms',
  headers: {
    'Authorization': `APPCODE ${process.env.APP_CODE}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};


export function generateOTP(otp_length) {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export async function fast2sms(code, contactNumber, next) {
  try {
    var params = {
      "PhoneNumbers": contactNumber,//接收短信的手机号码
      "SignName": "小半AI",//短信签名名称
      "TemplateCode": "SMS_274555169", //短信模板CODE
      "TemplateParam": `{"code":"${code}"}`//短信模板变量对应的实际值，JSON格式
    }
    var requestOption = {
      method: 'POST'
    };
    let result = await client.request('SendSms', params, requestOption);
    console.log(result);
  } catch (error) {
    next(error);
  }
}