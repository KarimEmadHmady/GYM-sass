import ClientProgress from '../models/userMangment/ClientProgress.model.js';

// إنشاء سجل جديد
export const createClientProgressService = async (data) => {
  const {
    userId,
    trainerId,
    date,
    weight,
    bodyFatPercentage,
    muscleMass,
    waist,
    chest,
    arms,
    legs,
    weightChange,
    fatChange,
    muscleChange,
    status,
    advice,
    notes
  } = data;
  if (!userId || !date) {
    throw new Error('userId and date are required');
  }
  const allowed = {
    userId,
    trainerId,
    date,
    weight,
    bodyFatPercentage,
    muscleMass,
    waist,
    chest,
    arms,
    legs,
    weightChange,
    fatChange,
    muscleChange,
    status,
    advice,
    notes
  };
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

// جلب السجلات حسب المدرب
export const getClientProgressByTrainerService = async (trainerId) => {
  return await ClientProgress.find({ trainerId }).sort({ date: -1 });
};

// تعديل سجل
export const updateClientProgressService = async (id, data) => {
  const allowed = {
    date: data.date,
    weight: data.weight,
    bodyFatPercentage: data.bodyFatPercentage,
    muscleMass: data.muscleMass,
    waist: data.waist,
    chest: data.chest,
    arms: data.arms,
    legs: data.legs,
    weightChange: data.weightChange,
    fatChange: data.fatChange,
    muscleChange: data.muscleChange,
    status: data.status,
    advice: data.advice,
    notes: data.notes
  };
  const progress = await ClientProgress.findByIdAndUpdate(id, allowed, { new: true });
  if (!progress) throw new Error('Client progress record not found');
  return progress;
};

// حذف سجل
export const deleteClientProgressService = async (id) => {
  const progress = await ClientProgress.findByIdAndDelete(id);
  if (!progress) throw new Error('Client progress record not found');
  return progress;
};
