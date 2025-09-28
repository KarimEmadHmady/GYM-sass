'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { expenseService } from '@/services';
import type { Expense } from '@/types';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

type SortOrder = 'asc' | 'desc';

const AdminExpenses: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // List state
  const [items, setItems] = useState<Expense[]>([]);
  const [count, setCount] = useState(0);

  // Filters
  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState<SortOrder>('desc');
  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);

  // Create/Update state
  type ExpenseForm = {
    amount?: number;
    date?: string; // ISO date string yyyy-mm-dd
    category: string;
    paidTo?: string;
    notes?: string;
  };

  const [form, setForm] = useState<ExpenseForm>({
    amount: undefined,
    date: undefined,
    category: '',
    paidTo: '',
    notes: '',
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Summary state
  const [summary, setSummary] = useState<{
    range: { from: string | null; to: string | null };
    totals: { expense: number };
    monthly: Array<{ year: number; month: number; expense: number }>;
  } | null>(null);

  // Delete confirmation & notifications
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  // View modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewExpense, setViewExpense] = useState<Expense | null>(null);

  const queryParams = useMemo(() => ({
    category: category || undefined,
    minAmount: minAmount ? Number(minAmount) : undefined,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    from: from || undefined,
    to: to || undefined,
    sort,
    limit,
    skip,
  }), [category, minAmount, maxAmount, from, to, sort, limit, skip]);

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expenseService.list(queryParams);
      setItems(res.results);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await expenseService.summary({
        category: queryParams.category,
        from: queryParams.from,
        to: queryParams.to,
        sort: queryParams.sort,
      });
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

  const resetForm = () => {
    setForm({ amount: undefined, date: undefined, category: '', paidTo: '', notes: '' });
    setSelectedId(null);
  };

  const onCreate = async () => {
    if (!form.amount || !form.category) {
      setError('amount and category are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        amount: Number(form.amount),
        category: form.category,
        paidTo: form.paidTo || undefined,
        notes: form.notes || undefined,
      };
      if (form.date) payload.date = form.date;
      await expenseService.create(payload);
      resetForm();
      await loadList();
      notify('تم إضافة المصروف بنجاح');
    } catch (e: any) {
      setError(e?.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await expenseService.getById(id);
      setViewExpense(doc);
      setViewOpen(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to get expense');
    } finally {
      setLoading(false);
    }
  };

  const fillForEdit = () => {
    if (!viewExpense) return;
    setSelectedId(viewExpense._id);
    setForm({
      amount: viewExpense.amount,
      date: new Date(viewExpense.date).toISOString().slice(0, 10),
      category: viewExpense.category,
      paidTo: viewExpense.paidTo,
      notes: viewExpense.notes,
    });
    setViewOpen(false);
  };

  const onUpdate = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        amount: form.amount !== undefined ? Number(form.amount) : undefined,
        category: form.category || undefined,
        paidTo: form.paidTo || undefined,
        notes: form.notes || undefined,
      };
      if (form.date) payload.date = form.date;
      await expenseService.update(selectedId, payload);
      resetForm();
      await loadList();
      notify('تم حفظ التعديلات');
    } catch (e: any) {
      setError(e?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };
  
  const requestDelete = (id: string) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setLoading(true);
    setError(null);
    try {
      // Optimistic UI: remove locally first
      setItems((prev) => prev.filter((x) => x._id !== deleteTargetId));
      setCount((c) => Math.max(0, c - 1));
      await expenseService.delete(deleteTargetId);
      if (selectedId === deleteTargetId) resetForm();
      // Optionally re-fetch current page to stay consistent
      await loadList();
      notify('تم حذف المصروف');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete expense');
      // If deletion failed, reload to restore accurate state
      await loadList();
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* المرشحات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">التصنيف</label>
            <input
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              placeholder="مثال: rent"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">أدنى مبلغ</label>
            <input
              type="number"
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">أقصى مبلغ</label>
            <input
              type="number"
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              placeholder="10000"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">من تاريخ</label>
            <input
              type="date"
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">إلى تاريخ</label>
            <input
              type="date"
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">الترتيب</label>
            <select
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
            >
              <option value="desc">الأحدث</option>
              <option value="asc">الأقدم</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">الحد</label>
            <input
              type="number"
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              placeholder="20"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value || 0))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">التخطي</label>
            <input
              type="number"
              className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs w-full h-8 min-w-[110px] max-w-[160px]"
              placeholder="0"
              value={skip}
              onChange={(e) => setSkip(Number(e.target.value || 0))}
            />
          </div>
          <div className="flex items-end">
            <button
              className="w-full px-1.5 py-0.5 rounded bg-blue-600 text-white text-xs h-8 min-w-[110px] max-w-[160px]"
              onClick={loadList}
              disabled={loading}
            >
              {loading ? 'جارِ التحميل...' : 'تحديث'}
            </button>
          </div>
          <div className="flex items-end">
            <button
              className="w-full px-1.5 py-0.5 rounded border text-xs h-8 min-w-[110px] max-w-[160px]"
              onClick={() => { setSkip(0); loadSummary(); }}
              disabled={loading}
            >
              ملخص
            </button>
          </div>
        </div>
      </div>

      {/* Create / Update */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{selectedId ? 'تعديل مصروف' : 'إنشاء مصروف'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="number" placeholder="المبلغ"
            value={form.amount as any || ''}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="date"
            value={form.date || ''}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" placeholder="التصنيف"
            value={form.category || ''}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" placeholder="المدفوع له"
            value={form.paidTo || ''}
            onChange={(e) => setForm((f) => ({ ...f, paidTo: e.target.value }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" placeholder="ملاحظات"
            value={form.notes || ''}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="mt-3 flex gap-2">
          {!selectedId && (<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50" onClick={onCreate} disabled={loading}>إنشاء</button>)}
          {selectedId && (
            <>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" onClick={onUpdate} disabled={loading}>حفظ</button>
              <button className="px-4 py-2 border rounded disabled:opacity-50" onClick={resetForm} disabled={loading}>إلغاء</button>
            </>
          )}
        </div>
      </div>

      {/* الملخص */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-500">إجمالي المصروفات</div>
          <div className="text-2xl font-semibold">ج.م{new Intl.NumberFormat().format(summary?.totals.expense || 0)}</div>
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

      {/* القائمة */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">المصروفات ({count})</h3>
          {loading && <span className="text-sm text-gray-500">جارِ التحميل...</span>}
        </div>
        {error && (
          <div className="alert alert-error mb-3">
            <span>{error}</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-center">التاريخ</th>
                <th className="px-4 py-2 text-center">التصنيف</th>
                <th className="px-4 py-2 text-center">المبلغ</th>
                <th className="px-4 py-2 text-center">المدفوع له</th>
                <th className="px-4 py-2 text-center">ملاحظات</th>
                <th className="px-4 py-2 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className={`border-t border-gray-200 dark:border-gray-700 ${selectedId === row._id ? 'bg-gray-50 dark:bg-gray-900/40' : ''}`}>
                  <td className="px-4 py-2 text-sm text-center">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">{row.category}</td>
                  <td className="px-4 py-2 text-center">ج.م{new Intl.NumberFormat().format(row.amount)}</td>
                  <td className="px-4 py-2 text-center">{row.paidTo || '-'}</td>
                  <td className="px-4 py-2 text-center">{row.notes || '-'}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-60" onClick={() => onSelect(row._id)} disabled={loading}>عرض</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-60" onClick={() => requestDelete(row._id)} disabled={loading}>حذف</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {(() => {
          const pageSize = limit || 10;
          const currentPage = Math.floor((skip || 0) / pageSize) + 1;
          const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
          const start = count > 0 ? (skip || 0) + 1 : 0;
          const end = Math.min((skip || 0) + pageSize, count || 0);
          return (
            <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-700 dark:text-gray-300">
              <div>
                عرض {start} إلى {end} من {new Intl.NumberFormat().format(count)} نتيجة • صفحة {currentPage} من {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded border dark:border-gray-700 disabled:opacity-50" disabled={(skip === 0) || loading} onClick={() => { setSkip(Math.max(0, skip - pageSize)); loadList(); }}>السابق</button>
                <button className="px-3 py-1 rounded border dark:border-gray-700 disabled:opacity-50" disabled={((skip + pageSize) >= count) || loading} onClick={() => { setSkip(skip + pageSize); loadList(); }}>التالي</button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">ملخص المصروفات</h3>
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            النطاق: {summary.range.from || '-'} → {summary.range.to || '-'}
          </div>
          <div className="font-medium">الإجمالي: ج.م{new Intl.NumberFormat().format(summary.totals.expense)}</div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-3 py-2">السنة</th>
                  <th className="px-3 py-2">الشهر</th>
                  <th className="px-3 py-2">المصروف</th>
                </tr>
              </thead>
              <tbody>
                {summary.monthly.map((m, i) => (
                  <tr key={`${m.year}-${m.month}-${i}`} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2">{m.year}</td>
                    <td className="px-3 py-2">{m.month}</td>
                    <td className="px-3 py-2">ج.م{new Intl.NumberFormat().format(m.expense)}</td>
                  </tr>
                ))}
                {summary.monthly.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">لا توجد بيانات شهرية</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Success toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {successMessage}
        </div>
      )}

      {/* View Expense Modal */}
      {viewOpen && viewExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-xl w-full mx-4 p-6 relative animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-200">💸</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">تفاصيل المصروف</h2>
              </div>
              <button onClick={() => setViewOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">×</button>
            </div>

            {/* Body */}
            <div className="text-sm">
              <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>📅</span>
                    <span>التاريخ</span>
                  </div>
                  <div className="font-medium">{new Date(viewExpense.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>🏷️</span>
                    <span>التصنيف</span>
                  </div>
                  <div className="font-medium">{viewExpense.category}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>💰</span>
                    <span>المبلغ</span>
                  </div>
                  <div className="font-semibold text-red-600 dark:text-red-400">ج.م{new Intl.NumberFormat().format(viewExpense.amount)}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>👤</span>
                    <span>المدفوع له</span>
                  </div>
                  <div className="font-medium">{viewExpense.paidTo || '-'}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span>📝</span>
                    <span>ملاحظات</span>
                  </div>
                  <div className="font-medium whitespace-pre-wrap">{viewExpense.notes || '-'}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-gray-500">تم الإنشاء</div>
                  <div className="font-medium">{new Date(viewExpense.createdAt as any).toLocaleString()}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-gray-500">آخر تحديث</div>
                  <div className="font-medium">{new Date(viewExpense.updatedAt as any).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 border rounded" onClick={() => setViewOpen(false)}>إغلاق</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fillForEdit}>تعديل هذا المصروف</button>
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
        message="هل أنت متأكد من حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default AdminExpenses;


