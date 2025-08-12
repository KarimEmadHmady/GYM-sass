import mongoose from "mongoose";

const sessionScheduleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const SessionSchedule = mongoose.model("SessionSchedule", sessionScheduleSchema);
export default SessionSchedule;
