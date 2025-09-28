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
    <div className="fixed top-4 right-4 z-50">
      {/* مؤشر التحذير الرئيسي */}
      <div className="relative">
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          <span className="font-semibold">
            {alerts.length} تحذير اشتراك
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
            title="إغلاق التحذير"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* تفاصيل التحذيرات */}
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800/70 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
              تحذيرات الاشتراكات
            </h3>
            
            {criticalAlerts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                  تحذيرات ضرورية ({criticalAlerts.length})
                </h4>
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-2">
                    <div className="font-medium text-red-900 dark:text-red-100">
                      {alert.userName}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
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
                <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                  تحذيرات  ({warningAlerts.length})
                </h4>
                {warningAlerts.map((alert, index) => (
                  <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-2">
                    <div className="font-medium text-yellow-900 dark:text-yellow-100">
                      {alert.userName}
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
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
