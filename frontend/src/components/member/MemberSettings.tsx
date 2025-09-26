"use client";

import React, { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import { UserService } from '@/services/userService';
import { User as UserIcon, Mail, Phone, Calendar, MapPin, Ruler, Weight, FileText, Crown, Star, Edit3, X, Save } from 'lucide-react';

const MemberSettings: React.FC = () => {
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
    heightCm: '',
    baselineWeightKg: '',
    healthNotes: '',
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
          heightCm: (me as any).heightCm?.toString?.() || (me as any).metadata?.heightCm?.toString?.() || '',
          baselineWeightKg: (me as any).baselineWeightKg?.toString?.() || '',
          healthNotes: (me as any).healthNotes || '',
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
        avatarUrl: form.avatarUrl || null,
        address: form.address || null,
        dob: form.dob ? new Date(form.dob) : null,
        heightCm: form.heightCm !== '' ? Number(form.heightCm) : null,
        baselineWeightKg: form.baselineWeightKg !== '' ? Number(form.baselineWeightKg) : null,
        healthNotes: form.healthNotes || null,
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

  const badgeForLevel = (level?: string) => {
    const map: Record<string, string> = {
      basic: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      silver: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
      gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return map[(level || 'basic').toLowerCase()] || map.basic;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" /> إعداداتي
          </h3>
          {!loading && user && (
            <button onClick={() => setIsEditOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
              <Edit3 className="w-4 h-4" /> تعديل
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : user ? (
          <div className="space-y-6">
            {/* Header card */}
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <div className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-500" /> {user.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {user.email}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Phone className="w-4 h-4 text-emerald-600" /> رقم الهاتف</span>
                <span className="text-gray-900 dark:text-white">{user.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Calendar className="w-4 h-4 text-indigo-600" /> تاريخ الميلاد</span>
                <span className="text-gray-900 dark:text-white">{user.dob ? new Date(user.dob).toLocaleDateString('ar-EG') : '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4 text-pink-600" /> العنوان</span>
                <span className="text-gray-900 dark:text-white">{user.address || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Ruler className="w-4 h-4 text-orange-600" /> الطول (سم)</span>
                <span className="text-gray-900 dark:text-white">{(user as any).heightCm ?? (user as any).metadata?.heightCm ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Weight className="w-4 h-4 text-rose-600" /> الوزن الابتدائي (كجم)</span>
                <span className="text-gray-900 dark:text-white">{(user as any).baselineWeightKg ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><FileText className="w-4 h-4 text-purple-600" /> ملاحظات صحية</span>
                <span className="text-gray-900 dark:text-white">{(user as any).healthNotes || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Crown className="w-4 h-4 text-yellow-500" /> مستوى العضوية</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeForLevel(user.membershipLevel)}`}>{user.membershipLevel}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Star className="w-4 h-4 text-amber-500" /> نقاط الولاء</span>
                <span className="text-gray-900 dark:text-white">{user.loyaltyPoints}</span>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={() => setIsEditOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                <Edit3 className="w-4 h-4" /> تعديل
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
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" /> تعديل بياناتي
              </h4>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><UserIcon className="w-4 h-4 text-blue-600" /> الاسم</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600" /> رقم الهاتف</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-600" /> تاريخ الميلاد</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-pink-600" /> العنوان</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><Ruler className="w-4 h-4 text-orange-600" /> الطول (سم)</label>
                  <input name="heightCm" value={form.heightCm} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><Weight className="w-4 h-4 text-rose-600" /> الوزن الابتدائي (كجم)</label>
                  <input name="baselineWeightKg" value={form.baselineWeightKg} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-purple-600" /> ملاحظات صحية</label>
                <textarea name="healthNotes" value={form.healthNotes} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                  <X className="w-4 h-4" /> إلغاء
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white">
                  <Save className="w-4 h-4" /> {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSettings;
