// 📝 هذا الملف يحتوي على موديل الـ Feedback
// يستخدم لتخزين التقييمات والتعليقات التي يقوم بها المستخدمين على بعضهم البعض
// يحتوي على معلومات عن المستخدم المرسل والمستقبل للتقييم، التقييم نفسه، والتعليق
// يتم حفظ التاريخ بشكل تلقائي مع إنشاء أو تعديل أي سجل

import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    // معرف المستخدم المستلم للتقييم (مطلوب)
    toUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "المستخدم المستلم للتقييم مطلوب"] 
    },

    // معرف المستخدم الذي قام بكتابة التقييم (اختياري في حالة كان التقييم مجهول)
    fromUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },

    // التقييم بالأرقام من 1 إلى 5 (مطلوب)
    rating: { 
      type: Number, 
      min: [1, "أقل تقييم هو 1"], 
      max: [5, "أعلى تقييم هو 5"], 
      required: [true, "التقييم مطلوب"] 
    },

    // التعليق النصي على التقييم (اختياري)
    comment: { 
      type: String, 
      default: "" 
    },

    // تاريخ إرسال التقييم (يتم تحديده تلقائياً)
    date: { 
      type: Date, 
      default: Date.now 
    },
  },
  { 
    timestamps: true // إضافة createdAt و updatedAt تلقائياً
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
