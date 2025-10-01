'use client';

import React, { useState, useEffect } from 'react';
import { subscriptionAlertService, type SubscriptionAlert } from '@/services/subscriptionAlertService';

interface SubscriptionAlertIndicatorProps {
  onAlertsChange?: (alerts: SubscriptionAlert[]) => void;
  playSound?: boolean;
}

const SubscriptionAlertIndicator: React.FC<SubscriptionAlertIndicatorProps> = ({ 
  onAlertsChange, 
  playSound = true 
}) => {
  const [alerts, setAlerts] = useState<SubscriptionAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const subscriptionAlerts = await subscriptionAlertService.getSubscriptionAlerts();
        setAlerts(subscriptionAlerts);
        onAlertsChange?.(subscriptionAlerts);
        
        // إرسال إشعارات المتصفح للتحذيرات الحرجة (بدون صوت)
        if (playSound && subscriptionAlerts.length > 0 && !hasPlayedSound) {
          const criticalAlerts = subscriptionAlerts.filter(alert => alert.severity === 'critical');
          if (criticalAlerts.length > 0) {
            setHasPlayedSound(true);
            
            // إرسال إشعارات المتصفح للتحذيرات الحرجة
            try {
              const isNotificationEnabled = localStorage.getItem('subscription-alert-notification') === 'true';
              if (isNotificationEnabled) {
                const hasPermission = await subscriptionAlertService.requestNotificationPermission();
                if (hasPermission) {
                  await subscriptionAlertService.sendAllAlertsAsNotifications();
                }
              }
            } catch (error) {
              console.error('Error sending notifications:', error);
            }
          }
        }
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
  }, [onAlertsChange, playSound, hasPlayedSound]);

  if (isLoading) {
    return null;
  }

  if (alerts.length === 0 || isDismissed) {
    return null;
  }

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning');

  return (
    <div className="fixed bottom-[180px] left-4 z-50 flex flex-col items-end gap-2 w-[255px]">
      {/* مؤشر التحذير الرئيسي */}
      <div className="relative w-full ">
        <div className="bg-red-500 text-white px-2 py-1 rounded-md shadow-lg flex items-center space-x-1 animate-pulse  text-xs min-w-[120px] min-h-[32px] mb-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="font-semibold text-xs w-full flex items-center justify-center">
            {alerts.length} تحذير اشتراك
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-1 text-white hover:text-gray-200 transition-colors p-1.5  "
            title="إغلاق التحذير"
            style={{ fontSize: '12px' }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* تفاصيل التحذيرات */}
        <div className="absolute  right-0 mb-2 w-64 bg-white dark:bg-gray-800/80 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-72 overflow-y-auto text-xs">
          <div className="p-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm text-center">
              تحذيرات الاشتراكات
            </h3>
            {criticalAlerts.length > 0 && (
              <div className="mb-2">
                <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5 text-center">
                  تحذيرات ضرورية ({criticalAlerts.length})
                </h4>
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mb-1">
                    <div className="font-medium text-red-900 dark:text-red-100 text-xs text-center">
                      {alert.userName}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300 text-center">
                      {alert.alertType === 'expiry' && (
                        <span>
                          الاشتراك سينتهي خلال {alert.daysUntilExpiry} أيام
                        </span>
                      )}
                      {alert.alertType === 'reminder' && (
                        <span>
                          يجب إرسال تذكير خلال {alert.daysUntilReminder} أيام
                        </span>
                      )}
                      {alert.alertType === 'both' && (
                        <span>
                          انتهاء خلال {alert.daysUntilExpiry} أيام + تذكير خلال {alert.daysUntilReminder} أيام
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {warningAlerts.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                  تحذيرات  ({warningAlerts.length})
                </h4>
                {warningAlerts.map((alert, index) => (
                  <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg mb-1">
                    <div className="font-medium text-yellow-900 dark:text-yellow-100 text-xs">
                      {alert.userName}
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">
                      {alert.alertType === 'expiry' && (
                        <span>
                          الاشتراك سينتهي خلال {alert.daysUntilExpiry} أيام
                        </span>
                      )}
                      {alert.alertType === 'reminder' && (
                        <span>
                          يجب إرسال تذكير خلال {alert.daysUntilReminder} أيام
                        </span>
                      )}
                      {alert.alertType === 'both' && (
                        <span>
                          انتهاء خلال {alert.daysUntilExpiry} أيام + تذكير خلال {alert.daysUntilReminder} أيام
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAlertIndicator;
