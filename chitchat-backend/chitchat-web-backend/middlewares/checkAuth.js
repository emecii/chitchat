import { findById } from "../services/userServices.js";
import { getUserByUserId } from "../services/userProfileService.js";
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

    const user_profile = await getUserByUserId(userId);

    if (!user_profile) {
      next({ status: 404, message: USER_NOT_FOUND_ERR });
      return;
    }

    res.locals.userId = user_profile.user_id;
    res.locals.userName = user_profile.user_name;
    res.locals.gender = user_profile.gender;
    res.locals.birthday = user_profile.dob;
    res.locals.city = user_profile.city;
    res.locals.phone = user_profile.phone;

    next();
  } catch (err) {
    next(err);
  }
}
