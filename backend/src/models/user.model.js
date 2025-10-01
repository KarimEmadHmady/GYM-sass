import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;


const userSchema = new mongoose.Schema(
  {
    // البيانات الأساسية (مشتركة لكل المستخدمين)
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "trainer", "member", "manager"], default: "member" },
    phone: { type: String, trim: true, match: /^[0-9]{10,15}$/, default: "" },
    dob: { type: Date },
    avatarUrl: { type: String, default: "https://st4.depositphotos.com/5161043/23536/v/450/depositphotos_235367142-stock-illustration-fitness-logo-design-vector.jpg" },
    address: { type: String, default: "" },
    balance: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    metadata: {
      emergencyContact: { type: String, default: "" },
      notes: { type: String, default: "" },
      lastLogin: { type: Date },
      ipAddress: { type: String },
    },
    isDeleted: { type: Boolean, default: false },

    // بيانات الاشتراك والعضوية (مهم للعميل Gym Member)
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    subscriptionFreezeDays: { type: Number, default: 0 },
    subscriptionFreezeUsed: { type: Number, default: 0 },
    subscriptionStatus: { type: String, enum: ["active", "frozen", "expired", "cancelled"], default: "active" },
    subscriptionRenewalReminderSent: { type: Date },
    lastPaymentDate: { type: Date },
    nextPaymentDueDate: { type: Date },

    loyaltyPoints: { type: Number, default: 100 },
    membershipLevel: { type: String, enum: ["basic", "silver", "gold", "platinum"], default: "basic" },
    
    // Barcode for membership card
    barcode: { type: String, unique: true, sparse: true },

    goals: {
      weightLoss: { type: Boolean, default: false },
      muscleGain: { type: Boolean, default: false },
      endurance: { type: Boolean, default: false },
    },

    // بيانات الجيم الأساسية
    heightCm: { type: Number },
    baselineWeightKg: { type: Number },
    targetWeightKg: { type: Number },
    activityLevel: { type: String, enum: ["sedentary", "light", "moderate", "active", "very_active"] },
    healthNotes: { type: String, default: "" },

    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // مدرب المستخدم (لو هو عضو)

  },
  { timestamps: true }
);

// Virtual: حساب العمر من dob
userSchema.virtual("age").get(function () {
  if (!this.dob) return undefined;
  const diff = Date.now() - new Date(this.dob).getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
});

// تضمين الvirtuals في المخرجات
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Auto-generate barcode for new users
userSchema.pre("save", async function (next) {
  // Generate barcode when creating a new user or when barcode is missing
  if ((!this.barcode) && (this.isNew || this.isModified())) {
    try {
      const userCount = await mongoose.model('User').countDocuments();
      this.barcode = `G${String(userCount + 1).padStart(4, '0')}`;
    } catch (err) {
      this.barcode = `G${Date.now().toString().slice(-6)}`;
    }
  }
  next();
});

// Ensure barcode exists when updating via findOneAndUpdate
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() || {};
  // If barcode explicitly provided, respect it; otherwise ensure it exists
  if (!('barcode' in update)) {
    // Only assign if current document has no barcode
    const docToUpdate = await this.model.findOne(this.getQuery()).select('barcode').lean();
    if (!docToUpdate?.barcode) {
      try {
        const userCount = await mongoose.model('User').countDocuments();
        this.setUpdate({ ...update, barcode: `G${String(userCount + 1).padStart(4, '0')}` });
      } catch (err) {
        this.setUpdate({ ...update, barcode: `G${Date.now().toString().slice(-6)}` });
      }
    }
  }
  next();
});

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
