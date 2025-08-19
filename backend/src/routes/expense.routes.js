import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getExpenseSummary } from "../controllers/expense.controller.js";
import { validateCreateExpense, validateListExpense } from "../validators/expense.validator.js";

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, validateCreateExpense, createExpense);
router.get('/', authenticate, authorizeAdmin, validateListExpense, getExpenses);
router.get('/summary', authenticate, authorizeAdmin, validateListExpense, getExpenseSummary);
router.get('/:id', authenticate, authorizeAdmin, getExpenseById);
router.put('/:id', authenticate, authorizeAdmin, updateExpense);
router.delete('/:id', authenticate, authorizeAdmin, deleteExpense);

export default router;


