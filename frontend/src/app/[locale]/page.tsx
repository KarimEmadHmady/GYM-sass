'use client';
// src/app/[locale]/page.tsx
import AnnouncementBar from '@/components/ui/AnnouncementBar';
import HeroSection from '@/components/ui/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ContactSection from '@/components/ui/ContactSection';
import SocialSidebar from '@/components/ui/SocialSidebar';
import FooterSection from '@/components/ui/FooterSection';
import FloatingActions from '@/components/ui/FloatingActions';

import CalculatorsSection from '@/components/ui/calculators/CalculatorsSection';

import { VortexDemo } from '@/components/ui/VortexDemo';
import { SparklesPreview } from '@/components/ui/SparklesPreview';
import { CardSpotlightDemo } from '@/components/ui/CardSpotlightDemo';
import { CompareDemo } from '@/components/ui/CompareDemo';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
        const userId = payload.id || payload.userId || payload._id;
        if (!isExpired && userId) {
          const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'ar' : 'ar';
          router.replace(`/${locale}/admin/dashboard/${userId}`);
          return;
        }
      } catch (e) {
        // التوكن غير صالح
      }
    }
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh' }} className="flex flex-col z-50 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-20 h-15 mb-2 drop-shadow-lg" />
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-bold text-blue-700 dark:text-blue-200">جاري التحميل ...</span>
        </div>
      </div>
    );
  }

  return (
    <>
            <BackgroundGradientAnimation
              gradientBackgroundStart="rgb(108, 0, 162)"
              gradientBackgroundEnd="rgb(0, 17, 82)"
              firstColor="18, 113, 255"
              secondColor="221, 74, 255"
              thirdColor="100, 220, 255"
              fourthColor="200, 50, 50"
              fifthColor="180, 180, 50"
              pointerColor="140, 100, 255"
              size="80%"
              blendingValue="hard-light"
              interactive={true}
              containerClassName="fixed inset-0 -z-10"
            />
      <AnnouncementBar />
      <section id="home" className="scroll-mt-24">
        <HeroSection />
      </section>
      <section id="services" className="scroll-mt-24">
        <AnimatedSection />
      </section>
      <section id="pricing" className="scroll-mt-24">
        <CalculatorsSection />
      </section>

      <CompareDemo/>
      <section id="contact" className="scroll-mt-24">
        <ContactSection />
      </section>
      <SparklesPreview />
      <SocialSidebar />
      <section id="plans" className="scroll-mt-24">
        <CardSpotlightDemo />
      </section>
      <VortexDemo />
      <FooterSection />
      <FloatingActions />
    </>
  );
}
