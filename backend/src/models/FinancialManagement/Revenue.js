//  models/FinancialManagement/Revenue.js

import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
  amount: { type: Number, required: true },  // قيمة الدخل
  date: { type: Date, default: Date.now },  // تاريخ العملية
  paymentMethod: { type: String, enum: ["cash", "card", "transfer"], default: "cash" },
  sourceType: { type: String, enum: ["subscription", "purchase", "other"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // العميل المرتبط
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Revenue", revenueSchema);
