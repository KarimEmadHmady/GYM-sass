import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import {
  createSessionSchedule,
  getSessionSchedulesByUser,
  updateSessionSchedule,
  deleteSessionSchedule
} from "../controllers/sessionSchedule.controller.js";

const router = express.Router();

// إنشاء حصة جديدة
router.post("/:userId", authenticate, authorizeAdmin, createSessionSchedule);

// جلب جميع الحصص لمستخدم
router.get("/:userId", authenticate, authorizeAdmin, getSessionSchedulesByUser);

// تعديل حصة
router.put("/:id", authenticate, authorizeAdmin, updateSessionSchedule);

// حذف حصة
router.delete("/:id", authenticate, authorizeAdmin, deleteSessionSchedule);

export default router;
