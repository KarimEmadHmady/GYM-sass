import ClientProgress from '../models/userMangment/ClientProgress.model.js';

// إنشاء سجل جديد
export const createClientProgressService = async (data) => {
  const { userId, date, weight, bodyFatPercentage, notes } = data;
  if (!userId || !date) {
    throw new Error('userId and date are required');
  }
  const allowed = { userId, date, weight, bodyFatPercentage, notes };
  return await ClientProgress.create(allowed);
};

// جلب السجلات لمستخدم معين
export const getClientProgressByUserService = async (userId) => {
  return await ClientProgress.find({ userId }).sort({ date: -1 });
};

// جلب كل السجلات
export const getAllClientProgressService = async () => {
  return await ClientProgress.find().sort({ date: -1 });
};

// تعديل سجل
export const updateClientProgressService = async (id, data) => {
  const progress = await ClientProgress.findByIdAndUpdate(id, data, { new: true });
  if (!progress) throw new Error('Client progress record not found');
  return progress;
};

// حذف سجل
export const deleteClientProgressService = async (id) => {
  const progress = await ClientProgress.findByIdAndDelete(id);
  if (!progress) throw new Error('Client progress record not found');
  return progress;
};
