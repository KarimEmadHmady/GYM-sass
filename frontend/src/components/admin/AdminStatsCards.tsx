'use client';

import React from 'react';

const AdminStatsCards = () => {
  const stats = [
    {
      title: 'إجمالي الأعضاء',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'المدربين النشطين',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: '🏋️',
      color: 'green'
    },
    {
      title: 'الحصص اليومية',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: '📅',
      color: 'purple'
    },
    {
      title: 'الإيرادات الشهرية',
      value: 'ج.م45,678',
      change: '+8%',
      changeType: 'positive',
      icon: '💰',
      color: 'yellow'
    },
    {
      title: 'المصروفات الشهرية',
      value: 'ج.م12,345',
      change: '+5%',
      changeType: 'negative',
      icon: '💸',
      color: 'red'
    },
    {
      title: 'الربح الصافي',
      value: 'ج.م33,333',
      change: '+12%',
      changeType: 'positive',
      icon: '📈',
      color: 'green'
    },
    {
      title: 'نقاط الولاء الموزعة',
      value: '12,456',
      change: '+8%',
      changeType: 'positive',
      icon: '⭐',
      color: 'indigo'
    },
    {
      title: 'التقييمات الجديدة',
      value: '67',
      change: '+5',
      changeType: 'positive',
      icon: '💬',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  من الشهر الماضي
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center text-white text-xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
