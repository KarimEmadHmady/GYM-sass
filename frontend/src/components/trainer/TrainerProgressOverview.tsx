'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/models';
import { UserService } from '@/services/userService';
import { ProgressService } from '@/services/progressService';

const TrainerProgressOverview = () => {
  const { user } = useAuth();
  const currentTrainerId = (user as any)?._id ?? user?.id ?? '';
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressModalClient, setProgressModalClient] = useState<User | null>(null);
  const [progressModalLoading, setProgressModalLoading] = useState(false);
  const [progressModalList, setProgressModalList] = useState<any[]>([]);
  const [progressEditId, setProgressEditId] = useState<string | null>(null);
  const [progressEditData, setProgressEditData] = useState<any>(null);
  const [progressDeleteId, setProgressDeleteId] = useState<string | null>(null);
  const [progressAddOpen, setProgressAddOpen] = useState(false);
  const [progressAddData, setProgressAddData] = useState<any>({ date: '', weight: '', bodyFatPercentage: '', notes: '' });
  const userService = new UserService();
  const progressService = new ProgressService();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const membersRes: any = await userService.getUsersByRole('member', { page: 1, limit: 1000 });
        const arr = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
        const normalizeId = (val: any): string => {
          if (!val) return '';
          if (typeof val === 'string') return val;
          if (typeof val === 'object') return (val._id || val.id || '') as string;
          return String(val);
        };
        const me = normalizeId(currentTrainerId);
        const filtered = (arr || []).filter((m: any) => normalizeId(m?.trainerId) === me);
        setClients(filtered);
      } catch (err: any) {
        setError('تعذر جلب العملاء');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [currentTrainerId]);

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="flex justify-center my-4">
  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow border border-blue-200 dark:border-blue-700 p-4 flex flex-col items-center w-full max-w-xs">
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl shadow mb-2">
      👥
    </div>
    <p className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-1">{clients.length}</p>
    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">إجمالي العملاء</p>
  </div>
