import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    // ===== البيانات الأساسية (مشتركة لكل المستخدمين) =====

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      // الاسم الكامل للمستخدم، مطلوب للتعريف به
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
      // البريد الإلكتروني يستخدم لتسجيل الدخول وللتواصل
    },

    passwordHash: {
      type: String,
      required: true,
      // كلمة المرور مشفرة، تحفظ أمان الحساب
    },

    role: {
      type: String,
      enum: ["admin", "trainer", "member", "manager"],
      default: "member",
      // دور المستخدم في النظام (مدير، مدرب، عضو، مدير فرع)
    },

    phone: {
      type: String,
      trim: true,
      match: /^[0-9]{10,15}$/,
      default: "",
      // رقم الهاتف للتواصل مع المستخدم
    },

    dob: {
      type: Date,
      // تاريخ الميلاد يمكن استخدامه لأغراض إحصائية أو تحديد العمر المناسب للعضوية
    },

    avatarUrl: {
      type: String,
      default: "https://example.com/default-avatar.png",
      // رابط الصورة الشخصية للمستخدم
    },

    address: {
      type: String,
      default: "",
      // العنوان التفصيلي للمستخدم، قد يفيد في التواصل أو التسليم
    },

    balance: {
      type: Number,
      default: 0,
      // رصيد المستخدم (مثلاً: رصيد مالي في النظام لمعاملات داخلية)
    },

    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
      // حالة الحساب: نشط، غير نشط أو محظور
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      // هل تم التحقق من البريد الإلكتروني للمستخدم
    },

    emailVerificationToken: {
      type: String,
      // رمز التحقق المستخدم لتأكيد البريد الإلكتروني
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      // عدد محاولات تسجيل الدخول الفاشلة (لأمان الحساب)
    },

    lockUntil: {
      type: Date,
      // تاريخ ووقت انتهاء قفل الحساب (إذا تم قفله لأسباب أمان)
    },

    metadata: {
      emergencyContact: {
        type: String,
        default: "",
        // رقم هاتف للطوارئ خاص بالمستخدم
      },
      notes: {
        type: String,
        default: "",
        // ملاحظات إضافية عن المستخدم يمكن أن يستخدمها الموظفون
      },
      lastLogin: {
        type: Date,
        // آخر وقت دخول للمستخدم للنظام
      },
      ipAddress: {
        type: String,
        // آخر عنوان IP استخدمه المستخدم لتسجيل الدخول
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
      // لتفعيل الحذف الناعم (Soft delete) بدلاً من حذف البيانات فعلياً
    },

    activeSubscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      // الاشتراك الحالي النشط للمستخدم (مرجع لجدول الاشتراكات)
    },

    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        // قائمة بكل الاشتراكات التي سجل بها المستخدم سابقاً
      },
    ],

    // ===== بيانات الاشتراك والعضوية (مهم للعميل Gym Member) =====

    subscriptionStartDate: {
      type: Date,
      // بداية فترة الاشتراك الحالية
    },

    subscriptionEndDate: {
      type: Date,
      // نهاية فترة الاشتراك الحالية
    },

    subscriptionFreezeDays: {
      type: Number,
      default: 0,
      // عدد الأيام التي يمكن للمستخدم فيها تجميد اشتراكه (إجمالي)
    },

    subscriptionFreezeUsed: {
      type: Number,
      default: 0,
      // عدد الأيام المستخدمة من أيام التجميد
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "frozen", "expired", "cancelled"],
      default: "active",
      // حالة الاشتراك حالياً (نشط، مجمد، منتهي أو ملغي)
    },

    subscriptionRenewalReminderSent: {
      type: Date,
      // آخر تاريخ تم فيه إرسال تذكير لتجديد الاشتراك
    },

    lastPaymentDate: {
      type: Date,
      // تاريخ آخر دفعة مالية دفعها المستخدم
    },

    nextPaymentDueDate: {
      type: Date,
      // موعد استحقاق الدفعة القادمة
    },

    discounts: [
      {
        code: String,
        // كود الخصم (مثلاً كوبون)
        amount: Number,
        // قيمة الخصم بالعملة المحلية
        expiryDate: Date,
        // تاريخ انتهاء صلاحية الخصم
      },
    ],

    loyaltyPoints: {
      type: Number,
      default: 0,
      // نقاط الولاء التي جمعها المستخدم لاستبدالها بمكافآت
    },

    membershipLevel: {
      type: String,
      enum: ["basic", "silver", "gold", "platinum"],
      default: "basic",
      // مستوى العضوية بناءً على الولاء أو الاشتراك
    },

    goals: {
      weightLoss: {
        type: Boolean,
        default: false,
        // هدف خسارة الوزن
      },
      muscleGain: {
        type: Boolean,
        default: false,
        // هدف زيادة الكتلة العضلية
      },
      endurance: {
        type: Boolean,
        default: false,
        // هدف زيادة القدرة على التحمل
      },
      // يمكن إضافة أهداف أخرى حسب الحاجة
    },

    purchases: [
      {
        itemName: {
          type: String,
          required: true,
          // اسم المنتج أو الخدمة التي تم شراؤها
        },
        price: {
          type: Number,
          required: true,
          // سعر الشراء
        },
        date: {
          type: Date,
          required: true,
          // تاريخ الشراء
        },
      },
    ],

    attendanceRecords: [
      {
        date: {
          type: Date,
          required: true,
          // اليوم الذي تم تسجيل الحضور أو الغياب فيه
        },
        status: {
          type: String,
          enum: ["present", "absent", "excused"],
          default: "present",
          // حالة الحضور في ذلك اليوم
        },
        notes: {
          type: String,
          default: "",
          // ملاحظات إضافية عن الحضور (مثلاً إجازة أو عذر)
        },
      },
    ],

    paymentHistory: [
      {
        amount: {
          type: Number,
          required: true,
          // مبلغ الدفعة التي دفعها المستخدم
        },
        date: {
          type: Date,
          required: true,
          // تاريخ الدفع
        },
        method: {
          type: String,
          default: "cash",
          // طريقة الدفع (نقدي، بطاقة، تحويل بنكي، الخ)
        },
        notes: {
          type: String,
          default: "",
          // ملاحظات حول الدفعة إذا وجدت
        },
      },
    ],

    contractDetails: {
      startDate: {
        type: Date,
        // بداية عقد العضوية أو التدريب
      },
      endDate: {
        type: Date,
        // نهاية العقد
      },
      terms: {
        type: String,
        // شروط وبنود العقد
      },
      autoRenew: {
        type: Boolean,
        default: false,
        // هل يتجدد العقد تلقائياً أم لا
      },
    },

    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
        // هل يرغب المستخدم في تلقي إشعارات البريد الإلكتروني
      },
      sms: {
        type: Boolean,
        default: false,
        // هل يرغب المستخدم في تلقي رسائل SMS
      },
      pushNotification: {
        type: Boolean,
        default: false,
        // هل يرغب المستخدم في تلقي إشعارات دفع على الجهاز
      },
    },

    rewardsHistory: [
      {
        points: {
          type: Number,
          // عدد النقاط التي تم جمعها أو استبدالها
        },
        redeemedFor: {
          type: String,
          // مقابل ماذا تم استبدال النقاط (هدية، خصم، الخ)
        },
        date: {
          type: Date,
          // تاريخ عملية الاستبدال
        },
      },
    ],

    workoutPlans: [
      {
        planName: {
          type: String,
          // اسم خطة التمرين
        },
        description: {
          type: String,
          // وصف الخطة
        },
        startDate: {
          type: Date,
          // بداية تطبيق خطة التمرين
        },
        endDate: {
          type: Date,
          // نهاية الخطة
        },
        exercises: [
          {
            name: String,
            // اسم التمرين
            reps: Number,
            // عدد التكرارات المطلوبة
            sets: Number,
            // عدد المجموعات
            notes: String,
            // ملاحظات إضافية على التمرين
          },
        ],
      },
    ],

    dietPlans: [
      {
        planName: {
          type: String,
          // اسم خطة النظام الغذائي
        },
        description: {
          type: String,
          // وصف النظام الغذائي
        },
        startDate: {
          type: Date,
          // بداية تطبيق النظام الغذائي
        },
        endDate: {
          type: Date,
          // نهاية النظام الغذائي
        },
        meals: [
          {
            mealName: String,
            // اسم الوجبة
            calories: Number,
            // السعرات الحرارية في الوجبة
            notes: String,
            // ملاحظات إضافية
          },
        ],
      },
    ],

    messages: [
      {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // مرجع للمرسل (مستخدم داخل النظام)
        },
        message: {
          type: String,
          // نص الرسالة
        },
        date: {
          type: Date,
          default: Date.now,
          // تاريخ إرسال الرسالة
        },
        read: {
          type: Boolean,
          default: false,
          // هل قرأ المتلقي الرسالة أم لا
        },
      },
    ],

    // ===== الحقول الخاصة بالترينر =====

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // معرف مدرب المستخدم (إذا كان المستخدم عضو)
    },

    assignedClients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // قائمة عملاء الترينر لإدارة تقدمهم وجدولة الحصص
      },
    ],

    clientProgress: [
      {
        date: {
          type: Date,
          required: true,
          // تاريخ تسجيل التقدم
        },
        weight: {
          type: Number,
          // وزن العميل في ذلك التاريخ
        },
        bodyFatPercentage: {
          type: Number,
          // نسبة الدهون في الجسم للعميل
        },
        notes: {
          type: String,
          default: "",
          // ملاحظات إضافية حول التقدم
        },
      },
    ],

    sessionSchedules: [
      {
        date: {
          type: Date,
          required: true,
          // تاريخ الجلسة أو الحصة التدريبية
        },
        startTime: {
          type: String,
          // وقت بدء الحصة
        },
        endTime: {
          type: String,
          // وقت انتهاء الحصة
        },
        description: {
          type: String,
          default: "",
          // وصف مختصر للحصة التدريبية
        },
      },
    ],

    feedbacks: [
      {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // معرف المستخدم الذي قدم التقييم
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          // تقييم النجوم (من 1 إلى 5)
        },
        comment: {
          type: String,
          default: "",
          // تعليق المستخدم على التقييم
        },
        date: {
          type: Date,
          default: Date.now,
          // تاريخ كتابة التقييم
        },
      },
    ],

    // ===== الحقول الخاصة بالادمن =====
    // (تقدر تضيف هنا أي حقول خاصة بإدارة النظام مثل صلاحيات إضافية أو سجلات أنشطة)

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // إذا لم يتم تعديل كلمة المرور، انتقل إلى الخطوة التالية
  if (!this.isModified("passwordHash")) return next();

  try {
    // توليد Salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // عمل Hash لكلمة المرور
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method: للتحقق من كلمة المرور
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;
