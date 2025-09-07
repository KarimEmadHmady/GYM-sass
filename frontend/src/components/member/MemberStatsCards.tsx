'use client';

import React from 'react';

const MemberStatsCards = () => {
  const stats = [
    {
      title: 'الحصص المكتملة',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: '🏋️',
      color: 'blue',
      description: 'هذا الشهر'
    },
    {
      title: 'ساعات التدريب',
      value: '48',
      change: '+8',
      changeType: 'positive',
      icon: '⏰',
      color: 'green',
      description: 'هذا الشهر'
    },
    {
      title: 'الخطط النشطة',
      value: '2',
      change: '+1',
      changeType: 'positive',
      icon: '📋',
      color: 'purple',
      description: 'خطة تمرين + خطة غذائية'
    },
    {
      title: 'نقاط الولاء',
      value: '1,250',
      change: '+150',
      changeType: 'positive',
      icon: '⭐',
      color: 'yellow',
      description: 'إجمالي النقاط'
    },
    {
      title: 'فقدان الوزن',
      value: '3.2',
      change: '+0.5',
      changeType: 'positive',
      icon: '📉',
      color: 'red',
      description: 'كيلوغرام'
    },
    {
      title: 'بناء العضلات',
      value: '1.1',
      change: '+0.3',
      changeType: 'positive',
      icon: '💪',
      color: 'indigo',
      description: 'كيلوغرام'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
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
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
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

export default MemberStatsCards;
