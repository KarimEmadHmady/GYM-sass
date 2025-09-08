'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { User } from '@/types/models';
import { UserService } from '@/services/userService';

type TrainersDirectoryProps = {
  scope: 'admin' | 'manager';
};

const TrainersDirectory: React.FC<TrainersDirectoryProps> = ({ scope }) => {
  const svc = useMemo(() => new UserService(), []);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTrainer, setSelectedTrainer] = useState<User | null>(null);
  const [clients, setClients] = useState<User[]>([]);
  const [allMembers, setAllMembers] = useState<User[]>([]); // أضف هذا السطر
  const [clientsLoading, setClientsLoading] = useState<boolean>(false);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [trainerClientCount, setTrainerClientCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: any = await svc.getUsersByRole('trainer', { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
        const raw = Array.isArray(res) ? res : (res?.data || []);
        const onlyTrainers = (raw || []).filter((u: any) => u?.role === 'trainer');
        setTrainers(onlyTrainers);

        // Fetch members to compute counts per trainer
        try {
          const membersRes: any = await svc.getUsersByRole('member', { page: 1, limit: 1000 });
          const members = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
          setAllMembers(members); // خزّن كل الأعضاء هنا
          const counts: Record<string, number> = {};
          (members || []).forEach((m: any) => {
            const tid = (m?.trainerId && typeof m.trainerId === 'object' ? m.trainerId._id : m.trainerId) as string | undefined;
            if (tid) counts[tid] = (counts[tid] || 0) + 1;
          });
          setTrainerClientCount(counts);
        } catch (e) {
          // ignore counts error
        }
      } catch (e: any) {
        setError(e?.message || 'تعذر جلب المدربين');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [svc]);

  const openClients = (trainer: User) => {
    setSelectedTrainer(trainer);
    setModalOpen(true);
    setClients([]);
    setClientsLoading(true);
    setClientsError(null);
    try {
      // فلتر العملاء من allMembers فقط
      const filtered = allMembers.filter((m: any) => {
        const tid = (m?.trainerId && typeof m.trainerId === 'object' ? m.trainerId._id : m.trainerId);
        return tid === trainer._id;
      });
      setClients(filtered || []);
    } catch (e: any) {
      setClientsError(e?.message || 'تعذر جلب العملاء');
    } finally {
      setClientsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">المدربون</h3>
      </div>

      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">جارٍ التحميل...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : trainers.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300">لا يوجد مدربون حتى الآن.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trainers.map((t) => (
            <div
              key={t._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-2xl border border-gray-100 dark:border-gray-700 group"
              style={{ minHeight: 160 }}
            >
              <div className="flex items-center gap-4 mb-3">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 group-hover:border-indigo-500 shadow-sm transition-all duration-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl border-2 border-blue-500 group-hover:border-indigo-500 shadow-sm">
                    {t.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 dark:text-white font-bold text-lg truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {t.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm truncate">{t.email}</div>
                  <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 truncate">{t.phone || '- لا يوجد رقم هاتف -'}</div>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <span className="inline-block text-blue-500"><svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm2 5V6a2 2 0 1 0-4 0v1h4z'/></svg></span>
                  {trainerClientCount[t._id] ?? 0} عملاء
                </div>
                <button
                  onClick={() => openClients(t)}
                  className="px-3 py-1.5 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors duration-200"
                >
                  عرض العملاء
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 p-6">
            <button className="absolute top-3 left-3 text-gray-400 hover:text-gray-600" onClick={() => setModalOpen(false)}>✕</button>
            <div className="flex items-center gap-3 mb-4">
              {selectedTrainer?.avatarUrl ? (
                <img src={selectedTrainer.avatarUrl} alt={selectedTrainer.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {selectedTrainer?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-gray-900 dark:text-white font-semibold">{selectedTrainer?.name}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">عملاؤه</div>
              </div>
            </div>

            {clientsLoading ? (
              <div className="text-gray-500 dark:text-gray-400">جارٍ التحميل...</div>
            ) : clientsError ? (
              <div className="text-red-600">{clientsError}</div>
            ) : clients.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-300">لا يوجد عملاء مسندون لهذا المدرب.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {clients.map((c) => (
                  <div key={c._id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold">
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-gray-900 dark:text-white font-medium truncate">{c.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs truncate">{c.email}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <div>الهاتف: {c.phone || '-'}</div>
                      <div>المستوى: {c.membershipLevel}</div>
                      <div>النقاط: {c.loyaltyPoints ?? 0}</div>
                      <div>الاشتراك: {c.subscriptionStartDate ? new Date(c.subscriptionStartDate).toLocaleDateString() : '-'} → {c.subscriptionEndDate ? new Date(c.subscriptionEndDate).toLocaleDateString() : '-'}</div>
                      <div>الطول/الوزن: {(c.heightCm ?? '-')} سم / {(c.baselineWeightKg ?? '-')} كجم</div>
                      <div>الأهداف: {['weightLoss','muscleGain','endurance'].filter(k => (c.goals as any)?.[k]).map(k => ({weightLoss:'تنحيف',muscleGain:'عضلات',endurance:'تحمل'} as any)[k]).join('، ') || '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainersDirectory;


