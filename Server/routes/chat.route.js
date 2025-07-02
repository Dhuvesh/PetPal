import express from "express";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getChatByAdoption
} from "../controllers/chat.controller.js";

const router = express.Router();

/**
 * @route GET /api/chat/user-chats
 * @description Get all chats for a user
 * @access User
 */
router.get("/user-chats", getUserChats);

/**
 * @route GET /api/chat/messages/:chatId
 * @description Get messages for a specific chat
 * @access User (chat participant)
 */
router.get("/messages/:chatId", getChatMessages);

/**
 * @route POST /api/chat/send-message
 * @description Send a new message
 * @access User (chat participant)
 */
router.post("/send-message", sendMessage);

/**
 * @route PUT /api/chat/mark-read/:chatId
 * @description Mark messages as read
 * @access User (chat participant)
 */
router.put("/mark-read/:chatId", markMessagesAsRead);

/**
 * @route GET /api/chat/by-adoption/:adoptionId
 * @description Get chat by adoption ID
 * @access User (chat participant)
 */
router.get("/by-adoption/:adoptionId", getChatByAdoption);

export default router;