import mongoose from "mongoose";

const clientProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    weight: { type: Number },
    bodyFatPercentage: { type: Number },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const ClientProgress = mongoose.model("ClientProgress", clientProgressSchema);
export default ClientProgress;
