import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import {
  createWorkoutPlan,
  getWorkoutPlansByUser,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutPlanById,
  addExerciseToPlan,
  updateExerciseInPlan,
  deleteExerciseFromPlan
} from "../controllers/workoutPlan.controller.js";

const router = express.Router();

//  خطة  
router.post("/:userId", authenticate, authorizeAdmin, createWorkoutPlan);
router.get("/:userId", authenticate, authorizeAdmin, getWorkoutPlansByUser);
router.get('/plan/:id', authenticate, authorizeAdmin, getWorkoutPlanById);
router.put("/:id", authenticate, authorizeAdmin, updateWorkoutPlan);
router.delete("/:id", authenticate, authorizeAdmin, deleteWorkoutPlan);

//  تمرين
router.post("/:planId/exercises", authenticate, authorizeAdmin, addExerciseToPlan);
router.put("/:planId/exercises/:exerciseIndex", authenticate, authorizeAdmin, updateExerciseInPlan);
router.delete("/:planId/exercises/:exerciseIndex", authenticate, authorizeAdmin, deleteExerciseFromPlan);


export default router;
