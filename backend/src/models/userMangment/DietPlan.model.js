import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  mealName: String,
  calories: Number,
  notes: String,
});

const dietPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    meals: [mealSchema],
  },
  { timestamps: true }
);

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
export default DietPlan;
