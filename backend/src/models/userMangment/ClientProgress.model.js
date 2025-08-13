// models/ClientProgress.js
// هذا الموديل مسؤول عن تخزين وتتبع تقدم العميل (مثل الوزن، نسبة الدهون في الجسم، والملاحظات) 
// لكل يوم أو جلسة تدريب. يتم الربط مع المستخدم عن طريق userId.

import mongoose from "mongoose";

const clientProgressSchema = new mongoose.Schema(
  {
    // معرف المستخدم المرتبط بالتقدم (يجب أن يكون موجود ومربوط بجدول المستخدمين)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // تاريخ تسجيل التقدم (إجباري)
    date: { type: Date, required: true },

    // وزن العميل (اختياري)
    weight: { type: Number },

    // نسبة الدهون في الجسم (اختياري)
    bodyFatPercentage: { type: Number },

    // ملاحظات إضافية عن حالة العميل أو التدريب (افتراضي فارغ)
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// إنشاء الموديل وتصديره
const ClientProgress = mongoose.model("ClientProgress", clientProgressSchema);
export default ClientProgress;
