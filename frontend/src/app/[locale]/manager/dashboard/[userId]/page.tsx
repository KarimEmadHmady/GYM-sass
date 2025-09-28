'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

// Components
import ManagerStatsCards from '@/components/manager/ManagerStatsCards';
import ManagerQuickActions from '@/components/manager/ManagerQuickActions';
import ManagerRecentActivity from '@/components/manager/ManagerRecentActivity';
import ManagerUsersTable from '@/components/manager/ManagerUsersTable';
import AdminPlansOverview from '@/components/admin/AdminPlansOverview';
import AdminAttendance from '@/components/admin/AdminAttendance';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminPurchases from '@/components/admin/AdminPurchases';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminProgress from '@/components/admin/AdminProgress';
import AdminLoyalty from '@/components/admin/AdminLoyalty';
import AdminSearch from '@/components/admin/AdminSearch';
import ManagerSettings from '@/components/manager/ManagerSettings';
import TrainersDirectory from '@/components/shared/TrainersDirectory';
import ManagerFeedback from '@/components/manager/ManagerFeedback';
import ManagerInvoices from '@/components/manager/ManagerInvoices';
import AdminSessionsOverview from '@/components/admin/AdminSessionsOverview';
import dynamic from 'next/dynamic';
const ManagerAddExpense = dynamic(() => import('@/components/manager/ManagerAddExpense'), { ssr: false });
const ManagerAddRevenue = dynamic(() => import('@/components/manager/ManagerAddRevenue'), { ssr: false });

const ManagerDashboard = ({ params }: { params: { userId: string } }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ManagerDashboard');
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');

  // يمكنك استخدام userId هنا لجلب بيانات أو التحقق

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'manager') {
      router.push('/unauthorized');
      return;
    }
    // إعادة التوجيه إذا كان userId في الرابط لا يساوي user.id
    if (params.userId && user?.id && params.userId !== user.id) {
      router.replace(`/ar/manager/dashboard/${user.id}`);
      return;
    }
  }, [isAuthenticated, user, isLoading, router, params.userId]);

  // Sync activeTab with URL changes
  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-lg">{t('Loading.message')}</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'manager') {
    return null;
  }

  const tabs = [
    { id: 'overview', name: t('Tabs.overview'), icon: '📊' },
    { id: 'users', name: t('Tabs.users'), icon: '👥' },
    { id: 'trainers', name: 'المدربون', icon: '🧑‍🏫' },
    { id: 'sessions', name: t('Tabs.sessions'), icon: '🏋️' },
    { id: 'plans', name: t('Tabs.plans'), icon: '📋' },
    { id: 'reports', name: t('Tabs.reports'), icon: '📈' },
    { id: 'attendance', name: 'الحضور', icon: '📝' },
    { id: 'payments', name: 'مدفوعات', icon: '💵' },
    { id: 'invoices', name: 'الفواتير', icon: '🧾' },
    { id: 'add-expense', name: 'إضافة مصروف', icon: '💸' },
    { id: 'add-revenue', name: 'إضافة دخل', icon: '💰' },
    { id: 'purchases', name: 'مشتريات', icon: '🛒' },
    { id: 'messages', name: 'رسائل', icon: '✉️' },
    { id: 'progress', name: 'تقدم العملاء', icon: '📈' },
    { id: 'feedback', name: 'التقييمات', icon: '⭐' },
    { id: 'loyalty', name: 'نقاط الولاء', icon: '🎯' },
    { id: 'search', name: 'بحث', icon: '🔎' },
    { id: 'settings', name: t('Tabs.settings'), icon: '⚙️' },

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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
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
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
            <ManagerStatsCards />
            
            {/* Quick Actions */}
            <ManagerQuickActions />
            
            {/* Recent Activity */}
            <ManagerRecentActivity />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <ManagerUsersTable />
          </div>
        )}

        {activeTab === 'trainers' && (
          <div className="space-y-8">
            <TrainersDirectory scope="manager" />
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

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                التقارير والإحصائيات
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                صفحة التقارير قيد التطوير...
              </p>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <AdminAttendance />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <AdminPayments />
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-8">
            <ManagerInvoices />
          </div>
        )}

      {activeTab === 'add-expense' && (
          <div className="space-y-8">
            <ManagerAddExpense />
          </div>
        )}

        {activeTab === 'add-revenue' && (
          <div className="space-y-8">
            <ManagerAddRevenue />
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="space-y-8">
            <AdminPurchases />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-8">
            <AdminMessages />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            <AdminProgress />
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            <ManagerFeedback />
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-8">
            <AdminLoyalty />
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-8">
            <AdminSearch />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <ManagerSettings />
          </div>
        )}


      </div>
    </div>
  );
};

export default ManagerDashboard;
