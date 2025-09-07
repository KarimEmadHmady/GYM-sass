"use client";

import { usePathname } from 'next/navigation';
import SplashCursor from './SplashCursor';

const ConditionalSplashCursorAlt = () => {
  const pathname = usePathname();
  
  // تحديد الصفحات التي يجب إظهار تأثير الماوس فيها
  // نزيل locale prefix من pathname
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  const allowedRoutes = ['/', '/login'];
  const shouldShowCursor = allowedRoutes.includes(cleanPathname);
  
  // إخفاء المكون إذا لم يكن في الصفحات المسموحة
  if (!shouldShowCursor) {
    return null;
  }

  return <SplashCursor />;
};

export default ConditionalSplashCursorAlt;
