'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

// Components
import MemberProfileHeader from '@/components/member/MemberProfileHeader';
import MemberStatsCards from '@/components/member/MemberStatsCards';
import MemberQuickActions from '@/components/member/MemberQuickActions';
import MemberSessionsHistory from '@/components/member/MemberSessionsHistory';
import MemberPlansOverview from '@/components/member/MemberPlansOverview';
import MemberProgressTracking from '@/components/member/MemberProgressTracking';
import MemberLoyaltyPoints from '@/components/member/MemberLoyaltyPoints';
import MemberAttendance from '@/components/member/MemberAttendance';
import MemberPayments from '@/components/member/MemberPayments';
import MemberSubscription from '@/components/member/MemberSubscription';
import MemberPurchases from '@/components/member/MemberPurchases';
import MemberTrainer from '@/components/member/MemberTrainer';
import MemberMessages from '@/components/member/MemberMessages';
import MemberSettings from '@/components/member/MemberSettings';
import MemberFeedback from '@/components/member/MemberFeedback';

const MemberProfile = ({ params }: { params: Promise<{ userId: string }> }) => {
  const resolvedParams = use(params);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('MemberProfile');
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');

  // يمكنك استخدام userId هنا لجلب بيانات أو التحقق

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'member') {
      router.push('/unauthorized');
      return;
    }
    // إعادة التوجيه إذا كان userId في الرابط لا يساوي user.id
    if (resolvedParams.userId && user?.id && resolvedParams.userId !== user.id) {
      router.replace(`/ar/member/profile/${user.id}`);
      return;
    }
  }, [isAuthenticated, user, isLoading, router, resolvedParams.userId]);

  // Sync activeTab with URL changes
  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">{t('Loading.message')}</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'member') {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'attendance', name: 'الحضور', icon: '📝' },
    { id: 'payments', name: 'مدفوعات', icon: '💵' },
    { id: 'subscription', name: 'الاشتراك', icon: '📅' },
    { id: 'purchases', name: 'مشتريات', icon: '🛒' },
    { id: 'sessions', name: 'الحصص', icon: '🏋️' },
    { id: 'plans', name: 'الخطط', icon: '📋' },
    { id: 'trainer', name: 'مدربي', icon: '👨‍🏫' },
    { id: 'messages', name: 'الرسائل', icon: '💬' },
    { id: 'progress', name: 'التقدم', icon: '📈' },
    { id: 'feedback', name: 'التقييمات', icon: '⭐' },
    { id: 'loyalty', name: 'نقاط الولاء', icon: '⭐' },
    { id: 'settings', name: 'الإعدادات', icon: '⚙️' }
  ];

  // زر تبديل اللغة
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const handleLocaleSwitch = () => {
    const paramsString = searchParams.toString();
    const pathWithQuery = paramsString ? `${pathname}?${paramsString}` : pathname;
    router.push(pathWithQuery, { locale: otherLocale });
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                بروفايل العضو
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                مرحباً بك، {user?.name}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 sm:space-x-4">
            <div className="flex flex-row sm:flex-row items-center space-x-3">
            <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  عضو
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            <div className="flex  items-center space-x-3">
            <button
                onClick={logout}
                aria-label="تسجيل الخروج"
                className="bg-red-600 hover:bg-red-700 text-white p-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-0 sm:space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
              <button
                onClick={handleLocaleSwitch}
                aria-label="تغيير اللغة"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors ml-0 sm:ml-2"
              >
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" />
                </svg>
                <span className="hidden sm:inline">تغيير اللغة</span>
              </button>
            </div>


            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Profile Header */}
            <MemberProfileHeader />
            
            {/* Stats Cards */}
            <MemberStatsCards />
            
            {/* Quick Actions */}
            <MemberQuickActions />
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <MemberAttendance />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <MemberPayments />
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-8">
            <MemberSubscription />
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="space-y-8">
            <MemberPurchases />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-8">
            <MemberSessionsHistory />
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
            <MemberPlansOverview />
          </div>
        )}

        {activeTab === 'trainer' && (
          <div className="space-y-8">
            <MemberTrainer />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-8">
            <MemberMessages />
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            <MemberFeedback />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            <MemberProgressTracking />
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-8">
            <MemberLoyaltyPoints />
          </div>
        )}


        {activeTab === 'settings' && (
          <div className="space-y-8">
            <MemberSettings />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;