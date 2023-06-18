import { ACCESS_DENIED_ERR } from "../errors.js";

export async function checkAdmin(req, res, next) {
  const currentUser = res.locals.user;

  if (!currentUser) {
    return next({ status: 401, message: ACCESS_DENIED_ERR });
  }

  if (currentUser.role === "admin") {
    return next();
  }

  return next({ status: 401, message: ACCESS_DENIED_ERR });
}