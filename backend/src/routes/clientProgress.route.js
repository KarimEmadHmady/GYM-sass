import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import {
  createClientProgress,
  getClientProgressByUser,
  updateClientProgress,
  deleteClientProgress,
  getAllClientProgress
} from '../controllers/clientProgress.controller.js';

const router = express.Router();

// إنشاء سجل تقدم جديد
router.post('/', authenticate,  authorizeRole(['admin','manager', 'trainer']), createClientProgress);

// جلب كل سجلات التقدم
router.get('/', authenticate,  authorizeRole(['admin','manager', 'trainer']), getAllClientProgress);

// جلب كل سجلات تقدم مستخدم
router.get('/:userId', authenticate,  authorizeRole(['admin','manager', 'trainer', 'member']), getClientProgressByUser);

// تعديل سجل تقدم
router.put('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), updateClientProgress);

// حذف سجل تقدم
router.delete('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), deleteClientProgress);

export default router;
