import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemName: { type: String, required: true }, // اسم المنتج أو الخدمة
    price: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
