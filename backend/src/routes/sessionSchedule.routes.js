import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";
import {
  createSessionSchedule,
  getSessionSchedulesByUser,
  updateSessionSchedule,
  deleteSessionSchedule,
  getAllSessionSchedules
} from "../controllers/sessionSchedule.controller.js";

const router = express.Router();

// إنشاء حصة جديدة
router.post("/:userId", authenticate,  authorizeRole(['admin','manager', 'trainer']), createSessionSchedule);

// جلب جميع الحصص لمستخدم
router.get("/:userId", authenticate,  authorizeRole(['admin','manager', 'trainer']), getSessionSchedulesByUser);

// جلب جميع الحصص
router.get("/", authenticate,  authorizeRole(['admin','manager']), getAllSessionSchedules);

// تعديل حصة
router.put("/:id", authenticate,  authorizeRole(['admin','manager']), updateSessionSchedule);

// حذف حصة
router.delete("/:id", authenticate,  authorizeRole(['admin','manager']), deleteSessionSchedule);

export default router;
