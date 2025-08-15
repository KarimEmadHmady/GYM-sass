import SessionSchedule from "../models/userMangment/SessionSchedule.model.js";

// إنشاء حصة جديدة
export const createSessionScheduleService = async (data) => { 
  const { userId, date, startTime, endTime, description } = data;
  if (!userId || !date || !startTime || !endTime) {
    throw new Error('userId, date, startTime, and endTime are required');
  }
  const allowed = { userId, date, startTime, endTime, description };
  return await SessionSchedule.create(allowed);
};

// جلب جميع الحصص لمستخدم
export const getSessionSchedulesByUserService = async (userId) => {
  return await SessionSchedule.find({ userId }).sort({ date: 1 });
};

// جلب جميع الحصص
export const getAllSessionSchedulesService = async () => {
  return await SessionSchedule.find().sort({ date: 1 });
};

// تحديث بيانات حصة
export const updateSessionScheduleService = async (id, data) => {
  return await SessionSchedule.findByIdAndUpdate(id, data, { new: true });
};

// حذف حصة
export const deleteSessionScheduleService = async (id) => {
  return await SessionSchedule.findByIdAndDelete(id);
};
