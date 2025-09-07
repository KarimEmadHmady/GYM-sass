'use client';

import React from 'react';

const ManagerRecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'member_registered',
      title: 'عضو جديد مسجل',
      description: 'أحمد محمد سجل في الجيم',
      time: 'منذ 5 دقائق',
      icon: '👤',
      color: 'green'
    },
    {
      id: 2,
      type: 'session_completed',
      title: 'حصة مكتملة',
      description: 'حصة تدريبية مع المدرب سارة',
      time: 'منذ 15 دقيقة',
      icon: '🏋️',
      color: 'blue'
    },
    {
      id: 3,
      type: 'plan_created',
      title: 'خطة جديدة',
      description: 'تم إنشاء خطة تمرين للمجموعة أ',
      time: 'منذ ساعة',
      icon: '📋',
      color: 'purple'
    },
    {
      id: 4,
      type: 'points_awarded',
      title: 'نقاط ولاء',
      description: 'تم منح 50 نقطة ولاء لمحمد علي',
      time: 'منذ ساعتين',
      icon: '⭐',
      color: 'yellow'
    },
    {
      id: 5,
      type: 'feedback_received',
      title: 'تقييم جديد',
      description: 'تقييم 5 نجوم من فاطمة أحمد',
      time: 'منذ 3 ساعات',
      icon: '💬',
      color: 'pink'
    },
    {
      id: 6,
      type: 'payment_received',
      title: 'دفعة مستلمة',
      description: 'دفعة شهرية من 15 عضواً',
      time: 'منذ 4 ساعات',
      icon: '💰',
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          النشاط الأخير
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          عرض الكل
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getColorClasses(activity.color)}`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerRecentActivity;
