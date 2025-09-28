'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/useAuth';

const AdminQuickActions = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (actionId: string, action: () => Promise<void> | void) => {
    setLoading(actionId);
    try {
      await action();
    } catch (error) {
      console.error('Error executing action:', error);
    } finally {
      setLoading(null);
    }
  };

  const actions = [
    {
      id: 'add_member',
      title: 'إضافة عضو جديد',
      description: 'تسجيل عضو جديد في الجيم',
      icon: '👤',
      color: 'blue',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=users`)
    },
    {
      id: 'add_trainer',
      title: 'إضافة مدرب',
      description: 'تسجيل مدرب جديد',
      icon: '🏋️',
      color: 'green',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=trainers`)
    },
    {
      id: 'add_manager',
      title: 'إضافة مدير',
      description: 'تسجيل مدير جديد',
      icon: '👨‍💼',
      color: 'purple',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=users`)
    },
    {
      id: 'create_workout',
      title: 'إنشاء خطة تمرين',
      description: 'إنشاء خطة تمرين جديدة',
      icon: '📋',
      color: 'orange',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=plans`)
    },
    {
      id: 'create_diet',
      title: 'إنشاء خطة غذائية',
      description: 'إنشاء خطة غذائية جديدة',
      icon: '🍎',
      color: 'yellow',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=plans`)
    },
    {
      id: 'schedule_session',
      title: 'جدولة حصة',
      description: 'جدولة حصة تدريبية جديدة',
      icon: '📅',
      color: 'indigo',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=sessions`)
    },
    {
      id: 'add_expense',
      title: 'إضافة مصروف',
      description: 'تسجيل مصروف جديد',
      icon: '💸',
      color: 'red',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=financial`)
    },
    {
      id: 'add_revenue',
      title: 'إضافة إيراد',
      description: 'تسجيل إيراد جديد',
      icon: '💰',
      color: 'green',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=financial`)
    },
    {
      id: 'create_invoice',
      title: 'إنشاء فاتورة',
      description: 'إنشاء فاتورة جديدة',
      icon: '🧾',
      color: 'blue',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=financial`)
    },
    {
      id: 'manage_payroll',
      title: 'إدارة الرواتب',
      description: 'إدارة رواتب الموظفين',
      icon: '💳',
      color: 'purple',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=financial`)
    },
    {
      id: 'view_reports',
      title: 'عرض التقارير',
      description: 'عرض تقارير مفصلة',
      icon: '📊',
      color: 'pink',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=reports`)
    },
    {
      id: 'manage_system',
      title: 'إدارة النظام',
      description: 'تعديل إعدادات النظام',
      icon: '⚙️',
      color: 'gray',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=settings`)
    },
    // إضافات ناقصة من التبويبات المتاحة في الصفحة
    {
      id: 'attendance',
      title: 'الحضور',
      description: 'تسجيل وعرض الحضور',
      icon: '📝',
      color: 'indigo',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=attendance`)
    },
    {
      id: 'payments',
      title: 'مدفوعات',
      description: 'إدارة المدفوعات',
      icon: '💵',
      color: 'green',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=payments`)
    },
    {
      id: 'purchases',
      title: 'مشتريات',
      description: 'إدارة المشتريات',
      icon: '🛒',
      color: 'orange',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=purchases`)
    },
    {
      id: 'messages',
      title: 'رسائل',
      description: 'عرض وإرسال الرسائل',
      icon: '✉️',
      color: 'blue',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=messages`)
    },
    {
      id: 'progress',
      title: 'تقدم العملاء',
      description: 'متابعة تقدم العملاء',
      icon: '📈',
      color: 'pink',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=progress`)
    },
    {
      id: 'feedback',
      title: 'التقييمات',
      description: 'إدارة التقييمات',
      icon: '⭐',
      color: 'yellow',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=feedback`)
    },
    {
      id: 'loyalty',
      title: 'نقاط الولاء',
      description: 'إدارة نقاط الولاء',
      icon: '🎯',
      color: 'red',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=loyalty`)
    },
    {
      id: 'search',
      title: 'بحث',
      description: 'البحث في النظام',
      icon: '🔎',
      color: 'gray',
      action: () => router.push(`/admin/dashboard/${user?.id}?tab=search`)
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      gray: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        الإجراءات السريعة - الإدارة
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id, action.action)}
            disabled={loading === action.id}
            className={`bg-gradient-to-r ${getColorClasses(action.color)} text-white rounded-md p-3 text-center cursor-pointer hover:shadow-md transform hover:scale-[1.02] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <div className="flex items-center justify-center mb-1 text-center w-full">
              <span className="text-xl mr-2">{action.icon}</span>
              <h4 className="font-semibold text-xs">{action.title}</h4>
            </div>
            <p className="text-[10px] opacity-90 text-center">{action.description}</p>
            {loading === action.id && (
              <div className="mt-1 flex items-center">
                <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white mr-2"></div>
                <span className="text-[10px]">جارِ التوجيه...</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminQuickActions;
