import { User } from "../models/user.model.js";

import { findByPhone, findById } from "../services/userServices.js";

import { PHONE_NOT_FOUND_ERR, PHONE_ALREADY_EXISTS_ERR, USER_NOT_FOUND_ERR, INCORRECT_OTP_ERR, ACCESS_DENIED_ERR } from "../errors.js";

import { createJwtToken } from "../utils/token.util.js";

import { generateOTP, fast2sms } from "../utils/otp.util.js";

const COOKIE_NAME = 'auth_token';

// --------------------- create new user ---------------------------------
export async function loginOrRegisterUser(req, res, next) {
    try {
        const { phone } = req.body;
        var user = await findByPhone(phone);
        // register if a new user
        if (!user) {
            await createNewUser(phone, next);
            user = await findByPhone(phone);
            if (user) {
                res.status(200).json({
                    type: "success",
                    message: "Account created OTP sended to mobile number",
                    data: {
                      userId: user._id,
                    },
                  });
            } else {
                res.status(500).json({
                    type: "error",
                    message: "用户创建失败，请稍后重试。",
                    data: {
                      
                    },
                  });
            }
            
            return;
        }
        // generate otp
        const otp = generateOTP(6);
        // save otp to user collection
        user.phoneOtp = otp;
        user.isAccountVerified = true;
        await user.save();
        // send otp to phone number
        await fast2sms(otp, user.phone);

        res.status(201).json({
          type: "success",
          message: "验证码已发送，请查收。",
          data: {
          userId: user._id,
          },
      });
   } catch (error) {
    console.log("[Debug] error.status",error.response.status)
      if (error.response.status === 403) {
        res.status(403).json({
          type: "error",
          message: "验证码操作频繁，请稍后重试。",
          data: {
          },
        });
      }
   } finally {
    console.log("[Debug] finally")
   }
}

async function createNewUser(phone, next) {
  try {
    // create new user
    const createUser = new User({
      phone,
      role : phone === process.env.ADMIN_PHONE ? "ADMIN" :"USER"
    });

    // save user
    const user = await createUser.save();

    // generate otp
    const otp = generateOTP(6);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number
    await fast2sms(otp, user.phone, next);
  } catch (error) {
    next(error);
  }
}

// ---------------------- verify phone otp -------------------------

export async function verifyOTP(req, res, next) {
  try {
    const { otp, phone } = req.body;
    const user = await findByPhone(phone);
    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    if (user.phoneOtp !== otp) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }
    console.log("[Debug] user",JSON.stringify(user));
    const token = createJwtToken({ userId: user._id });

    // user.phoneOtp = "";
    // await user.save();
    res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(201).json({
      type: "success",
      message: "登录成功",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
}


// --------------- fetch current user -------------------------

export async function fetchCurrentUser(req, res, next) {
  try {

    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        userId: res.locals.userId,
        userName: res.locals.userName,
        gender: res.locals.gender
      },
    });
  } catch (error) {
    next(error);
  }
}

// --------------- admin access only -------------------------

export async function handleAdmin(req, res, next) {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "Okay you are admin!!",
      data: {
        user:currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
}