'use client';

import React, { useState } from 'react';

const AdminPlansOverview = () => {
  const [activeTab, setActiveTab] = useState('workout');

  const workoutPlans = [
    {
      id: 1,
      name: 'خطة التخسيس للمبتدئين',
      type: 'weight_loss',
      difficulty: 'beginner',
      duration: '8 أسابيع',
      exercises: 12,
      members: 25,
      status: 'active',
      createdBy: 'سارة أحمد',
      createdAt: '2024-01-15',
      revenue: 2500
    },
    {
      id: 2,
      name: 'خطة بناء العضلات',
      type: 'muscle_gain',
      difficulty: 'intermediate',
      duration: '12 أسبوع',
      exercises: 18,
      members: 15,
      status: 'active',
      createdBy: 'علي محمود',
      createdAt: '2024-01-10',
      revenue: 1800
    },
    {
      id: 3,
      name: 'خطة اللياقة العامة',
      type: 'general_fitness',
      difficulty: 'beginner',
      duration: '6 أسابيع',
      exercises: 10,
      members: 30,
      status: 'active',
      createdBy: 'سارة أحمد',
      createdAt: '2024-01-08',
      revenue: 3000
    }
  ];

  const dietPlans = [
    {
      id: 1,
      name: 'خطة التخسيس الغذائية',
      type: 'weight_loss',
      calories: 1500,
      meals: 5,
      members: 20,
      status: 'active',
      createdBy: 'سارة أحمد',
      createdAt: '2024-01-12',
      revenue: 1200
    },
    {
      id: 2,
      name: 'خطة بناء العضلات الغذائية',
      type: 'muscle_gain',
      calories: 2500,
      meals: 6,
      members: 12,
      status: 'active',
      createdBy: 'علي محمود',
      createdAt: '2024-01-05',
      revenue: 900
    },
    {
      id: 3,
      name: 'خطة الصحة العامة',
      type: 'general_health',
      calories: 2000,
      meals: 4,
      members: 35,
      status: 'active',
      createdBy: 'سارة أحمد',
      createdAt: '2024-01-03',
      revenue: 2100
    }
  ];

  const getTypeText = (type: string) => {
    const types = {
      weight_loss: 'تخسيس',
      muscle_gain: 'بناء عضلات',
      general_fitness: 'لياقة عامة',
      general_health: 'صحة عامة'
    };
    return types[type as keyof typeof types] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم'
    };
    return texts[difficulty as keyof typeof texts] || difficulty;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'نشط',
      inactive: 'غير نشط',
      draft: 'مسودة'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const currentPlans = activeTab === 'workout' ? workoutPlans : dietPlans;
  const totalRevenue = currentPlans.reduce((sum, plan) => sum + plan.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            إدارة الخطط - الإدارة
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">ج.م{totalRevenue}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                إضافة خطة جديدة
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                تصدير البيانات
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'workout', name: 'خطط التمرين', count: workoutPlans.length, icon: '🏋️' },
              { id: 'diet', name: 'الخطط الغذائية', count: dietPlans.length, icon: '🍎' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Plans List */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                    {getStatusText(plan.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">النوع:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getTypeText(plan.type)}
                    </span>
                  </div>

                  {activeTab === 'workout' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">المستوى:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                          {getDifficultyText(plan.difficulty)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">المدة:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">التمارين:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.exercises} تمرين
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">السعرات:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.calories} سعرة
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">الوجبات:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.meals} وجبة
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">الأعضاء:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.members} عضو
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">المنشئ:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.createdBy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">الإيرادات:</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      ج.م{plan.revenue}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    عرض التفاصيل
                  </button>
                  <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlansOverview;
