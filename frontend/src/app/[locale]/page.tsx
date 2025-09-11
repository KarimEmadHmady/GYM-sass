// src/app/[locale]/page.tsx
'use client'

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
import { InfiniteMovingCardsDemo } from '@/components/ui/InfiniteMovingCardsDemo';
import { CardSpotlightDemo } from '@/components/ui/CardSpotlightDemo';
import { CompareDemo } from '@/components/ui/CompareDemo';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

export default function HomePage() {
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
      <HeroSection />
      <AnimatedSection />
      <CalculatorsSection />
      <InfiniteMovingCardsDemo />
      <CompareDemo/>
      <ContactSection />
      <SparklesPreview />
      <SocialSidebar />
      <CardSpotlightDemo />
      <VortexDemo />
      <FooterSection />
      <FloatingActions />
    </>
  );
}
