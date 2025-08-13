// 📄 attendanceRecord.model.js
// هذا الملف يحتوي على تعريف الـ Mongoose Schema و الـ Model لسجلات الحضور والغياب.
// النموذج يربط كل سجل بالمستخدم عن طريق userId، ويسجل تاريخ الحضور أو الغياب وحالته.
// الحقول:
// - userId: معرف المستخدم المرتبط بالسجل
// - date: تاريخ السجل
// - status: حالة الحضور (present, absent, excused)
// - notes: ملاحظات إضافية

import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ربط بسجل المستخدم
    date: { type: Date, required: true }, // يوم الحضور أو الغياب
    status: { type: String, enum: ["present", "absent", "excused"], default: "present" }, // حالة الحضور
    notes: { type: String, default: "" }, // ملاحظات إضافية
  },
  { timestamps: true } // إضافة createdAt و updatedAt تلقائياً
);

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);
export default AttendanceRecord;
