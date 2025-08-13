import Reward from "../models/userMangment/Reward.model.js";

// إنشاء مكافأة جديدة
export const createRewardService = async (data) => {
  const { userId, points, redeemedFor, date } = data;
  if (!userId || !points) {
    throw new Error('userId and points are required');
  }
  const allowed = { userId, points, redeemedFor, date };
  return await Reward.create(allowed);
};

// جلب جميع المكافآت لمستخدم
export const getRewardsByUserService = async (userId) => {
  return await Reward.find({ userId }).sort({ createdAt: -1 });
};

// تحديث مكافأة
export const updateRewardService = async (id, data) => {
  return await Reward.findByIdAndUpdate(id, data, { new: true });
};

// حذف مكافأة
export const deleteRewardService = async (id) => {
  return await Reward.findByIdAndDelete(id);
};
