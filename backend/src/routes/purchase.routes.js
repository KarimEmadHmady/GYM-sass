import express from "express";
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import * as purchaseController from "../controllers/purchase.controller.js";

const router = express.Router();

// إنشاء عملية شراء جديدة
router.post("/", authenticate, authorizeAdmin, purchaseController.createPurchase);

// جلب كل المشتريات
router.get("/", authenticate, authorizeAdmin, purchaseController.getPurchases);

// جلب عملية شراء واحدة
router.get("/:id", authenticate, authorizeAdmin, purchaseController.getPurchase);

// تحديث عملية شراء
router.put("/:id", authenticate, authorizeAdmin, purchaseController.updatePurchase);

// حذف عملية شراء
router.delete("/:id", authenticate, authorizeAdmin, purchaseController.deletePurchase);

export default router;
