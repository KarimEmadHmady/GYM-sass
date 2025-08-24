import AttendanceRecord from '../models/userMangment/AttendanceRecord.model.js';
import { addAttendancePoints } from './loyaltyPoints.service.js';

// إنشاء سجل جديد
export const createAttendanceRecordService = async (data) => {
  const { userId, date, status, notes } = data;
  if (!userId || !date) {
    throw new Error('userId and date are required');
  }
  const allowed = { userId, date, status, notes };
  
  // إنشاء سجل الحضور
  const record = await AttendanceRecord.create(allowed);
  
  // إضافة نقاط الحضور إذا كان الحضور "present"
  if (status === 'present') {
    try {
      // حساب عدد أيام الحضور المتتالية
      const attendanceStreak = await calculateAttendanceStreak(userId);
      await addAttendancePoints(userId, attendanceStreak);
    } catch (error) {
      console.error('خطأ في إضافة نقاط الحضور:', error.message);
      // لا نوقف العملية إذا فشلت إضافة النقاط
    }
  }
  
  return record;
};

// حساب عدد أيام الحضور المتتالية
const calculateAttendanceStreak = async (userId) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // جلب سجلات الحضور للـ 7 أيام الماضية
  const recentRecords = await AttendanceRecord.find({
    userId,
    date: { $gte: yesterday },
    status: 'present'
  }).sort({ date: -1 });
  
  return recentRecords.length;
};
// جلب كل السجلات لمستخدم معين
export const getAttendanceRecordsByUserService = async (userId) => {
  return await AttendanceRecord.find({ userId }).sort({ date: -1 });
};

// جلب كل السجلات
export const getAllAttendanceRecordsService = async () => {
  return await AttendanceRecord.find().sort({ date: -1 });
};

// تعديل سجل
export const updateAttendanceRecordService = async (id, data) => {
  const record = await AttendanceRecord.findByIdAndUpdate(id, data, { new: true });
  if (!record) throw new Error('Attendance record not found');
  return record;
};

// حذف سجل
export const deleteAttendanceRecordService = async (id) => {
  const record = await AttendanceRecord.findByIdAndDelete(id);
  if (!record) throw new Error('Attendance record not found');
  return record;
};
