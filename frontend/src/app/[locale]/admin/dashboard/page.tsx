'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

// Components
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminSessionsOverview from '@/components/admin/AdminSessionsOverview';
import AdminPlansOverview from '@/components/admin/AdminPlansOverview';
import AdminFinancialOverview from '@/components/admin/AdminFinancialOverview';
import AdminReports from '@/components/admin/AdminReports';
import AdminSettings from '@/components/admin/AdminSettings';


const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('AdminDashboard');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">{t('Loading.message')}</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'overview', name: t('Tabs.overview'), icon: '📊' },
    { id: 'users', name: t('Tabs.users'), icon: '👥' },
    { id: 'sessions', name: t('Tabs.sessions'), icon: '🏋️' },
    { id: 'plans', name: t('Tabs.plans'), icon: '📋' },
    { id: 'financial', name: t('Tabs.financial'), icon: '💰' },
    { id: 'reports', name: t('Tabs.reports'), icon: '📈' },
    { id: 'settings', name: t('Tabs.settings'), icon: '⚙️' }
  ];

  // زر تبديل اللغة
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const handleLocaleSwitch = () => {
    router.push(pathname, { locale: otherLocale });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
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
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
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
            <AdminStatsCards />
            
            {/* Quick Actions */}
            <AdminQuickActions />
            
            {/* Recent Activity */}
            <AdminRecentActivity />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <AdminUsersTable />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-8">
            <AdminSessionsOverview />
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
            <AdminPlansOverview />
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-8">
            <AdminFinancialOverview />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <AdminReports />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <AdminSettings />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;