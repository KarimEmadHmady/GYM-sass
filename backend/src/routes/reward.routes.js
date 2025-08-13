import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import {
  createReward,
  getRewardsByUser,
  updateReward,
  deleteReward
} from "../controllers/reward.controller.js";

const router = express.Router();

// إنشاء مكافأة جديدة لمستخدم
router.post("/:userId", authenticate, authorizeAdmin, createReward);

// جلب جميع المكافآت لمستخدم
router.get("/:userId", authenticate, authorizeAdmin, getRewardsByUser);

// تعديل مكافأة
router.put("/:id", authenticate, authorizeAdmin, updateReward);

// حذف مكافأة
router.delete("/:id", authenticate, authorizeAdmin, deleteReward);

export default router;
