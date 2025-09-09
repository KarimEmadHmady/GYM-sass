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
  getDietPlanById,
  getAllDietPlans
} from '../controllers/dietPlan.controller.js';
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// الخطط الغذائية
router.get('/', authenticate,  authorizeRole(['admin','manager', 'trainer']), getAllDietPlans);
router.post('/', authenticate,  authorizeRole(['admin','manager', 'trainer']), createDietPlan);
router.get('/user/:userId', authenticate,  authorizeRole(['admin','manager', 'trainer']), getDietPlansByUser); // Changed to be more specific
router.get('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer', 'member']), getDietPlanById);
router.put('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), updateDietPlan);
router.delete('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), deleteDietPlan);

// الوجبات
router.get('/:planId/meals', authenticate,  authorizeRole(['admin','manager', 'trainer']), getMealsByPlanId);
router.post('/:planId/meals', authenticate,  authorizeRole(['admin','manager', 'trainer']), addMealToPlan);
router.put('/:planId/meals/:mealId', authenticate,  authorizeRole(['admin','manager', 'trainer']), updateMealInPlan);
router.delete('/:planId/meals/:mealId', authenticate,  authorizeRole(['admin','manager', 'trainer']), deleteMealFromPlan);
router.get('/meal/:mealId', authenticate,  authorizeRole(['admin','manager', 'trainer', 'member']), getMealById);

export default router;
