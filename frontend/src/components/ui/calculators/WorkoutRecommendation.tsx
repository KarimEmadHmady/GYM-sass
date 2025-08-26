// src/components/calculators/WorkoutRecommendation.tsx
"use client";
import { useState } from "react";
import { useLocale } from 'next-intl';

export default function WorkoutRecommendation() {
  const language = useLocale() as 'ar' | 'en';
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [details, setDetails] = useState<string[]>([]);

  const translations = {
    ar: {
      selectGoal: "اختر هدفك",
      weightLoss: "خسارة الوزن",
      muscleGain: "بناء العضلات",
      fitness: "لياقة عامة",
      getRecommendation: "احصل على التوصية",
      weightLossPlan: "خطة خسارة الوزن",
      muscleGainPlan: "خطة بناء العضلات",
      fitnessPlan: "خطة اللياقة العامة",
      weightLossDetails: [
        "كارديو 4-5 مرات في الأسبوع",
        "تمارين قوة 2-3 مرات في الأسبوع",
        "ركز على تمارين مركبة",
        "احرص على الراحة الكافية"
      ],
      muscleGainDetails: [
        "تمارين قوة 4-5 مرات في الأسبوع",
        "كارديو خفيف 2 مرات للتحمل",
        "ركز على زيادة الأوزان تدريجياً",
        "تناول بروتين كافي (1.6-2.2 جرام/كجم)"
      ],
      fitnessDetails: [
        "مزيج من الكارديو والقوة 3 مرات لكل منهما",
        "تمارين مرونة 2-3 مرات في الأسبوع",
        "تنوع في التمارين",
        "استمتع بالتمرين"
      ]
    },
    en: {
      selectGoal: "Select Goal",
      weightLoss: "Lose Weight",
      muscleGain: "Build Muscle",
      fitness: "General Fitness",
      getRecommendation: "Get Recommendation",
      weightLossPlan: "Weight Loss Plan",
      muscleGainPlan: "Muscle Building Plan",
      fitnessPlan: "General Fitness Plan",
      weightLossDetails: [
        "Cardio 4-5 times per week",
        "Strength training 2-3 times per week",
        "Focus on compound exercises",
        "Ensure adequate rest"
      ],
      muscleGainDetails: [
        "Strength training 4-5 times per week",
        "Light cardio 2 times for conditioning",
        "Focus on progressive overload",
        "Consume adequate protein (1.6-2.2g/kg)"
      ],
      fitnessDetails: [
        "Mix of cardio & strength 3 times each",
        "Flexibility training 2-3 times per week",
        "Exercise variety",
        "Enjoy your workout"
      ]
    }
  };

  const t = translations[language];

  const recommendWorkout = () => {
    if (!goal) {
      setPlan(language === "ar" ? "يرجى اختيار هدف." : "Please select a goal.");
      setDetails([]);
      return;
    }

    switch (goal) {
      case "weight_loss":
        setPlan(t.weightLossPlan);
        setDetails(t.weightLossDetails);
        break;
      case "muscle_gain":
        setPlan(t.muscleGainPlan);
        setDetails(t.muscleGainDetails);
        break;
      case "fitness":
        setPlan(t.fitnessPlan);
        setDetails(t.fitnessDetails);
        break;
      default:
        setPlan(language === "ar" ? "يرجى اختيار هدف." : "Please select a goal.");
        setDetails([]);
    }
  };

  const getGoalColor = (selectedGoal: string) => {
    switch (selectedGoal) {
      case "weight_loss": return "text-red-600";
      case "muscle_gain": return "text-blue-600";
      case "fitness": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-center text-lg bg-white text-black"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="">{t.selectGoal}</option>
          <option value="weight_loss">{t.weightLoss}</option>
          <option value="muscle_gain">{t.muscleGain}</option>
          <option value="fitness">{t.fitness}</option>
        </select>
      </div>
      
      <button
        onClick={recommendWorkout}
        className="w-full cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.getRecommendation}
      </button>
      
      {plan && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center space-y-4">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <h4 className={`text-lg font-bold ${getGoalColor(goal)} mb-2`}>
                {plan}
              </h4>
            </div>
            
            {details.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                  {language === "ar" ? "تفاصيل الخطة:" : "Plan Details:"}
                </h5>
                <ul className="text-left space-y-2">
                  {details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
