
import { Router } from "express";
import { upload_image } from "../controllers/image.controller.js";
import { get_wechat_config } from "../controllers/wechat.controller.js";
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-image', upload.single('file'), upload_image);
router.get('/wechat-config', get_wechat_config);

export const apiRoutes = router;