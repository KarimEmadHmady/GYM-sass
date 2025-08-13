import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import {
  createWorkoutPlan,
  getWorkoutPlansByUser,
  updateWorkoutPlan,
  deleteWorkoutPlan
} from "../controllers/workoutPlan.controller.js";

const router = express.Router();

// إنشاء خطة تمرين جديدة
router.post("/:userId", authenticate, authorizeAdmin, createWorkoutPlan);

// جلب جميع الخطط لمستخدم
router.get("/:userId", authenticate, authorizeAdmin, getWorkoutPlansByUser);

// تعديل خطة تمرين
router.put("/:id", authenticate, authorizeAdmin, updateWorkoutPlan);

// حذف خطة تمرين
router.delete("/:id", authenticate, authorizeAdmin, deleteWorkoutPlan);

export default router;
