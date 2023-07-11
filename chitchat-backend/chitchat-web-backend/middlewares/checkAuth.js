import { findById } from "../services/userServices.js";
import {
  ACCESS_DENIED_ERR,
  AUTH_TOKEN_MISSING_ERR,
  AUTH_USER_MISSING_ERR,
  JWT_DECODE_ERR,
  USER_NOT_FOUND_ERR,
} from "../errors.js";
import { verifyJwtToken } from "../utils/token.util.js";
import jwt from "jsonwebtoken";

export async function checkAuth(req, res, next) {
  try {
    // Check for JWT token in the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next({ status: 403, message: AUTH_TOKEN_MISSING_ERR });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      next({ status: 403, message: AUTH_TOKEN_MISSING_ERR });
      return;
    }

    let userId;
    try {
      userId = verifyJwtToken(token, next);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // Handle the expired token case
        return next({ status: 401, message: "Token has expired" });
      } else {
        // Handle other errors
        return next({ status: 403, message: JWT_DECODE_ERR });
      }
    }

    const user_profile = await findById(userId);

    if (!user_profile) {
      next({ status: 404, message: USER_NOT_FOUND_ERR });
      return;
    }

    res.locals.user = {
      id: user_profile.id,
      username: user_profile.username,
      phone: user_profile.phone,
      role: user_profile.role,
      birthday: user_profile.birthday,
      gender: user_profile.gender,
      profileUrl: user_profile.profileUrl,
      phoneOtp: user_profile.phoneOtp,
      // not yet implemented
      //city: String,
      //wechatId: String,
      //currentModelId: String,
      //email: String,
    };

    next();
  } catch (err) {
    next(err);
  }
}
