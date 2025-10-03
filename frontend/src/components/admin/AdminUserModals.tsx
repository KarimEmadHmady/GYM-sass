import React, { useEffect, useMemo, useState } from 'react';
import type { User as UserModel } from '@/types/models';
import { UserService } from '@/services/userService';

// دالة لتنسيق التاريخ والوقت بشكل مقروء
function formatDateTime(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

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
  const userSvc = useMemo(() => new UserService(), []);
  const [trainers, setTrainers] = useState<UserModel[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(false);

  useEffect(() => {
    const loadTrainers = async () => {
      setLoadingTrainers(true);
      try {
        const res = await userSvc.getUsersByRole('trainer', { page: 1, limit: 1000, sortBy: 'name', sortOrder: 'asc' } as any);
        const arr = Array.isArray(res) ? (res as unknown as UserModel[]) : ((res as any)?.data || []);
        setTrainers(arr);
      } catch {
        setTrainers([]);
      } finally {
        setLoadingTrainers(false);
      }
    };
    loadTrainers();
  }, [userSvc]);

  // نسخ كل JSX المودالز من الكود الأصلي هنا مع تمرير props
  // ... سيتم نقل كل مودال كما هو مع استخدام props
  // لتوفير الوقت، يمكن نقل الكود مباشرة من الكومبوننت الأصلي
  return <>
    {/* مودال إضافة مستخدم */}
    {props.isCreateOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsCreateOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10 overflow-y-auto max-h-[90vh]">
          <button
            onClick={() => props.setIsCreateOpen(false)}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
              <input
                name="phone"
                value={props.newUser.phone || ''}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="01234567890"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ الميلاد</label>
              <input
                type="date"
                name="dob"
                value={props.newUser.dob || ''}
                onChange={props.handleCreateChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
              <input
                name="address"
                value={props.newUser.address || ''}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white "
                placeholder="العنوان"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الرصيد</label>
              <input
                type="number"
                name="balance"
                value={props.newUser.balance || 0}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white "
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
              <select
                name="status"
                value={props.newUser.status || 'active'}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white "
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="banned">محظور</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تأكيد البريد الإلكتروني</label>
              <select
                name="isEmailVerified"
                value={props.newUser.isEmailVerified || false}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="false">غير مؤكد</option>
                <option value="true">مؤكد</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">نقاط الولاء</label>
              <input
                type="number"
                name="loyaltyPoints"
                value={props.newUser.loyaltyPoints || 0}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">مستوى العضوية</label>
              <select
                name="membershipLevel"
                value={props.newUser.membershipLevel || 'basic'}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="basic">عادي</option>
                <option value="silver">فضي</option>
                <option value="gold">ذهبي</option>
                <option value="platinum">بلاتينيوم</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الأهداف</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goals.weightLoss"
                    checked={props.newUser.goals?.weightLoss || false}
                    onChange={props.handleCreateChange}
                    className="mr-2"
                  />
                  فقدان الوزن
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goals.muscleGain"
                    checked={props.newUser.goals?.muscleGain || false}
                    onChange={props.handleCreateChange}
                    className="mr-2"
                  />
                  بناء العضلات
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goals.endurance"
                    checked={props.newUser.goals?.endurance || false}
                    onChange={props.handleCreateChange}
                    className="mr-2"
                  />
                  تحسين التحمل
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ بداية الاشتراك</label>
              <input
                type="date"
                name="subscriptionStartDate"
                value={props.newUser.subscriptionStartDate || ''}
                onChange={props.handleCreateChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ نهاية الاشتراك</label>
              <input
                type="date"
                name="subscriptionEndDate"
                value={props.newUser.subscriptionEndDate || ''}
                onChange={props.handleCreateChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ آخر دفع</label>
              <input
                type="date"
                name="lastPaymentDate"
                value={props.newUser.lastPaymentDate || ''}
                onChange={props.handleCreateChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ استحقاق الدفع القادم</label>
              <input
                type="date"
                name="nextPaymentDueDate"
                value={props.newUser.nextPaymentDueDate || ''}
                onChange={props.handleCreateChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">معرف المدرب</label>
              <select
                name="trainerId"
                value={props.newUser.trainerId || ''}
                onChange={props.handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="">بدون مدرب</option>
                {loadingTrainers ? (
                  <option value="" disabled>جارٍ التحميل...</option>
                ) : (
                  trainers.map(t => (
                    <option key={t._id} value={t._id}>{t.name} {t.phone ? `(${t.phone})` : ''}</option>
                  ))
                )}
              </select>
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
        <button
          onClick={() => props.setIsEditOpen(false)}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
              <input type="date" name="dob" value={props.editForm.dob} onClick={(e) => e.currentTarget.showPicker?.()} onChange={props.handleEditChange} className=" cursor-pointer w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
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
              <input type="date" name="subscriptionStartDate" onClick={(e) => e.currentTarget.showPicker?.()} value={props.editForm.subscriptionStartDate} onChange={props.handleEditChange} className="cursor-pointer w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ نهاية الاشتراك</label>
              <input type="date" name="subscriptionEndDate" onClick={(e) => e.currentTarget.showPicker?.()} value={props.editForm.subscriptionEndDate} onChange={props.handleEditChange} className="cursor-pointer w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
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
              <input type="date" name="lastPaymentDate" onClick={(e) => e.currentTarget.showPicker?.()} value={props.editForm.lastPaymentDate} onChange={props.handleEditChange} className="cursor-pointer w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ استحقاق الدفع القادم</label>
              <input type="date" name="nextPaymentDueDate" onClick={(e) => e.currentTarget.showPicker?.()} value={props.editForm.nextPaymentDueDate} onChange={props.handleEditChange} className="cursor-pointer w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
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

            {/* بيانات المستخدم */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الطول (سم)</label>
              <input name="heightCm" value={props.editForm.heightCm || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="الطول بالسنتيمتر" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الوزن الابتدائي (كجم)</label>
              <input name="baselineWeightKg" value={props.editForm.baselineWeightKg || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="الوزن الابتدائي" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الوزن المستهدف (كجم)</label>
              <input name="targetWeightKg" value={props.editForm.targetWeightKg || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="الوزن المستهدف" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">مستوى النشاط</label>
              <select name="activityLevel" value={props.editForm.activityLevel || ''} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="">غير محدد</option>
                <option value="sedentary">قليل الحركة</option>
                <option value="light">نشاط خفيف</option>
                <option value="moderate">نشاط متوسط</option>
                <option value="active">نشاط عالٍ</option>
                <option value="very_active">نشاط شديد</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">ملاحظات صحية</label>
              <textarea name="healthNotes" value={props.editForm.healthNotes || ''} onChange={e => props.handleEditChange(e as any)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="أي ملاحظات صحية" />
            </div>
            {/* حالة الحذف */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">حالة الحذف</label>
              <select name="isDeleted" value={props.editForm.isDeleted} onChange={props.handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="false">غير محذوف</option>
                <option value="true">محذوف</option>
              </select>
            </div>
            {/* الأهداف */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الأهداف</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goals.weightLoss"
                    checked={props.editForm.goals?.weightLoss || false}
                    onChange={props.handleEditChange}
                    className="mr-2"
                  />
                  فقدان الوزن
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goals.muscleGain"
                    checked={props.editForm.goals?.muscleGain || false}
                    onChange={props.handleEditChange}
                    className="mr-2"
                  />
                  بناء العضلات
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goals.endurance"
                    checked={props.editForm.goals?.endurance || false}
                    onChange={props.handleEditChange}
                    className="mr-2"
                  />
                  تحسين التحمل
                </label>
              </div>
            </div>
            {/* ملاحظات فقط */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">ملاحظات</label>
              <textarea name="metadata.notes" value={props.editForm.metadata?.notes || ''} onChange={e => props.handleEditChange(e as any)} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            {/* مدرب المستخدم */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">معرف المدرب</label>
              <select
                name="trainerId"
                value={props.editForm.trainerId || ''}
                onChange={props.handleEditChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="">بدون مدرب</option>
                {loadingTrainers ? (
                  <option value="" disabled>جارٍ التحميل...</option>
                ) : (
                  trainers.map(t => (
                    <option key={t._id} value={t._id}>{t.name} {t.phone ? `(${t.phone})` : ''}</option>
                  ))
                )}
              </select>
            </div>
            {/* createdAt, updatedAt */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ الإنشاء</label>
              <input name="createdAt" value={formatDateTime(props.editForm.createdAt)} readOnly className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">تاريخ التعديل</label>
              <input name="updatedAt" value={formatDateTime(props.editForm.updatedAt)} readOnly className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" />
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
            {props.viewUser?.avatarUrl && props.viewUser.avatarUrl !== '' ? (
              <img
                src={props.viewUser.avatarUrl}
                alt={props.viewUser.name || 'User'}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 shadow mb-2"
              />
            ) : (
              <img
                src="https://img.freepik.com/premium-vector/sports-dumbbell-gymnastics-sketch-isolated_522698-33.jpg"
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 shadow mb-2"
              />
            )}
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">👤 بيانات المستخدم</h4>
          {props.viewLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : props.viewUser && !props.viewUser.error ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* User IDs */}
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🆔 معرّف المستخدم (ID)</span>
                <span className="text-gray-900 dark:text-white break-all">{props.viewUser._id}</span>
              </div>
              {props.viewUser.barcode && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🏷️ الباركود</span>
                  <span className="text-gray-900 dark:text-white break-all">{props.viewUser.barcode}</span>
                </div>
              )}

              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">👤 الاسم</span>
                <span className="text-gray-900 dark:text-white break-all">{props.viewUser.name}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">✉️ البريد الإلكتروني</span>
                <span className="text-gray-900 dark:text-white break-all">{props.viewUser.email}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🏷️ الدور</span>
                <span className="text-gray-900 dark:text-white">{
                  props.viewUser.role === 'admin' ? 'إدارة' :
                  props.viewUser.role === 'manager' ? 'مدير' :
                  props.viewUser.role === 'trainer' ? 'مدرب' :
                  'عضو'
                }</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">📞 رقم الهاتف</span>
                <span className="text-gray-900 dark:text-white">{props.viewUser.phone || '-'}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">💰 الرصيد</span>
                <span className="text-gray-900 dark:text-white">{props.viewUser.balance ?? 0}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🔖 الحالة</span>
                <span className="text-gray-900 dark:text-white">{
                  props.viewUser.status === 'active' ? 'نشط' :
                  props.viewUser.status === 'inactive' ? 'غير نشط' :
                  props.viewUser.status === 'banned' ? 'محظور' : '-'
                }</span>
              </div>
              {/* بيانات إضافية مطلوبة */}
              {props.viewUser.passwordHash && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🔒 Password Hash</span>
                  <span className="text-gray-900 dark:text-white break-all">{props.viewUser.passwordHash}</span>
                </div>
              )}
              {props.viewUser.emailVerificationToken && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">✅ توكن تأكيد البريد</span>
                  <span className="text-gray-900 dark:text-white break-all">{props.viewUser.emailVerificationToken}</span>
                </div>
              )}
              {typeof props.viewUser.failedLoginAttempts === 'number' && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🚫 محاولات الدخول الفاشلة</span>
                  <span className="text-gray-900 dark:text-white">{props.viewUser.failedLoginAttempts}</span>
                </div>
              )}
              {props.viewUser.lockUntil && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🔒 تاريخ القفل</span>
                  <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.lockUntil)}</span>
                </div>
              )}
              {typeof props.viewUser.isDeleted === 'boolean' && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🗑️ محذوف؟</span>
                  <span className="text-gray-900 dark:text-white">{props.viewUser.isDeleted ? '✔️' : '❌'}</span>
                </div>
              )}
              {/* العضوية */}
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🏆 مستوى العضوية</span>
                <span className="text-gray-900 dark:text-white">{
                  props.viewUser.membershipLevel === 'basic' ? 'عادي' :
                  props.viewUser.membershipLevel === 'silver' ? 'فضي' :
                  props.viewUser.membershipLevel === 'gold' ? 'ذهبي' :
                  props.viewUser.membershipLevel === 'platinum' ? 'بلاتينيوم' : '-'
                }</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">⭐ نقاط الولاء</span>
                <span className="text-gray-900 dark:text-white">{props.viewUser.loyaltyPoints ?? 0}</span>
              </div>
              {/* الأهداف */}
              <div className="flex flex-col border-b pb-2 col-span-1 md:col-span-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🎯 الأهداف</span>
                <div className="flex gap-6 flex-wrap">
                  <span className="flex items-center gap-1">
                    {props.viewUser.goals?.weightLoss ? '✔️' : '❌'} فقدان الوزن
                  </span>
                  <span className="flex items-center gap-1">
                    {props.viewUser.goals?.muscleGain ? '✔️' : '❌'} بناء العضلات
                  </span>
                  <span className="flex items-center gap-1">
                    {props.viewUser.goals?.endurance ? '✔️' : '❌'} تحسين التحمل
                  </span>
                </div>
              </div>
              {/* بيانات الاشتراك */}
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">📅 تاريخ بداية الاشتراك</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.subscriptionStartDate)}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">📅 تاريخ نهاية الاشتراك</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.subscriptionEndDate)}</span>
              </div>
              {props.viewUser.subscriptionRenewalReminderSent && (
                <div className="flex flex-col border-b pb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🔔 تذكير التجديد</span>
                  <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.subscriptionRenewalReminderSent)}</span>
                </div>
              )}
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">💳 تاريخ آخر دفع</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.lastPaymentDate)}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">📆 تاريخ استحقاق الدفع القادم</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.nextPaymentDueDate)}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🧑‍🏫 معرّف المدرب (Trainer ID)</span>
                <span className="text-gray-900 dark:text-white break-all">{
                  typeof props.viewUser.trainerId === 'object' && props.viewUser.trainerId !== null ? (props.viewUser.trainerId._id || '-') : (props.viewUser.trainerId || '-')
                }</span>
              </div>
              {/* بيانات المستخدم - تظهر فقط إن وجدت */}
              {(props.viewUser.heightCm !== undefined || props.viewUser.baselineWeightKg !== undefined || props.viewUser.targetWeightKg !== undefined || props.viewUser.activityLevel || props.viewUser.healthNotes || props.viewUser.metadata?.heightCm !== undefined) && (
                <div className="flex flex-col border-b pb-2 col-span-1 md:col-span-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-2">🗂️ بيانات المستخدم</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {(() => {
                      const height = props.viewUser.heightCm ?? props.viewUser.metadata?.heightCm;
                      return (height !== undefined && height !== null && height !== '') ? (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">📏 الطول (سم)</span>
                          <span className="text-gray-900 dark:text-white">{height}</span>
                        </div>
                      ) : null;
                    })()}
                    {(props.viewUser.baselineWeightKg !== undefined && props.viewUser.baselineWeightKg !== null && props.viewUser.baselineWeightKg !== '') && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">⚖️ الوزن الابتدائي (كجم)</span>
                        <span className="text-gray-900 dark:text-white">{props.viewUser.baselineWeightKg}</span>
                      </div>
                    )}
                    {(props.viewUser.targetWeightKg !== undefined && props.viewUser.targetWeightKg !== null && props.viewUser.targetWeightKg !== '') && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">🎯 الوزن المستهدف (كجم)</span>
                        <span className="text-gray-900 dark:text-white">{props.viewUser.targetWeightKg}</span>
                      </div>
                    )}
                    {props.viewUser.activityLevel && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">⚡ مستوى النشاط</span>
                        <span className="text-gray-900 dark:text-white">
                          {props.viewUser.activityLevel === 'sedentary' ? 'قليل الحركة' :
                           props.viewUser.activityLevel === 'light' ? 'نشاط خفيف' :
                           props.viewUser.activityLevel === 'moderate' ? 'نشاط متوسط' :
                           props.viewUser.activityLevel === 'active' ? 'نشاط عالٍ' :
                           props.viewUser.activityLevel === 'very_active' ? 'نشاط شديد' : props.viewUser.activityLevel}
                        </span>
                      </div>
                    )}
                    {props.viewUser.healthNotes && (
                      <div className="md:col-span-2 flex items-start justify-between">
                        <span className="text-gray-600 dark:text-gray-400">📝 ملاحظات صحية</span>
                        <span className="text-gray-900 dark:text-white ml-2">{props.viewUser.healthNotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* metadata */}
              {(props.viewUser.metadata && (props.viewUser.metadata.emergencyContact || props.viewUser.metadata.notes || props.viewUser.metadata.lastLogin || props.viewUser.metadata.ipAddress)) && (
                <div className="flex flex-col border-b pb-2 col-span-1 md:col-span-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 mb-2">📎 بيانات إضافية</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {props.viewUser.metadata.emergencyContact && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">🚑 رقم طوارئ</span>
                        <span className="text-gray-900 dark:text-white">{props.viewUser.metadata.emergencyContact}</span>
                      </div>
                    )}
                    {props.viewUser.metadata.notes && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">📝 ملاحظات</span>
                        <span className="text-gray-900 dark:text-white">{props.viewUser.metadata.notes}</span>
                      </div>
                    )}
                    {props.viewUser.metadata.lastLogin && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">🕓 آخر دخول</span>
                        <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.metadata.lastLogin)}</span>
                      </div>
                    )}
                    {props.viewUser.metadata.ipAddress && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">🌐 IP Address</span>
                        <span className="text-gray-900 dark:text-white">{props.viewUser.metadata.ipAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* createdAt, updatedAt */}
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🗓️ تاريخ الإنشاء</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.createdAt)}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 mb-1">🗓️ تاريخ التعديل</span>
                <span className="text-gray-900 dark:text-white">{formatDateTime(props.viewUser.updatedAt)}</span>
              </div>
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
