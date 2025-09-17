import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } from "../controllers/invoice.controller.js";
import { getInvoiceSummaryService } from "../services/invoice.service.js";
import { validateCreateInvoice, validateListInvoice } from "../validators/invoice.validator.js";
import { authorizeRole, authorizeInvoiceAccess } from '../middlewares/role.middleware.js';


const router = express.Router();

router.post('/', authenticate, authorizeAdmin, validateCreateInvoice, createInvoice);
router.get('/', authenticate, authorizeInvoiceAccess, validateListInvoice, getInvoices);
router.get('/summary', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const summary = await getInvoiceSummaryService({ ...req.query });
    res.status(200).json(summary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/:id', authenticate,  authorizeRole(['admin','manager','member']), getInvoiceById);
router.put('/:id', authenticate, authorizeAdmin, updateInvoice);
router.delete('/:id', authenticate, authorizeAdmin, deleteInvoice);

export default router;


