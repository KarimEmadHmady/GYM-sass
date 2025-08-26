// src/components/calculators/ProteinCalculator.tsx
"use client";
import { useState } from "react";
import { useLocale } from 'next-intl';

export default function ProteinCalculator() {
  const language = useLocale() as 'ar' | 'en';
  const [weight, setWeight] = useState<number | "">("");
  const [protein, setProtein] = useState<string>("");
  const [minProtein, setMinProtein] = useState<number | null>(null);
  const [maxProtein, setMaxProtein] = useState<number | null>(null);

  const translations = {
    ar: {
      weightPlaceholder: "الوزن (كجم)",
      calculate: "احسب",
      result: "تحتاج يومياً:",
      minProtein: "الحد الأدنى",
      maxProtein: "الحد الأقصى",
      grams: "جرام",
      protein: "بروتين",
      recommendation: "توصية: ركز على مصادر البروتين عالية الجودة مثل اللحوم الخالية من الدهون، الأسماك، البيض، والبقوليات"
    },
    en: {
      weightPlaceholder: "Weight (kg)",
      calculate: "Calculate",
      result: "Daily protein needs:",
      minProtein: "Minimum",
      maxProtein: "Maximum",
      grams: "grams",
      protein: "protein",
      recommendation: "Recommendation: Focus on high-quality protein sources like lean meats, fish, eggs, and legumes"
    }
  };

  const t = translations[language];

  const calculateProtein = () => {
    if (!weight || weight <= 0) {
      setProtein(language === "ar" ? "يرجى إدخال وزن صحيح." : "Please enter a valid weight.");
      setMinProtein(null);
      setMaxProtein(null);
      return;
    }
    
    const min = weight * 1.6;
    const max = weight * 2.2;
    
    setMinProtein(Number(min.toFixed(1)));
    setMaxProtein(Number(max.toFixed(1)));
    setProtein(`${t.result} ${min.toFixed(1)}g - ${max.toFixed(1)}g ${t.protein}`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="number"
          placeholder={t.weightPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>
      
      <button
        onClick={calculateProtein}
        className="w-full cursor-pointer bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-orange-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.calculate}
      </button>
      
      {protein && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-700 font-medium">
              {protein}
            </p>
            
            {minProtein && maxProtein && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">
                    {t.minProtein}
                  </p>
                  <p className="text-xl font-bold text-orange-700">
                    {minProtein}g
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">
                    {t.maxProtein}
                  </p>
                  <p className="text-xl font-bold text-orange-700">
                    {maxProtein}g
                  </p>
                </div>
              </div>
            )}
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                {t.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
