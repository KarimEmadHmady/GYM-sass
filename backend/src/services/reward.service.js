import Reward from "../models/userMangment/Reward.model.js";

// إنشاء مكافأة جديدة
export const createReward = async (data) => {
  return await Reward.create(data);
};

// جلب جميع المكافآت لمستخدم
export const getRewardsByUser = async (userId) => {
  return await Reward.find({ userId }).sort({ createdAt: -1 });
};

// تحديث مكافأة
export const updateReward = async (id, data) => {
  return await Reward.findByIdAndUpdate(id, data, { new: true });
};

// حذف مكافأة
export const deleteReward = async (id) => {
  return await Reward.findByIdAndDelete(id);
};
