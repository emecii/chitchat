import { Router } from "express";
import { upload_image } from "../controllers/image.controller.js";
import { get_wechat_config } from "../controllers/wechat.controller.js";
import { sendMessage, joinChat } from "../controllers/chat.controller.js";
import { getUserProfile, postUserProfile } from "../controllers/user.controller.js";
import {
  getModelProfile,
  postModelProfile,
  updateModelProfile,
  updateVotes,
  getChatModels,
} from "../controllers/model.controller.js";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-image", upload.single("file"), upload_image);
router.get("/wechat-config", get_wechat_config);
router.post("/send-message", sendMessage);
router.post("/join-chat", joinChat);
router.get("/model-profile", getModelProfile);
router.post("/model-profile", postModelProfile);
router.get("/user-profile/:user_id", getUserProfile);
router.put("/model-profile", updateModelProfile);
router.patch("/model-profile/votes", updateVotes);
router.post("/user-profile", postUserProfile);
router.get("/chat-models", getChatModels);

export const apiRoutes = router;
