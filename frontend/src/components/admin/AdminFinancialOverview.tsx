
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const AdminFinancialOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const t = useTranslations();

  const financialData = {
    revenue: { monthly: 45678, weekly: 11420, daily: 1631, growth: 8.5 },
    expenses: { monthly: 12345, weekly: 3086, daily: 441, growth: 5.2 },
    profit: { monthly: 33333, weekly: 8333, daily: 1190, growth: 12.3 },
  };
  const recentTransactions = [
    {
      id: 1,
      type: 'revenue',
      description: t('AdminFinancialOverview.transactionDescriptions.membershipPayment'),
      amount: 3750,
      date: '2024-01-20',
      category: 'subscriptions',
    },
    {
      id: 2,
      type: 'expense',
      description: t('AdminFinancialOverview.transactionDescriptions.equipmentPurchase'),
      amount: -2500,
      date: '2024-01-19',
      category: 'equipment',
    },
    {
      id: 3,
      type: 'revenue',
      description: t('AdminFinancialOverview.transactionDescriptions.personalTraining'),
      amount: 150,
      date: '2024-01-19',
      category: 'personal_training',
    },
    {
      id: 4,
      type: 'expense',
      description: t('AdminFinancialOverview.transactionDescriptions.utilitiesBill'),
      amount: -800,
      date: '2024-01-18',
      category: 'utilities',
    },
    {
      id: 5,
      type: 'revenue',
      description: t('AdminFinancialOverview.transactionDescriptions.supplementsSale'),
      amount: 300,
      date: '2024-01-18',
      category: 'supplements',
    },
  ];
  

  const getTransactionIcon = (type: string) => {
    return type === 'revenue' ? '💰' : '💸';
  };

  const getTransactionColor = (type: string) => {
    return type === 'revenue' ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryText = (category: string) => {
    return t(`AdminFinancialOverview.categories.${category}`);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('AdminFinancialOverview.monthlyRevenue')}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ج.م{financialData.revenue.monthly.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                +{financialData.revenue.growth}%{' '}
                {t('AdminFinancialOverview.fromLastMonth')}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              💰
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('AdminFinancialOverview.monthlyExpenses')}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ج.م{financialData.expenses.monthly.toLocaleString()}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                +{financialData.expenses.growth}%{' '}
                {t('AdminFinancialOverview.fromLastMonth')}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl">
              💸
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('AdminFinancialOverview.netProfit')}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ج.م{financialData.profit.monthly.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                +{financialData.profit.growth}%{' '}
                {t('AdminFinancialOverview.fromLastMonth')}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: 'overview',
                name: t('AdminFinancialOverview.tabs.overview'),
                icon: '📊',
              },
              {
                id: 'transactions',
                name: t('AdminFinancialOverview.tabs.transactions'),
                icon: '💳',
              },
              {
                id: 'reports',
                name: t('AdminFinancialOverview.tabs.reports'),
                icon: '📈',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('AdminFinancialOverview.overviewTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.revenues')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.monthly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.revenue.monthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.weekly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.revenue.weekly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.daily')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.revenue.daily.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.expenses')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.monthly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.expenses.monthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.weekly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.expenses.weekly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.daily')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.expenses.daily.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('AdminFinancialOverview.recentTransactions')}
              </h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getCategoryText(transaction.category)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${getTransactionColor(
                          transaction.type,
                        )}`}
                      >
                        {transaction.amount > 0 ? '+' : ''}ج.م
                        {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('AdminFinancialOverview.reportsTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.reports.revenue')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('AdminFinancialOverview.reports.revenueDesc')}
                  </p>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.reports.expenses')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('AdminFinancialOverview.reports.expensesDesc')}
                  </p>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.reports.profit')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('AdminFinancialOverview.reports.profitDesc')}
                  </p>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.reports.general')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('AdminFinancialOverview.reports.generalDesc')}
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialOverview;
