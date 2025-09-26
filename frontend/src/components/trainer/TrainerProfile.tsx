'use client';

import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import { UserService } from '@/services/userService';
import { User, Mail, Phone, Info, Edit, Save, X } from 'lucide-react';

const TrainerProfile = () => {
  const { user: authUser } = usePermissions();
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
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
          bio: (me as any).healthNotes || '',
        });
      } catch {
        setError('تعذر جلب بيانات الحساب');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        healthNotes: form.bio || null,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === null || payload[k] === undefined || payload[k] === '') delete payload[k];
      });
      const updated = await userService.updateUser(userId, payload);
      setUser(updated);
      setIsEdit(false);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم حفظ التغييرات' } }));
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: (user as any).healthNotes || '',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-500" /> الملف الشخصي
      </h3>
      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* عرض البيانات */}
          {!isEdit ? (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-200">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-200">{user?.phone || <span className="text-gray-400">غير محدد</span>}</span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Info className="w-5 h-5 text-purple-500 mt-1" />
                <span className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{(user as any)?.healthNotes || <span className="text-gray-400">لا يوجد نبذة</span>}</span>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsEdit(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" /> تعديل
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1"><User className="w-4 h-4 text-blue-500" /> الاسم</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400" placeholder="اسم المدرب" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1"><Mail className="w-4 h-4 text-green-500" /> البريد</label>
                <input name="email" value={form.email} readOnly className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1"><Phone className="w-4 h-4 text-yellow-500" /> الهاتف</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 rounded border border-yellow-300 dark:border-yellow-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400" placeholder="+20.." />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1"><Info className="w-4 h-4 text-purple-500" /> النبذة</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full px-3 py-2 rounded border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-400" placeholder="نبذة قصيرة" rows={3} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" /> إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4" /> {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default TrainerProfile;


