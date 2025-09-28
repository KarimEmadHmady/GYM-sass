import { useEffect, useRef } from 'react';
import { subscriptionAlertService } from '@/services/subscriptionAlertService';

export const useSoundManager = (activeTab: string, hasAlerts: boolean) => {
  const lastTabRef = useRef<string>('');
  const soundPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    // إعادة تعيين حالة الصوت عند تغيير التبويب
    if (activeTab !== lastTabRef.current) {
      subscriptionAlertService.resetSoundState();
      soundPlayedRef.current = false;
      lastTabRef.current = activeTab;
    }

    // تشغيل الصوت مرة واحدة فقط عند وجود تحذيرات
    if (activeTab === 'users' && hasAlerts && !soundPlayedRef.current) {
      const isSoundEnabled = localStorage.getItem('subscription-alert-sound') !== 'false';
      if (isSoundEnabled && subscriptionAlertService.canPlaySound()) {
        subscriptionAlertService.playAlertSound();
        soundPlayedRef.current = true;
      }
    }
  }, [activeTab, hasAlerts]);

  return {
    resetSound: () => {
      subscriptionAlertService.resetSoundState();
      soundPlayedRef.current = false;
    }
  };
};
