import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ربط بسجل المستخدم
    date: { type: Date, required: true }, // يوم الحضور أو الغياب
    status: { type: String, enum: ["present", "absent", "excused"], default: "present" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);
export default AttendanceRecord;
