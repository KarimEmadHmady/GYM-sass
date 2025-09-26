'use client';

import React, { useEffect, useState } from 'react';
import { SessionSchedule } from '@/types';
import { SessionScheduleService } from '@/services/sessionScheduleService';
import { userService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, User as UserIcon, MapPin, CheckCircle2 } from 'lucide-react';

const sessionScheduleService = new SessionScheduleService();

const TrainerScheduledList = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getCurrentTrainerId = () => {
    if (authUser) {
      return (authUser as any)._id || (authUser as any).id;
    }
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (authToken) {
      try {
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        return tokenData.userId || tokenData._id || tokenData.id;
      } catch {
        // ignore
      }
    }
    return null;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const trainerId = getCurrentTrainerId();
        if (!trainerId) {
          setError('لم يتم العثور على بيانات المدرب');
          setSessions([]);
          return;
        }
        const allSessions = await sessionScheduleService.getSessionsByUser(trainerId);
        const scheduledOnly = (allSessions || []).filter((s) => s.status === 'مجدولة');
        setSessions(scheduledOnly);
      } catch (e: any) {
        setError(e?.message || 'حدث خطأ في تحميل البيانات');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-gray-600 dark:text-gray-400">جاري تحميل الحصص المجدولة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">لا توجد حصص مجدولة حالياً</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          الحصص المجدولة
        </h3>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          {sessions.length} حصة
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session._id} className="relative border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:shadow-sm transition-shadow overflow-hidden">
            {/* Left accent bar */}
            <span className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Main info */}
              <div className="flex items-start gap-4">
                <div className="text-2xl">{session.sessionType === 'شخصية' ? '👤' : session.sessionType === 'جماعية' ? '👥' : session.sessionType === 'أونلاين' ? '💻' : '🥗'}</div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {session.sessionType}
                  </p>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{new Date(session.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                    {session.location && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-pink-600" />
                        <span>{session.location}</span>
                      </div>
                    )}
                    {typeof session.price === 'number' && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                          ج.م {session.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 md:self-start">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  مجدولة
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerScheduledList;
