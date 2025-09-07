'use client';

import React, { useState } from 'react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const settingsTabs = [
    { id: 'general', name: 'عام', icon: '⚙️' },
    { id: 'users', name: 'المستخدمين', icon: '👥' },
    { id: 'financial', name: 'الماليات', icon: '💰' },
    { id: 'notifications', name: 'الإشعارات', icon: '🔔' },
    { id: 'security', name: 'الأمان', icon: '🔒' },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: '💾' }
  ];

  const [generalSettings, setGeneralSettings] = useState({
    gymName: 'Coach Gym',
    address: 'شارع الرياض، الرياض، المملكة العربية السعودية',
    phone: '+966 50 123 4567',
    email: 'info@coachgym.com',
    workingHours: '06:00 - 23:00',
    timezone: 'Asia/Riyadh',
    currency: 'EGP',
    language: 'ar'
  });

  const [userSettings, setUserSettings] = useState({
    allowSelfRegistration: true,
    requireEmailVerification: true,
    allowPasswordReset: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireStrongPassword: true
  });

  const [financialSettings, setFinancialSettings] = useState({
    currency: 'EGP',
    taxRate: 15,
    allowPartialPayments: true,
    autoGenerateInvoices: true,
    invoicePrefix: 'INV-',
    paymentMethods: ['cash', 'card', 'bank_transfer']
  });

  const handleSave = (settingsType: string) => {
    console.log(`Saving ${settingsType} settings`);
    // Here you would typically save to backend
  };

  return (
    <div className="space-y-6">
      {/* Settings Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الإعدادات العامة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم الجيم
                  </label>
                  <input
                    type="text"
                    value={generalSettings.gymName}
                    onChange={(e) => setGeneralSettings({...generalSettings, gymName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الهاتف
                  </label>
                  <input
                    type="text"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    value={generalSettings.workingHours}
                    onChange={(e) => setGeneralSettings({...generalSettings, workingHours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان
                  </label>
                  <textarea
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <button
                onClick={() => handleSave('general')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                حفظ الإعدادات
              </button>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إعدادات المستخدمين</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">السماح بالتسجيل الذاتي</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">السماح للمستخدمين بالتسجيل بأنفسهم</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.allowSelfRegistration}
                      onChange={(e) => setUserSettings({...userSettings, allowSelfRegistration: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">طلب تأكيد البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">طلب تأكيد البريد الإلكتروني عند التسجيل</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.requireEmailVerification}
                      onChange={(e) => setUserSettings({...userSettings, requireEmailVerification: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">طلب كلمة مرور قوية</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">طلب كلمة مرور قوية عند التسجيل</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.requireStrongPassword}
                      onChange={(e) => setUserSettings({...userSettings, requireStrongPassword: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <button
                onClick={() => handleSave('users')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                حفظ الإعدادات
              </button>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إعدادات الماليات</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العملة
                  </label>
                  <select
                    value={financialSettings.currency}
                    onChange={(e) => setFinancialSettings({...financialSettings, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="EGP">جنيه مصري (ج.م)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    معدل الضريبة (%)
                  </label>
                  <input
                    type="number"
                    value={financialSettings.taxRate}
                    onChange={(e) => setFinancialSettings({...financialSettings, taxRate: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    بادئة الفواتير
                  </label>
                  <input
                    type="text"
                    value={financialSettings.invoicePrefix}
                    onChange={(e) => setFinancialSettings({...financialSettings, invoicePrefix: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <button
                onClick={() => handleSave('financial')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                حفظ الإعدادات
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إعدادات الإشعارات</h3>
              <p className="text-gray-500 dark:text-gray-400">صفحة إعدادات الإشعارات قيد التطوير...</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إعدادات الأمان</h3>
              <p className="text-gray-500 dark:text-gray-400">صفحة إعدادات الأمان قيد التطوير...</p>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">النسخ الاحتياطي</h3>
              <p className="text-gray-500 dark:text-gray-400">صفحة النسخ الاحتياطي قيد التطوير...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
