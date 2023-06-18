
import { Router } from "express";
const router = Router();


import { checkAuth } from "../middlewares/checkAuth.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import { fetchCurrentUser, loginOrRegisterUser, verifyOTP, handleAdmin } from "../controllers/auth.controller.js";

router.post("/login_or_register", loginOrRegisterUser);


router.post("/verify", verifyOTP);

router.get("/me", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

export const authRoutes = router;