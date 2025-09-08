'use client';

import React, { useEffect, useState } from 'react';
import { GymSettingsService, type GymSettings } from '@/services/gymSettingsService';

const AdminSettings = () => {
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const svc = new GymSettingsService();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const s = await svc.get();
        setSettings(s);
      } catch (e: any) {
        setError(e?.message || 'تعذر جلب إعدادات الجيم');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...(prev || {}), [name]: value }));
  };

  const handleToggle = (path: string) => {
    setSettings(prev => {
      const next: any = { ...(prev || {}) };
      const parts = path.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = obj[parts[i]] || {};
        obj = obj[parts[i]];
      }
      const key = parts[parts.length - 1];
      obj[key] = !obj[key];
      return next;
    });
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const payload: GymSettings = { ...settings };
      const updated = await svc.update(payload);
      setSettings(updated);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم حفظ الإعدادات' } }));
    } catch (e: any) {
      setError(e?.message || 'تعذر حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إعدادات الجيم</h3>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">جاري التحميل...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">اسم الجيم</label>
                <input name="gymName" value={settings?.gymName || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رابط الشعار</label>
                <input name="logoUrl" value={settings?.logoUrl || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                <input name="address" value={settings?.address || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الهاتف</label>
                <input name="phone" value={settings?.phone || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">البريد</label>
                <input name="email" value={settings?.email || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">مواعيد العمل</label>
                <input name="workingHours" value={settings?.workingHours || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">روابط السوشيال</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['facebook','instagram','twitter','tiktok','youtube'].map((k) => (
                  <div key={k}>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{k}</label>
                    <input name={`socialLinks.${k}`} value={(settings as any)?.socialLinks?.[k] || ''} onChange={(e) => {
                      const { name, value } = e.target; const [, key] = name.split('.'); setSettings(prev => ({ ...(prev || {}), socialLinks: { ...((prev as any)?.socialLinks || {}), [key]: value } }));
                    }} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                  </div>
                ))}
              </div>
            </div>



            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">السياسات</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['terms','privacy','refund'].map((k) => (
                  <div key={k}>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{k}</label>
                    <textarea name={`policies.${k}`} value={(settings as any)?.policies?.[k] || ''} onChange={(e) => { const { name, value } = e.target; const [, key] = name.split('.'); setSettings(prev => ({ ...(prev || {}), policies: { ...((prev as any)?.policies || {}), [key]: value } })); }} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" rows={3} />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">{saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
