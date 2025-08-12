import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // الموظف
  salaryAmount: { type: Number, required: true },  // قيمة الراتب
  paymentDate: { type: Date, default: Date.now },  // تاريخ الدفع
  bonuses: { type: Number, default: 0 },  // مكافآت إضافية
  deductions: { type: Number, default: 0 },  // خصومات
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);
