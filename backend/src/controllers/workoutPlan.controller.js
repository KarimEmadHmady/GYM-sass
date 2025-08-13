import {
  createWorkoutPlanService,
  getWorkoutPlansByUserService,
  updateWorkoutPlanService,
  deleteWorkoutPlanService,
  getWorkoutPlanByIdService,
  addExerciseToPlanService,
  updateExerciseInPlanService,
  deleteExerciseFromPlanService
} from "../services/workoutPlan.service.js";

// إنشاء خطة تمرين جديدة
export const createWorkoutPlan = async (req, res) => {
  try {
    const plan = await createWorkoutPlanService({  
      ...req.body,
      userId: req.params.userId
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب جميع الخطط لمستخدم معين
export const getWorkoutPlansByUser = async (req, res) => {
  try {
    const plans = await getWorkoutPlansByUserService(req.params.userId);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب خطة تمرين واحدة بالـ id
export const getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await getWorkoutPlanByIdService(req.params.id);
    if (!plan) return res.status(404).json({ message: "الخطة غير موجودة" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل خطة تمرين
export const updateWorkoutPlan = async (req, res) => {
  try {
    const updated = await updateWorkoutPlanService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "الخطة غير موجودة" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف خطة تمرين
export const deleteWorkoutPlan = async (req, res) => {
  try {
    const deleted = await deleteWorkoutPlanService(req.params.id);
    if (!deleted) return res.status(404).json({ message: "الخطة غير موجودة" });
    res.json({ message: "تم حذف الخطة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// إضافة تمرين
export const addExerciseToPlan = async (req, res) => {
  try {
    const plan = await addExerciseToPlanService(req.params.planId, req.body);
    if (!plan) return res.status(404).json({ message: "الخطة غير موجودة" });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل تمرين
export const updateExerciseInPlan = async (req, res) => {
  try {
    const plan = await updateExerciseInPlanService(
      req.params.planId,
      req.params.exerciseIndex,
      req.body
    );
    if (!plan) return res.status(404).json({ message: "الخطة أو التمرين غير موجود" });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف تمرين
export const deleteExerciseFromPlan = async (req, res) => {
  try {
    const plan = await deleteExerciseFromPlanService(req.params.planId, req.params.exerciseIndex);
    if (!plan) return res.status(404).json({ message: "الخطة أو التمرين غير موجود" });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};