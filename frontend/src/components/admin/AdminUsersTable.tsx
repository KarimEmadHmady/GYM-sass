'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/userService';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';

const AdminUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'member' });
  const [users, setUsers] = useState<UserModel[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userService = new UserService();
  const { hasPermission, user: currentUser } = usePermissions();
  const PAGE_SIZE = 10;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserModel | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; phone: string; status: string; address: string }>({ name: '', email: '', phone: '', status: 'active', address: '' });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<UserModel | null>(null);
  const [roleForm, setRoleForm] = useState('member');
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // جلب المستخدمين من السيرفر
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, limit: PAGE_SIZE };
        if (filterRole !== 'all') params.role = filterRole;
        if (searchTerm) params.search = searchTerm;
        const res = await userService.getUsers(params);
        if (Array.isArray(res)) {
          setUsers(res as unknown as UserModel[]);
          setTotalUsers((res as UserModel[]).length);
        } else if (Array.isArray(res.data)) {
          setUsers(res.data as unknown as UserModel[]);
          setTotalUsers(res.pagination?.total || res.data.length);
        } else {
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (err) {
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, filterRole, searchTerm, refresh]);

  const getRoleText = (role: string) => {
    const roles = {
      member: 'عضو',
      trainer: 'مدرب',
      admin: 'إدارة',
      manager: 'مدير'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      trainer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      banned: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSubscriptionColor = (subscription: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[subscription as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // users دائماً Array
  const safeUsers = Array.isArray(users) ? users : [];

  // إذا أردت فلترة محلية إضافية (مثلاً بحث محلي بعد جلب السيرفر)
  // const filteredUsers = safeUsers.filter(...)
  // لكن حالياً البحث والتصفية تتم في السيرفر

  const openCreate = () => {
    setFormError(null);
    setNewUser({ name: '', email: '', password: '', role: 'member' });
    setIsCreateOpen(true);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      setFormError('الرجاء ملء جميع الحقول');
      return;
    }
    setIsSubmitting(true);
    try {
      await userService.createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role as any
      });
      setIsCreateOpen(false);
      setRefresh(r => !r); // Refresh to show new user
    } catch (err) {
      setFormError('حدث خطأ أثناء إنشاء المستخدم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // فتح popup تغيير الدور
  const handleChangeRole = (id: string, currentRole: string) => {
    const user = users.find(u => u._id === id);
    if (!user) return;
    setRoleUser(user);
    setRoleForm(user.role);
    setRoleError(null);
    setIsRoleOpen(true);
  };

  // حفظ تغيير الدور
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm) {
      setRoleError('يرجى اختيار الدور');
      return;
    }
    setIsRoleSubmitting(true);
    try {
      await userService.updateRole(roleUser!._id, roleForm as any);
      setIsRoleOpen(false);
      setRefresh(r => !r);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم تغيير الدور بنجاح' } }));
    } catch {
      setRoleError('حدث خطأ أثناء تغيير الدور');
    } finally {
      setIsRoleSubmitting(false);
    }
  };

  // تحديث handleEdit ليشمل كل بيانات المستخدم
  const handleEdit = (id: string) => {
    const user = users.find(u => u._id === id);
    if (!user) return;
    setEditUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status || 'active',
      address: user.address || '',
      // أضف أي حقول أخرى تريدها هنا
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  // تحديث handleEditChange ليشمل كل الحقول
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    if (editError) setEditError(null);
  };

  // تحديث handleEditSubmit ليشمل كل الحقول
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      setEditError('الرجاء ملء جميع الحقول الأساسية');
      return;
    }
    setIsEditSubmitting(true);
    try {
      await userService.updateUser(editUser!._id, { ...editForm });
      setIsEditOpen(false);
      setRefresh(r => !r);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم تعديل المستخدم بنجاح' } }));
    } catch {
      setEditError('حدث خطأ أثناء التعديل');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // تحديث الحذف ليظهر notification عصري (مؤقتاً استخدم window.confirm وwindow.dispatchEvent)
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف المستخدم؟')) return;
    setLoading(true);
    try {
      await userService.deleteUser(id);
      setRefresh(r => !r);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم حذف المستخدم بنجاح' } }));
    } catch {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'حدث خطأ أثناء الحذف' } }));
    } finally {
      setLoading(false);
    }
  };
  const handleHardDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف المستخدم نهائياً؟')) return;
    setLoading(true);
    try {
      await userService.hardDeleteUser(id);
      setRefresh(r => !r);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم حذف المستخدم نهائياً' } }));
    } catch {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'حدث خطأ أثناء الحذف النهائي' } }));
    } finally {
      setLoading(false);
    }
  };

  // فلترة الأزرار حسب الصلاحيات
  const canEdit = hasPermission('users:write');
  const canChangeRole = hasPermission('users:write');
  const canDelete = hasPermission('users:delete');
  const canHardDelete = currentUser?.role === 'admin';

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            إدارة المستخدمين - الإدارة
          </h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={openCreate}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              إضافة مستخدم
            </button>
            <input
              type="text"
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">جميع الأدوار</option>
              <option value="member">عضو</option>
              <option value="trainer">مدرب</option>
              <option value="manager">مدير</option>
              <option value="admin">إدارة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                المستخدم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الدور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الاشتراك
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الرصيد
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                آخر دخول
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8">جاري التحميل...</td></tr>
            ) : safeUsers.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8">لا يوجد مستخدمين</td></tr>
            ) : safeUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'محظور'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionColor(user.subscriptionStatus)}`}>
                    {user.subscriptionStatus === 'active' ? 'نشط' : user.subscriptionStatus === 'expired' ? 'منتهي' : user.subscriptionStatus === 'cancelled' ? 'ملغي' : 'مجمد'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ج.م{user.balance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ar-EG') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {canEdit && (
                      <button onClick={() => handleEdit(user._id)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">تعديل</button>
                    )}
                    {canChangeRole && (
                      <button onClick={() => handleChangeRole(user._id, user.role)} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">تغيير دور</button>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">حذف</button>
                    )}
                    {canHardDelete && (
                      <button onClick={() => handleHardDelete(user._id)} className="text-red-800 hover:text-red-900 font-bold">حذف نهائي</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            عرض {safeUsers.length} من {totalUsers} مستخدم
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              السابق
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * PAGE_SIZE >= totalUsers || loading}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
    {isCreateOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsCreateOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إضافة مستخدم جديد</h4>
          {formError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
              <input
                name="name"
                value={newUser.name}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="ادخل الاسم"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white"
              >
                {isSubmitting ? 'جارٍ الإضافة...' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    {/* Popup تغيير الدور */}
    {isRoleOpen && roleUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsRoleOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تغيير دور المستخدم</h4>
          {roleError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">{roleError}</div>
          )}
          <form onSubmit={handleRoleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الدور</label>
              <select
                name="role"
                value={roleForm}
                onChange={e => setRoleForm(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="member">عضو</option>
                <option value="trainer">مدرب</option>
                <option value="manager">مدير</option>
                <option value="admin">إدارة</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsRoleOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">إلغاء</button>
              <button type="submit" disabled={isRoleSubmitting} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white">{isRoleSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {/* Popup تعديل المستخدم */}
    {isEditOpen && editUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsEditOpen(false)}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 z-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تعديل المستخدم</h4>
          {editError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">{editError}</div>
          )}
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
              <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="ادخل الاسم" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
              <input name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="رقم الهاتف" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
              <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="banned">محظور</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
              <input name="address" value={editForm.address} onChange={handleEditChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="العنوان" />
            </div>
            {/* أضف أي حقول إضافية هنا */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">إلغاء</button>
              <button type="submit" disabled={isEditSubmitting} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white">{isEditSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminUsersTable;
