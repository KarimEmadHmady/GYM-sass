import User from '../models/user.model.js';
import Reward from '../models/userMangment/Reward.model.js';

/**
 * إضافة نقاط ولاء للمستخدم
 * @param {string} userId - معرف المستخدم
 * @param {number} points - عدد النقاط المراد إضافتها
 * @param {string} reason - سبب إضافة النقاط
 * @returns {Object} المستخدم المحدث
 */
export const addLoyaltyPoints = async (userId, points, reason) => {
  if (!userId || !points || points <= 0) {
    throw new Error('بيانات غير صحيحة: معرف المستخدم وعدد النقاط مطلوبان');
  }

  // التحقق من وجود المستخدم
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }

  // إضافة النقاط للمستخدم
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { loyaltyPoints: points } },
    { new: true }
  );

  // تسجيل العملية في جدول Rewards
  await Reward.create({
    userId,
    points,
    redeemedFor: reason,
    date: new Date()
  });

  return updatedUser;
};

/**
 * استبدال نقاط الولاء
 * @param {string} userId - معرف المستخدم
 * @param {number} points - عدد النقاط المراد استبدالها
 * @param {string} reward - المكافأة المستبدلة
 * @returns {Object} المستخدم المحدث
 */
export const redeemLoyaltyPoints = async (userId, points, reward) => {
  if (!userId || !points || points <= 0) {
    throw new Error('بيانات غير صحيحة: معرف المستخدم وعدد النقاط مطلوبان');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }

  if (user.loyaltyPoints < points) {
    throw new Error('نقاط غير كافية للاستبدال');
  }

  // خصم النقاط
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { loyaltyPoints: -points } },
    { new: true }
  );

  // تسجيل الاستبدال
  await Reward.create({
    userId,
    points: -points,
    redeemedFor: reward,
    date: new Date()
  });

  return updatedUser;
};

/**
 * جلب نقاط الولاء للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Object} معلومات النقاط
 */
export const getUserLoyaltyPoints = async (userId) => {
  const user = await User.findById(userId).select('loyaltyPoints name email');
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }

  // جلب سجل النقاط
  const rewardsHistory = await Reward.find({ userId })
    .sort({ date: -1 })
    .limit(10);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      loyaltyPoints: user.loyaltyPoints
    },
    history: rewardsHistory
  };
};

/**
 * حساب نقاط الولاء من المدفوعات
 * @param {number} amount - مبلغ الدفع
 * @returns {number} عدد النقاط المكتسبة
 */
export const calculatePointsFromPayment = (amount) => {
  // قاعدة: كل 10 جنيه = نقطة واحدة
  return Math.floor(amount / 10);
};

/**
 * إضافة نقاط تلقائياً عند الدفع
 * @param {string} userId - معرف المستخدم
 * @param {number} amount - مبلغ الدفع
 * @param {string} paymentType - نوع الدفع
 * @returns {Object} المستخدم المحدث
 */
export const addPointsFromPayment = async (userId, amount, paymentType) => {
  const points = calculatePointsFromPayment(amount);
  
  if (points > 0) {
    const reason = `دفع ${paymentType} - ${amount} جنيه`;
    return await addLoyaltyPoints(userId, points, reason);
  }
  
  return await User.findById(userId);
};

/**
 * جلب إحصائيات نقاط الولاء
 * @returns {Object} الإحصائيات
 */
export const getLoyaltyPointsStats = async () => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalPoints: { $sum: '$loyaltyPoints' },
        totalUsers: { $sum: 1 },
        avgPoints: { $avg: '$loyaltyPoints' },
        maxPoints: { $max: '$loyaltyPoints' }
      }
    }
  ]);

  const topUsers = await User.find({ loyaltyPoints: { $gt: 0 } })
    .sort({ loyaltyPoints: -1 })
    .limit(10)
    .select('name email loyaltyPoints');

  return {
    stats: stats[0] || { totalPoints: 0, totalUsers: 0, avgPoints: 0, maxPoints: 0 },
    topUsers
  };
};

/**
 * إضافة نقاط للحضور
 * @param {string} userId - معرف المستخدم
 * @param {number} attendanceStreak - عدد أيام الحضور المتتالية
 * @returns {Object} المستخدم المحدث
 */
export const addAttendancePoints = async (userId, attendanceStreak) => {
  let points = 0;
  let reason = '';

  if (attendanceStreak >= 7) {
    points = 50;
    reason = 'حضور أسبوع متتالي';
  } else if (attendanceStreak >= 3) {
    points = 20;
    reason = 'حضور 3 أيام متتالية';
  } else {
    points = 5;
    reason = 'حضور اليوم';
  }

  return await addLoyaltyPoints(userId, points, reason);
};
