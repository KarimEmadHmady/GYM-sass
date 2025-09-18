'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PurchaseService, type PurchaseDTO } from '@/services/purchaseService';
import { UserService } from '@/services/userService';
import type { User } from '@/types/models';
import { useAuth } from '@/hooks/useAuth';

const AdminPurchases = () => {
  const { user } = useAuth();
  const role = user?.role;
  const canDeleteOrEdit = role === 'admin';

  const purchaseSvc = useMemo(() => new PurchaseService(), []);
  const userSvc = useMemo(() => new UserService(), []);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [purchases, setPurchases] = useState<PurchaseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<PurchaseDTO | null>(null);
  const [form, setForm] = useState<{ itemName: string; price: string; date: string }>({ itemName: '', price: '', date: new Date().toISOString().slice(0,10) });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await userSvc.getUsers({ page: 1, limit: 1000 });
        const arr = Array.isArray(res) ? (res as any) : (res as any)?.data || [];
        setUsers(arr);
      } catch (e: any) {
        // ignore silently
      }
    })();
  }, [userSvc]);

  const load = async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = userId ? await purchaseSvc.getByUser(userId) : await purchaseSvc.listAll();
      const arr: any[] = Array.isArray(res) ? res as any : (res as any)?.data || [];
      setPurchases(arr as PurchaseDTO[]);
    } catch (e: any) {
      setError(e?.message || 'تعذر جلب المشتريات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(selectedUserId || undefined); /* eslint-disable-next-line */ }, [selectedUserId]);

  // initial load for all
  useEffect(() => { if (!selectedUserId) load(undefined); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return purchases.filter(p => !q || (p.itemName || '').toLowerCase().includes(q) || String(p.price).includes(q));
  }, [purchases, search]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">المشتريات</h3>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-[4px] text-sm"
            value={selectedUserId}
            onChange={e=>setSelectedUserId(e.target.value)}
          >
            <option value="">اختر المستخدم</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} {u.phone ? `(${u.phone})` : ''}</option>
            ))}
          </select>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="ابحث باسم العنصر/السعر"
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm"
          />
          {selectedUserId && (
            <button onClick={()=>{ setEditing(null); setForm({ itemName: '', price: '', date: new Date().toISOString().slice(0,10) }); setModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">إضافة مشتري</button>
          )}
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
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">العنصر</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">السعر</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                {canDeleteOrEdit && <th className="px-4 py-2"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={canDeleteOrEdit ? 4 : 3} className="text-center py-4 text-gray-400">لا توجد مشتريات.</td></tr>
              ) : filtered.map(p => {
                const d = p.date ? new Date(p.date) : (p.createdAt ? new Date(p.createdAt) : null);
                return (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 whitespace-nowrap text-center">{p.itemName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{p.price}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{d ? `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : '-'}</td>
                    {canDeleteOrEdit && (
                      <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                        <button className="px-2 py-1 rounded bg-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 text-xs" onClick={()=>{ setEditing(p); const d = p.date ? new Date(p.date) : (p.createdAt ? new Date(p.createdAt) : new Date()); setForm({ itemName: p.itemName, price: String(p.price), date: d.toISOString().slice(0,10) }); setModalOpen(true); }}>تعديل</button>
                        <button className="px-2 py-1 rounded bg-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 text-xs disabled:opacity-50" onClick={()=>{ setConfirmId(p._id); setConfirmOpen(true); }} disabled={deletingId===p._id}>{deletingId===p._id?'جارٍ الحذف...':'حذف'}</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">إضافة مشتري</h2>
              <button className="text-white hover:text-red-500 text-xl absolute right-4 top-4 w-8 h-8 flex items-center justify-center" onClick={()=>setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={async e=>{e.preventDefault(); if(!selectedUserId && !editing) return; setSaving(true); try { const payload = { userId: selectedUserId || editing?.userId || '', itemName: form.itemName.trim(), price: Number(form.price), date: form.date ? new Date(form.date).toISOString() : undefined }; if (editing) { const updated = await purchaseSvc.updatePurchase(editing._id, payload as any); setPurchases(prev => prev.map(x => x._id === editing._id ? updated : x)); } else { const created = await purchaseSvc.createPurchase(payload as any); setPurchases(prev => [created, ...prev]); } setModalOpen(false); setEditing(null); } catch (e:any){ alert(e?.message || 'فشل الحفظ'); } finally { setSaving(false); } }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العنصر</label>
                <input className="w-full border rounded p-2 bg-gray-800 text-white" value={form.itemName} onChange={e=>setForm(prev=>({ ...prev, itemName: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السعر</label>
                <input type="number" min={0} step="0.01" className="w-full border rounded p-2 bg-gray-800 text-white" value={form.price} onChange={e=>setForm(prev=>({ ...prev, price: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">التاريخ</label>
                <input type="date" className="w-full border rounded p-2 bg-gray-800 text-white" value={form.date} onChange={e=>setForm(prev=>({ ...prev, date: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900" onClick={()=>setModalOpen(false)} disabled={saving}>إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving || (!selectedUserId && !editing)}>{saving ? 'جارٍ الحفظ...' : (editing ? 'حفظ التعديلات' : 'حفظ')}</button>
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
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">هل أنت متأكد من حذف هذه العملية؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={()=>setConfirmOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">إلغاء</button>
              <button onClick={async ()=>{ if(!confirmId) return; setConfirmOpen(false); setDeletingId(confirmId); try { await purchaseSvc.deletePurchase(confirmId); setPurchases(prev=>prev.filter(x=>x._id!==confirmId)); } catch(e:any){ alert(e?.message || 'فشل الحذف'); } finally { setDeletingId(null); } }} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white">تأكيد الحذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchases;


