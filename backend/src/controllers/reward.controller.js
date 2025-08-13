import {
  createRewardService,
  getRewardsByUserService,
  updateRewardService,
  deleteRewardService
} from "../services/reward.service.js";

// إنشاء مكافأة جديدة
export const createReward = async (req, res) => {
  try {
    const reward = await createRewardService({ 
      ...req.body,
      userId: req.params.userId
    });
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب جميع المكافآت لمستخدم
export const getRewardsByUser = async (req, res) => {
  try {
    const rewards = await getRewardsByUserService(req.params.userId);
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث مكافأة
export const updateReward = async (req, res) => {
  try {
    const updated = await updateRewardService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "المكافأة غير موجودة" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف مكافأة
export const deleteReward = async (req, res) => {
  try {
    const deleted = await deleteRewardService(req.params.id);
    if (!deleted) return res.status(404).json({ message: "المكافأة غير موجودة" });
    res.json({ message: "تم حذف المكافأة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
