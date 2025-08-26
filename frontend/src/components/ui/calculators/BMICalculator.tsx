"use client";
import { useState } from "react";
import { useLocale } from 'next-intl';

const BMICalculator = () => {
  const language = useLocale() as 'ar' | 'en';
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const translations = {
    ar: {
      weightPlaceholder: "الوزن (كجم)",
      heightPlaceholder: "الطول (سم)",
      calculate: "احسب",
      bmiResult: "مؤشر كتلة الجسم:",
      underweight: "نقص وزن - محتاج تبدأ تاكل أكتر وتركز على تمارين قوة",
      normal: "وزن طبيعي - وزنك ممتاز، ركز على بناء العضلات 💪",
      overweight: "وزن زائد - محتاج تعمل كارديو + تحكم في الدايت",
      obese: "سمنة - لازم خطة جدية مع مدرب وتغذية منظمة"
    },
    en: {
      weightPlaceholder: "Weight (kg)",
      heightPlaceholder: "Height (cm)",
      calculate: "Calculate",
      bmiResult: "BMI:",
      underweight: "Underweight - Need to eat more and focus on strength training",
      normal: "Normal - Excellent weight, focus on building muscle 💪",
      overweight: "Overweight - Need cardio + diet control",
      obese: "Obese - Need serious plan with trainer and organized nutrition"
    }
  };

  const t = translations[language];

  const calculateBMI = () => {
    if (!weight || !height) return;
    const heightInM = Number(height) / 100;
    const bmiValue = Number(weight) / (heightInM * heightInM);
    const roundedBMI = Number(bmiValue.toFixed(1));
    setBmi(roundedBMI);

    if (bmiValue < 18.5) {
      setCategory("underweight");
      setMessage(t.underweight);
    } else if (bmiValue < 24.9) {
      setCategory("normal");
      setMessage(t.normal);
    } else if (bmiValue < 29.9) {
      setCategory("overweight");
      setMessage(t.overweight);
    } else {
      setCategory("obese");
      setMessage(t.obese);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "underweight": return "text-blue-600";
      case "normal": return "text-green-600";
      case "overweight": return "text-orange-600";
      case "obese": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="number"
          placeholder={t.weightPlaceholder}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <input
          type="number"
          placeholder={t.heightPlaceholder}
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>
      
      <button
        onClick={calculateBMI}
        className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.calculate}
      </button>

      {bmi && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {t.bmiResult}
            </p>
            <p className={`text-3xl font-bold ${getCategoryColor(category)}`}>
              {bmi}
            </p>
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <p className={`text-sm ${getCategoryColor(category)} font-medium`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
