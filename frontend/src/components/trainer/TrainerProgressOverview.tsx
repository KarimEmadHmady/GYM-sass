'use client';

import React, { useState } from 'react';

const TrainerProgressOverview = () => {
  const [activeTab, setActiveTab] = useState('clients');

  const clientProgress = [
    {
      id: 1,
      clientName: 'أحمد محمد',
      planName: 'خطة التخسيس للمبتدئين',
      startDate: '2024-01-15',
      currentWeek: 3,
      totalWeeks: 8,
      progress: 37.5,
      weightLoss: 3.2,
      muscleGain: 1.1,
      lastUpdate: '2024-01-20',
      status: 'on_track'
    },
    {
      id: 2,
      clientName: 'فاطمة حسن',
      planName: 'خطة اللياقة العامة',
      startDate: '2024-01-10',
      currentWeek: 2,
      totalWeeks: 6,
      progress: 33.3,
      weightLoss: 1.8,
      muscleGain: 0.5,
      lastUpdate: '2024-01-19',
      status: 'excellent'
    },
    {
      id: 3,
      clientName: 'محمد علي',
      planName: 'خطة بناء العضلات',
      startDate: '2024-01-05',
      currentWeek: 2,
      totalWeeks: 12,
      progress: 16.7,
      weightLoss: 0,
      muscleGain: 2.3,
      lastUpdate: '2024-01-18',
      status: 'on_track'
    },
    {
      id: 4,
      clientName: 'نور الدين',
      planName: 'خطة التخسيس للمبتدئين',
      startDate: '2024-01-12',
      currentWeek: 1,
      totalWeeks: 8,
      progress: 12.5,
      weightLoss: 0.8,
      muscleGain: 0.2,
      lastUpdate: '2024-01-20',
      status: 'needs_attention'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      on_track: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      needs_attention: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      behind: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      excellent: 'ممتاز',
      on_track: 'على المسار الصحيح',
      needs_attention: 'يحتاج انتباه',
      behind: 'متأخر'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const overallStats = {
    totalClients: clientProgress.length,
    onTrack: clientProgress.filter(c => c.status === 'on_track' || c.status === 'excellent').length,
    needsAttention: clientProgress.filter(c => c.status === 'needs_attention').length,
    averageProgress: clientProgress.reduce((sum, c) => sum + c.progress, 0) / clientProgress.length
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              👥
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">على المسار الصحيح</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.onTrack}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">
              ⚠️
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">يحتاج انتباه</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.needsAttention}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              📈
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">متوسط التقدم</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.averageProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Progress Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            تقدم العملاء
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الخطة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  التقدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  فقدان الوزن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  بناء العضلات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  آخر تحديث
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {clientProgress.map((progress) => (
                <tr key={progress.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {progress.clientName.charAt(0)}
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {progress.clientName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          الأسبوع {progress.currentWeek} من {progress.totalWeeks}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{progress.planName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      بدأ في {progress.startDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(progress.progress)}`}
                          style={{ width: `${progress.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {progress.progress.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {progress.weightLoss} كغ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {progress.muscleGain} كغ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(progress.status)}`}>
                      {getStatusText(progress.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {progress.lastUpdate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerProgressOverview;
