import * as rewardService from "../services/reward.service.js";

// إنشاء مكافأة جديدة
export const createReward = async (req, res) => {
  try {
    const reward = await rewardService.createReward({
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
    const rewards = await rewardService.getRewardsByUser(req.params.userId);
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث مكافأة
export const updateReward = async (req, res) => {
  try {
    const updated = await rewardService.updateReward(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "المكافأة غير موجودة" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف مكافأة
export const deleteReward = async (req, res) => {
  try {
    const deleted = await rewardService.deleteReward(req.params.id);
    if (!deleted) return res.status(404).json({ message: "المكافأة غير موجودة" });
    res.json({ message: "تم حذف المكافأة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
