import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ar', 'en'],
 
  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Disable automatic locale detection to force Arabic as default
  localeDetection: false
});