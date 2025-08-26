"use client";
import { useState } from "react";
import { useLocale } from 'next-intl';

const CaloriesCalculator = () => {
  const language = useLocale() as 'ar' | 'en';
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [activity, setActivity] = useState<number>(1.2);
  const [calories, setCalories] = useState<number | null>(null);

  const translations = {
    ar: {
      agePlaceholder: "السن",
      weightPlaceholder: "الوزن (كجم)",
      heightPlaceholder: "الطول (سم)",
      selectGender: "اختر النوع",
      male: "ذكر",
      female: "أنثى",
      sedentary: "قليل النشاط",
      lightlyActive: "نشاط خفيف",
      moderatelyActive: "نشاط متوسط",
      veryActive: "نشاط عالي",
      extremelyActive: "نشاط شديد",
      calculate: "احسب",
      dailyCalories: "السعرات اليومية:",
      weightLoss: "لو عايز تخس:",
      weightGain: "لو عايز تزود:",
      calories: "كالوري"
    },
    en: {
      agePlaceholder: "Age",
      weightPlaceholder: "Weight (kg)",
      heightPlaceholder: "Height (cm)",
      selectGender: "Select Gender",
      male: "Male",
      female: "Female",
      sedentary: "Sedentary",
      lightlyActive: "Lightly Active",
      moderatelyActive: "Moderately Active",
      veryActive: "Very Active",
      extremelyActive: "Extremely Active",
      calculate: "Calculate",
      dailyCalories: "Daily Calories:",
      weightLoss: "For weight loss:",
      weightGain: "For weight gain:",
      calories: "calories"
    }
  };

  const t = translations[language];

  const calculateCalories = () => {
    if (!age || !weight || !height || !gender) return;
    let bmr = 0;

    if (gender === "male") {
      bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5;
    } else {
      bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;
    }

    const dailyCalories = bmr * activity;
    setCalories(Math.round(dailyCalories));
  };

  const getActivityText = (value: number) => {
    switch (value) {
      case 1.2: return t.sedentary;
      case 1.375: return t.lightlyActive;
      case 1.55: return t.moderatelyActive;
      case 1.725: return t.veryActive;
      case 1.9: return t.extremelyActive;
      default: return t.sedentary;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="number"
          placeholder={t.agePlaceholder}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <input
          type="number"
          placeholder={t.weightPlaceholder}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <input
          type="number"
          placeholder={t.heightPlaceholder}
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg bg-white text-black"
        >
          <option value="">{t.selectGender}</option>
          <option value="male">{t.male}</option>
          <option value="female">{t.female}</option>
        </select>
        <select
          value={activity}
          onChange={(e) => setActivity(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg bg-white text-black"
        >
          <option value={1.2}>{t.sedentary}</option>
          <option value={1.375}>{t.lightlyActive}</option>
          <option value={1.55}>{t.moderatelyActive}</option>
          <option value={1.725}>{t.veryActive}</option>
          <option value={1.9}>{t.extremelyActive}</option>
        </select>
      </div>

      <button
        onClick={calculateCalories}
        className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.calculate}
      </button>

      {calories && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center space-y-3">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">
                {t.dailyCalories}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {calories}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium">
                  {t.weightLoss}
                </p>
                <p className="text-lg font-bold text-red-700">
                  {calories - 500} {t.calories}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">
                  {t.weightGain}
                </p>
                <p className="text-lg font-bold text-green-700">
                  {calories + 300} {t.calories}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaloriesCalculator;
