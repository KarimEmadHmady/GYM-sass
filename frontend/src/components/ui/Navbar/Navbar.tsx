'use client';

import React, { useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconLanguage } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/navigation';

export default function GymNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  // next-intl hooks
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  // Debug logging
  console.log('Navbar rendered with locale:', locale);
  console.log('Current pathname:', pathname);
  console.log('Router:', router);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

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
      // Try using router.replace first
      console.log('Attempting router.replace...');
      const result = router.replace(pathname, { locale: newLocale });
      console.log('Router replace result:', result);
      
      // If router.replace doesn't work immediately, try manual redirect
      setTimeout(() => {
        if (window.location.pathname.includes(`/${locale}`)) {
          console.log('Router.replace failed, using manual redirect...');
          const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
          console.log('Redirecting to:', newPath);
          window.location.href = newPath;
        }
      }, 100);
      
    } catch (error) {
      console.error('Error switching language with router:', error);
      // Use manual redirect immediately
      console.log('Using manual redirect due to error...');
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      console.log('Redirecting to:', newPath);
      window.location.href = newPath;
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">GYM</span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white font-cairo">GYM Pro</span>
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
          <button
            onClick={(e) => toggleLanguage(e)}
            className="relative z-40 px-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-xs font-medium"
            title={`Switch to ${locale === 'ar' ? 'English' : 'العربية'}`}
          >
            {locale === 'ar' ? 'EN' : 'عربي'}
          </button>

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
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">GYM</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white font-cairo">GYM Pro</span>
          </Link>

          {/* Language Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => toggleLanguage(e)}
              className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-xs font-medium"
              title={`Switch to ${locale === 'ar' ? 'English' : 'العربية'}`}
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950"
            >
              <div className="flex flex-col space-y-4 w-full">
                {mobileNavigationItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className={cn("text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors", locale === 'ar' ? 'font-cairo' : '')}
                    onClick={handleMobileMenuClose}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
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
  return isOpen ? (
    <IconX className="text-black dark:text-white w-6 h-6 cursor-pointer" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black dark:text-white w-6 h-6 cursor-pointer" onClick={onClick} />
  );
};

 