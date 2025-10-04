// next.config.ts
const withPWA = require('next-pwa');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar',
        permanent: false,
      },
    ];
  },
};

// إعدادات PWA
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // تعطيل PWA في التطوير
});

// دمج الإضافات: PWA أولاً ثم next-intl
module.exports = pwaConfig(withNextIntl(nextConfig));