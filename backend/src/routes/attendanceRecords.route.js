import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
  createAttendanceRecord,
  getAttendanceRecordsByUser,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getAllAttendanceRecords
} from '../controllers/attendanceRecords.controller.js';

const router = express.Router();

// إنشاء سجل حضور جديد
router.post('/', authenticate, authorizeAdmin, createAttendanceRecord);

// جلب كل سجلات الحضور
router.get('/', authenticate, authorizeAdmin, getAllAttendanceRecords);

// جلب كل سجلات مستخدم معين
router.get('/:userId', authenticate, authorizeAdmin, getAttendanceRecordsByUser);

// تعديل سجل حضور
router.put('/:id', authenticate, authorizeAdmin, updateAttendanceRecord);

// حذف سجل حضور
router.delete('/:id', authenticate, authorizeAdmin, deleteAttendanceRecord);

export default router;
