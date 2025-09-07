'use client';

import React from 'react';

const ManagerQuickActions = () => {
  const actions = [
    {
      title: 'إضافة عضو جديد',
      description: 'تسجيل عضو جديد في الجيم',
      icon: '👤',
      color: 'blue',
      action: () => console.log('Add new member')
    },
    {
      title: 'إضافة مدرب',
      description: 'تسجيل مدرب جديد',
      icon: '🏋️',
      color: 'green',
      action: () => console.log('Add new trainer')
    },
    {
      title: 'إنشاء خطة تمرين',
      description: 'إنشاء خطة تمرين جديدة',
      icon: '📋',
      color: 'purple',
      action: () => console.log('Create workout plan')
    },
    {
      title: 'إنشاء خطة غذائية',
      description: 'إنشاء خطة غذائية جديدة',
      icon: '🍎',
      color: 'orange',
      action: () => console.log('Create diet plan')
    },
    {
      title: 'جدولة حصة',
      description: 'جدولة حصة تدريبية جديدة',
      icon: '📅',
      color: 'indigo',
      action: () => console.log('Schedule session')
    },
    {
      title: 'إضافة نقاط ولاء',
      description: 'إضافة نقاط ولاء لعضو',
      icon: '⭐',
      color: 'yellow',
      action: () => console.log('Add loyalty points')
    },
    {
      title: 'عرض التقارير',
      description: 'عرض تقارير مفصلة',
      icon: '📊',
      color: 'pink',
      action: () => console.log('View reports')
    },
    {
      title: 'إدارة الإعدادات',
      description: 'تعديل إعدادات النظام',
      icon: '⚙️',
      color: 'gray',
      action: () => console.log('Manage settings')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
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

export default ManagerQuickActions;
