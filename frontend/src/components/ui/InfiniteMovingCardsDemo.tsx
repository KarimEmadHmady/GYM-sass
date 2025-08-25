"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const testimonials = isArabic ? [
    {
      quote: "المدرب أحمد ساعدني في تحقيق أهدافي خلال 6 أشهر. المعدات حديثة والنظافة ممتازة. أنصح الجميع بالتجربة!",
      name: "أحمد محمد",
      title: "عضو منذ 8 أشهر",
    },
    {
      quote: "أفضل جيم في المنطقة! الفصول الجماعية ممتعة والمدربين محترفين. فقدت 15 كيلو في 4 أشهر.",
      name: "علي أحمد",
      title: "عضو منذ سنة",
    },
    {
      quote: "برامج التدريب مخصصة تناسب الجميع. المدربين متعاونين والنظام الغذائي ساعدني كثيراً.",
      name: "محمد علي",
      title: "عضو منذ 6 أشهر",
    },
    {
      quote: "معدات حديثة وبيئة تدريب آمنة. المدربين متاحين دائماً للإجابة على الأسئلة. تجربة رائعة!",
      name: "محمد حسن",
      title: "عضو منذ سنة ونصف",
    },
    {
      quote: "فصول اليوجا والبيلاتس ممتازة. المدرب نورا محترف جداً. أشعر بتحسن كبير في مرونتي.",
      name: "عمر محمود",
      title: "عضو منذ 3 أشهر",
    },
  ] : [
    {
      quote: "Coach Ahmed helped me achieve my goals in 6 months. The equipment is modern and cleanliness is excellent. I recommend everyone to try it!",
      name: "Ahmed Mohamed",
      title: "Member for 8 months",
    },
    {
      quote: "Best gym in the area! Group classes are fun and trainers are professional. I lost 15kg in 4 months.",
      name: "Ali Ahmed",
      title: "Member for 1 year",
    },
    {
      quote: "Training programs are customized to suit everyone. Trainers are cooperative and the nutrition system helped me a lot.",
      name: "Mohamed Ali",
      title: "Member for 6 months",
    },
    {
      quote: "Modern equipment and safe training environment. Trainers are always available to answer questions. Great experience!",
      name: "Mohamed Hassan",
      title: "Member for 1.5 years",
    },
    {
      quote: "Yoga and Pilates classes are excellent. Trainer Noura is very professional. I feel a great improvement in my flexibility.",
      name: "Omar Mahmoud",
      title: "Member for 3 months",
    },
  ];

  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl items-center justify-center relative overflow-hidden">
      <div className="text-center mb-8">
        <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${isArabic ? 'font-cairo' : ''}`}>
          {isArabic ? 'آراء أعضائنا' : 'What Our Members Say'}
        </h2>
        <p className={`text-white/70 text-lg ${isArabic ? 'font-cairo' : ''}`}>
          {isArabic ? 'تعرف على تجارب الأعضاء معنا' : 'Discover our members experiences'}
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
