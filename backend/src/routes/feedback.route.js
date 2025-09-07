import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createFeedback,
  getFeedbackForUser,
  updateFeedback,
  deleteFeedback,
  getAllFeedback
} from '../controllers/feedback.controller.js';
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// إضافة تقييم جديد
router.post('/', authenticate,  createFeedback);

// جلب جميع التقييمات
router.get('/', authenticate,  authorizeRole(['admin','manager', 'trainer']), getAllFeedback);

// جلب جميع التقييمات الخاصة بمستخدم معين
router.get('/:userId', authenticate,  authorizeRole(['admin','manager', 'trainer', 'member']), getFeedbackForUser);

// تعديل تقييم
router.put('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), updateFeedback);

// حذف تقييم
router.delete('/:id', authenticate,  authorizeRole(['admin','manager']), deleteFeedback);

export default router;
