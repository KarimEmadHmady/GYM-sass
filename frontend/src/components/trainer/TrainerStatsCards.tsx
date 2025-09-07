'use client';

import React from 'react';

const TrainerStatsCards = () => {
  const stats = [
    {
      title: 'عملائي النشطين',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'الحصص هذا الأسبوع',
      value: '18',
      change: '+2',
      changeType: 'positive',
      icon: '🏋️',
      color: 'green'
    },
    {
      title: 'ساعات التدريب',
      value: '36',
      change: '+8',
      changeType: 'positive',
      icon: '⏰',
      color: 'purple'
    },
    {
      title: 'التقييمات',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive',
      icon: '⭐',
      color: 'yellow'
    },
    {
      title: 'الخطط النشطة',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: '📋',
      color: 'indigo'
    },
    {
      title: 'الإيرادات الشهرية',
      value: 'ج.م8,500',
      change: '+15%',
      changeType: 'positive',
      icon: '💰',
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  من الأسبوع الماضي
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

export default TrainerStatsCards;
