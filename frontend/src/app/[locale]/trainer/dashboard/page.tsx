'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

// Components
import TrainerStatsCards from '@/components/trainer/TrainerStatsCards';
import TrainerQuickActions from '@/components/trainer/TrainerQuickActions';
import TrainerRecentActivity from '@/components/trainer/TrainerRecentActivity';
import TrainerSessionsOverview from '@/components/trainer/TrainerSessionsOverview';
import TrainerClientsOverview from '@/components/trainer/TrainerClientsOverview';
import TrainerPlansOverview from '@/components/trainer/TrainerPlansOverview';
import TrainerProgressOverview from '@/components/trainer/TrainerProgressOverview';

const TrainerDashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('TrainerDashboard');
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'trainer') {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Sync activeTab with URL changes
  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">{t('Loading.message')}</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'trainer') {
    return null;
  }

  const tabs = [
    { id: 'overview', name: t('Tabs.overview'), icon: '📊' },
    { id: 'sessions', name: t('Tabs.sessions'), icon: '🏋️' },
    { id: 'clients', name: t('Tabs.clients'), icon: '👥' },
    { id: 'plans', name: t('Tabs.plans'), icon: '📋' },
    { id: 'progress', name: t('Tabs.progress'), icon: '📈' },
    { id: 'schedule', name: t('Tabs.schedule'), icon: '📅' }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('Header.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('Header.welcome', { name: user?.name })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('Header.role')}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t('Logout.btn')}</span>
              </button>
              <button
                onClick={handleLocaleSwitch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-2"
              >
                {t('Language.btn')}
              </button>
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
                    ? 'border-green-500 text-green-600 dark:text-green-400'
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
            {/* Stats Cards */}
            <TrainerStatsCards />
            
            {/* Quick Actions */}
            <TrainerQuickActions />
            
            {/* Recent Activity */}
            <TrainerRecentActivity />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-8">
            <TrainerSessionsOverview />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-8">
            <TrainerClientsOverview />
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
            <TrainerPlansOverview />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            <TrainerProgressOverview />
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                جدولي الزمني
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                صفحة الجدول الزمني قيد التطوير...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;