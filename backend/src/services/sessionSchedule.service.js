import SessionSchedule from "../models/userMangment/SessionSchedule.model.js";

// إنشاء حصة جديدة
export const createSessionSchedule = async (data) => {
  return await SessionSchedule.create(data);
};

// جلب جميع الحصص لمستخدم
export const getSessionSchedulesByUser = async (userId) => {
  return await SessionSchedule.find({ userId }).sort({ date: 1 });
};

// تحديث بيانات حصة
export const updateSessionSchedule = async (id, data) => {
  return await SessionSchedule.findByIdAndUpdate(id, data, { new: true });
};

// حذف حصة
export const deleteSessionSchedule = async (id) => {
  return await SessionSchedule.findByIdAndDelete(id);
};
