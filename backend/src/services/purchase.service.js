import Purchase from "../models/userMangment/Payment.model.js";

// إنشاء عملية شراء جديدة
export const createPurchase = async (data) => {
  return await Purchase.create(data);
};

// جلب كل المشتريات لمستخدم معين
export const getPurchasesByUser = async (userId) => {
  return await Purchase.find({ userId }).sort({ createdAt: -1 });
};

// جلب عملية شراء واحدة بالـ ID
export const getPurchaseById = async (id) => {
  return await Purchase.findById(id);
};

// تحديث عملية شراء
export const updatePurchase = async (id, data) => {
  return await Purchase.findByIdAndUpdate(id, data, { new: true });
};

// حذف عملية شراء
export const deletePurchase = async (id) => {
  return await Purchase.findByIdAndDelete(id);
};
