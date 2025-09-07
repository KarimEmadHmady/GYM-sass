'use client';

import React from 'react';

const TrainerProfile = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الملف الشخصي</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الاسم</label>
          <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="اسم المدرب" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">البريد</label>
          <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الهاتف</label>
          <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="+966.." />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">النبذة</label>
          <textarea className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="نبذة قصيرة" rows={3} />
        </div>
      </div>
      <div className="mt-6 text-left">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">حفظ التغييرات</button>
      </div>
    </div>
  );
};

export default TrainerProfile;


