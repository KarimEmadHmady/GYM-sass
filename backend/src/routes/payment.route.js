import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
  createPayment,
  getPaymentsByUser,
  updatePayment,
  deletePayment,
  getAllPayments
} from '../controllers/payment.controller.js';

const router = express.Router();
ششش

// ➕ إنشاء دفعة جديدة
router.post('/', authenticate, authorizeAdmin, createPayment);

// جلب جميع الدفعات
router.get('/', authenticate, authorizeAdmin, getAllPayments);

// 📄 جلب جميع الدفعات لمستخدم معين
router.get('/:userId', authenticate, authorizeAdmin, getPaymentsByUser);

// ✏️ تعديل دفعة
router.put('/:id', authenticate, authorizeAdmin, updatePayment);

// 🗑️ حذف دفعة
router.delete('/:id', authenticate, authorizeAdmin, deletePayment);

export default router;
