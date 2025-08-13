// 📌 هذا الموديل خاص بجدولة الحصص (Session Schedule) ويخزن مواعيد الحصص
// لكل مستخدم (مدرب أو متدرب) مع تاريخ الحصة وتوقيتها ووصفها
import mongoose from "mongoose";

const sessionScheduleSchema = new mongoose.Schema(
  {
    // 🔹 معرف المستخدم المرتبط بالحصة
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // 🔹 تاريخ الحصة (إجباري)
    date: { 
      type: Date, 
      required: true 
    },

    // 🔹 وقت بدء الحصة (إجباري)
    startTime: { 
      type: String, 
      required: true 
    },

    // 🔹 وقت نهاية الحصة (إجباري)
    endTime: { 
      type: String, 
      required: true 
    },

    // 🔹 وصف أو ملاحظات عن الحصة
    description: { 
      type: String, 
      default: "" 
    }
  },
  { 
    timestamps: true // تاريخ الإنشاء والتعديل تلقائياً
  }
);

// 📌 تعريف الموديل
const SessionSchedule = mongoose.model("SessionSchedule", sessionScheduleSchema);

export default SessionSchedule;
