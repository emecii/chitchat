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

var requestOption = {
    method: 'POST'
};

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

export async function fast2sms(code, contactNumber) {
  try {
    var data = qs.stringify({
      content: `code:${code}`,
      phone_number: contactNumber,
      template_id: 'CST_lduha10224'
    });
    config.data = data;

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
    });
  } catch (error) {
    throw error;
  }
}