import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { createPayroll, getPayrolls, getPayrollById, updatePayroll, deletePayroll } from "../controllers/payroll.controller.js";
import { getPayrollSummaryService } from "../services/payroll.service.js";
import { validateCreatePayroll, validateListPayroll } from "../validators/payroll.validator.js";

const router = express.Router();

// منع الكاش لكل مسارات الرواتب
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('ETag', Date.now().toString());
  next();
});

router.post('/', authenticate, authorizeAdmin, validateCreatePayroll, createPayroll);
router.get('/', authenticate, authorizeAdmin, validateListPayroll, getPayrolls);
router.get('/summary', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const summary = await getPayrollSummaryService({ ...req.query });
    res.status(200).json(summary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/:id', authenticate, authorizeAdmin, getPayrollById);
router.put('/:id', authenticate, authorizeAdmin, updatePayroll);
router.delete('/:id', authenticate, authorizeAdmin, deletePayroll);

export default router;