</div>

      {/* Client Progress Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            تقدم العملاء
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">الاسم</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">البريد الإلكتروني</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">رقم الهاتف</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">سجلات التقدم</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {clients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 text-sm">{client.name}</td>
                  <td className="px-3 py-2 text-sm">{client.email}</td>
                  <td className="px-3 py-2 text-sm">{client.phone || '-'}</td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={async () => {
                        setProgressModalClient(client);
                        setProgressModalLoading(true);
                        setProgressModalList([]);
                        try {
                          const list = await progressService.getUserProgress(client._id);
                          setProgressModalList(list);
                        } catch {
                          setProgressModalList([]);
                        } finally {
                          setProgressModalLoading(false);
                        }
                      }}
                    >سجلات التقدم</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {progressModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setProgressModalClient(null)} />
          <div className="relative z-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">سجلات التقدم - {progressModalClient.name}</div>
              <button onClick={() => setProgressModalClient(null)} className="px-3 py-1.5 text-sm rounded-md bg-gray-200 dark:bg-gray-800 dark:text-white">إغلاق</button>
            </div>
            <div className="mb-4 flex justify-end">
              <button onClick={() => { setProgressAddOpen(true); setProgressAddData({ date: '', weight: '', bodyFatPercentage: '', notes: '' }); }} className="px-3 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white">إضافة سجل جديد</button>
            </div>
            {progressModalLoading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : progressModalList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا يوجد سجلات تقدم</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">التاريخ</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">الوزن</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">نسبة الدهون</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">الكتلة العضلية</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">مقاس الوسط</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">مقاس الصدر</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">مقاس الذراع</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">مقاس الرجل</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">تغير الوزن</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">تغير الدهون</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">تغير الكتلة العضلية</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">الحالة العامة</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">نصيحة المدرب</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">ملاحظات</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {progressModalList.map((p) => (
                    <tr key={p._id}>
                      <td className="px-3 py-2 text-sm">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.weight ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.bodyFatPercentage ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.muscleMass ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.waist ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.chest ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.arms ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.legs ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.weightChange ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.fatChange ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.muscleChange ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.status ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.advice ?? '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.notes || '-'}</td>
                      <td className="px-3 py-2 text-sm flex gap-2">
                        <button onClick={() => { setProgressEditId(p._id); setProgressEditData({ ...p, date: p.date ? new Date(p.date).toISOString().slice(0,10) : '' }); }} className="px-2 py-1 rounded bg-blue-600 text-white text-xs">تعديل</button>
                        <button onClick={() => setProgressDeleteId(p._id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* بوب أب إضافة سجل */}
            {progressAddOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setProgressAddOpen(false)} />
                <div className="relative z-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-[80vh]">
                  <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">إضافة سجل جديد</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">التاريخ</label>
                      <input type="date" value={progressAddData.date} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, date: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">الوزن (كجم)</label>
                      <input type="number" value={progressAddData.weight} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, weight: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">نسبة الدهون %</label>
                      <input type="number" value={progressAddData.bodyFatPercentage} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, bodyFatPercentage: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">الكتلة العضلية (كجم)</label>
                        <input type="number" value={progressAddData.muscleMass || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, muscleMass: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الوسط (سم)</label>
                        <input type="number" value={progressAddData.waist || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, waist: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الصدر (سم)</label>
                        <input type="number" value={progressAddData.chest || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, chest: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الذراع (سم)</label>
                        <input type="number" value={progressAddData.arms || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, arms: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الرجل (سم)</label>
                        <input type="number" value={progressAddData.legs || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, legs: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">تغير الوزن عن السابق (كجم)</label>
                        <input type="number" value={progressAddData.weightChange || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, weightChange: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">تغير الدهون عن السابق (%)</label>
                        <input type="number" value={progressAddData.fatChange || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, fatChange: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">تغير الكتلة العضلية عن السابق (كجم)</label>
                        <input type="number" value={progressAddData.muscleChange || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, muscleChange: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">الحالة العامة</label>
                        <select value={progressAddData.status || 'جيد'} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, status: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white">
                          <option value="ممتاز">ممتاز</option>
                          <option value="جيد">جيد</option>
                          <option value="يحتاج لتحسين">يحتاج لتحسين</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">نصيحة المدرب</label>
                      <input type="text" value={progressAddData.advice || ''} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, advice: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">ملاحظات</label>
                      <input type="text" value={progressAddData.notes} onChange={e => setProgressAddData((d: typeof progressAddData) => ({ ...d, notes: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setProgressAddOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800">إلغاء</button>
                    <button
                      onClick={async () => {
                        if (!progressAddData.date) return;
                        setProgressModalLoading(true);
                        try {
                          const payload = {
                            userId: progressModalClient._id,
                            trainerId: currentTrainerId,
                            date: new Date(progressAddData.date),
                            weight: progressAddData.weight ? Number(progressAddData.weight) : undefined,
                            bodyFatPercentage: progressAddData.bodyFatPercentage ? Number(progressAddData.bodyFatPercentage) : undefined,
                            muscleMass: progressAddData.muscleMass ? Number(progressAddData.muscleMass) : undefined,
                            waist: progressAddData.waist ? Number(progressAddData.waist) : undefined,
                            chest: progressAddData.chest ? Number(progressAddData.chest) : undefined,
                            arms: progressAddData.arms ? Number(progressAddData.arms) : undefined,
                            legs: progressAddData.legs ? Number(progressAddData.legs) : undefined,
                            weightChange: progressAddData.weightChange ? Number(progressAddData.weightChange) : undefined,
                            fatChange: progressAddData.fatChange ? Number(progressAddData.fatChange) : undefined,
                            muscleChange: progressAddData.muscleChange ? Number(progressAddData.muscleChange) : undefined,
                            status: progressAddData.status || 'جيد',
                            advice: progressAddData.advice || '',
                            notes: progressAddData.notes || '',
                          };
                          await progressService.create(payload);
                          // إعادة تحميل السجلات
                          const list = await progressService.getUserProgress(progressModalClient._id);
                          setProgressModalList(list);
                          setProgressAddOpen(false);
                        } finally {
                          setProgressModalLoading(false);
                        }
                      }}
                      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                      disabled={!progressAddData.date || progressModalLoading}
                    >حفظ</button>
                  </div>
                </div>
              </div>
            )}
            {/* بوب أب تعديل سجل */}
            {progressEditId && progressEditData && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setProgressEditId(null)} />
                <div className="relative z-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-[80vh]">
                  <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">تعديل سجل التقدم</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">التاريخ</label>
                      <input type="date" value={progressEditData.date} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, date: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">الوزن (كجم)</label>
                      <input type="number" value={progressEditData.weight} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, weight: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">نسبة الدهون %</label>
                      <input type="number" value={progressEditData.bodyFatPercentage} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, bodyFatPercentage: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">الكتلة العضلية (كجم)</label>
                        <input type="number" value={progressEditData.muscleMass || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, muscleMass: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الوسط (سم)</label>
                        <input type="number" value={progressEditData.waist || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, waist: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الصدر (سم)</label>
                        <input type="number" value={progressEditData.chest || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, chest: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الذراع (سم)</label>
                        <input type="number" value={progressEditData.arms || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, arms: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">مقاس الرجل (سم)</label>
                        <input type="number" value={progressEditData.legs || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, legs: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">تغير الوزن عن السابق (كجم)</label>
                        <input type="number" value={progressEditData.weightChange || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, weightChange: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">تغير الدهون عن السابق (%)</label>
                        <input type="number" value={progressEditData.fatChange || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, fatChange: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">تغير الكتلة العضلية عن السابق (كجم)</label>
                        <input type="number" value={progressEditData.muscleChange || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, muscleChange: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">الحالة العامة</label>
                        <select value={progressEditData.status || 'جيد'} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, status: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white">
                          <option value="ممتاز">ممتاز</option>
                          <option value="جيد">جيد</option>
                          <option value="يحتاج لتحسين">يحتاج لتحسين</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">نصيحة المدرب</label>
                      <input type="text" value={progressEditData.advice || ''} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, advice: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">ملاحظات</label>
                      <input type="text" value={progressEditData.notes} onChange={e => setProgressEditData((d: typeof progressEditData) => ({ ...d, notes: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setProgressEditId(null)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800">إلغاء</button>
                    <button
                      onClick={async () => {
                        setProgressModalLoading(true);
                        try {
                          await progressService.update(progressEditId, {
                            date: progressEditData.date ? new Date(progressEditData.date) : undefined,
                            weight: progressEditData.weight ? Number(progressEditData.weight) : undefined,
                            bodyFatPercentage: progressEditData.bodyFatPercentage ? Number(progressEditData.bodyFatPercentage) : undefined,
                            muscleMass: progressEditData.muscleMass ? Number(progressEditData.muscleMass) : undefined,
                            waist: progressEditData.waist ? Number(progressEditData.waist) : undefined,
                            chest: progressEditData.chest ? Number(progressEditData.chest) : undefined,
                            arms: progressEditData.arms ? Number(progressEditData.arms) : undefined,
                            legs: progressEditData.legs ? Number(progressEditData.legs) : undefined,
                            weightChange: progressEditData.weightChange ? Number(progressEditData.weightChange) : undefined,
                            fatChange: progressEditData.fatChange ? Number(progressEditData.fatChange) : undefined,
                            muscleChange: progressEditData.muscleChange ? Number(progressEditData.muscleChange) : undefined,
                            status: progressEditData.status || 'جيد',
                            advice: progressEditData.advice || '',
                            notes: progressEditData.notes || '',
                          });
                          // إعادة تحميل السجلات
                          const list = await progressService.getUserProgress(progressModalClient._id);
                          setProgressModalList(list);
                          setProgressEditId(null);
                        } finally {
                          setProgressModalLoading(false);
                        }
                      }}
                      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                      disabled={progressModalLoading}
                    >تأكيد</button>
                  </div>
                </div>
              </div>
            )}
            {/* بوب أب حذف سجل */}
            {progressDeleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setProgressDeleteId(null)} />
                <div className="relative z-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
                  <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">تأكيد حذف السجل</div>
                  <div className="mb-6 text-gray-700 dark:text-gray-300">هل أنت متأكد أنك تريد حذف هذا السجل؟ لا يمكن التراجع.</div>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => setProgressDeleteId(null)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800">إلغاء</button>
                    <button onClick={async () => {
                      setProgressModalLoading(true);
                      try {
                        await progressService.delete(progressDeleteId);
                        // إعادة تحميل السجلات
                        const list = await progressService.getUserProgress(progressModalClient._id);
                        setProgressModalList(list);
                        setProgressDeleteId(null);
                      } finally {
                        setProgressModalLoading(false);
                      }
                    }} className="px-4 py-2 rounded bg-red-600 text-white">تأكيد الحذف</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProgressOverview;
