import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createFeedback,
  getFeedbackForUser,
  updateFeedback,
  deleteFeedback,
  getAllFeedback
} from '../controllers/feedback.controller.js';

const router = express.Router();

// إضافة تقييم جديد
router.post('/', authenticate,  createFeedback);

// جلب جميع التقييمات
router.get('/', authenticate, getAllFeedback);

// جلب جميع التقييمات الخاصة بمستخدم معين
router.get('/:userId', authenticate,  getFeedbackForUser);

// تعديل تقييم
router.put('/:id', authenticate,  updateFeedback);

// حذف تقييم
router.delete('/:id', authenticate,  deleteFeedback);

export default router;
