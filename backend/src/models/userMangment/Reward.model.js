import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number },
    redeemedFor: { type: String },
    date: { type: Date },
  },
  { timestamps: true }
);

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
