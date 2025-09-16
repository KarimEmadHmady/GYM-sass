// 📄 هذا الموديل خاص بتخزين بيانات المدفوعات (Payments) لكل عميل
// يحتوي على قيمة الدفع، تاريخ الدفع، طريقة الدفع، ملاحظات، وربط الدفع بالمستخدم (userId)

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // 🔗 معرف المستخدم صاحب الدفعة
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 💰 قيمة الدفعة
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📅 تاريخ الدفع
    date: {
      type: Date,
      required: true,
    },

    // 💳 طريقة الدفع (نقدي، بطاقة، تحويل...)
    method: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "other"], // طرق الدفع المسموحة
      default: "cash",
    },

    // ربط الدفعة بفاتورة محددة (اختياري)
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },

    // الجزء المسدد من الفاتورة في هذه الدفعة (للسداد الجزئي)
    appliedAmount: {
      type: Number,
      min: 0,
    },

    // 📝 ملاحظات إضافية عن الدفع
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
