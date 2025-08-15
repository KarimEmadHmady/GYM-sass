import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
  createClientProgress,
  getClientProgressByUser,
  updateClientProgress,
  deleteClientProgress,
  getAllClientProgress
} from '../controllers/clientProgress.controller.js';

const router = express.Router();

// إنشاء سجل تقدم جديد
router.post('/', authenticate, authorizeAdmin, createClientProgress);

// جلب كل سجلات التقدم
router.get('/', authenticate, authorizeAdmin, getAllClientProgress);

// جلب كل سجلات تقدم مستخدم
router.get('/:userId', authenticate, authorizeAdmin, getClientProgressByUser);

// تعديل سجل تقدم
router.put('/:id', authenticate, authorizeAdmin, updateClientProgress);

// حذف سجل تقدم
router.delete('/:id', authenticate, authorizeAdmin, deleteClientProgress);

export default router;
