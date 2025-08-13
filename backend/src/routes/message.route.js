import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createMessage,
  getMessagesForUser,
  updateMessageStatus,
  deleteMessage
} from '../controllers/message.controller.js';

const router = express.Router();

// إرسال رسالة جديدة
router.post('/', authenticate,  createMessage);

// جلب جميع الرسائل الخاصة بمستخدم معين
router.get('/:userId', authenticate, getMessagesForUser);

// تحديث حالة قراءة الرسالة
router.put('/:id/read', authenticate, updateMessageStatus);

// حذف رسالة
router.delete('/:id', authenticate, deleteMessage);

export default router;
