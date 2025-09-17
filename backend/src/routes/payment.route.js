import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
  createPayment,
  getPaymentsByUser,
  updatePayment,
  deletePayment,
  getAllPayments
} from '../controllers/payment.controller.js';
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// ➕ إنشاء دفعة جديدة
router.post('/', authenticate, authorizeRole(['admin','manager']), createPayment);

// جلب جميع الدفعات
router.get('/', authenticate, authorizeRole(['admin','manager']), getAllPayments);

// 📄 جلب جميع الدفعات لمستخدم معين
router.get('/:userId', authenticate, authorizeRole(['admin','manager','member']), getPaymentsByUser);

// ✏️ تعديل دفعة
router.put('/:id', authenticate, authorizeRole(['admin','manager']), updatePayment);

// 🗑️ حذف دفعة
router.delete('/:id', authenticate, authorizeAdmin, deletePayment);

export default router;
