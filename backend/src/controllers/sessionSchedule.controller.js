import * as sessionService from "../services/sessionSchedule.service.js";

// إنشاء حصة جديدة
export const createSessionSchedule = async (req, res) => {
  try {
    const session = await sessionService.createSessionSchedule({
      ...req.body,
      userId: req.params.userId
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب جميع الحصص لمستخدم
export const getSessionSchedulesByUser = async (req, res) => {
  try {
    const sessions = await sessionService.getSessionSchedulesByUser(req.params.userId);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل حصة
export const updateSessionSchedule = async (req, res) => {
  try {
    const updated = await sessionService.updateSessionSchedule(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "الحصة غير موجودة" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف حصة
export const deleteSessionSchedule = async (req, res) => {
  try {
    const deleted = await sessionService.deleteSessionSchedule(req.params.id);
    if (!deleted) return res.status(404).json({ message: "الحصة غير موجودة" });
    res.json({ message: "تم حذف الحصة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
