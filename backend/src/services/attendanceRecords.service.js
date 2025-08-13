import AttendanceRecord from '../models/userMangment/AttendanceRecord.model.js';

// إنشاء سجل جديد
export const createAttendanceRecordService = async (data) => {
  return await AttendanceRecord.create(data);
};
// جلب كل السجلات لمستخدم معين
export const getAttendanceRecordsByUserService = async (userId) => {
  return await AttendanceRecord.find({ userId }).sort({ date: -1 });
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
