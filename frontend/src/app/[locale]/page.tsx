// src/app/[locale]/page.tsx
'use client'

import AnnouncementBar from '@/components/ui/AnnouncementBar';
import HeroSection from '@/components/ui/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ContactSection from '@/components/ui/ContactSection';
import SocialSidebar from '@/components/ui/SocialSidebar';
import FooterSection from '@/components/ui/FooterSection';
import { VortexDemo } from '@/components/ui/VortexDemo';
import { SparklesPreview } from '@/components/ui/SparklesPreview';
import { InfiniteMovingCardsDemo } from '@/components/ui/InfiniteMovingCardsDemo';
import { LayoutGridDemo } from '@/components/ui/LayoutGridDemo';
import { CardSpotlightDemo } from '@/components/ui/CardSpotlightDemo';
import { CompareDemo } from '@/components/ui/CompareDemo';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <HeroSection />
      <AnimatedSection />
      <InfiniteMovingCardsDemo />
      <CompareDemo/>
      <LayoutGridDemo />
      <ContactSection />
      <SparklesPreview />
      <SocialSidebar />
      <CardSpotlightDemo />
      <VortexDemo />
      <FooterSection />
    </>
  );
}
