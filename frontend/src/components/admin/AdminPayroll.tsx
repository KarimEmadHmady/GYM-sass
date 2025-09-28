'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { payrollService, userService } from '@/services';
import type { Payroll } from '@/services/payrollService';
import type { User } from '@/types/models';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import * as XLSX from 'xlsx';
import CustomAlert from '@/components/ui/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';

type SortOrder = 'asc' | 'desc';

const AdminPayroll: React.FC = () => {
  const { alertState, showSuccess, showError, showWarning, hideAlert } = useCustomAlert();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [rows, setRows] = useState<Payroll[]>([]);
  const [count, setCount] = useState(0);

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const userMap = useMemo(() => {
    const m: Record<string, User> = {};
    users.forEach(u => { m[u._id] = u; });
    return m;
  }, [users]);

  // Filters
  const [employeeId, setEmployeeId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState<SortOrder>('desc');
  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const [roleFilter, setRoleFilter] = useState<string>('');
  

  const queryParams = useMemo(() => ({
    employeeId: employeeId || undefined,
    from: from || undefined,  
    to: to || undefined,
    sort,
    limit,
    skip,
  }), [employeeId, from, to, sort, limit, skip]);

  const filteredUsers = useMemo(() => {
    if (!roleFilter) return users;
    return users.filter(u => (u as any).role === roleFilter);
  }, [users, roleFilter]);

  // قائمة الموظفين للإنشاء/التعديل (المدربين والمديرين فقط)
  const payrollUsers = useMemo(() => {
    return users.filter(u => (u as any).role === 'trainer' || (u as any).role === 'manager');
  }, [users]);

  // Create/Update form
  type PayrollForm = {
    employeeId?: string;
    salaryAmount?: number;
    paymentDate?: string; // yyyy-mm-dd
    bonuses?: number;
    deductions?: number;
    notes?: string;
  };
  const [form, setForm] = useState<PayrollForm>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Summary
  const [summary, setSummary] = useState<{
    range: { from: string | null; to: string | null };
    totals: { payroll: number };
    monthly: Array<{ year: number; month: number; payroll: number }>;
  } | null>(null);

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<Payroll | null>(null);

  // Delete confirm & toast
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const notify = (msg: string) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(null), 2500); };

  const loadUsers = async () => {
    try {
      const res = await userService.getUsers({ limit: 500 });
      const list = Array.isArray(res) ? res : [];
      setUsers(list);
    } catch { /* ignore */ }
  };

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await payrollService.list(queryParams);
      setRows(res.results);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load payroll');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await payrollService.summary({ employeeId: queryParams.employeeId, from: queryParams.from, to: queryParams.to, sort: queryParams.sort });
      console.log('SUMMARY MONTHLY:', s.monthly); // ✅
      setSummary(s);
    } catch (e: any) {
      setError(e?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadList();
    loadSummary(); // تحميل الملخص تلقائياً عند أول تحميل
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // تحميل الملخص تلقائياً عند تغيير الفلاتر
  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, from, to, sort]);

  const resetForm = () => { setForm({}); setSelectedId(null); };

  const onCreate = async () => {
    if (!form.employeeId || !form.salaryAmount) { setError('الموظف وقيمة الراتب مطلوبة'); return; }
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        employeeId: form.employeeId,
        salaryAmount: Number(form.salaryAmount),
        paymentDate: form.paymentDate || undefined,
        bonuses: form.bonuses !== undefined ? Number(form.bonuses) : undefined,
        deductions: form.deductions !== undefined ? Number(form.deductions) : undefined,
        notes: form.notes || undefined,
      };
      await payrollService.create(payload);
      resetForm();
      await loadList();
      await fetchTotalPayrollAll(); // تحديث الإجمالي الكلي
      notify('تم إضافة قيد الرواتب');
    } catch (e: any) {
      setError(e?.message || 'Failed to create payroll');
    } finally { setLoading(false); }
  };

  const onSelect = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await payrollService.getById(id);
      console.log('PAYROLL DOC:', doc); // طباعة البيانات القادمة من السيرفر
      setViewDoc(doc);
      setViewOpen(true);
    } catch (e: any) { setError(e?.message || 'Failed to get payroll'); }
    finally { setLoading(false); }
  };

  const fillForEdit = () => {
    if (!viewDoc) return;
    setSelectedId(viewDoc._id);
    setForm({
      employeeId: viewDoc.employeeId,
      salaryAmount: viewDoc.salaryAmount,
      paymentDate: String(viewDoc.paymentDate).slice(0,10),
      bonuses: viewDoc.bonuses,
      deductions: viewDoc.deductions,
      notes: viewDoc.notes,
    });
    setViewOpen(false);
  };

  const onUpdate = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        employeeId: form.employeeId || undefined,
        salaryAmount: form.salaryAmount !== undefined ? Number(form.salaryAmount) : undefined,
        paymentDate: form.paymentDate || undefined,
        bonuses: form.bonuses !== undefined ? Number(form.bonuses) : undefined,
        deductions: form.deductions !== undefined ? Number(form.deductions) : undefined,
        notes: form.notes || undefined,
      };
      await payrollService.update(selectedId, payload);
      resetForm();
      await loadList();
      await fetchTotalPayrollAll(); // تحديث الإجمالي الكلي
      notify('تم حفظ التعديلات');
    } catch (e: any) { setError(e?.message || 'Failed to update payroll'); }
    finally { setLoading(false); }
  };

  const requestDelete = (id: string) => { setDeleteTargetId(id); setConfirmOpen(true); };
  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setLoading(true);
    setError(null);
    try {
      setRows(prev => prev.filter(x => x._id !== deleteTargetId));
      setCount(c => Math.max(0, c - 1));
      await payrollService.delete(deleteTargetId);
      if (selectedId === deleteTargetId) resetForm();
      await loadList();
      await fetchTotalPayrollAll(); // تحديث الإجمالي الكلي
      notify('تم حذف قيد الرواتب');
    } catch (e: any) { setError(e?.message || 'Failed to delete payroll'); await loadList(); }
    finally { setLoading(false); setConfirmOpen(false); setDeleteTargetId(null); }
  };

  const [totalPayrollAll, setTotalPayrollAll] = useState<number>(0);

  // جلب إجمالي كل الرواتب بدون فلاتر عند تحميل الصفحة فقط
  useEffect(() => {
    payrollService.summary().then(s => setTotalPayrollAll(s.totals.payroll || 0));
  }, []);

  // أضف دالة مساعدة لجلب إجمالي كل الرواتب
  const fetchTotalPayrollAll = async () => {
    const s = await payrollService.summary();
    setTotalPayrollAll(s.totals.payroll || 0);
  };

  // دالة تصدير الرواتب إلى Excel
  const exportPayrollToExcel = () => {
    try {
      const exportData = rows.map(payroll => {
        const user = userMap[payroll.employeeId];
        const netSalary = (payroll.salaryAmount || 0) + (payroll.bonuses || 0) - (payroll.deductions || 0);
        
        return {
          'الموظف': user?.name || payroll.employeeId || 'غير محدد',
          'هاتف الموظف': user?.phone || 'غير محدد',
          'بريد الموظف': user?.email || 'غير محدد',
          'دور الموظف': user ? ((user as any).role === 'trainer' ? 'مدرب' : (user as any).role === 'manager' ? 'مدير' : 'غير محدد') : 'غير محدد',
          'الراتب الأساسي (ج.م)': payroll.salaryAmount || 0,
          'المكافآت (ج.م)': payroll.bonuses || 0,
          'الخصومات (ج.م)': payroll.deductions || 0,
          'صافي الراتب (ج.م)': netSalary,
          'تاريخ الدفع': payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString('ar-EG') : '',
          'الشهر': payroll.paymentDate ? new Date(payroll.paymentDate).getMonth() + 1 : '',
          'السنة': payroll.paymentDate ? new Date(payroll.paymentDate).getFullYear() : '',
          'الملاحظات': payroll.notes || '',
          'تاريخ الإنشاء': payroll.createdAt ? new Date(payroll.createdAt).toLocaleDateString('ar-EG') : '',
          'آخر تعديل': payroll.updatedAt ? new Date(payroll.updatedAt).toLocaleDateString('ar-EG') : '',
        };
      });

      // إنشاء ورقة عمل
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // إنشاء كتاب عمل
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'الرواتب');

      // تحديد عرض الأعمدة
      const columnWidths = [
        { wch: 20 }, // الموظف
        { wch: 15 }, // هاتف الموظف
        { wch: 25 }, // بريد الموظف
        { wch: 12 }, // دور الموظف
        { wch: 15 }, // الراتب الأساسي
        { wch: 15 }, // المكافآت
        { wch: 15 }, // الخصومات
        { wch: 15 }, // صافي الراتب
        { wch: 15 }, // تاريخ الدفع
        { wch: 8 },  // الشهر
        { wch: 8 },  // السنة
        { wch: 30 }, // الملاحظات
        { wch: 15 }, // تاريخ الإنشاء
        { wch: 15 }, // آخر تعديل
      ];
      worksheet['!cols'] = columnWidths;

      // تصدير الملف
      const fileName = `الرواتب_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showSuccess('تم التصدير بنجاح', `تم تصدير ${exportData.length} قيد راتب بنجاح`);
    } catch (error) {
      console.error('خطأ في تصدير الرواتب:', error);
      showError('خطأ في التصدير', 'حدث خطأ أثناء تصدير الرواتب');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">الموظف</label>
            <select className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">الكل</option>
              {payrollUsers.map(u => (
                <option key={u._id} value={u._id}>{u.name}{u.phone ? ` - ${u.phone}` : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 dark:text-gray-300 mb-1">الدور</label>
            <select className="px-1.5 py-0.5 rounded border dark:bg-gray-900 text-xs h-8" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">الكل</option>
              <option value="trainer">مدرب</option>
              <option value="manager">مدير</option>
            </select>
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
          <div className="flex items-end space-x-2">
   
            <button className="w-full px-1.5 py-0.5 rounded bg-blue-600 text-white text-xs h-8" onClick={loadList} disabled={loading}>{loading ? 'جارِ التحميل...' : 'تحديث'}</button>
          </div>
          <div className="flex items-end">
            <button className="w-full px-1.5 py-0.5 rounded border text-xs h-8" onClick={() => { setSkip(0); loadSummary(); }} disabled={loading}>ملخص</button>
          </div>
          <div className="flex items-end">
          <button
              onClick={exportPayrollToExcel}
              disabled={rows.length === 0}
              className="px-1.5 py-0.5 rounded bg-green-600 text-white text-xs h-8 disabled:opacity-50"
            >
              تصدير البيانات
            </button>          
            </div>
        </div>
      </div>

      {/* Create / Update */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{selectedId ? 'تعديل قيد رواتب' : 'إضافة قيد رواتب'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" value={form.employeeId || ''} onChange={(e) => setForm(f => ({ ...f, employeeId: e.target.value }))}>
            <option value="">اختر موظفاً</option>
            {payrollUsers.map(u => (<option key={u._id} value={u._id}>{u.name}{u.phone ? ` - ${u.phone}` : ''}</option>))}
          </select>
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="number" placeholder="قيمة الراتب" value={form.salaryAmount as any || ''} onChange={(e) => setForm(f => ({ ...f, salaryAmount: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="date" value={form.paymentDate || ''} onChange={(e) => setForm(f => ({ ...f, paymentDate: e.target.value }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="number" placeholder="مكافآت (اختياري)" value={typeof form.bonuses === 'number' ? form.bonuses : ''} onChange={(e) => setForm(f => ({ ...f, bonuses: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" type="number" placeholder="خصومات (اختياري)" value={typeof form.deductions === 'number' ? form.deductions : ''} onChange={(e) => setForm(f => ({ ...f, deductions: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600" placeholder="ملاحظات" value={form.notes || ''} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="mt-3 flex gap-2">
          {!selectedId && (<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50" onClick={onCreate} disabled={loading}>إنشاء</button>)}
          {selectedId && (<><button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" onClick={onUpdate} disabled={loading}>حفظ</button><button className="px-4 py-2 border rounded disabled:opacity-50" onClick={resetForm} disabled={loading}>إلغاء</button></>)}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="text-sm text-gray-500">إجمالي الرواتب (حسب الفلاتر)</div>
          <div className="text-2xl font-semibold mb-1">ج.م{new Intl.NumberFormat().format(summary?.totals.payroll || 0)}</div>
          <div className="text-xs text-gray-400">إجمالي كل الرواتب: <span className="font-bold text-green-700">ج.م{new Intl.NumberFormat().format(totalPayrollAll)}</span></div>
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

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">الرواتب ({count})</h3>
          {loading && <span className="text-sm text-gray-500">جارِ التحميل...</span>}
        </div>
        {error && (<div className="alert alert-error mb-3"><span>{error}</span></div>)}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-center">التاريخ</th>
                <th className="px-4 py-2 text-center">الموظف</th>
                <th className="px-4 py-2 text-center">الراتب</th>
                <th className="px-4 py-2 text-center">المكافآت</th>
                <th className="px-4 py-2 text-center">الخصومات</th>
                <th className="px-4 py-2 text-center">ملاحظات</th>
                <th className="px-4 py-2 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className={`border-t border-gray-200 dark:border-gray-700 ${selectedId === r._id ? 'bg-gray-50 dark:bg-gray-900/40' : ''}`}>
                  <td className="px-4 py-2 text-sm text-center">{new Date(r.paymentDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">
                    {r.employeeId && userMap[r.employeeId] ? (
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{userMap[r.employeeId].name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{userMap[r.employeeId].phone || '-'}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">ج.م{new Intl.NumberFormat().format(r.salaryAmount)}</td>
                  <td className="px-4 py-2 text-center">{typeof r.bonuses === 'number' ? r.bonuses : '-'}</td>
                  <td className="px-4 py-2 text-center">{typeof r.deductions === 'number' ? r.deductions : '-'}</td>
                  <td className="px-4 py-2 text-center">{r.notes || '-'}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-60" onClick={() => onSelect(r._id)} disabled={loading}>عرض</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-60" onClick={() => requestDelete(r._id)} disabled={loading}>حذف</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">لا توجد بيانات</td>
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

      {/* Monthly Summary */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">ملخص الرواتب الشهري</h3>
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">النطاق: {summary.range.from || '-'} → {summary.range.to || '-'}</div>
          <div className="font-medium">الإجمالي: ج.م{new Intl.NumberFormat().format(summary.totals.payroll)}</div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-3 py-2">السنة</th>
                  <th className="px-3 py-2">الشهر</th>
                  <th className="px-3 py-2">الرواتب</th>
                </tr>
              </thead>
              <tbody>
                {summary.monthly.map((m, i) => (
                  <tr key={`${m.year}-${m.month}-${i}`} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2">{m.year}</td>
                    <td className="px-3 py-2">{m.month}</td>
                    <td className="px-3 py-2">
                      ج.م{new Intl.NumberFormat().format(Number((m as any).salary) || 0)}
                    </td>
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

      {/* Toast */}
      {successMessage && (<div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg">{successMessage}</div>)}

      {/* Delete dialog */}
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTargetId(null); }}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا القيد؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={loading}
      />

      {/* View Payroll Modal */}
      {viewOpen && viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-xl w-full mx-4 p-6 relative animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">🧾</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">تفاصيل قيد الرواتب</h2>
              </div>
              <button onClick={() => setViewOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">×</button>
            </div>

            {/* Body */}
            <div className="text-sm">
              <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>👤</span>
                    <span>الموظف</span>
                  </div>
                  <div className="font-medium">{userMap[viewDoc.employeeId]?.name || viewDoc.employeeId}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>💰</span>
                    <span>الراتب</span>
                  </div>
                  <div className="font-semibold text-green-700 dark:text-green-400">ج.م{new Intl.NumberFormat().format(viewDoc.salaryAmount)}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>📅</span>
                    <span>التاريخ</span>
                  </div>
                  <div className="font-medium">{new Date(viewDoc.paymentDate).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>🎁</span>
                    <span>المكافآت</span>
                  </div>
                  <div className="font-medium">{viewDoc.bonuses ?? '-'}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>➖</span>
                    <span>الخصومات</span>
                  </div>
                  <div className="font-medium">{viewDoc.deductions ?? '-'}</div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span>📝</span>
                    <span>ملاحظات</span>
                  </div>
                  <div className="font-medium whitespace-pre-wrap">{viewDoc.notes || '-'}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-gray-500">تم الإنشاء</div>
                  <div className="font-medium">{viewDoc.createdAt ? new Date(viewDoc.createdAt as any).toLocaleString() : '-'}</div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/40">
                  <div className="text-gray-500">آخر تحديث</div>
                  <div className="font-medium">{viewDoc.updatedAt ? new Date(viewDoc.updatedAt as any).toLocaleString() : '-'}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 border rounded" onClick={() => setViewOpen(false)}>إغلاق</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fillForEdit}>تعديل هذا القيد</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={hideAlert}
      />
    </div>
  );
};

export default AdminPayroll;


