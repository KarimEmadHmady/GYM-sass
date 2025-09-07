'use client';

import React, { useState } from 'react';

const TrainerClientsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const clients = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
      status: 'active',
      joinDate: '2024-01-15',
      lastSession: '2024-01-20',
      totalSessions: 12,
      rating: 4.8,
      progress: 85,
      goals: ['تخسيس', 'بناء عضلات']
    },
    {
      id: 2,
      name: 'فاطمة حسن',
      email: 'fatima@example.com',
      phone: '+966 50 234 5678',
      status: 'active',
      joinDate: '2024-01-10',
      lastSession: '2024-01-19',
      totalSessions: 8,
      rating: 4.9,
      progress: 72,
      goals: ['تخسيس', 'لياقة عامة']
    },
    {
      id: 3,
      name: 'محمد علي',
      email: 'mohamed@example.com',
      phone: '+966 50 345 6789',
      status: 'inactive',
      joinDate: '2024-01-05',
      lastSession: '2024-01-15',
      totalSessions: 5,
      rating: 4.5,
      progress: 60,
      goals: ['بناء عضلات']
    },
    {
      id: 4,
      name: 'نور الدين',
      email: 'nour@example.com',
      phone: '+966 50 456 7890',
      status: 'active',
      joinDate: '2024-01-12',
      lastSession: '2024-01-20',
      totalSessions: 6,
      rating: 4.7,
      progress: 78,
      goals: ['لياقة عامة', 'مرونة']
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'معلق'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            عملائي
          </h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="البحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">معلق</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{client.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                {getStatusText(client.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">التقييم:</span>
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-1">
                    {client.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">الحصص:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {client.totalSessions} حصة
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">آخر حصة:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {client.lastSession}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">التقدم:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {client.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(client.progress)}`}
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">الأهداف:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors">
                عرض التفاصيل
              </button>
              <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                إرسال رسالة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerClientsOverview;
