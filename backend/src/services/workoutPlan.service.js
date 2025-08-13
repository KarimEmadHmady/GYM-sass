import WorkoutPlan from "../models/userMangment/WorkoutPlan.model.js";

// إنشاء خطة تمرين جديدة
export const createWorkoutPlan = async (data) => {
  return await WorkoutPlan.create(data);
};

// جلب جميع خطط التمارين لمستخدم معين
export const getWorkoutPlansByUser = async (userId) => {
  return await WorkoutPlan.find({ userId }).sort({ startDate: 1 });
};

// تعديل خطة تمرين
export const updateWorkoutPlan = async (id, data) => {
  return await WorkoutPlan.findByIdAndUpdate(id, data, { new: true });
};

// حذف خطة تمرين
export const deleteWorkoutPlan = async (id) => {
  return await WorkoutPlan.findByIdAndDelete(id);
};
