import WorkoutPlan from "../models/userMangment/WorkoutPlan.model.js";

// إنشاء خطة تمرين جديدة
export const createWorkoutPlanService = async (data) => {
  const { userId, planName, description, startDate, endDate, exercises, trainerId } = data;
  if (!userId || !planName || !startDate || !endDate || !exercises) {
    throw new Error('userId, planName, startDate, endDate, and exercises are required');
  }
  const allowed = { userId, planName, description, startDate, endDate, exercises };
  if (trainerId) {
    allowed.trainerId = trainerId;
  }
  return await WorkoutPlan.create(allowed);
};

// جلب جميع خطط التمارين لمستخدم معين
export const getWorkoutPlansByUserService = async (userId) => {
  return await WorkoutPlan.find({ userId }).sort({ startDate: 1 });
};

// جلب جميع خطط التمرين
export const getAllWorkoutPlansService = async (filters = {}) => {
  const query = {};
  if (filters.trainerId) {
    query.trainerId = filters.trainerId;
  }
  return await WorkoutPlan.find(query).sort({ createdAt: -1 });
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

// جلب تمرين معين من الخطة بواسطة الـ ID
export const getExerciseByIdService = async (planId, exerciseId) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) return null;

  const exercise = plan.exercises.find(exercise => exercise._id.toString() === exerciseId);
  return exercise || null;
};

// تعديل تمرين معين في الخطة
export const updateExerciseInPlanService = async (planId, exerciseId, updatedExercise) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) return null;

  const exerciseIndex = plan.exercises.findIndex(exercise => exercise._id.toString() === exerciseId);
  if (exerciseIndex === -1) return null;

  // Update the specific exercise
  Object.assign(plan.exercises[exerciseIndex], updatedExercise);
  await plan.save();
  return plan;
};

// حذف تمرين معين من الخطة
export const deleteExerciseFromPlanService = async (planId, exerciseId) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) return null;

  const exerciseIndex = plan.exercises.findIndex(exercise => exercise._id.toString() === exerciseId);
  if (exerciseIndex === -1) return null;

  plan.exercises.splice(exerciseIndex, 1);
  await plan.save();
  return plan;
};