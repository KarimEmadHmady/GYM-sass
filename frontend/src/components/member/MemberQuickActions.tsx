'use client';

import React from 'react';

const MemberQuickActions = () => {
  const actions = [
    {
      title: 'حجز حصة',
      description: 'حجز حصة تدريبية جديدة',
      icon: '📅',
      color: 'blue',
      action: () => console.log('Book session')
    },
    {
      title: 'تسجيل حضور',
      description: 'تسجيل حضور في الحصة',
      icon: '✅',
      color: 'green',
      action: () => console.log('Check in')
    },
    {
      title: 'عرض خططي',
      description: 'عرض خطط التمرين والغذائية',
      icon: '📋',
      color: 'purple',
      action: () => console.log('View plans')
    },
    {
      title: 'تسجيل تقدمي',
      description: 'تسجيل تقدمي في التدريب',
      icon: '📈',
      color: 'orange',
      action: () => console.log('Record progress')
    },
    {
      title: 'استبدال نقاط',
      description: 'استبدال نقاط الولاء',
      icon: '⭐',
      color: 'yellow',
      action: () => console.log('Redeem points')
    },
    {
      title: 'إرسال رسالة',
      description: 'إرسال رسالة لمدربي',
      icon: '💬',
      color: 'pink',
      action: () => console.log('Send message')
    },
    {
      title: 'عرض جدولي',
      description: 'عرض جدولي الزمني',
      icon: '📊',
      color: 'indigo',
      action: () => console.log('View schedule')
    },
    {
      title: 'تحديث بروفايل',
      description: 'تحديث معلوماتي الشخصية',
      icon: '⚙️',
      color: 'gray',
      action: () => console.log('Update profile')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      gray: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        الإجراءات السريعة
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`bg-gradient-to-r ${getColorClasses(action.color)} text-white rounded-lg p-4 text-left hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{action.icon}</span>
              <h4 className="font-semibold text-sm">{action.title}</h4>
            </div>
            <p className="text-xs opacity-90">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemberQuickActions;
