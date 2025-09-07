'use client';

import React, { useState } from 'react';

const AdminReports = () => {
  const [activeReport, setActiveReport] = useState('financial');

  const reports = [
    {
      id: 'financial',
      name: 'التقارير المالية',
      icon: '💰',
      description: 'تقارير شاملة عن الإيرادات والمصروفات والأرباح'
    },
    {
      id: 'users',
      name: 'تقارير المستخدمين',
      icon: '👥',
      description: 'إحصائيات مفصلة عن الأعضاء والمدربين'
    },
    {
      id: 'sessions',
      name: 'تقارير الحصص',
      icon: '🏋️',
      description: 'تحليل شامل للحصص التدريبية والإيرادات'
    },
    {
      id: 'plans',
      name: 'تقارير الخطط',
      icon: '📋',
      description: 'تقييم أداء خطط التمرين والغذائية'
    },
    {
      id: 'attendance',
      name: 'تقارير الحضور',
      icon: '📅',
      description: 'متابعة حضور الأعضاء وتقييم الالتزام'
    },
    {
      id: 'loyalty',
      name: 'تقارير نقاط الولاء',
      icon: '⭐',
      description: 'تحليل نظام نقاط الولاء والاسترداد'
    }
  ];

  const financialData = {
    monthly: {
      revenue: 45678,
      expenses: 12345,
      profit: 33333,
      growth: 8.5
    },
    weekly: {
      revenue: 11420,
      expenses: 3086,
      profit: 8334,
      growth: 12.3
    },
    daily: {
      revenue: 1631,
      expenses: 441,
      profit: 1190,
      growth: 15.2
    }
  };

  const userStats = {
    total: 1234,
    active: 1100,
    inactive: 134,
    newThisMonth: 45,
    growth: 12.5
  };

  const sessionStats = {
    total: 89,
    completed: 67,
    upcoming: 15,
    cancelled: 7,
    revenue: 13350
  };

  return (
    <div className="space-y-6">
      {/* Report Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          أنواع التقارير
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`p-4 rounded-lg border-2 text-right transition-all ${
                activeReport === report.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{report.icon}</span>
                <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {activeReport === 'financial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">التقارير المالية</h3>
            
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">الإيرادات</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ج.م{financialData.monthly.revenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +{financialData.monthly.growth}% من الشهر الماضي
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">المصروفات</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ج.م{financialData.monthly.expenses.toLocaleString()}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  +5.2% من الشهر الماضي
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">الربح الصافي</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ج.م{financialData.monthly.profit.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  +12.3% من الشهر الماضي
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">الإيرادات</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">شهرياً:</span>
                    <span className="font-medium">ج.م{financialData.monthly.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">أسبوعياً:</span>
                    <span className="font-medium">ج.م{financialData.weekly.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">يومياً:</span>
                    <span className="font-medium">ج.م{financialData.daily.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">المصروفات</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">شهرياً:</span>
                    <span className="font-medium">ج.م{financialData.monthly.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">أسبوعياً:</span>
                    <span className="font-medium">ج.م{financialData.weekly.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">يومياً:</span>
                    <span className="font-medium">ج.م{financialData.daily.expenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">الربح</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">شهرياً:</span>
                    <span className="font-medium">ج.م{financialData.monthly.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">أسبوعياً:</span>
                    <span className="font-medium">ج.م{financialData.weekly.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">يومياً:</span>
                    <span className="font-medium">ج.م{financialData.daily.profit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'users' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير المستخدمين</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">إجمالي المستخدمين</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.total}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">النشطين</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.active}</p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">غير النشطين</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{userStats.inactive}</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">جدد هذا الشهر</h4>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.newThisMonth}</p>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'sessions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير الحصص</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">إجمالي الحصص</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sessionStats.total}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">المكتملة</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionStats.completed}</p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">القادمة</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{sessionStats.upcoming}</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">إيرادات الحصص</h4>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">ج.م{sessionStats.revenue}</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">تصدير التقرير</h4>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              تصدير PDF
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
              تصدير Excel
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
              تصدير CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
