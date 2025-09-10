'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProgressService } from '@/services/progressService';

const MemberProgressTracking = () => {
  const { user } = useAuth();
  const userId = (user as any)?._id ?? user?.id ?? '';
  const [progressList, setProgressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressService = new ProgressService();

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await progressService.getUserProgress(userId);
        setProgressList(list);
      } catch {
        setError('تعذر جلب سجلات التقدم');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProgress();
  }, [userId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">سجلات تقدمي</h2>
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : progressList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">لا يوجد سجلات تقدم بعد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressList.map((p) => (
            <div key={p._id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 text-base">📅</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-blue-400">⚖️</span> الوزن (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.weight ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-yellow-400">💧</span> نسبة الدهون %:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.bodyFatPercentage ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💪 الكتلة العضلية (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.muscleMass ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">📏 مقاس الوسط (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.waist ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">📏 مقاس الصدر (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.chest ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💪 مقاس الذراع (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.arms ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🦵 مقاس الرجل (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.legs ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🔄 تغير الوزن (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.weightChange ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🔄 تغير الدهون (%):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.fatChange ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🔄 تغير الكتلة العضلية (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.muscleChange ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">📊 الحالة العامة:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.status ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💡 نصيحة المدرب:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.advice ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-green-400">📝</span> ملاحظات:</span>
                <span className="text-gray-700 dark:text-gray-200 text-xs">{p.notes || '-'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberProgressTracking;
