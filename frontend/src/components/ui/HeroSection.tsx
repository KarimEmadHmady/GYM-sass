"use client";
import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    title: isArabic ? 'كوتش جيم' : 'Coach Gym',
    subtitle: isArabic 
      ? 'اكتشف عالم اللياقة مع أفضل المدربين وبرامج التدريب المتقدمة'
      : 'Discover the world of fitness with the best trainers and advanced training programs',
    getStarted: isArabic ? 'ابدأ الآن' : 'Get Started',
    learnMore: isArabic ? 'اعرف المزيد' : 'Learn More',
    features: isArabic ? [
      '🏋️‍♂️ معدات حديثة ومتطورة',
      '👨‍💼 مدربين محترفين معتمدين',
      '🕐 فتح 24/7',
      '🧘‍♀️ دروس جماعية متنوعة',
      '💪 برامج تدريب شخصية'
    ] : [
      '🏋️‍♂️ Modern & Advanced Equipment',
      '👨‍💼 Certified Professional Trainers',
      '📱 Smart App for Progress Tracking',
      '🕐 Open 24/7',
      '🧘‍♀️ Various Group Classes',
      '💪 Personal Training Programs'
    ]
  };

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden mt-[-25px]">
      {/* Banner Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          className="w-full h-[100%] object-cover"
          src="/gym v2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      <div className="w-full max-w-6xl px-4 relative z-20">
        <div className=" p-8 md:p-12 ">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
 
            {/* النص */}
            <div className="w-full md:w-2/3 text-center space-y-6 order-1 md:order-2 mx-auto">
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold text-white drop-shadow-2xl ${isArabic ? 'font-cairo' : ''}`}>
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/30">
                  {content.title}
                </span>
              </h1>
              <p className={`text-xl md:text-2xl  text-white/80 leading-relaxed ${isArabic ? 'font-cairo' : ''}`}>
                {content.subtitle}
              </p>
              {/* المميزات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 place-items-center justify-items-center">
                {content.features.map((feature, index) => (
                  <div key={index} className={`flex items-center justify-center space-x-2 text-white/70 ${isArabic ? 'font-cairo' : ''}`}>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// CSS Animations for animated shadow
const animatedShadowStyles = `
  .animated-shadow {
    animation: shadowColor 6s ease-in-out infinite;
  }
  
  .animated-shadow::after {
    content: '';
    position: absolute;
    z-index: -1;
    filter: blur(36px) saturate(120%);
    opacity: 0.9;
    background:
      radial-gradient(40% 40% at 20% 30%, rgba(255, 0, 102, 0.45), transparent 60%),
      radial-gradient(45% 45% at 80% 70%, rgba(0, 153, 255, 0.40), transparent 60%),
      radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 170, 0.35), transparent 60%);
    animation: glowShift 10s linear infinite;
  }

  @keyframes shadowColor {
    0%   { filter: drop-shadow(0 0 18px rgba(255, 0, 102, 0.9)); }
    25%  { filter: drop-shadow(0 0 20px rgba(0, 153, 255, 0.9)); }
    50%  { filter: drop-shadow(0 0 22px rgba(0, 255, 170, 0.9)); }
    75%  { filter: drop-shadow(0 0 20px rgba(255, 196, 0, 0.9)); }
    100% { filter: drop-shadow(0 0 18px rgba(255, 0, 102, 0.9)); }
  }

  @keyframes glowShift {
    0%   { transform: scale(1) rotate(0deg); opacity: 0.9; }
    50%  { transform: scale(1.06) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(1) rotate(360deg); opacity: 0.9; }
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = animatedShadowStyles;
  document.head.appendChild(styleElement);
}
