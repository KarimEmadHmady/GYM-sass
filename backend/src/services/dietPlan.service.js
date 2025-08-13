import DietPlan from '../models/userMangment/DietPlan.model.js';

// إنشاء خطة غذائية جديدة
export const createDietPlanService = async (data) => {
  return await DietPlan.create(data);
};

// جلب جميع الخطط الغذائية لمستخدم معين
export const getDietPlansByUserService = async (userId) => {
  return await DietPlan.find({ userId }).sort({ startDate: -1 });
};

// تعديل خطة غذائية
export const updateDietPlanService = async (id, data) => {
  const plan = await DietPlan.findByIdAndUpdate(id, data, { new: true });
  if (!plan) throw new Error('Diet plan not found');
  return plan;
};

// حذف خطة غذائية
export const deleteDietPlanService = async (id) => {
  const plan = await DietPlan.findByIdAndDelete(id);
  if (!plan) throw new Error('Diet plan not found');
  return plan;
};
