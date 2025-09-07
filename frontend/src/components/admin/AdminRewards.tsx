'use client';

import React from 'react';

const AdminRewards = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الجوائز</h3>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">إضافة جائزة</button>
      </div>
      <p className="text-gray-500 dark:text-gray-400">واجهة إدارة CRUD للجوائز ستظهر هنا.</p>
    </div>
  );
};

export default AdminRewards;


