// src/app/[locale]/page.tsx
'use client'

import AnnouncementBar from '@/components/ui/AnnouncementBar';
import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ContactSection from '@/components/ui/ContactSection';
import SocialSidebar from '@/components/ui/SocialSidebar';
import FooterSection from '@/components/ui/FooterSection';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <HeroSection />
      <FeaturesSection />
      <AnimatedSection />
      <ContactSection />
      <SocialSidebar />
      <FooterSection />
    </>
  );
}
