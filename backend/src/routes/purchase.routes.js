import express from "express";
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import {
    createPurchase,
    getPurchases,
    getPurchase,
    updatePurchase,
    deletePurchase
} from "../controllers/purchase.controller.js";

const router = express.Router();

// إنشاء عملية شراء جديدة
router.post("/", authenticate, authorizeAdmin, createPurchase);

// جلب كل المشتريات
router.get("/", authenticate, authorizeAdmin, getPurchases);

// جلب عملية شراء واحدة
router.get("/:id", authenticate, authorizeAdmin, getPurchase);

// تحديث عملية شراء
router.put("/:id", authenticate, authorizeAdmin, updatePurchase);

// حذف عملية شراء
router.delete("/:id", authenticate, authorizeAdmin, deletePurchase);

export default router;
