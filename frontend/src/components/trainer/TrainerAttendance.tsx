'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AttendanceService } from '@/services/attendanceService';
import { UserService } from '@/services/userService';
import type { AttendanceRecord, User } from '@/types/models';

const TrainerAttendance = () => {
  const { user, isAuthenticated } = useAuth();
  const attendanceSvc = useMemo(() => new AttendanceService(), []);
  const userSvc = useMemo(() => new UserService(), []);
  const currentUserId = useMemo(() => ((user as any)?._id ?? user?.id ?? ''), [user]);

  const [myRecords, setMyRecords] = useState<AttendanceRecord[]>([]);
  const [clientRecords, setClientRecords] = useState<AttendanceRecord[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<any>({ date: '', time: '', status: 'present', notes: '' });

  const loadMy = async () => {
    if (!currentUserId) return;
    try {
      const res = await attendanceSvc.getUserAttendance(currentUserId, { page: 1, limit: 200 });
      const data = Array.isArray(res) ? res : (res?.data || []);
      setMyRecords((data || []).filter(r => r.userId === currentUserId));
    } catch (e) {}
  };

  const loadClients = async () => {
    try {
      const membersRes: any = await userSvc.getUsersByRole('member', { page: 1, limit: 1000 } as any);
      const arr = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
      const normalizeId = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return (val._id || val.id || '') as string;
        return String(val);
      };
      const me = normalizeId(currentUserId);
      const filtered = (arr || []).filter((m: any) => normalizeId(m?.trainerId) === me);
      setClients(filtered);
    } catch (e) {
      setClients([]);
    }
  };

  const loadClientRecords = async (clientId: string) => {
    if (!clientId) { setClientRecords([]); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceSvc.getUserAttendance(clientId, { page: 1, limit: 200 });
      setClientRecords(Array.isArray(res) ? res : (res?.data || []));
    } catch (e: any) {
      setError(e?.message || 'تعذر جلب سجلات العميل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      loadMy();
      loadClients();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUserId]);

  const openAddModal = () => {
    const now = new Date();
    setAddForm({ date: now.toISOString().slice(0,10), time: now.toTimeString().slice(0,5), status: 'present', notes: '' });
    setAddModalOpen(true);
  };

  const handleAddSave = async () => {
    if (!currentUserId) return;
    setAdding(true);
    try {
      const dateTime = new Date(addForm.date + 'T' + addForm.time);
      const created = await attendanceSvc.createAttendanceRecord({
        userId: currentUserId,
        date: dateTime,
        status: addForm.status,
        notes: addForm.notes,
      });
      setMyRecords(prev => [created, ...prev]);
      setAddModalOpen(false);
    } catch (e: any) {
      alert(e?.message || 'فشل الإضافة');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">سجلات حضوري</h3>
          <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">إضافة سجل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الساعة</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {myRecords.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-gray-400">لا توجد سجلات.</td></tr>
              ) : myRecords.map(rec => {
                const d = new Date(rec.date);
                return (
                  <tr key={rec._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 whitespace-nowrap">{d.toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.status === 'present' ? 'حاضر' : rec.status === 'absent' ? 'غائب' : 'بعذر'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">سجلات حضور العملاء</h3>
        <div className="flex items-center gap-2 mb-4">
          <select
            className="border rounded p-2 bg-gray-800 text-white"
            value={selectedClient}
            onChange={(e) => { setSelectedClient(e.target.value); loadClientRecords(e.target.value); }}
          >
            <option value="">اختر العميل</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>{c.name} ({c.phone || '-'})</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">جارٍ التحميل...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الساعة</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {clientRecords.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-400">لا توجد سجلات.</td></tr>
                ) : clientRecords.map(rec => {
                  const d = new Date(rec.date);
                  const cl = clients.find(c => c._id === rec.userId);
                  return (
                    <tr key={rec._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 whitespace-nowrap">{cl?.name || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{d.toLocaleDateString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{rec.status === 'present' ? 'حاضر' : rec.status === 'absent' ? 'غائب' : 'بعذر'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{rec.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">إضافة سجل حضور</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-white bg-gray-700 hover:bg-gray-900 text-xl absolute left-4 top-4 rounded-full w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleAddSave(); }} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">التاريخ</label>
                  <input type="date" className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white cursor-pointer"
                    value={addForm.date}
                    onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, date: e.target.value }))}
                    required onFocus={e => e.target.showPicker && e.target.showPicker()} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">الساعة</label>
                  <input type="time" className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white cursor-pointer"
                    value={addForm.time}
                    onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, time: e.target.value }))}
                    required onFocus={e => e.target.showPicker && e.target.showPicker()} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الحالة</label>
                <select className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={addForm.status}
                  onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, status: e.target.value }))}
                  required>
                  <option value="present">حاضر</option>
                  <option value="absent">غائب</option>
                  <option value="excused">بعذر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <textarea className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={addForm.notes}
                  onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, notes: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900" onClick={() => setAddModalOpen(false)} disabled={adding}>إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={adding}>{adding ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAttendance;


