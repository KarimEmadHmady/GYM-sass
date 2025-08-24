import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import {
  getUserPoints,
  addPoints,
  redeemPoints,
  getStats,
  addPointsFromPaymentController,
  addAttendancePointsController,
  getTopUsers
} from '../controllers/loyaltyPoints.controller.js';
import {
  addPointsSchema,
  redeemPointsSchema,
  paymentPointsSchema,
  attendancePointsSchema,
  topUsersSchema
} from '../validators/loyaltyPoints.validator.js';

// Middleware للتحقق من صحة البيانات
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'بيانات غير صحيحة',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const router = express.Router();

// جلب نقاط الولاء للمستخدم (يمكن للمستخدم رؤية نقاطه)
router.get('/user/:userId', authenticate, getUserPoints);

// جلب نقاط الولاء للمستخدم الحالي
router.get('/my-points', authenticate, getUserPoints);

// إضافة نقاط ولاء (للمدير فقط)
router.post('/add', authenticate, authorizeAdmin, validateRequest(addPointsSchema), addPoints);

// استبدال نقاط الولاء (للمستخدم نفسه)
router.post('/redeem', authenticate, validateRequest(redeemPointsSchema), redeemPoints);

// جلب إحصائيات نقاط الولاء (للمدير فقط)
router.get('/stats', authenticate, authorizeAdmin, getStats);

// جلب أفضل المستخدمين في النقاط
router.get('/top-users', authenticate, getTopUsers);

// إضافة نقاط من الدفع (للمدير فقط)
router.post('/payment-points', authenticate, authorizeAdmin, validateRequest(paymentPointsSchema), addPointsFromPaymentController);

// إضافة نقاط للحضور (للمدير والمدرب)
router.post('/attendance-points', authenticate, authorizeRole(['admin', 'trainer']), validateRequest(attendancePointsSchema), addAttendancePointsController);

export default router;
