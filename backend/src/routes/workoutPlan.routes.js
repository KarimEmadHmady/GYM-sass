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
  deleteExerciseFromPlan,
  getAllWorkoutPlans,
  getExercisesByPlanId,
  getExerciseById
} from "../controllers/workoutPlan.controller.js";
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

//  خطة  
router.post("/:userId", authenticate,  authorizeRole(['admin','manager', 'trainer']), createWorkoutPlan);
router.get("/:userId", authenticate,  authorizeRole(['admin','manager', 'trainer','member']), getWorkoutPlansByUser);
router.get('/plan/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), getWorkoutPlanById);
router.put("/:id", authenticate,  authorizeRole(['admin','manager', 'trainer']), updateWorkoutPlan);
router.delete("/:id", authenticate,  authorizeRole(['admin','manager', 'trainer']), deleteWorkoutPlan);

//  تمرين
router.get('/', authenticate,  authorizeRole(['admin','manager', 'trainer']), getAllWorkoutPlans);
router.post("/:planId/exercises", authenticate,  authorizeRole(['admin','manager', 'trainer']), addExerciseToPlan);
router.get('/:planId/exercises', authenticate,  authorizeRole(['admin','manager', 'trainer', 'member']), getExercisesByPlanId);
router.get('/:planId/exercises/:exerciseId', authenticate, authorizeRole(['admin','manager', 'trainer', 'member']), getExerciseById);
router.put("/:planId/exercises/:exerciseId", authenticate, authorizeRole(['admin','manager', 'trainer', 'member']), updateExerciseInPlan);
router.delete("/:planId/exercises/:exerciseId", authenticate, authorizeRole(['admin','manager', 'trainer', 'member']), deleteExerciseFromPlan);


export default router;
