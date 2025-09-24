'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { revenueService, userService } from '@/services';
import type { Revenue } from '@/services/revenueService';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import type { User } from '@/types/models';

type SortOrder = 'asc' | 'desc';

const AdminRevenue: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // List state
  const [items, setItems] = useState<Revenue[]>([]);
  const [count, setCount] = useState(0);

  // Filters
  const [sourceType, setSourceType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState<SortOrder>('desc');
  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);

  // Create/Update state
  type RevenueForm = {
    amount?: number;
    date?: string; // yyyy-mm-dd
    paymentMethod?: 'cash' | 'card' | 'transfer' | 'bank_transfer' | 'other';
    sourceType?: 'subscription' | 'purchase' | 'invoice' | 'other';
    userId?: string;
    notes?: string;
  };
  const [form, setForm] = useState<RevenueForm>({ amount: undefined, date: undefined, paymentMethod: 'cash', sourceType: 'other', notes: '' });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Summary state
  const [summary, setSummary] = useState<{
    range: { from: string | null; to: string | null };
    totals: { revenue: number };
    monthly: Array<{ year: number; month: number; revenue: number }>;
  } | null>(null);

  // Delete confirmation & notifications
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const notify = (msg: string) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(null), 2500); };

  // Users map for displaying name/phone
  const [users, setUsers] = useState<User[]>([]);
  const userMap = useMemo(() => {
    const map: Record<string, User> = {};
    users.forEach(u => { map[u._id] = u; });
    return map;
  }, [users]);

  // View modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewRevenue, setViewRevenue] = useState<Revenue | null>(null);

  const queryParams = useMemo(() => ({
    sourceType: sourceType || undefined,
    paymentMethod: paymentMethod || undefined,
    minAmount: minAmount ? Number(minAmount) : undefined,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    from: from || undefined,
    to: to || undefined,
    sort,
    limit,
    skip,
  }), [sourceType, paymentMethod, minAmount, maxAmount, from, to, sort, limit, skip]);

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await revenueService.list(queryParams);
      setItems(res.results);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load revenue');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await revenueService.summary({
        sourceType: queryParams.sourceType,
        paymentMethod: queryParams.paymentMethod,
        from: queryParams.from,
        to: queryParams.to,
        sort: queryParams.sort,
      } as any);
      setSummary(s);
    } catch (e: any) {
      setError(e?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await userService.getUsers({ limit: 500 });
        const list = Array.isArray(res) ? res : [];
        setUsers(list);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const resetForm = () => {
    setForm({ amount: undefined, date: undefined, paymentMethod: 'cash', sourceType: 'other', userId: undefined, notes: '' });
    setSelectedId(null);
  };

  const onCreate = async () => {
    if (!form.amount || !form.sourceType) { setError('المبلغ ونوع المصدر مطلوبان'); return; }
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        amount: Number(form.amount),
        sourceType: form.sourceType,
        paymentMethod: form.paymentMethod || 'cash',
        userId: form.userId || undefined,
        notes: form.notes || undefined,
      };
      if (form.date) payload.date = form.date;
      await revenueService.create(payload);
      resetForm();
      await loadList();
      notify('تم إضافة الدخل بنجاح');
    } catch (e: any) {
      setError(e?.message || 'Failed to create revenue');
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await revenueService.getById(id);
      setViewRevenue(doc);
      setViewOpen(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to get revenue');
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        amount: form.amount !== undefined ? Number(form.amount) : undefined,
        sourceType: form.sourceType || undefined,
        paymentMethod: form.paymentMethod || undefined,
        userId: form.userId || undefined,
        notes: form.notes || undefined,
      };
      if (form.date) payload.date = form.date;
      await revenueService.update(selectedId, payload);
      resetForm();
      await loadList();
      notify('تم حفظ التعديلات');
    } catch (e: any) {
      setError(e?.message || 'Failed to update revenue');
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => { setDeleteTargetId(id); setConfirmOpen(true); };
  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setLoading(true);
    setError(null);
    try {
      setItems((prev) => prev.filter((x) => x._id !== deleteTargetId));
      setCount((c) => Math.max(0, c - 1));
      await revenueService.delete(deleteTargetId);
      if (selectedId === deleteTargetId) resetForm();
      await loadList();
      notify('تم حذف سجل الدخل');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete revenue');
      await loadList();
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const fillForEdit = () => {
    if (!viewRevenue) return;
    setSelectedId(viewRevenue._id);
    setForm({
      amount: viewRevenue.amount,
      date: String(viewRevenue.date).slice(0,10),
      paymentMethod: viewRevenue.paymentMethod,
      sourceType: viewRevenue.sourceType,
      userId: viewRevenue.userId,
      notes: viewRevenue.notes,
    });
    setViewOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">نوع المصدر</label>
            <select className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
              <option value="">الكل</option>
              <option value="subscription">اشتراك</option>
              <option value="purchase">شراء</option>
              <option value="invoice">فاتورة</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">طريقة الدفع</label>
            <select className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">الكل</option>
              <option value="cash">نقدي</option>
              <option value="card">بطاقة</option>
              <option value="transfer">تحويل</option>
              <option value="bank_transfer">حوالة بنكية</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">أدنى مبلغ</label>
            <input type="number" className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">أقصى مبلغ</label>
            <input type="number" className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">من تاريخ</label>
            <input type="date" className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">إلى تاريخ</label>
            <input type="date" className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">الترتيب</label>
            <select className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={sort} onChange={(e) => setSort(e.target.value as SortOrder)}>
              <option value="desc">الأحدث</option>
              <option value="asc">الأقدم</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-1.5 py-0.5 rounded bg-blue-600 text-white text-xs h-8" onClick={loadList} disabled={loading}>{loading ? 'جارِ التحميل...' : 'تحديث'}</button>
          </div>
          <div className="flex items-end">
            <button className="w-full px-1.5 py-0.5 rounded border text-xs h-8" onClick={() => { setSkip(0); loadSummary(); }} disabled={loading}>ملخص</button>
          </div>
        </div>
      </div>

      {/* Create / Update */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{selectedId ? 'تعديل دخل' : 'إضافة دخل'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="number" placeholder="المبلغ" value={form.amount as any || ''} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="date" value={form.date || ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          <select className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" value={form.sourceType} onChange={(e) => setForm((f) => ({ ...f, sourceType: e.target.value as any }))}>
            <option value="subscription">اشتراك</option>
            <option value="purchase">شراء</option>
            <option value="invoice">فاتورة</option>
            <option value="other">أخرى</option>
          </select>
          <select className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" value={form.paymentMethod} onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value as any }))}>
            <option value="cash">نقدي</option>
            <option value="card">بطاقة</option>
            <option value="transfer">تحويل</option>
            <option value="bank_transfer">حوالة بنكية</option>
            <option value="other">أخرى</option>
          </select>
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" placeholder="ID العميل (اختياري)" value={form.userId || ''} onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" placeholder="ملاحظات" value={form.notes || ''} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="mt-3 flex gap-2">
          {!selectedId && (<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50" onClick={onCreate} disabled={loading}>إنشاء</button>)}
          {selectedId && (<><button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" onClick={onUpdate} disabled={loading}>حفظ</button><button className="px-4 py-2 border rounded disabled:opacity-50" onClick={resetForm} disabled={loading}>إلغاء</button></>)}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-500">إجمالي الدخل</div>
          <div className="text-2xl font-semibold">ج.م{new Intl.NumberFormat().format(summary?.totals.revenue || 0)}</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-500">النطاق الزمني</div>
          <div className="text-sm">{summary?.range.from || '-'} → {summary?.range.to || '-'}</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-500">عدد السجلات</div>
          <div className="text-2xl font-semibold">{new Intl.NumberFormat().format(count)}</div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">الشارت الشهري للدخل</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">النطاق: {summary.range.from || '-'} → {summary.range.to || '-'}</div>
          </div>
          {summary.monthly.length > 0 ? (
            <div className="w-full overflow-x-auto">
              {(() => {
                const maxVal = Math.max(...summary.monthly.map(m => m.revenue || 0), 0);
                const months = summary.monthly;
                return (
                  <div className="min-w-[560px]">
                    <div className="h-48 flex items-end gap-2 px-2">
                      {months.map((m, idx) => {
                        const pct = maxVal > 0 ? Math.round((m.revenue / maxVal) * 100) : 0;
                        return (
                          <div key={`${m.year}-${m.month}-${idx}`} className="flex-1 flex flex-col items-center">
                            <div className="w-full h-40 bg-blue-100 dark:bg-blue-900/30 rounded-t">
                              <div
                                className="w-full bg-blue-600 dark:bg-blue-500 rounded-t"
                                style={{ height: `${pct}%` }}
                                title={`ج.م${new Intl.NumberFormat().format(m.revenue)}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex gap-2 px-2">
                      {months.map((m, idx) => (
                        <div key={`lbl-${m.year}-${m.month}-${idx}`} className="flex-1 text-center text-xs text-gray-600 dark:text-gray-300">
                          {m.year}/{String(m.month).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2 px-2">
                      {months.map((m, idx) => (
                        <div key={`val-${m.year}-${m.month}-${idx}`} className="flex-1 text-center text-[10px] text-gray-500 dark:text-gray-400">
                          ج.م{new Intl.NumberFormat().format(m.revenue)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد بيانات شهرية</div>
          )}
        </div>
      )}

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">الدخل ({count})</h3>
          {loading && <span className="text-sm text-gray-500">جارِ التحميل...</span>}
        </div>
        {error && (<div className="alert alert-error mb-3"><span>{error}</span></div>)}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-center">التاريخ</th>
                <th className="px-4 py-2 text-center">المبلغ</th>
                <th className="px-4 py-2 text-center">طريقة الدفع</th>
                <th className="px-4 py-2 text-center">نوع المصدر</th>
                <th className="px-4 py-2 text-center">العميل</th>
                <th className="px-4 py-2 text-center">ملاحظات</th>
                <th className="px-4 py-2 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className={`border-t border-gray-200 dark:border-gray-700 ${selectedId === row._id ? 'bg-gray-50 dark:bg-gray-900/40' : ''}`}>
                  <td className="px-4 py-2 text-sm text-center">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">ج.م{new Intl.NumberFormat().format(row.amount)}</td>
                  <td className="px-4 py-2 text-center">{row.paymentMethod}</td>
                  <td className="px-4 py-2 text-center">{row.sourceType}</td>
                  <td className="px-4 py-2 text-center">
                    {row.userId && userMap[row.userId] ? (
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{userMap[row.userId].name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{userMap[row.userId].phone || '-'}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">{row.notes || '-'}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-60" onClick={() => onSelect(row._id)} disabled={loading}>عرض</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-60" onClick={() => requestDelete(row._id)} disabled={loading}>حذف</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">الإجمالي: {new Intl.NumberFormat().format(count)}</div>
          <div className="space-x-2">
            <button className="px-3 py-1 rounded border" disabled={skip === 0 || loading} onClick={() => { setSkip(Math.max(0, skip - limit)); loadList(); }}>السابق</button>
            <button className="px-3 py-1 rounded border" disabled={skip + limit >= count || loading} onClick={() => { setSkip(skip + limit); loadList(); }}>التالي</button>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {successMessage && (<div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg">{successMessage}</div>)}

      {/* View Revenue Modal */}
      {viewOpen && viewRevenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-xl w-full mx-4 p-6 relative animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-200">💰</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">تفاصيل الدخل</h2>
              </div>
              <button onClick={() => setViewOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">×</button>
            </div>
            {/* Body */}
            <div className="text-sm">
              <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500"><span>📅</span><span>التاريخ</span></div>
                  <div className="font-medium">{new Date(viewRevenue.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500"><span>💰</span><span>المبلغ</span></div>
                  <div className="font-semibold text-green-600 dark:text-green-400">ج.م{new Intl.NumberFormat().format(viewRevenue.amount)}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500"><span>💳</span><span>طريقة الدفع</span></div>
                  <div className="font-medium">{viewRevenue.paymentMethod}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500"><span>🏷️</span><span>نوع المصدر</span></div>
                  <div className="font-medium">{viewRevenue.sourceType}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><span>👤</span><span>العميل</span></div>
                  <div className="font-medium">
                    {viewRevenue.userId && userMap[viewRevenue.userId] ? (
                      <div>
                        <div>{userMap[viewRevenue.userId].name}</div>
                        <div className="text-xs text-gray-500">{userMap[viewRevenue.userId].phone || '-'}</div>
                      </div>
                    ) : '-'}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1"><span>📝</span><span>ملاحظات</span></div>
                  <div className="font-medium whitespace-pre-wrap">{viewRevenue.notes || '-'}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-gray-500">تم الإنشاء</div>
                  <div className="font-medium">{new Date(viewRevenue.createdAt as any).toLocaleString()}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-gray-500">آخر تحديث</div>
                  <div className="font-medium">{new Date(viewRevenue.updatedAt as any).toLocaleString()}</div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 border rounded" onClick={() => setViewOpen(false)}>إغلاق</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fillForEdit}>تعديل هذا السجل</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTargetId(null); }}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default AdminRevenue;


