import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
