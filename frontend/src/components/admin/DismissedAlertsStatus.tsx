'use client';

import React from 'react';

interface DismissedAlertsStatusProps {
  dismissedCount: number;
  totalAlerts: number;
  onReset: () => void;
  className?: string;
}

const DismissedAlertsStatus: React.FC<DismissedAlertsStatusProps> = ({ 
  dismissedCount, 
  totalAlerts, 
  onReset, 
  className = '' 
}) => {
  if (dismissedCount === 0) return null;

  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            تم إغلاق {dismissedCount} من أصل {totalAlerts} تحذير
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded transition-colors"
        >
          إعادة تعيين
        </button>
      </div>
    </div>
  );
};

export default DismissedAlertsStatus;
