import * as workoutPlanService from "../services/workoutPlan.service.js";

// إنشاء خطة تمرين جديدة
export const createWorkoutPlan = async (req, res) => {
  try {
    const plan = await workoutPlanService.createWorkoutPlan({
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
    const plans = await workoutPlanService.getWorkoutPlansByUser(req.params.userId);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل خطة تمرين
export const updateWorkoutPlan = async (req, res) => {
  try {
    const updated = await workoutPlanService.updateWorkoutPlan(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "الخطة غير موجودة" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف خطة تمرين
export const deleteWorkoutPlan = async (req, res) => {
  try {
    const deleted = await workoutPlanService.deleteWorkoutPlan(req.params.id);
    if (!deleted) return res.status(404).json({ message: "الخطة غير موجودة" });
    res.json({ message: "تم حذف الخطة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
