'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isLoading, error, isAuthenticated, user, clearError } = useAuth();
  const router = useRouter();
  const t = useTranslations('Login');
  const locale = useLocale();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear local error when user starts typing
    if (localError) {
      setLocalError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError(t('fillAllFields'));
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError(t('validEmail'));
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      const result = await login(formData);
      if (!result.success) {
        setLocalError(result.error || t('loginFailed'));
      }
    } catch (error) {
      setLocalError(t('unexpectedError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* خلفية زخرفية إضافية */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* دوائر شفافة متداخلة */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* خطوط ضبابية */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/5" />
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        {/* الفورم */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl px-8 py-10 w-full max-w-sm flex flex-col gap-6 mx-auto mt-[20vh] relative z-[999999]"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-2">{t('title')}</h2>
          
          {/* Error Message */}
          {localError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
              {localError}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white font-medium">{t('email')}</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90 text-black disabled:opacity-50"
              placeholder={t('emailPlaceholder')}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white font-medium">{t('password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90 text-black disabled:opacity-50"
              placeholder={t('passwordPlaceholder')}
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="mt-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition-all duration-200 shadow-md flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('loggingIn')}
              </>
            ) : (
              t('loginBtn')
            )}
          </button>
          {/* Divider */}
          <div className="mt-4 border-t border-white/30 w-[90%] mx-auto"></div>

          {/* Language & Contact Buttons */}
          <div className="mt-4 w-[90%] mx-auto flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => router.push('/login', { locale: 'ar' })}
              className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => router.push('/login', { locale: 'en' })}
              className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              EN
            </button>
            <a
              href="mailto:support@example.com"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              تواصل معنا
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
