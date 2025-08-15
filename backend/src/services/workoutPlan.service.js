import WorkoutPlan from "../models/userMangment/WorkoutPlan.model.js";

// إنشاء خطة تمرين جديدة
export const createWorkoutPlanService = async (data) => {
  const { userId, planName, description, startDate, endDate, exercises } = data;
  if (!userId || !planName || !startDate || !endDate || !exercises) {
    throw new Error('userId, planName, startDate, endDate, and exercises are required');
  }
  const allowed = { userId, planName, description, startDate, endDate, exercises };
  return await WorkoutPlan.create(allowed);
};

// جلب جميع خطط التمارين لمستخدم معين
export const getWorkoutPlansByUserService = async (userId) => {
  return await WorkoutPlan.find({ userId }).sort({ startDate: 1 });
};

// جلب جميع خطط التمرين
export const getAllWorkoutPlansService = async () => {
  return await WorkoutPlan.find().sort({ createdAt: -1 });
};

// جلب جميع التمارين لخطة معينة
export const getExercisesByPlanIdService = async (planId) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) throw new Error('الخطة غير موجودة');
  return plan.exercises || [];
};

// تعديل خطة تمرين
export const updateWorkoutPlanService = async (id, data) => {
  return await WorkoutPlan.findByIdAndUpdate(id, data, { new: true });
};

// حذف خطة تمرين
export const deleteWorkoutPlanService = async (id) => {
  return await WorkoutPlan.findByIdAndDelete(id);
};

export const getWorkoutPlanByIdService = async (id) => {
  return await WorkoutPlan.findById(id);
};

// إضافة تمرين جديد لخطة
export const addExerciseToPlanService = async (planId, exercise) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) return null;
  plan.exercises.push(exercise);
  await plan.save();
  return plan;
};

// تعديل تمرين معين في الخطة
export const updateExerciseInPlanService = async (planId, exerciseIndex, updatedExercise) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan || !plan.exercises[exerciseIndex]) return null;
  plan.exercises[exerciseIndex] = { ...plan.exercises[exerciseIndex]._doc, ...updatedExercise };
  await plan.save();
  return plan;
};

// حذف تمرين معين من الخطة
export const deleteExerciseFromPlanService = async (planId, exerciseIndex) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan || !plan.exercises[exerciseIndex]) return null;
  plan.exercises.splice(exerciseIndex, 1);
  await plan.save();
  return plan;
};