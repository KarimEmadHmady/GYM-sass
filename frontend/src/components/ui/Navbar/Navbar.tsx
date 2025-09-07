'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconLanguage } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

export default function GymNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  // next-intl hooks
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const dashboardRoutes = [
    '/admin/dashboard',
    '/manager/dashboard',
    '/trainer/dashboard',
    '/member/profile',
    '/dashboard',
  ];
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  const allowedRoutes = ['/', '/login'];
  const shouldShowNavbar = allowedRoutes.includes(cleanPathname) && !dashboardRoutes.some(route => cleanPathname.startsWith(route));
  
  // Debug logging
  console.log('Navbar rendered with locale:', locale);
  console.log('Current pathname:', pathname);
  console.log('Should show navbar:', shouldShowNavbar);
  console.log('Router:', router);

  // Handle scroll visibility with useEffect instead of useScroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = (event?: React.MouseEvent<HTMLButtonElement>) => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    console.log('Current locale:', locale);
    console.log('New locale:', newLocale);
    console.log('Current pathname:', pathname);
    
    // Force immediate state update for visual feedback
    const button = event?.target as HTMLButtonElement;
    if (button) {
      button.style.opacity = '0.7';
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.opacity = '';
        button.style.transform = '';
      }, 150);
    }
    
    try {
      // Use router.push for proper i18n navigation
      console.log('Switching language using router.push...');
      router.push(pathname, { locale: newLocale });
    } catch (error) {
      console.error('Error switching language with router:', error);
    }
  };

  // Navigation items using translations
  const navigationItems = [
    { name: t('home'), link: '/' },
    { name: t('services'), link: '/services' },
    { name: t('pricing'), link: '/pricing' },
    { name: t('trainers'), link: '/trainers' },
    { name: t('contact'), link: '/contact' }
  ];

  const mobileNavigationItems = [
    { name: t('home'), link: '/' },
    { name: t('services'), link: '/services' },
    { name: t('pricing'), link: '/pricing' },
    { name: t('trainers'), link: '/trainers' },
    { name: t('contact'), link: '/contact' },
    { name: t('login'), link: '/login' }
  ];

  // إخفاء الـ navbar إذا لم يكن في الصفحات المسموحة
  if (!shouldShowNavbar) {
    return null;
  }

  // زر اللغة: استخدام router.push للتنقل الصحيح
  const LanguageToggle = () => {
    return (
      <button
        onClick={() => {
          router.push(pathname, { locale: otherLocale });
        }}
        className="relative z-40 px-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-xs font-medium"
        title={`Switch to ${locale === 'ar' ? 'English' : 'العربية'}`}
      >
        {locale === 'ar' ? 'EN' : 'عربي'}
      </button>
    );
  };

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-20 z-40 w-full navbar-no-border navbar-container", `language-${locale}`)}
    >
      {/* Desktop Navigation */}
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(10px)" : "none",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: visible ? "40%" : "100%",
          y: visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        style={{
          minWidth: "800px",
        }}
        className={cn(
          "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
          visible && "bg-white/80 dark:bg-neutral-950/80",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
        >
            <span className="font-bold text-[25px] text-gray-900 dark:text-white font-cairo">Coach Gym</span>

        </Link>

        {/* Navigation Items */}
        <motion.div
          onMouseLeave={() => setHovered(null)}
          className="absolute left-0 right-0 top-0 bottom-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2"
          style={{ pointerEvents: 'none' }}
        >
          {navigationItems.map((item, idx) => (
            <Link
              onMouseEnter={() => setHovered(idx)}
              className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
              key={`link-${idx}`}
              href={item.link}
              style={{ pointerEvents: 'auto' }}
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800"
                />
              )}
              <span className={cn("relative z-20", locale === 'ar' ? 'font-cairo' : '')}>{item.name}</span>
            </Link>
          ))}
        </motion.div>

        {/* Right Side - Language Toggle and Buttons */}
        <div className="flex items-center space-x-4 relative z-30">
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Auth Button */}
          <NavbarButton href="/login" variant="primary" className={cn("relative z-40", locale === 'ar' ? 'font-cairo' : '')}>
            {t('login')}
          </NavbarButton>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(10px)" : "none",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: visible ? "90%" : "100%",
          paddingRight: visible ? "12px" : "0px",
          paddingLeft: visible ? "12px" : "0px",
          borderRadius: visible ? "4px" : "2rem",
          y: visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className="relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden"
      >
        {/* Mobile Header */}
        <div className="flex w-full flex-row items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
          >

            <span className="font-bold text-lg text-gray-900 dark:text-white font-cairo">Coach Gym</span>
          </Link>

          {/* Language Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={handleMobileMenuToggle}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-x-0 top-16 z-50 w-full"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={handleMobileMenuClose}
              />
              
              {/* Menu Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative mx-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-white/20 dark:border-neutral-700/50 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {locale === 'ar' ? 'القائمة' : 'Menu'}
                  </h3>
                  <button
                    onClick={handleMobileMenuClose}
                    className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <IconX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="p-6">
                  <div className="flex flex-col space-y-3">
                    {mobileNavigationItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={item.link}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium",
                            locale === 'ar' ? 'font-cairo' : ''
                          )}
                          onClick={handleMobileMenuClose}
                        >
                          <span className="text-lg">{item.name}</span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Additional Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800">
                    <div className="flex flex-col space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                          {locale === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                        </button>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <button className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200">
                          {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// NavbarButton Component
const NavbarButton = ({
  href,
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none dark:text-white",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// MobileNavToggle Component
const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 flex flex-col justify-center items-star group cursor-pointer "
      aria-label="Toggle mobile menu"
    >
      {/* Animated hamburger lines */}
      <span
        className={`w-6 h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 ease-in-out transform ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`w-[50%] h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 ease-in-out my-1 ${
          isOpen ? 'opacity-0 scale-0' : ''
        }`}
      />
      <span
        className={`w-6 h-0.5 bg-black dark:bg-white rounded-full transition-all duration-300 ease-in-out transform ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
    </button>
  );
};

 