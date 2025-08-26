// src/components/calculators/BodyFatCalculator.tsx
"use client";
import { useState } from "react";
import { useLocale } from 'next-intl';

export default function BodyFatCalculator() {
  const language = useLocale() as 'ar' | 'en';
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [waist, setWaist] = useState<number | "">("");
  const [gender, setGender] = useState("male");
  const [bodyFat, setBodyFat] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const translations = {
    ar: {
      weightPlaceholder: "الوزن (كجم)",
      heightPlaceholder: "الطول (سم)",
      waistPlaceholder: "محيط الخصر (سم)",
      male: "ذكر",
      female: "أنثى",
      calculate: "احسب",
      result: "نسبة الدهون المقدرة:",
      essential: "دهون أساسية",
      athletic: "دهون رياضية",
      fitness: "دهون لياقة",
      average: "دهون متوسطة",
      high: "دهون عالية"
    },
    en: {
      weightPlaceholder: "Weight (kg)",
      heightPlaceholder: "Height (cm)",
      waistPlaceholder: "Waist (cm)",
      male: "Male",
      female: "Female",
      calculate: "Calculate",
      result: "Estimated body fat:",
      essential: "Essential fat",
      athletic: "Athletic",
      fitness: "Fitness",
      average: "Average",
      high: "High"
    }
  };

  const t = translations[language];

  const calculateBodyFat = () => {
    if (!weight || !height || !waist) {
      setBodyFat(language === "ar" ? "يرجى ملء جميع الحقول." : "Please fill in all fields.");
      return;
    }

    // Approximation formula
    let bf = 0;
    if (gender === "male") {
      bf = 64 - (20 * height) / waist + (12 * weight) / height;
    } else {
      bf = 76 - (20 * height) / waist + (12 * weight) / height;
    }

    // Determine category
    if (bf < 6) setCategory("essential");
    else if (bf < 14) setCategory("athletic");
    else if (bf < 21) setCategory("fitness");
    else if (bf < 25) setCategory("average");
    else setCategory("high");

    setBodyFat(`${t.result} ${bf.toFixed(1)}%`);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "essential": return "text-blue-600";
      case "athletic": return "text-green-600";
      case "fitness": return "text-yellow-600";
      case "average": return "text-orange-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="number"
          placeholder={t.weightPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <input
          type="number"
          placeholder={t.heightPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <input
          type="number"
          placeholder={t.waistPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          value={waist}
          onChange={(e) => setWaist(Number(e.target.value))}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-lg bg-white text-black"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">{t.male}</option>
          <option value="female">{t.female}</option>
        </select>
      </div>
      
      <button
        onClick={calculateBodyFat}
        className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.calculate}
      </button>
      
      {bodyFat && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {bodyFat}
            </p>
            {category && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                <p className={`text-sm ${getCategoryColor(category)} font-medium`}>
                  {t[category as keyof typeof t]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
