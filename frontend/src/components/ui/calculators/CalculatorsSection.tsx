"use client";
import { useState } from "react";
import BMICalculator from "./BMICalculator";
import BodyFatCalculator from "./BodyFatCalculator";
import CaloriesCalculator from "./CaloriesCalculator";
import ProteinCalculator from "./ProteinCalculator";
import WaterCalculator from "./WaterCalculator";
import WorkoutRecommendation from "./WorkoutRecommendation";
import { useTranslations } from 'next-intl';
import { 
  Calculator, 
  Heart, 
  Flame, 
  Beef, 
  Droplets, 
  Dumbbell 
} from 'lucide-react';

const calculators = [
  { 
    key: 'bmi', 
    labelKey: 'bmi', 
    component: <BMICalculator />,
    icon: <Calculator className="w-8 h-8" />,
    gradient: "from-blue-500 via-blue-600 to-blue-700",
    shadow: "shadow-blue-500/25"
  },
  { 
    key: 'bodyFat', 
    labelKey: 'bodyFat', 
    component: <BodyFatCalculator />,
    icon: <Heart className="w-8 h-8" />,
    gradient: "from-green-500 via-green-600 to-green-700",
    shadow: "shadow-green-500/25"
  },
  { 
    key: 'calories', 
    labelKey: 'calories', 
    component: <CaloriesCalculator />,
    icon: <Flame className="w-8 h-8" />,
    gradient: "from-purple-500 via-purple-600 to-purple-700",
    shadow: "shadow-purple-500/25"
  },
  { 
    key: 'protein', 
    labelKey: 'protein', 
    component: <ProteinCalculator />,
    icon: <Beef className="w-8 h-8" />,
    gradient: "from-orange-500 via-orange-600 to-orange-700",
    shadow: "shadow-orange-500/25"
  },
  { 
    key: 'water', 
    labelKey: 'water', 
    component: <WaterCalculator />,
    icon: <Droplets className="w-8 h-8" />,
    gradient: "from-cyan-500 via-cyan-600 to-cyan-700",
    shadow: "shadow-cyan-500/25"
  },
  { 
    key: 'workout', 
    labelKey: 'workout', 
    component: <WorkoutRecommendation />,
    icon: <Dumbbell className="w-8 h-8" />,
    gradient: "from-red-500 via-red-600 to-red-700",
    shadow: "shadow-red-500/25"
  },
];

const CalculatorsSection = () => {
  const t = useTranslations('CalculatorsSection');
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="py-16 font-cairo">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Calculators Grid as Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {calculators.map(calc => (
            <button
              key={calc.key}
              onClick={() => setOpen(calc.key)}
              className="group w-full focus:outline-none cursor-pointer transform transition-all duration-500 hover:scale-105"
              aria-label={t(calc.labelKey)}
            >
              <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-500 hover:bg-white/20 group-hover:border-white/40 ${calc.shadow} hover:shadow-2xl`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${calc.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10 p-8 text-center">
                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${calc.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {calc.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                    {t(calc.labelKey)}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {t('clickToOpen', { name: t(calc.labelKey) }) || 'Click to open'}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Popup Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Enhanced Overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setOpen(null)}
            />
            
            {/* Enhanced Modal Content */}
            <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full mx-4 border border-white/20 overflow-hidden">
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${calculators.find(c => c.key === open)?.gradient} p-6 text-white relative`}>
                <button
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:text-gray-200 transition-all duration-200 focus:outline-none"
                  onClick={() => setOpen(null)}
                  aria-label={t('close')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {calculators.find(c => c.key === open)?.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center">
                    {t(calculators.find(c => c.key === open)?.labelKey || '')}
                  </h3>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 bg-white">
                {calculators.find(c => c.key === open)?.component}
              </div>
            </div>
          </div>
        )}


      </div>
    </section>
  );
};

export default CalculatorsSection;
