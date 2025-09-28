'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PaymentService, type Payment } from '@/services/paymentService';
import { UserService } from '@/services/userService';
import type { User } from '@/types/models';
import { useAuth } from '@/hooks/useAuth';

const AdminPayments = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const paymentSvc = useMemo(() => new PaymentService(), []);
  const userSvc = useMemo(() => new UserService(), []);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState<any>({ userId: '', amount: '', date: '', method: 'cash', notes: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, uRes] = await Promise.all([
        paymentSvc.getAllPayments({ page: 1, limit: 500 }),
        userSvc.getUsers({ page: 1, limit: 1000 })
      ]);
      const pArr = Array.isArray(pRes) ? pRes : (pRes as any)?.data || [];
      const uArr = Array.isArray(uRes) ? uRes as any : (uRes as any)?.data || [];
      setPayments(pArr);
      setUsers(uArr);
    } catch (e: any) {
      setError(e?.message || 'تعذر جلب المدفوعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const userMap = useMemo(() => {
    const m: Record<string, User> = {};
    users.forEach(u => { m[u._id] = u; });
    return m;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter(p => {
      const u = userMap[p.userId];
      const name = (u?.name || '').toLowerCase();
      const phone = (u?.phone || '').toLowerCase();
      const email = (u?.email || '').toLowerCase();
      const bySearch = !q || name.includes(q) || phone.includes(q) || email.includes(q);
      const byMethod = methodFilter === 'all' || p.method === methodFilter;
      return bySearch && byMethod;
    });
  }, [payments, userMap, search, methodFilter]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, methodFilter]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);
  const paginated = useMemo(() => filtered.slice(startIndex, endIndex), [filtered, startIndex, endIndex]);

  const openAdd = () => {
    setEditing(null);
    setForm({ userId: '', amount: '', date: new Date().toISOString().slice(0,10), time: new Date().toTimeString().slice(0,5), method: 'cash', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (p: Payment) => {
    setEditing(p);
    const d = new Date(p.date);
    setForm({ userId: p.userId, amount: String(p.amount), date: d.toISOString().slice(0,10), time: d.toTimeString().slice(0,5), method: p.method, notes: p.notes || '' });
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const dateTime = new Date(form.date + 'T' + (form.time || '00:00'));
      const payload: any = { userId: form.userId, amount: Number(form.amount), date: dateTime, method: form.method, notes: form.notes };
      if (editing) {
        const updated = await paymentSvc.updatePayment(editing._id, payload);
        setPayments(prev => prev.map(x => x._id === editing._id ? updated : x));
      } else {
        const created = await paymentSvc.createPayment(payload);
        setPayments(prev => [created, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e: any) {
      alert(e?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const removePayment = async (id: string) => {
    setDeletingId(id);
    try {
      await paymentSvc.deletePayment(id);
      setPayments(prev => prev.filter(x => x._id !== id));
    } catch (e: any) {
      alert(e?.message || 'فشل الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const openConfirm = (id: string) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmOpen(false);
    setConfirmId(null);
    await removePayment(id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">المدفوعات</h3>
        {canEdit && (
          <div className="flex items-center gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث بالاسم/الهاتف/الإيميل" className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm" />
            <select value={methodFilter} onChange={e=>setMethodFilter(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white  text-sm p-[4px]">
              <option value="all">كل الطرق</option>
              <option value="cash">نقدي</option>
              <option value="card">بطاقة</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="other">أخرى</option>
            </select>
            <button onClick={openAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">إضافة مدفوع</button>
          </div>
        )}
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
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase ">المستخدم</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase ">المبلغ</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase ">التاريخ</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase ">الطريقة</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase ">ملاحظات</th>
                {canEdit && <th className="px-4 py-2"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={canEdit ? 6 : 5} className="text-center py-4 text-gray-400">لا توجد مدفوعات.</td></tr>
              ) : paginated.map(p => {
                const u = userMap[p.userId];
                const d = new Date(p.date);
                return (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 whitespace-nowrap text-center">{u?.name || p.userId} {u?.phone ? `(${u.phone})` : ''}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{p.amount}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{d.toLocaleDateString()} {d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{p.method === 'cash' ? 'نقدي' : p.method === 'card' ? 'بطاقة' : p.method === 'bank_transfer' ? 'تحويل بنكي' : 'أخرى'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{p.notes || '-'}</td>
                    {canEdit && (
                      <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                        <button className="px-2 py-1 rounded bg-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 text-xs" onClick={()=>openEdit(p)}>تعديل</button>
                        <button className="px-2 py-1 rounded bg-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 text-xs disabled:opacity-50" onClick={()=>openConfirm(p._id)} disabled={deletingId===p._id}>{deletingId===p._id?'جارٍ الحذف...':'حذف'}</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                عرض {startIndex + 1} إلى {endIndex} من {filtered.length} نتيجة
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </button>
                <span>
                  صفحة {currentPage} من {pageCount}
                </span>
                <button
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                  disabled={currentPage === pageCount}
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editing ? 'تعديل دفعة' : 'إضافة دفعة'}</h2>
              <button className="text-white  hover:text-red-500  text-xl absolute right-4 top-4  w-8 h-8 flex items-center justify-center" onClick={()=>setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={e=>{e.preventDefault(); save();}} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">المستخدم</label>
                <select className="w-full border rounded p-2 bg-gray-800 text-white" value={form.userId} onChange={e=>setForm((prev:any)=>({...prev, userId:e.target.value}))} required>
                  <option value="">اختر المستخدم</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} {u.phone ? `(${u.phone})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المبلغ</label>
                <input type="number" className="w-full border rounded p-2 bg-gray-800 text-white" value={form.amount} onChange={e=>setForm((prev:any)=>({...prev, amount:e.target.value}))} min={0} step="0.01" required />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">التاريخ</label>
                  <input type="date" className="w-full border rounded p-2 bg-gray-800 text-white" value={form.date} onChange={e=>setForm((prev:any)=>({...prev, date:e.target.value}))} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">الساعة</label>
                  <input type="time" className="w-full border rounded p-2 bg-gray-800 text-white" value={form.time || ''} onChange={e=>setForm((prev:any)=>({...prev, time:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">طريقة الدفع</label>
                <select className="w-full border rounded p-2 bg-gray-800 text-white" value={form.method} onChange={e=>setForm((prev:any)=>({...prev, method:e.target.value}))}>
                  <option value="cash">نقدي</option>
                  <option value="card">بطاقة</option>
                  <option value="bank_transfer">تحويل بنكي</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <textarea className="w-full border rounded p-2 bg-gray-800 text-white" value={form.notes} onChange={e=>setForm((prev:any)=>({...prev, notes:e.target.value}))} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900" onClick={()=>setModalOpen(false)} disabled={saving}>إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setConfirmOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm p-6 z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">!</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">تأكيد الحذف</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={()=>setConfirmOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">إلغاء</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white">تأكيد الحذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;


