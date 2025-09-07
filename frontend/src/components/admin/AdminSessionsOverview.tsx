'use client';

import React, { useState } from 'react';

const AdminSessionsOverview = () => {
  const [activeTab, setActiveTab] = useState('today');

  const sessions = [
    {
      id: 1,
      title: 'حصة تدريبية - المجموعة أ',
      trainer: 'سارة أحمد',
      members: ['أحمد محمد', 'فاطمة حسن', 'محمد علي'],
      time: '09:00 - 10:00',
      date: '2024-01-20',
      status: 'completed',
      type: 'group',
      revenue: 150
    },
    {
      id: 2,
      title: 'حصة شخصية - أحمد محمد',
      trainer: 'علي محمود',
      members: ['أحمد محمد'],
      time: '11:00 - 12:00',
      date: '2024-01-20',
      status: 'upcoming',
      type: 'personal',
      revenue: 200
    },
    {
      id: 3,
      title: 'حصة تدريبية - المجموعة ب',
      trainer: 'سارة أحمد',
      members: ['فاطمة حسن', 'محمد علي', 'نور الدين'],
      time: '14:00 - 15:00',
      date: '2024-01-20',
      status: 'upcoming',
      type: 'group',
      revenue: 150
    },
    {
      id: 4,
      title: 'حصة تدريبية - المجموعة ج',
      trainer: 'علي محمود',
      members: ['أحمد محمد', 'فاطمة حسن'],
      time: '16:00 - 17:00',
      date: '2024-01-20',
      status: 'cancelled',
      type: 'group',
      revenue: 0
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: 'مكتملة',
      upcoming: 'قادمة',
      cancelled: 'ملغية',
      in_progress: 'جارية'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeIcon = (type: string) => {
    return type === 'group' ? '👥' : '👤';
  };

  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'today') {
      return session.date === '2024-01-20';
    } else if (activeTab === 'upcoming') {
      return session.status === 'upcoming';
    } else if (activeTab === 'completed') {
      return session.status === 'completed';
    }
    return true;
  });

  const totalRevenue = filteredSessions.reduce((sum, session) => sum + session.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            إدارة الحصص - الإدارة
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">ج.م{totalRevenue}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                إضافة حصة جديدة
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
              { id: 'today', name: 'اليوم', count: sessions.filter(s => s.date === '2024-01-20').length },
              { id: 'upcoming', name: 'القادمة', count: sessions.filter(s => s.status === 'upcoming').length },
              { id: 'completed', name: 'المكتملة', count: sessions.filter(s => s.status === 'completed').length },
              { id: 'all', name: 'الكل', count: sessions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sessions List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">
                      {getTypeIcon(session.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {session.title}
                      </h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">المدرب:</span> {session.trainer}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">الوقت:</span> {session.time}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">التاريخ:</span> {session.date}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span className="font-medium">الأعضاء:</span>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {session.members.map((member, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              >
                                {member}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ج.م{session.revenue}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">إيراد</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        تعديل
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSessionsOverview;
