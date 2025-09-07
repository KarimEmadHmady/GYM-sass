import express from "express";
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
    createPurchase,
    getPurchases,
    getPurchase,
    updatePurchase,
    deletePurchase
} from "../controllers/purchase.controller.js";
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// إنشاء عملية شراء جديدة
router.post("/", authenticate,  authorizeRole(['admin','manager']), createPurchase);

// جلب كل المشتريات
router.get("/", authenticate,  authorizeRole(['admin','manager']), getPurchases);

// جلب عملية شراء واحدة
router.get("/:id", authenticate,  authorizeRole(['admin','manager']), getPurchase);

// تحديث عملية شراء
router.put("/:id", authenticate, authorizeAdmin, updatePurchase);

// حذف عملية شراء
router.delete("/:id", authenticate, authorizeAdmin, deletePurchase);

export default router;
