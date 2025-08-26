// src/components/calculators/WaterCalculator.tsx
"use client";
import { useState } from "react";
import { useLocale } from 'next-intl';

export default function WaterCalculator() {
  const language = useLocale() as 'ar' | 'en';
  const [weight, setWeight] = useState<number | "">("");
  const [water, setWater] = useState<string>("");
  const [waterAmount, setWaterAmount] = useState<number | null>(null);

  const translations = {
    ar: {
      weightPlaceholder: "الوزن (كجم)",
      calculate: "احسب",
      result: "تحتاج يومياً:",
      liters: "لتر",
      water: "ماء",
      recommendation: "توصية: اشرب الماء على مدار اليوم، وزد الكمية عند ممارسة الرياضة أو في الطقس الحار",
      tips: [
        "اشرب كوب ماء عند الاستيقاظ",
        "اشرب قبل وأثناء وبعد التمرين",
        "راقب لون البول - يجب أن يكون فاتحاً",
        "اشرب عند الشعور بالعطش"
      ]
    },
    en: {
      weightPlaceholder: "Weight (kg)",
      calculate: "Calculate",
      result: "Daily water needs:",
      liters: "liters",
      water: "water",
      recommendation: "Recommendation: Drink water throughout the day, increase intake during exercise or hot weather",
      tips: [
        "Drink a glass of water when waking up",
        "Drink before, during, and after exercise",
        "Monitor urine color - should be light",
        "Drink when thirsty"
      ]
    }
  };

  const t = translations[language];

  const calculateWater = () => {
    if (!weight || weight <= 0) {
      setWater(language === "ar" ? "يرجى إدخال وزن صحيح." : "Please enter a valid weight.");
      setWaterAmount(null);
      return;
    }
    
    const liters = weight * 0.033; // 33ml per kg
    setWaterAmount(Number(liters.toFixed(2)));
    setWater(`${t.result} ${liters.toFixed(2)} ${t.liters} ${t.water}`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="number"
          placeholder={t.weightPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-center text-lg text-black"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>
      
      <button
        onClick={calculateWater}
        className="w-full cursor-pointer bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-cyan-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.calculate}
      </button>
      
      {water && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-700 font-medium">
              {water}
            </p>
            
            {waterAmount && (
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="text-3xl font-bold text-cyan-700">
                  {waterAmount} {t.liters}
                </p>
                <p className="text-sm text-cyan-600 mt-1">
                  {t.recommendation}
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-3">
                {language === "ar" ? "نصائح للترطيب:" : "Hydration Tips:"}
              </h4>
              <ul className="text-left space-y-2">
                {t.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-blue-600 flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
