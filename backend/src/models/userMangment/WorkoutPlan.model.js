import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  reps: Number,
  sets: Number,
  notes: String,
});

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;
