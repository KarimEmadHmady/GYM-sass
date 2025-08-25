import React from "react";
import { Vortex } from "../ui/vortex";

export function VortexDemo() {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    title: isArabic ? 'ابدأ رحلة لياقتك اليوم!' : 'Start Your Fitness Journey Today!',
    subtitle: isArabic 
      ? 'انضم إلى أفضل جيم في المنطقة واحصل على جسم أحلامك مع مدربين محترفين ومعدات حديثة'
      : 'Join the best gym in the area and get your dream body with professional trainers and modern equipment',
    primaryButton: isArabic ? 'ابدأ الآن مجاناً' : 'Start Free Trial',
    secondaryButton: isArabic ? 'شاهد الجيم' : 'View Gym',
    features: isArabic ? [
      'مدربين محترفين معتمدين',
      'أحدث معدات التدريب',
      'فصول لياقة متنوعة',
      'برامج تغذية مخصصة'
    ] : [
      'Certified Professional Trainers',
      'Latest Training Equipment',
      'Diverse Fitness Classes',
      'Customized Nutrition Programs'
    ]
  };

  return (
    <div className="w-[100%] mx-auto h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className={`text-white text-2xl md:text-6xl font-bold text-center ${isArabic ? 'font-cairo' : ''}`}>
          {content.title}
        </h2>
        
        <p className={`text-white text-sm md:text-2xl max-w-4xl mt-6 text-center leading-relaxed ${isArabic ? 'font-cairo' : ''}`}>
          {content.subtitle}
        </p>
        
        {/* Features List */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-3xl">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className={`text-white text-sm md:text-base ${isArabic ? 'font-cairo' : ''}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl text-white font-bold text-lg shadow-[0px_4px_0px_0px_#FFFFFF40_inset] hover:shadow-[0px_6px_0px_0px_#FFFFFF40_inset] transform hover:scale-105 active:scale-95">
            {content.primaryButton}
          </button>
          <button className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 rounded-xl font-semibold text-lg backdrop-blur-sm">
            {content.secondaryButton}
          </button>
        </div>
        
        {/* Additional CTA Text */}
        <p className={`text-white/70 text-sm md:text-lg mt-6 text-center max-w-2xl ${isArabic ? 'font-cairo' : ''}`}>
          {isArabic 
            ? '🎯 عرض خاص: أول شهر مجاناً + خصم 20% على الاشتراك السنوي'
            : '🎯 Special Offer: First Month Free + 20% Off Annual Subscription'
          }
        </p>
      </Vortex>
    </div>
  );
}
