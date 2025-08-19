import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { searchFinancial, getFinancialSummary } from "../controllers/financial.controller.js";
import { validateFinancialSearch, validateFinancialSummary } from "../validators/financial.validator.js";

const router = express.Router();

// Unified financial search across Revenue, Expense, Invoice, Payroll, Payment, Purchase
router.get("/search", authenticate, authorizeAdmin, validateFinancialSearch, searchFinancial);
router.get("/summary", authenticate, authorizeAdmin, validateFinancialSummary, getFinancialSummary);

export default router;


