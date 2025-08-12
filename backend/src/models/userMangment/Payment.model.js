import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // قيمة الدفعة
    date: { type: Date, required: true }, // تاريخ الدفعة
    method: { type: String, default: "cash" }, // طريقة الدفع (نقدي، بطاقة..)
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
