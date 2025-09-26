'use client';

import React, { useEffect, useState } from 'react';
import { getFeedbackForUser } from '@/services/feedbackService';
import { userService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import type { Feedback, User } from '@/types/models';
import { Star, X } from 'lucide-react';

const TrainerFeedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;
      setLoading(true);
      try {
        const [feedbackList, membersRes, trainersRes, adminsRes, managersRes] = await Promise.all([
          getFeedbackForUser(user.id),
          userService.getUsersByRole('member', { limit: 1000 }),
          userService.getUsersByRole('trainer', { limit: 1000 }),
          userService.getUsersByRole('admin', { limit: 1000 }),
          userService.getUsersByRole('manager', { limit: 1000 }),
        ]);
        const extract = (res: any) => {
          const tdata = res.data || res;
          return tdata?.items || tdata || [];
        };
        const allUsers: User[] = [
          ...extract(membersRes),
          ...extract(trainersRes),
          ...extract(adminsRes),
          ...extract(managersRes),
        ];
        setFeedbacks(feedbackList);
        setUsers(allUsers);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getUserName = (id?: string) => {
    if (!id) return 'مجهول';
    const u = users.find(u => (u._id === id) || ((u as any).id === id) || (String(u._id) === String(id)));
    return u ? u.name : 'غير معروف';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">التقييمات الخاصة بي</h3>
      {loading ? (
        <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">لا توجد تقييمات بعد.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-3 text-center">المرسل</th>
                <th className="py-2 px-3 text-center">التقييم</th>
                <th className="py-2 px-3 text-center">التعليق</th>
                <th className="py-2 px-3 text-center">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(fb => (
                <tr key={fb._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => { setSelectedFeedback(fb); setShowModal(true); }}>
                  <td className="py-2 px-3 text-center">{getUserName(fb.fromUserId)}</td>
                  <td className="py-2 px-3 text-center">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={18} className={
                        'inline-block mx-0.5 ' + (i <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')
                      } fill={i <= fb.rating ? '#facc15' : 'none'} />
                    ))}
                  </td>
                  <td className="py-2 px-3 text-center">{fb.comment || '-'}</td>
                  <td className="py-2 px-3 text-center">{new Date(fb.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gradient-to-br from-yellow-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-yellow-200 dark:border-gray-700">
            <button onClick={() => setShowModal(false)} className="absolute left-4 top-4 bg-white dark:bg-gray-800 rounded-full shadow p-1 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"><X size={22} className="text-gray-400 hover:text-red-500" /></button>
            <div className="flex items-center gap-2 mb-6">
              <Star size={28} className="text-yellow-400 fill-yellow-400 drop-shadow" />
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">تفاصيل التقييم</h4>
            </div>
            <div className="space-y-5">
              <div>
                <div className="text-xs text-gray-500 mb-1">المرسل</div>
                <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">{getUserName(selectedFeedback.fromUserId)}</div>
              </div>
              <div className="border-t border-dashed border-gray-300 dark:border-gray-700" />
              <div>
                <div className="text-xs text-gray-500 mb-1">التقييم</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={28} className={i <= selectedFeedback.rating ? 'text-yellow-400 fill-yellow-400 drop-shadow' : 'text-gray-300'} fill={i <= selectedFeedback.rating ? '#facc15' : 'none'} />
                  ))}
                  <span className="ml-2 text-base font-bold text-yellow-600 dark:text-yellow-400">{selectedFeedback.rating}/5</span>
                </div>
              </div>
              <div className="border-t border-dashed border-gray-300 dark:border-gray-700" />
              <div>
                <div className="text-xs text-gray-500 mb-1">التعليق</div>
                <div className="mt-1 p-3 bg-yellow-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white whitespace-pre-line break-words max-h-40 overflow-auto border border-yellow-100 dark:border-gray-700 shadow-inner">
                  {selectedFeedback.comment || '-'}
                </div>
              </div>
              <div className="border-t border-dashed border-gray-300 dark:border-gray-700" />
              <div>
                <div className="text-xs text-gray-500 mb-1">التاريخ</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{new Date(selectedFeedback.date).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerFeedback;


