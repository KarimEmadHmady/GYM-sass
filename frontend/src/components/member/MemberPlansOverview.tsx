'use client';

import React, { useState } from 'react';

const MemberPlansOverview = () => {
  const [activeTab, setActiveTab] = useState('workout');

  const workoutPlans = [
    {
      id: 1,
      name: 'خطة التخسيس للمبتدئين',
      type: 'weight_loss',
      difficulty: 'beginner',
      duration: '8 أسابيع',
      currentWeek: 3,
      progress: 37.5,
      exercises: 12,
      trainer: 'سارة أحمد',
      status: 'active',
      nextSession: '2024-01-22'
    },
    {
      id: 2,
      name: 'خطة بناء العضلات',
      type: 'muscle_gain',
      difficulty: 'intermediate',
      duration: '12 أسبوع',
      currentWeek: 2,
      progress: 16.7,
      exercises: 18,
      trainer: 'علي محمود',
      status: 'active',
      nextSession: '2024-01-23'
    }
  ];

  const dietPlans = [
    {
      id: 1,
      name: 'خطة التخسيس الغذائية',
      type: 'weight_loss',
      calories: 1500,
      meals: 5,
      currentWeek: 3,
      progress: 37.5,
      trainer: 'سارة أحمد',
      status: 'active',
      nextMeal: 'الإفطار - 08:00'
    },
    {
      id: 2,
      name: 'خطة بناء العضلات الغذائية',
      type: 'muscle_gain',
      calories: 2500,
      meals: 6,
      currentWeek: 2,
      progress: 16.7,
      trainer: 'علي محمود',
      status: 'active',
      nextMeal: 'الإفطار - 08:00'
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
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'نشط',
      inactive: 'غير نشط',
      completed: 'مكتمل'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const currentPlans = activeTab === 'workout' ? workoutPlans : dietPlans;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            خططي
          </h3>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              طلب خطة جديدة
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              تصدير البيانات
            </button>
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
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">المدرب:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.trainer}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">الأسبوع الحالي:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.currentWeek} من {plan.duration.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">التقدم:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {plan.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(plan.progress)}`}
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activeTab === 'workout' ? 'الحصة القادمة:' : 'الوجبة القادمة:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {activeTab === 'workout' ? plan.nextSession : plan.nextMeal}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    عرض التفاصيل
                  </button>
                  <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    تحديث التقدم
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

export default MemberPlansOverview;
