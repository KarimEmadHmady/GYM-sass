"use client";
import React from 'react';
import BlurText from './Sec-home/BlurText';
import { GlowingEffectDemo } from './Sec-home/GlowingEffectDemo';
import CurvedLoop from './Sec-home/CurvedLoop';

const AnimatedSection: React.FC = () => {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    blurText: isArabic ? "مميزاتنا تجعلنا الأفضل!" : "Our Features Make Us The Best!",
    marqueeText: isArabic ? "مرحباً بك في كوتش جيم ✦" : "Welcome to Coach Gym ✦"
  };

  return (
    <section className="flex items-center justify-center bg-[#000] flex-col font-cairo">
      <BlurText
        text={content.blurText}
        delay={150}
        animateBy="words"
        direction="top"
        className={`text-4xl text-white font-bold my-10 ${isArabic ? 'font-cairo' : ''}`}
      />
      <GlowingEffectDemo />
      <CurvedLoop marqueeText={content.marqueeText} />
    </section>
  );
};

export default AnimatedSection;
