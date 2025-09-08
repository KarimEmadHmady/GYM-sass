'use client';

import React, { useEffect, useState } from 'react';
import { AttendanceService } from '@/services/attendanceService';
import type { AttendanceRecord } from '@/types/models';
import { UserService } from '@/services/userService';
import type { User } from '@/types/models';

const AdminAttendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<any>({ userId: '', date: '', time: '', status: 'present', notes: '' });
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addUserQuery, setAddUserQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [attendanceRes, usersRes] = await Promise.all([
          new AttendanceService().getAttendanceRecords({ page: 1, limit: 100 }),
          new UserService().getUsers({ page: 1, limit: 1000 })
        ]);
        setRecords(Array.isArray(attendanceRes) ? attendanceRes : (attendanceRes?.data || []));
        setUsers(Array.isArray(usersRes) ? usersRes : (usersRes?.data || []));
      } catch (e: any) {
        setError(e?.message || 'تعذر جلب البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // خريطة userId => بيانات العضو
  const userMap = React.useMemo(() => {
    const map: Record<string, User> = {};
    users.forEach(u => { map[u._id] = u; });
    return map;
  }, [users]);

  // حذف سجل حضور
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
    setDeletingId(id);
    try {
      await new AttendanceService().deleteAttendanceRecord(id);
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch (e: any) {
      alert(e?.message || 'فشل الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  // فتح مودال التعديل
  const openEditModal = (rec: AttendanceRecord) => {
    setEditRecord(rec);
    setEditForm({
      userId: rec.userId,
      date: new Date(rec.date).toISOString().slice(0, 10),
      time: new Date(rec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: rec.status,
      notes: rec.notes || '',
    });
    setEditModalOpen(true);
  };

  // حفظ التعديلات
  const handleEditSave = async () => {
    if (!editRecord) return;
    setSaving(true);
    try {
      // دمج التاريخ والوقت
      const dateTime = new Date(editForm.date + 'T' + editForm.time);
      const updated = await new AttendanceService().updateAttendanceRecord(editRecord._id, {
        userId: editForm.userId,
        date: dateTime,
        status: editForm.status,
        notes: editForm.notes,
      });
      setRecords(prev => prev.map(r => r._id === editRecord._id ? { ...r, ...updated } : r));
      setEditModalOpen(false);
      setEditRecord(null);
    } catch (e: any) {
      alert(e?.message || 'فشل التعديل');
    } finally {
      setSaving(false);
    }
  };

  // فتح مودال الإضافة
  const openAddModal = () => {
    setAddForm({ userId: '', date: '', time: '', status: 'present', notes: '' });
    setAddUserQuery('');
    setAddModalOpen(true);
  };

  // حفظ سجل جديد
  const handleAddSave = async () => {
    setAdding(true);
    try {
      const dateTime = new Date(addForm.date + 'T' + addForm.time);
      const created = await new AttendanceService().createAttendanceRecord({
        userId: addForm.userId,
        date: dateTime,
        status: addForm.status,
        notes: addForm.notes,
      });
      setRecords(prev => [created, ...prev]);
      setAddModalOpen(false);
    } catch (e: any) {
      alert(e?.message || 'فشل الإضافة');
    } finally {
      setAdding(false);
    }
  };

  // فلترة السجلات حسب البحث في اسم أو هاتف العضو
  const filteredRecords = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return records;
    return records.filter((rec) => {
      const user = userMap[rec.userId];
      const name = (user?.name || '').toLowerCase();
      const phone = (user?.phone || '').toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [records, userMap, searchQuery]);

  // فلترة قائمة المستخدمين في مودال الإضافة
  const filteredAddUsers = React.useMemo(() => {
    const q = addUserQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.phone || '').toLowerCase().includes(q));
  }, [users, addUserQuery]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">سجلات الحضور</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو رقم الهاتف"
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            onClick={openAddModal}
          >
            إضافة سجل
          </button>
        </div>
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
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase text-start">اسم العضو</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase text-start">رقم الهاتف</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase text-start">التاريخ</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase text-start">الساعة</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase text-start">الحالة</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase text-start">ملاحظات</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">لا توجد سجلات حضور.</td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const user = userMap[rec.userId];
                  const dateObj = new Date(rec.date);
                  return (
                    <tr key={rec._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 whitespace-nowrap">{user?.name || '---'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{user?.phone || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{dateObj.toLocaleDateString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {rec.status === 'present' ? 'حاضر' : rec.status === 'absent' ? 'غائب' : 'بعذر'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{rec.notes || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                        <button
                          className="px-2 py-1 rounded bg-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 text-xs transition-colors"
                          onClick={() => openEditModal(rec)}
                        >
                          تعديل
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 text-xs transition-colors disabled:opacity-50"
                          onClick={() => handleDelete(rec._id)}
                          disabled={deletingId === rec._id}
                        >
                          {deletingId === rec._id ? 'جارٍ الحذف...' : 'حذف'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal التعديل (Pure React) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">تعديل سجل الحضور</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-white bg-gray-700 hover:bg-gray-900 text-xl absolute left-4 top-4 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-150">×</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العضو</label>
                <select
                  className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={editForm.userId}
                  onChange={e => setEditForm((prev: typeof editForm) => ({ ...prev, userId: e.target.value }))}
                  required
                >
                  <option value="">اختر العضو</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.phone || '-'})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">التاريخ</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white cursor-pointer"
                    value={editForm.date}
                    onChange={e => setEditForm((prev: typeof editForm) => ({ ...prev, date: e.target.value }))}
                    required
                    onFocus={e => e.target.showPicker && e.target.showPicker()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">الساعة</label>
                  <input
                    type="time"
                    className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white cursor-pointer"
                    value={editForm.time}
                    onChange={e => setEditForm((prev: typeof editForm) => ({ ...prev, time: e.target.value }))}
                    required
                    onFocus={e => e.target.showPicker && e.target.showPicker()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الحالة</label>
                <select
                  className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={editForm.status}
                  onChange={e => setEditForm((prev: typeof editForm) => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="present">حاضر</option>
                  <option value="absent">غائب</option>
                  <option value="excused">بعذر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <textarea
                  className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={editForm.notes}
                  onChange={e => setEditForm((prev: typeof editForm) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900" onClick={() => setEditModalOpen(false)} disabled={saving}>إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal الإضافة (نفس فورم التعديل لكن addForm/addModalOpen) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">إضافة سجل حضور</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-white bg-gray-700 hover:bg-gray-900 text-xl absolute left-4 top-4 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-150">×</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleAddSave(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العضو</label>
                <input
                  type="text"
                  value={addUserQuery}
                  onChange={(e) => setAddUserQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو رقم الهاتف"
                  className="w-full border rounded p-2 mb-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                />
                <select
                  className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={addForm.userId}
                  onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, userId: e.target.value }))}
                  required
                >
                  <option value="">اختر العضو</option>
                  {filteredAddUsers.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.phone || '-'})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">التاريخ</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white cursor-pointer"
                    value={addForm.date}
                    onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, date: e.target.value }))}
                    required
                    onFocus={e => e.target.showPicker && e.target.showPicker()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">الساعة</label>
                  <input
                    type="time"
                    className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white cursor-pointer"
                    value={addForm.time}
                    onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, time: e.target.value }))}
                    required
                    onFocus={e => e.target.showPicker && e.target.showPicker()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الحالة</label>
                <select
                  className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={addForm.status}
                  onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, status: e.target.value }))}
                  required
                >
                  <option value="present">حاضر</option>
                  <option value="absent">غائب</option>
                  <option value="excused">بعذر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <textarea
                  className="w-full border rounded p-2 bg-gray-800 text-white focus:bg-gray-900 focus:text-white"
                  value={addForm.notes}
                  onChange={e => setAddForm((prev: typeof addForm) => ({ ...prev, notes: e.target.value }))}
                />
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

export default AdminAttendance;


