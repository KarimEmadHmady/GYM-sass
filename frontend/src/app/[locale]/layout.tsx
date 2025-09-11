import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import GymNavbar from '@/components/ui/Navbar/Navbar';
import ReduxProvider from '@/redux/ReduxProvider';
import ConditionalSplashCursorAlt from '@/components/ui/ConditionalSplashCursorAlt';

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <ReduxProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* خلفية متحركة للموقع بأكمله */}

            
            {/* تأثير الماوس المشروط */}
            <ConditionalSplashCursorAlt />
            
            {/* محتوى الموقع */}
            <div className="relative z-10">
              <GymNavbar />
              {children}
            </div>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}