'use client';

import React, { useState, useEffect } from 'react';
import { subscriptionAlertService, type SubscriptionAlert } from '@/services/subscriptionAlertService';
import AlertResetButton from './AlertResetButton';
import DismissedAlertsStatus from './DismissedAlertsStatus';

interface SubscriptionAlertsSummaryProps {
  className?: string;
}

const SubscriptionAlertsSummary: React.FC<SubscriptionAlertsSummaryProps> = ({ className = '' }) => {
  const [alerts, setAlerts] = useState<SubscriptionAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedCount, setDismissedCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const subscriptionAlerts = await subscriptionAlertService.getSubscriptionAlerts();
        setAlerts(subscriptionAlerts);
      } catch (error) {
        console.error('Error fetching subscription alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
    
    // تحديث التحذيرات كل 30 ثانية
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  if (isDismissed) {
    return (
      <DismissedAlertsStatus
        dismissedCount={dismissedCount}
        totalAlerts={alerts.length}
        onReset={() => {
          setIsDismissed(false);
          setDismissedCount(0);
        }}
        className={className}
      />
    );
  }

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning');

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            تحذيرات الاشتراكات
          </h3>
          <div className="flex items-center space-x-4">
            <AlertResetButton 
              onReset={() => setIsDismissed(false)}
              className="text-xs"
            />
            <button
              onClick={() => {
                setIsDismissed(true);
                setDismissedCount(alerts.length);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="إغلاق التحذيرات"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {criticalAlerts.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {criticalAlerts.length} تحذيرات 
                </span>
              </div>
            )}
            {warningAlerts.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {warningAlerts.length} تحذير
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {criticalAlerts.map((alert, index) => (
            <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <h4 className="font-semibold text-red-900 dark:text-red-100">
                      {alert.userName}
                    </h4>
                    <span className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                       ! تحذير
                    </span>
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    {alert.alertType === 'expiry' && (
                      <span>الاشتراك سينتهي خلال {alert.daysUntilExpiry} أيام</span>
                    )}
                    {alert.alertType === 'reminder' && (
                      <span>يجب إرسال تذكير خلال {alert.daysUntilReminder} أيام</span>
                    )}
                    {alert.alertType === 'both' && (
                      <span>
                        انتهاء خلال {alert.daysUntilExpiry} أيام + تذكير خلال {alert.daysUntilReminder} أيام
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  {alert.subscriptionEndDate.toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>
          ))}
          
          {warningAlerts.map((alert, index) => (
            <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                      {alert.userName}
                    </h4>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                      تحذير
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    {alert.alertType === 'expiry' && (
                      <span>الاشتراك سينتهي خلال {alert.daysUntilExpiry} أيام</span>
                    )}
                    {alert.alertType === 'reminder' && (
                      <span>يجب إرسال تذكير خلال {alert.daysUntilReminder} أيام</span>
                    )}
                    {alert.alertType === 'both' && (
                      <span>
                        انتهاء خلال {alert.daysUntilExpiry} أيام + تذكير خلال {alert.daysUntilReminder} أيام
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  {alert.subscriptionEndDate.toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAlertsSummary;
