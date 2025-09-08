"use client";

import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import { UserService } from '@/services/userService';

const MemberTrainer: React.FC = () => {
  const { user: authUser } = usePermissions();
  const [member, setMember] = useState<UserModel | null>(null);
  const [trainer, setTrainer] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userService = new UserService();

  const memberId = (authUser as any)?._id || (authUser as any)?.id || '';

  useEffect(() => {
    const loadTrainer = async () => {
      if (!memberId) return;
      setLoading(true);
      setError(null);
      try {
        const me = await userService.getUser(memberId);
        setMember(me as any);
        const tId = (me as any)?.trainerId;
        if (!tId) {
          setTrainer(null);
          return;
        }
        const t = await userService.getUser(typeof tId === 'object' ? (tId as any)._id : tId);
        setTrainer(t as any);
      } catch {
        setError('تعذر جلب بيانات المدرب');
      } finally {
        setLoading(false);
      }
    };
    loadTrainer();
  }, [memberId]);

  const openMail = (email?: string) => {
    if (!email) return;
    window.location.href = `mailto:${email}`;
  };
  const goToMessage = (trainerId?: string) => {
    if (!trainerId) return;
    window.location.href = `/member/messages?to=${trainerId}`;
  };
  const goToFeedback = (trainerId?: string) => {
    if (!trainerId) return;
    window.location.href = `/member/feedback?to=${trainerId}`;
  };

  const trainerIdValue = trainer ? (trainer as any)._id : undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">مدربي</h3>
      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !trainer ? (
        <div className="text-gray-500 dark:text-gray-400">لا يوجد مدرب مرتبط بحسابك حالياً.</div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Info */}
          <div className="flex items-start gap-4 md:flex-1">
            {trainer.avatarUrl ? (
              
              <div className="flex flex-col align-center justify-start gap-2 text-sm">
              <img src={trainer.avatarUrl} alt={trainer.name} className="w-16 h-16 rounded-full object-cover border" />
              <div className="mt-3 flex flex-col align-center justify-start gap-2 text-sm">
                            <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">البريد : </span><span className="text-gray-900 dark:text-white break-all">{trainer.email || '-'}</span></div>
                            <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">الهاتف : </span><span className="text-gray-900 dark:text-white">{trainer.phone || '-'}</span></div>
                          </div>
              </div>
   
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                {trainer.name?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1">
              <div className="text-gray-900 dark:text-white font-medium text-base">{trainer.name}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{trainer.role === 'trainer' ? 'مدرب' : trainer.role}</div>
    

            </div>
          </div>
          {/* Right: Actions */}
          <div className="md:w-64 flex md:flex-col gap-2 md:justify-start justify-end">
            <button onClick={() => goToMessage(trainerIdValue)} className="flex-1 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">إرسال رسالة</button>
            <button onClick={() => goToFeedback(trainerIdValue)} className="flex-1 px-3 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm">إرسال فيدباك</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTrainer;


