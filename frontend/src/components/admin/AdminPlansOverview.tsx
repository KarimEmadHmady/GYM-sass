'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const AdminPlansOverview = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const t = useTranslations();

  const workoutPlans = [
    {
      id: 1,
      name: t('AdminPlansOverview.workoutPlans.plan1.name'),
      type: 'weight_loss',
      difficulty: 'beginner',
      duration: t('AdminPlansOverview.workoutPlans.plan1.duration'),
      exercises: 12,
      members: 25,
      status: 'active',
      createdBy: 'سارة أحمد',
      createdAt: '2024-01-15',
      revenue: 2500
    },
    {
      id: 2,
      name: t('AdminPlansOverview.workoutPlans.plan2.name'),
      type: 'muscle_gain',
      difficulty: 'intermediate',
      duration: t('AdminPlansOverview.workoutPlans.plan2.duration'),
      exercises: 18,
      members: 15,
      status: 'active',
      createdBy: 'علي محمود',
      createdAt: '2024-01-10',
      revenue: 1800
    },
    {
      id: 3,
      name: t('AdminPlansOverview.workoutPlans.plan3.name'),
      type: 'general_fitness',
      difficulty: 'beginner',
      duration: t('AdminPlansOverview.workoutPlans.plan3.duration'),
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
      name: t('AdminPlansOverview.dietPlans.plan1.name'),
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
      name: t('AdminPlansOverview.dietPlans.plan2.name'),
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
      name: t('AdminPlansOverview.dietPlans.plan3.name'),
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
    return t(`AdminPlansOverview.types.${type}`);
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
    return t(`AdminPlansOverview.difficulties.${difficulty}`);
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
    return t(`AdminPlansOverview.statuses.${status}`);
  };

  const currentPlans = activeTab === 'workout' ? workoutPlans : dietPlans;
  const totalRevenue = currentPlans.reduce((sum, plan) => sum + plan.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            {t('AdminPlansOverview.title')}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('AdminPlansOverview.totalRevenue')}
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ج.م{totalRevenue}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                {t('AdminPlansOverview.addNewPlan')}
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {t('AdminPlansOverview.exportData')}
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
              { id: 'workout', name: t('AdminPlansOverview.tabs.workout'), count: workoutPlans.length, icon: '🏋️' },
              { id: 'diet', name: t('AdminPlansOverview.tabs.diet'), count: dietPlans.length, icon: '🍎' }
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.type')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getTypeText(plan.type)}
                    </span>
                  </div>

                  {activeTab === 'workout' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.difficulty')}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor((plan as any).difficulty)}`}>
                          {getDifficultyText((plan as any).difficulty)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.duration')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(plan as any).duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.exercises')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(plan as any).exercises} {t('AdminPlansOverview.exerciseUnit')}
                        </span>
                      </div>
                    </>
                  )}
                  {activeTab === 'diet' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.calories')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(plan as any).calories} {t('AdminPlansOverview.calorieUnit')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.meals')}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(plan as any).meals} {t('AdminPlansOverview.mealUnit')}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.members')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.members} {t('AdminPlansOverview.memberUnit')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.createdBy')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.createdBy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('AdminPlansOverview.labels.revenue')}</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      ج.م{plan.revenue}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    {t('AdminPlansOverview.viewDetails')}
                  </button>
                  <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    {t('AdminPlansOverview.edit')}
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
