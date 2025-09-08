'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/userService';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import AdminUsersTableHeader from './AdminUsersTableHeader';
import AdminUsersTableList from './AdminUsersTableList';
import AdminUsersTablePagination from './AdminUsersTablePagination';
import AdminUserModals from './AdminUserModals';

const AdminUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userService = new UserService();
  const { hasPermission, user: currentUser } = usePermissions();
  const PAGE_SIZE = 10;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserModel | null>(null);
  const [editForm, setEditForm] = useState({
    _id: '', name: '', email: '', role: 'member', phone: '', dob: '', avatarUrl: '', address: '', balance: 0, status: 'active', isEmailVerified: false, subscriptionStartDate: '', subscriptionEndDate: '', subscriptionFreezeDays: 0, subscriptionFreezeUsed: 0, subscriptionStatus: 'active', lastPaymentDate: '', nextPaymentDueDate: '', loyaltyPoints: 0, membershipLevel: 'basic', goals: { weightLoss: false, muscleGain: false, endurance: false }, trainerId: '', createdAt: '', updatedAt: '',
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<UserModel | null>(null);
  const [roleForm, setRoleForm] = useState('member');
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserModel[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        // جلب كل المستخدمين بدون فلترة أو pagination
        const res = await userService.getUsers({});
        let usersArr: UserModel[] = [];
        if (Array.isArray(res)) {
          usersArr = res as unknown as UserModel[];
        } else if (Array.isArray(res.data)) {
          usersArr = res.data as unknown as UserModel[];
        }
        setAllUsers(usersArr);
      } catch (err) {
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, [refresh]);

  // فلترة وبحث محلي
  const filteredUsers = allUsers.filter(user => {
    // فلترة الدور
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    // بحث بالاسم أو الإيميل أو رقم الهاتف
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (
        !(user.name?.toLowerCase().includes(s) ||
          user.email?.toLowerCase().includes(s) ||
          user.phone?.toLowerCase().includes(s))
      ) {
        return false;
      }
    }
    return true;
  });

  // pagination محلي
  const totalUsers = filteredUsers.length;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const users = filteredUsers.slice(startIdx, endIdx);

  const getRoleText = (role: string) => {
    const roles = { member: 'عضو', trainer: 'مدرب', admin: 'إدارة', manager: 'مدير' };
    return roles[role as keyof typeof roles] || role;
  };
  const getRoleColor = (role: string) => {
    const colors = { member: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', trainer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  const getStatusColor = (status: string) => {
    const colors = { active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', banned: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  const getSubscriptionColor = (subscription: string) => {
    const colors = { active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
    return colors[subscription as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  const safeUsers = Array.isArray(users) ? users : [];

  // handlers (نفس الكود السابق)
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
    const user = allUsers.find(u => u._id === id); // البحث في جميع المستخدمين
    if (!user) return;
    function dateToInputString(val: any): string {
      if (!val) return '';
      if (typeof val === 'string') {
        // إذا string من نوع ISO
        if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.substring(0, 10);
        // إذا string تاريخ عربي أو غيره
        return '';
      }
      if (val instanceof Date) return val.toISOString().substring(0, 10);
      return '';
    }
    setEditUser(user);
    setEditForm({
      _id: user._id || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'member',
      phone: user.phone || '',
      dob: dateToInputString(user.dob),
      avatarUrl: user.avatarUrl || '',
      address: user.address || '',
      balance: user.balance ?? 0,
      status: user.status || 'active',
      isEmailVerified: user.isEmailVerified ?? false,
      subscriptionStartDate: dateToInputString(user.subscriptionStartDate),
      subscriptionEndDate: dateToInputString(user.subscriptionEndDate),
      subscriptionFreezeDays: user.subscriptionFreezeDays ?? 0,
      subscriptionFreezeUsed: user.subscriptionFreezeUsed ?? 0,
      subscriptionStatus: user.subscriptionStatus || 'active',
      lastPaymentDate: dateToInputString(user.lastPaymentDate),
      nextPaymentDueDate: dateToInputString(user.nextPaymentDueDate),
      loyaltyPoints: user.loyaltyPoints ?? 0,
      membershipLevel: user.membershipLevel || 'basic',
      goals: user.goals || { weightLoss: false, muscleGain: false, endurance: false },
      trainerId: user.trainerId || '',
      createdAt: user.createdAt ? (user.createdAt instanceof Date ? user.createdAt.toLocaleString('ar-EG') : user.createdAt) : '',
      updatedAt: user.updatedAt ? (user.updatedAt instanceof Date ? user.updatedAt.toLocaleString('ar-EG') : user.updatedAt) : '',
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
      // فقط الحقول القابلة للتعديل
      const {
        _id, createdAt, updatedAt, // نستثنيهم
        ...toSend
      } = editForm;
      // تحويل القيم الرقمية
      toSend.balance = Number(toSend.balance) || 0;
      toSend.subscriptionFreezeDays = Number(toSend.subscriptionFreezeDays) || 0;
      toSend.subscriptionFreezeUsed = Number(toSend.subscriptionFreezeUsed) || 0;
      toSend.loyaltyPoints = Number(toSend.loyaltyPoints) || 0;
      // تجهيز submitData مع تحويل الحقول الفارغة إلى null
      const dateKeys: (keyof typeof toSend)[] = [
        'dob',
        'subscriptionStartDate',
        'subscriptionEndDate',
        'lastPaymentDate',
        'nextPaymentDueDate',
      ];
      const submitData: any = { ...toSend };
      dateKeys.forEach((key) => {
        if (submitData[key] === '') submitData[key] = null;
      });
      // حذف الحقول التي قيمتها null
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === null) {
          delete submitData[key];
        }
      });
      // فلترة الحقول المسموحة فقط حسب schema
      const allowedKeys = [
        'name', 'email', 'role', 'phone', 'avatarUrl', 'address', 'balance', 'status',
        'isEmailVerified', 'failedLoginAttempts', 'metadata', 'isDeleted',
        'subscriptionFreezeDays', 'subscriptionFreezeUsed', 'subscriptionStatus',
        'loyaltyPoints', 'membershipLevel', 'goals'
      ];
      const filteredData: any = {};
      for (const key of allowedKeys) {
        if (typeof submitData[key] !== 'undefined') {
          filteredData[key] = submitData[key];
        }
      }
      // لا ترسل null أو undefined
      Object.keys(filteredData).forEach((key) => {
        if (filteredData[key] === null || filteredData[key] === undefined) {
          delete filteredData[key];
        }
      });
      // سجل البيانات المرسلة
      console.log('editForm sent:', filteredData);
      await userService.updateUser(editUser!._id, filteredData);
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

  // فتح مودال الحذف
  const openDeleteModal = (id: string, type: 'soft' | 'hard') => {
    setDeleteUserId(id);
    setDeleteType(type);
    setIsDeleteOpen(true);
  };
  // تنفيذ الحذف بعد التأكيد
  const confirmDelete = async () => {
    if (!deleteUserId) return;
    setIsDeleteOpen(false);
    if (deleteType === 'soft') {
      await handleDelete(deleteUserId);
    } else {
      await handleHardDelete(deleteUserId);
    }
    setDeleteUserId(null);
  };

  // جلب بيانات المستخدم بالتفصيل
  const openViewUser = async (id: string) => {
    setIsViewOpen(true);
    setViewUser(null);
    setViewLoading(true);
    try {
      const user = await userService.getUser(id);
      setViewUser(user);
    } catch {
      setViewUser({ error: 'تعذر جلب بيانات المستخدم' });
    } finally {
      setViewLoading(false);
    }
  };

  // userViewFields (نفس الكود السابق)
  const userViewFields: { key: string; label: string; type?: 'object' }[] = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'role', label: 'الدور' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'avatarUrl', label: 'رابط الصورة' },
    { key: 'address', label: 'العنوان' },
    { key: 'balance', label: 'الرصيد' },
    { key: 'status', label: 'الحالة' },
    { key: 'isEmailVerified', label: 'تم التحقق من البريد' },
    { key: 'failedLoginAttempts', label: 'محاولات الدخول الفاشلة' },
    { key: 'isDeleted', label: 'محذوف؟' },
    { key: 'subscriptionFreezeDays', label: 'أيام تجميد الاشتراك' },
    { key: 'subscriptionFreezeUsed', label: 'أيام التجميد المستخدمة' },
    { key: 'subscriptionStatus', label: 'حالة الاشتراك' },
    { key: 'loyaltyPoints', label: 'نقاط الولاء' },
    { key: 'membershipLevel', label: 'مستوى العضوية' },
    { key: 'goals', label: 'الأهداف', type: 'object' },
    { key: 'metadata', label: 'بيانات إضافية', type: 'object' },
    { key: 'createdAt', label: 'تاريخ الإنشاء' },
    { key: 'updatedAt', label: 'آخر تعديل' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <AdminUsersTableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        onOpenCreate={openCreate}
      />
      <AdminUsersTableList
        users={safeUsers}
        loading={loading}
        openViewUser={openViewUser}
        canEdit={hasPermission('users:write')}
        canChangeRole={hasPermission('users:write')}
        canDelete={hasPermission('users:delete')}
        canHardDelete={currentUser?.role === 'admin'}
        handleEdit={handleEdit}
        handleChangeRole={handleChangeRole}
        openDeleteModal={openDeleteModal}
        getRoleText={getRoleText}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
        getSubscriptionColor={getSubscriptionColor}
      />
      <AdminUsersTablePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        PAGE_SIZE={PAGE_SIZE}
        totalUsers={totalUsers}
        loading={loading}
      />
      <AdminUserModals
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isSubmitting={isSubmitting}
        formError={formError}
        newUser={newUser}
        handleCreateChange={handleCreateChange}
        handleCreateSubmit={handleCreateSubmit}
        isRoleOpen={isRoleOpen}
        roleUser={roleUser}
        roleForm={roleForm}
        setRoleForm={setRoleForm}
        roleError={roleError}
        isRoleSubmitting={isRoleSubmitting}
        setIsRoleOpen={setIsRoleOpen}
        handleRoleSubmit={handleRoleSubmit}
        isEditOpen={isEditOpen}
        editUser={editUser}
        editForm={editForm}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        isEditSubmitting={isEditSubmitting}
        editError={editError}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteType={deleteType}
        confirmDelete={confirmDelete}
        isViewOpen={isViewOpen}
        setIsViewOpen={setIsViewOpen}
        viewUser={viewUser}
        viewLoading={viewLoading}
        userViewFields={userViewFields}
              />
            </div>
  );
};

export default AdminUsersTable;
