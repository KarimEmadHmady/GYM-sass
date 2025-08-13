import Payment from '../models/userMangment/Payment.model.js';

// ➕ إنشاء دفعة جديدة
export const createPaymentService = async (data) => {
  const { userId, amount, date, method, notes } = data;
  if (!userId || !amount || !date) {
    throw new Error('userId, amount, and date are required');
  }
  const allowed = { userId, amount, date, method, notes };
  return await Payment.create(allowed);
};

// 📄 جلب جميع الدفعات لمستخدم معين
export const getPaymentsByUserService = async (userId) => {
  return await Payment.find({ userId }).sort({ date: -1 });
};

// ✏️ تعديل دفعة
export const updatePaymentService = async (id, data) => {
  const payment = await Payment.findByIdAndUpdate(id, data, { new: true });
  if (!payment) throw new Error('لم يتم العثور على الدفعة');
  return payment;
};

// 🗑️ حذف دفعة
export const deletePaymentService = async (id) => {
  const payment = await Payment.findByIdAndDelete(id);
  if (!payment) throw new Error('لم يتم العثور على الدفعة');
  return payment;
};
