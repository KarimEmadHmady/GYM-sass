import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
  createDietPlan,
  getDietPlansByUser,
  updateDietPlan,
  deleteDietPlan,
  getMealById,
  getMealsByPlanId,
  addMealToPlan,
  updateMealInPlan,
  deleteMealFromPlan,
  getDietPlanById
} from '../controllers/dietPlan.controller.js';

const router = express.Router();

// الخطط الغذائية
router.post('/', authenticate, authorizeAdmin, createDietPlan);
router.get('/:id', authenticate, authorizeAdmin, getDietPlanById);
router.get('/:userId', authenticate, authorizeAdmin, getDietPlansByUser);
router.put('/:id', authenticate, authorizeAdmin, updateDietPlan);
router.delete('/:id', authenticate, authorizeAdmin, deleteDietPlan);

// الوجبات
router.get('/:planId/meals', authenticate, authorizeAdmin, getMealsByPlanId);
router.post('/:planId/meals', authenticate, authorizeAdmin, addMealToPlan);
router.put('/:planId/meals/:mealId', authenticate, authorizeAdmin, updateMealInPlan);
router.delete('/:planId/meals/:mealId', authenticate, authorizeAdmin, deleteMealFromPlan);
router.get('/meal/:mealId', authenticate, authorizeAdmin, getMealById);

export default router;
