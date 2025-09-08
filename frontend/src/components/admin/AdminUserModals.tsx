import React from 'react';
import type { User as UserModel } from '@/types/models';

interface AdminUserModalsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (v: boolean) => void;
  isSubmitting: boolean;
  formError: string | null;
  newUser: any;
  handleCreateChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCreateSubmit: (e: React.FormEvent) => void;

  isRoleOpen: boolean;
  roleUser: UserModel | null;
  roleForm: string;
  setRoleForm: (v: string) => void;
  roleError: string | null;
  isRoleSubmitting: boolean;
  setIsRoleOpen: (v: boolean) => void;
  handleRoleSubmit: (e: React.FormEvent) => void;

  isEditOpen: boolean;
  editUser: UserModel | null;
  editForm: any;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
  isEditSubmitting: boolean;
  editError: string | null;
  setIsEditOpen: (v: boolean) => void;

  isDeleteOpen: boolean;
  setIsDeleteOpen: (v: boolean) => void;
  deleteType: 'soft' | 'hard';
  confirmDelete: () => void;

  isViewOpen: boolean;
  setIsViewOpen: (v: boolean) => void;
  viewUser: any;
  viewLoading: boolean;
  userViewFields: { key: string; label: string; type?: 'object' }[];
}

const AdminUserModals: React.FC<AdminUserModalsProps> = (props) => {
  // نسخ كل JSX المودالز من الكود الأصلي هنا مع تمرير props
  // ... سيتم نقل كل مودال كما هو مع استخدام props
  // لتوفير الوقت، يمكن نقل الكود مباشرة من الكومبوننت الأصلي
  return <>
    {/* مودال إضافة مستخدم */}
    {props.isCreateOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsCreateOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إضافة مستخدم جديد</h4>
          {props.formError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
              {props.formError}
            </div>
          )}
          <form onSubmit={props.handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
              <input
                name="name"
                value={props.newUser.name}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="ادخل الاسم"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={props.newUser.email}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                name="password"
                value={props.newUser.password}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => props.setIsCreateOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={props.isSubmitting}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white"
              >
                {props.isSubmitting ? 'جارٍ الإضافة...' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    {/* مودال تغيير الدور */}
    {props.isRoleOpen && props.roleUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsRoleOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تغيير دور المستخدم</h4>
          {props.roleError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">{props.roleError}</div>
          )}
          <form onSubmit={props.handleRoleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الدور</label>
              <select
                name="role"
                value={props.roleForm}
                onChange={e => props.setRoleForm(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="member">عضو</option>
                <option value="trainer">مدرب</option>
                <option value="manager">مدير</option>
                <option value="admin">إدارة</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => props.setIsRoleOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">إلغاء</button>
              <button type="submit" disabled={props.isRoleSubmitting} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white">{props.isRoleSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {/* مودال تعديل المستخدم */}
    {props.isEditOpen && props.editUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsEditOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 overflow-y-auto max-h-[90vh]">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تعديل المستخدم</h4>
          {props.editError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">{props.editError}</div>
          )}
          <form onSubmit={props.handleEditSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
              <input name="name" value={props.editForm.name} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" value={props.editForm.email} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* الدور */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الدور</label>
              <select name="role" value={props.editForm.role} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="member">عضو</option>
                <option value="trainer">مدرب</option>
                <option value="manager">مدير</option>
                <option value="admin">إدارة</option>
              </select>
            </div>
            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
              <input name="phone" value={props.editForm.phone} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* تاريخ الميلاد */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ الميلاد</label>
              <input type="date" name="dob" value={props.editForm.dob} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* رابط الصورة */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رابط الصورة</label>
              <input name="avatarUrl" value={props.editForm.avatarUrl} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* العنوان */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
              <input name="address" value={props.editForm.address} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* الرصيد */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الرصيد</label>
              <input type="number" name="balance" value={props.editForm.balance} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* الحالة */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
              <select name="status" value={props.editForm.status} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="banned">محظور</option>
              </select>
            </div>
            {/* بيانات الاشتراك والعضوية */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ بداية الاشتراك</label>
              <input type="date" name="subscriptionStartDate" value={props.editForm.subscriptionStartDate} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ نهاية الاشتراك</label>
              <input type="date" name="subscriptionEndDate" value={props.editForm.subscriptionEndDate} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">أيام تجميد الاشتراك</label>
              <input type="number" name="subscriptionFreezeDays" value={props.editForm.subscriptionFreezeDays} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">أيام التجميد المستخدمة</label>
              <input type="number" name="subscriptionFreezeUsed" value={props.editForm.subscriptionFreezeUsed} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">حالة الاشتراك</label>
              <select name="subscriptionStatus" value={props.editForm.subscriptionStatus} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="active">نشط</option>
                <option value="frozen">مجمد</option>
                <option value="expired">منتهي</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ إرسال تذكير التجديد</label>
              <input type="datetime-local" name="subscriptionRenewalReminderSent" value={props.editForm.subscriptionRenewalReminderSent || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ آخر دفع</label>
              <input type="date" name="lastPaymentDate" value={props.editForm.lastPaymentDate} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ استحقاق الدفع القادم</label>
              <input type="date" name="nextPaymentDueDate" value={props.editForm.nextPaymentDueDate} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* النقاط والعضوية */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">نقاط الولاء</label>
              <input type="number" name="loyaltyPoints" value={props.editForm.loyaltyPoints} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">مستوى العضوية</label>
              <select name="membershipLevel" value={props.editForm.membershipLevel} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="basic">عادي</option>
                <option value="silver">فضي</option>
                <option value="gold">ذهبي</option>
                <option value="platinum">بلاتينيوم</option>
              </select>
            </div>
            {/* بيانات metadata */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">جهة اتصال الطوارئ (metadata.emergencyContact)</label>
              <input name="metadata.emergencyContact" value={props.editForm.metadata?.emergencyContact || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">ملاحظات (metadata.notes)</label>
              <textarea name="metadata.notes" value={props.editForm.metadata?.notes || ''} onChange={e => props.handleEditChange(e as any)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">آخر دخول (metadata.lastLogin)</label>
              <input type="datetime-local" name="metadata.lastLogin" value={props.editForm.metadata?.lastLogin || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* مدرب المستخدم */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">معرف المدرب</label>
              <input name="trainerId" value={props.editForm.trainerId} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* createdAt, updatedAt */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ الإنشاء</label>
              <input name="createdAt" value={props.editForm.createdAt} readOnly className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ التعديل</label>
              <input name="updatedAt" value={props.editForm.updatedAt} readOnly className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => props.setIsEditOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">إلغاء</button>
              <button type="submit" disabled={props.isEditSubmitting} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white">{props.isEditSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {/* مودال تأكيد الحذف */}
    {props.isDeleteOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsDeleteOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            {props.deleteType === 'soft' ? 'تأكيد حذف المستخدم' : 'تأكيد الحذف النهائي للمستخدم'}
          </h4>
          <div className="mb-6 text-center text-gray-700 dark:text-gray-300">
            {props.deleteType === 'soft'
              ? 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟ يمكن استرجاعه لاحقًا.'
              : 'هل أنت متأكد أنك تريد حذف هذا المستخدم نهائيًا؟ لا يمكن استرجاعه بعد ذلك!'}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => props.setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              onClick={props.confirmDelete}
              className={`px-4 py-2 rounded-md text-white ${props.deleteType === 'soft' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-800 hover:bg-red-900 font-bold'}`}
            >
              {props.deleteType === 'soft' ? 'تأكيد الحذف' : 'تأكيد الحذف النهائي'}
            </button>
          </div>
        </div>
      </div>
    )}
    {/* مودال عرض بيانات المستخدم */}
    {props.isViewOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsViewOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 overflow-y-auto max-h-[90vh]">
          {/* رأس المودال: صورة المستخدم وزر X */}
          <div className="relative flex flex-col items-center mb-6 mt-2">
            <button
              onClick={() => props.setIsViewOpen(false)}
              className="absolute top-2 left-2 md:left-auto md:right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none"
              aria-label="إغلاق"
            >
              ×
            </button>
            {props.viewUser?.avatarUrl ? (
              <img
                src={props.viewUser.avatarUrl}
                alt={props.viewUser.name || 'User'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 shadow mb-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-2">
                {props.viewUser?.name ? props.viewUser.name.charAt(0) : '?'}
              </div>
            )}
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">بيانات المستخدم</h4>
          {props.viewLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : props.viewUser && !props.viewUser.error ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {props.userViewFields.map(({ key, label, type }) => {
                const value = props.viewUser[key];
                if (
                  typeof value === 'undefined' ||
                  value === '' ||
                  value === null ||
                  (Array.isArray(value)) ||
                  (typeof value === 'object' && value !== null && Object.keys(value).length === 0) ||
                  key === 'dob' ||
                  key === '__v'
                ) return null;
                if (type === 'object' && typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="flex flex-col border-b pb-2">
                      <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</span>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs">
                        {Object.entries(value).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b last:border-b-0 py-1">
                            <span className="text-gray-600 dark:text-gray-400">{k}</span>
                            <span className="text-gray-900 dark:text-white">{v === true ? '✔️' : v === false ? '❌' : (v === null || v === undefined || typeof v === 'object' ? '-' : String(v))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex flex-col border-b pb-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</span>
                    <span className="text-gray-900 dark:text-white break-all">
                      {value === true ? '✔️' : value === false ? '❌' : value}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-red-600 py-8">{props.viewUser?.error || 'تعذر جلب البيانات'}</div>
          )}
          <div className="flex items-center justify-center gap-3 pt-6">
            <button onClick={() => props.setIsViewOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">إغلاق</button>
          </div>
        </div>
      </div>
    )}
  </>;
};

export default AdminUserModals;
