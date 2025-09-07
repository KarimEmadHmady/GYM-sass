import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import {
  createReward,
  getRewardsByUser,
  updateReward,
  deleteReward,
  getAllRewards
} from "../controllers/reward.controller.js";
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// إنشاء مكافأة جديدة لمستخدم
router.post("/:userId", authenticate, authorizeAdmin, createReward);

// جلب جميع المكافآت
router.get("/", authenticate, authorizeAdmin, getAllRewards);

// جلب جميع المكافآت لمستخدم
router.get("/:userId", authenticate,  authorizeRole(['admin','manager', 'trainer','member']), getRewardsByUser);

// تعديل مكافأة
router.put("/:id", authenticate, authorizeAdmin, updateReward);

// حذف مكافأة
router.delete("/:id", authenticate, authorizeAdmin, deleteReward);

export default router;
