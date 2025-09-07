'use client';

import React, { useState } from 'react';

const MemberProgressTracking = () => {
  const [activeTab, setActiveTab] = useState('weight');

  const progressData = {
    weight: {
      current: 80,
      start: 83.2,
      target: 75,
      change: -3.2,
      unit: 'كغ'
    },
    muscle: {
      current: 1.1,
      start: 0,
      target: 2.5,
      change: 1.1,
      unit: 'كغ'
    },
    bodyFat: {
      current: 18.5,
      start: 22.3,
      target: 15,
      change: -3.8,
      unit: '%'
    },
    strength: {
      current: 85,
      start: 60,
      target: 100,
      change: 25,
      unit: '%'
    }
  };

  const weeklyProgress = [
    { week: 1, weight: 83.2, muscle: 0, bodyFat: 22.3, strength: 60 },
    { week: 2, weight: 82.1, muscle: 0.3, bodyFat: 21.8, strength: 65 },
    { week: 3, weight: 81.5, muscle: 0.7, bodyFat: 21.2, strength: 70 },
    { week: 4, weight: 80.8, muscle: 0.9, bodyFat: 20.5, strength: 75 },
    { week: 5, weight: 80.0, muscle: 1.1, bodyFat: 18.5, strength: 85 }
  ];

  const getProgressColor = (change: number, type: string) => {
    if (type === 'weight' || type === 'bodyFat') {
      return change < 0 ? 'text-green-600' : 'text-red-600';
    }
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getProgressIcon = (change: number, type: string) => {
    if (type === 'weight' || type === 'bodyFat') {
      return change < 0 ? '📉' : '📈';
    }
    return change > 0 ? '📈' : '📉';
  };

  const getProgressPercentage = (current: number, start: number, target: number) => {
    const totalChange = Math.abs(target - start);
    const currentChange = Math.abs(current - start);
    return Math.min((currentChange / totalChange) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(progressData).map(([key, data]) => (
          <div
            key={key}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {key === 'weight' ? 'الوزن' : 
                 key === 'muscle' ? 'بناء العضلات' : 
                 key === 'bodyFat' ? 'دهون الجسم' : 'القوة'}
              </h3>
              <span className="text-2xl">
                {getProgressIcon(data.change, key)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.current}{data.unit}
                </span>
                <span className={`text-sm font-medium ${getProgressColor(data.change, key)}`}>
                  {data.change > 0 ? '+' : ''}{data.change}{data.unit}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                الهدف: {data.target}{data.unit}
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${getProgressPercentage(data.current, data.start, data.target)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تقدمي الأسبوعي
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الأسبوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الوزن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  بناء العضلات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  دهون الجسم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  القوة
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {weeklyProgress.map((week, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    الأسبوع {week.week}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {week.weight} كغ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {week.muscle} كغ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {week.bodyFat}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {week.strength}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تسجيل تقدمي
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
            <div className="text-2xl mb-2">⚖️</div>
            <h4 className="font-medium text-gray-900 dark:text-white">تسجيل الوزن</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">تسجيل وزنك الحالي</p>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
            <div className="text-2xl mb-2">💪</div>
            <h4 className="font-medium text-gray-900 dark:text-white">تسجيل القوة</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">تسجيل قوتك الحالية</p>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
            <div className="text-2xl mb-2">📏</div>
            <h4 className="font-medium text-gray-900 dark:text-white">قياسات الجسم</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">تسجيل قياسات جسمك</p>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
            <div className="text-2xl mb-2">📸</div>
            <h4 className="font-medium text-gray-900 dark:text-white">صور التقدم</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">رفع صور تقدمك</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberProgressTracking;
