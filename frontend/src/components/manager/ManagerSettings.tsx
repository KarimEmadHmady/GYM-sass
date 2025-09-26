"use client";

import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import { UserService } from '@/services/userService';

const ManagerSettings: React.FC = () => {
  const { user: authUser } = usePermissions();
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    avatarUrl: '',
    address: '',
  });
  const userService = new UserService();
  const userId = (authUser as any)?._id || (authUser as any)?.id || '';

  useEffect(() => {
    const fetchMe = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const me = await userService.getUser(userId);
        setUser(me);
        setForm({
          name: me.name || '',
          email: me.email || '',
          phone: me.phone || '',
          dob: me.dob ? new Date(me.dob).toISOString().substring(0, 10) : '',
          avatarUrl: me.avatarUrl || '',
          address: me.address || '',
        });
      } catch {
        setError('تعذر جلب بيانات الحساب');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: form.name,
        phone: form.phone || null,
        avatarUrl: form.avatarUrl || null,
        address: form.address || null,
        dob: form.dob ? new Date(form.dob) : null,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === null || payload[k] === undefined || payload[k] === '') delete payload[k];
      });
      const updated = await userService.updateUser(userId, payload);
      setUser(updated);
      setIsEditOpen(false);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم تحديث بياناتك بنجاح' } }));
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M11.983 1.943a1 1 0 0 1 1.034 0l2.143 1.236a1 1 0 0 0 .9 0l2.143-1.236a1 1 0 0 1 1.5.866v2.472a1 1 0 0 0 .5.866l2.143 1.236a1 1 0 0 1 0 1.732l-2.143 1.236a1 1 0 0 0-.5.866v2.472a1 1 0 0 1-1.5.866l-2.143-1.236a1 1 0 0 0-.9 0l-2.143 1.236a1 1 0 0 1-1.5-.866V11.12a1 1 0 0 0-.5-.866L9.34 9.018a1 1 0 0 1 0-1.732l2.143-1.236a1 1 0 0 0 .5-.866V2.809a1 1 0 0 1 0-.866Z" clipRule="evenodd" />
            </svg>
          </span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إعدادات المدير</h3>
        </div>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-gray-900 dark:text-white font-medium truncate">{user.name}</div>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M1.5 8.67v6.63c0 .62.5 1.12 1.12 1.12h18.76c.62 0 1.12-.5 1.12-1.12V8.67L12 14.25 1.5 8.67z"/>
                    <path d="M21.38 6.5H2.62c-.33 0-.63.14-.84.36L12 12.75l10.22-5.89c-.21-.22-.51-.36-.84-.36z"/>
                  </svg>
                  <span className="truncate max-w-[180px]">{user.email}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">📞</span>
                  <span>رقم الهاتف</span>
                </div>
                <span className="text-gray-900 dark:text-white">{user.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">🎂</span>
                  <span>تاريخ الميلاد</span>
                </div>
                <span className="text-gray-900 dark:text-white">{user.dob ? new Date(user.dob).toLocaleDateString('ar-EG') : '-'}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">📍</span>
                  <span>العنوان</span>
                </div>
                <span className="text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-[240px] lg:max-w-[180px] text-right">{user.address || '-'}</span>
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => setIsEditOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M5 19h14v2H5z"/>
                  <path d="M17.7 3.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L10 16.7 7 17l.3-3 10.4-10.4z"/>
                </svg>
                تعديل
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">لا توجد بيانات</div>
        )}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تعديل بياناتي</h4>
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ الميلاد</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رابط الصورة</label>
                <input name="avatarUrl" value={form.avatarUrl} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white">{isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSettings;
