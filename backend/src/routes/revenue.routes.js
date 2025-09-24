import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { createRevenue, getRevenues, getRevenueById, updateRevenue, deleteRevenue, getRevenueSummary } from "../controllers/revenue.controller.js";
import { validateCreateRevenue, validateListRevenue } from "../validators/revenue.validator.js";
import { authorizeRole } from '../middlewares/role.middleware.js';


const router = express.Router();

router.post('/', authenticate,  authorizeRole(['admin','manager']), validateCreateRevenue, createRevenue);
router.get('/', authenticate, authorizeAdmin, validateListRevenue, getRevenues);
router.get('/summary', authenticate, authorizeAdmin, validateListRevenue, getRevenueSummary);
router.get('/:id', authenticate, authorizeAdmin, getRevenueById);
router.put('/:id', authenticate, authorizeAdmin, updateRevenue);
router.delete('/:id', authenticate, authorizeAdmin, deleteRevenue);

export default router;


