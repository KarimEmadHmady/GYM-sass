'use client';

import React from 'react';

const MemberTrainer = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">مدربي</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-900 dark:text-white">اسم المدرب</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">بيانات التواصل</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">إرسال رسالة</button>
          <button className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm">إرسال فيدباك</button>
        </div>
      </div>
    </div>
  );
};

export default MemberTrainer;


