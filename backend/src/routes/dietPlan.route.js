import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
  createDietPlan,
  getDietPlansByUser,
  updateDietPlan,
  deleteDietPlan
} from '../controllers/dietPlan.controller.js';

const router = express.Router();

// إنشاء خطة غذائية جديدة
router.post('/', authenticate, authorizeAdmin, createDietPlan);

// جلب جميع الخطط الغذائية لمستخدم
router.get('/:userId', authenticate, authorizeAdmin, getDietPlansByUser);

// تعديل خطة غذائية
router.put('/:id', authenticate, authorizeAdmin, updateDietPlan);

// حذف خطة غذائية
router.delete('/:id', authenticate, authorizeAdmin, deleteDietPlan);

export default router;
