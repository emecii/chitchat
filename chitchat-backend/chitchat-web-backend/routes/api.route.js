import { Router } from "express";
import { upload_image } from "../controllers/image.controller.js";
import { get_wechat_config } from "../controllers/wechat.controller.js";
import { sendMessage, joinChat } from "../controllers/chat.controller.js";
import { getUserProfile, postUserProfile, postUserTags, updateUserProfile } from "../controllers/user.controller.js";
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

/**
 * @swagger
 * /upload-image:
 *   post:
 *     summary: Upload an image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload.
 *       - in: body
 *         name: user_id
 *         type: string
 *         description: The id of the user.
 *       - in: body
 *         name: model_id
 *         type: string
 *         description: The id of the model.
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             image_url:
 *               type: string
 *       400:
 *         description: No image file.
 *       500:
 *         description: Error uploading the image.
 */

router.post("/upload-image", upload.single("file"), upload_image);

/**
 * @swagger
 * /wechat-config:
 *   get:
 *     summary: Retrieves wechat configuration
 *     parameters:
 *       - in: query
 *         name: url
 *         type: string
 *         description: The url.
 *     responses:
 *       200:
 *         description: Wechat configuration retrieved successfully.
 *         schema:
 *           type: object
 *           properties:
 *             appId:
 *               type: string
 *             timestamp:
 *               type: integer
 *             nonceStr:
 *               type: string
 *             signature:
 *               type: string
 */
router.get("/wechat-config", get_wechat_config);

/**
 * @swagger
 * /send-message:
 *   post:
 *     summary: Sends a message from a user to a model and returns a generated response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - user_id
 *               - model_id
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message that the user wants to send.
 *               user_id:
 *                 type: string
 *                 description: The ID of the user.
 *               model_id:
 *                 type: string
 *                 description: The ID of the model the user is chatting with.
 *     responses:
 *       200:
 *         description: Successfully sent the message and received a response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The AI's response to the user's message.
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                 user_id:
 *                   type: string
 *                   description: The ID of the user.
 *                 model_id:
 *                   type: string
 *                   description: The ID of the model the user is chatting with.
 *       500:
 *         description: An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
router.post("/send-message", sendMessage);

/**
 * @swagger
 * /join-chat:
 *   post:
 *     summary: Join an existing chat or start a new chat with a model.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - model_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user.
 *               model_id:
 *                 type: string
 *                 description: The ID of the model the user is chatting with.
 *     responses:
 *       200:
 *         description: Successfully joined the chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The initial message from the AI.
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *                 user_id:
 *                   type: string
 *                   description: The ID of the user.
 *                 model_id:
 *                   type: string
 *                   description: The ID of the model the user is chatting with.
 *                 chat_history:
 *                   type: array
 *                   description: The history of the chat conversation.
 *       500:
 *         description: An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
router.post("/join-chat", joinChat);


/**
 * @swagger
 * /model-profile:
 *   get:
 *     summary: Get a model profile by user_id, gender, is_public, model_id, or is_selected
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: The user's id
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: The gender of the model
 *       - in: query
 *         name: is_public
 *         schema:
 *           type: boolean
 *         description: Whether the model is public
 *       - in: query
 *         name: model_id
 *         schema:
 *           type: string
 *         description: The model's id
 *       - in: query
 *         name: is_selected
 *         schema:
 *           type: boolean
 *         description: Whether the model is selected
 *     responses:
 *       200:
 *         description: The model profile was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ModelProfile'
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/model-profile", getModelProfile);

/**
 * @swagger
 * /model-profile:
 *   post:
 *     summary: Create a new model profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModelProfile'
 *     responses:
 *       200:
 *         description: The model profile was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *       409:
 *         description: Conflict - Model already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/model-profile", postModelProfile);


/**
 * @swagger
 * /user-profile/{user_id}:
 *   get:
 *     summary: Retrieves a user's profile by user_id.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message regarding the user retrieval status.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 status:
 *                   type: string
 *                   description: The status of the operation.
 *       404:
 *         description: The user was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
router.get("/user-profile/:user_id", getUserProfile);
/**
 * @swagger
 * /user-profile:
 *   post:
 *     summary: Create a new user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               user_name:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthday:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *               profile_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user profile was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/user-profile", postUserProfile);
/**
 * @swagger
 * /update-user-profile:
 *   post:
 *     summary: Update an existing user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               user_name:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthday:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *               profile_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user profile was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: User Id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/update-user-profile", updateUserProfile);
/**
 * @swagger
 * /user-tags:
 *   post:
 *     summary: Create a new user tags profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               user_tags:
 *                 type: string[]
 *               user_mbti_tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user tags were successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/user-tags", postUserTags);
/**
 * @swagger
 * /model-profile:
 *   put:
 *     summary: Update an existing model profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModelProfile'
 *     responses:
 *       200:
 *         description: The model profile was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/model-profile", updateModelProfile);
/**
 * @swagger
 * /model-profile/votes:
 *   patch:
 *     summary: Update the votes for a model profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model_id:
 *                 type: string
 *               upVote:
 *                 type: number
 *               downVote:
 *                 type: number
 *     responses:
 *       200:
 *         description: The votes were successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.patch("/model-profile/votes", updateVotes);
/**
 * @swagger
 * /chat-models:
 *   get:
 *     summary: Get a list of model IDs that a user has chatted with
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: The user's id
 *     responses:
 *       200:
 *         description: The list of model IDs was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/chat-models", getChatModels);

export const apiRoutes = router;
