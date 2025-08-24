import {
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  getUserLoyaltyPoints,
  addPointsFromPayment,
  getLoyaltyPointsStats,
  addAttendancePoints
} from '../services/loyaltyPoints.service.js';

/**
 * جلب نقاط الولاء للمستخدم
 */
export const getUserPoints = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const loyaltyData = await getUserLoyaltyPoints(userId);
    res.json(loyaltyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * إضافة نقاط ولاء للمستخدم (للمدير فقط)
 */
export const addPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;
    
    if (!userId || !points || !reason) {
      return res.status(400).json({ 
        message: 'جميع الحقول مطلوبة: userId, points, reason' 
      });
    }

    const updatedUser = await addLoyaltyPoints(userId, points, reason);
    res.json({
      message: 'تم إضافة النقاط بنجاح',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * استبدال نقاط الولاء
 */
export const redeemPoints = async (req, res) => {
  try {
    const { userId, points, reward } = req.body;
    
    if (!userId || !points || !reward) {
      return res.status(400).json({ 
        message: 'جميع الحقول مطلوبة: userId, points, reward' 
      });
    }

    const updatedUser = await redeemLoyaltyPoints(userId, points, reward);
    res.json({
      message: 'تم استبدال النقاط بنجاح',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * جلب إحصائيات نقاط الولاء (للمدير فقط)
 */
export const getStats = async (req, res) => {
  try {
    const stats = await getLoyaltyPointsStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * إضافة نقاط من الدفع (يتم استدعاؤها تلقائياً)
 */
export const addPointsFromPaymentController = async (req, res) => {
  try {
    const { userId, amount, paymentType } = req.body;
    
    if (!userId || !amount || !paymentType) {
      return res.status(400).json({ 
        message: 'جميع الحقول مطلوبة: userId, amount, paymentType' 
      });
    }

    const updatedUser = await addPointsFromPayment(userId, amount, paymentType);
    res.json({
      message: 'تم إضافة النقاط من الدفع بنجاح',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * إضافة نقاط للحضور
 */
export const addAttendancePointsController = async (req, res) => {
  try {
    const { userId, attendanceStreak } = req.body;
    
    if (!userId || !attendanceStreak) {
      return res.status(400).json({ 
        message: 'جميع الحقول مطلوبة: userId, attendanceStreak' 
      });
    }

    const updatedUser = await addAttendancePoints(userId, attendanceStreak);
    res.json({
      message: 'تم إضافة نقاط الحضور بنجاح',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from '../models/user.model.js';

/**
 * جلب أفضل المستخدمين في النقاط
 */
export const getTopUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topUsers = await User.find({ loyaltyPoints: { $gt: 0 } })
      .sort({ loyaltyPoints: -1 })
      .limit(limit)
      .select('name email loyaltyPoints avatarUrl');

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
