'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/userService';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import AdminUsersTableHeader from '../admin/AdminUsersTableHeader';
import AdminUsersTableList from '../admin/AdminUsersTableList';
import AdminUsersTablePagination from '../admin/AdminUsersTablePagination';
import AdminUserModals from '../admin/AdminUserModals';

const ManagerUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserModel | null>(null);
  const [editForm, setEditForm] = useState<any>({});
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
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const PAGE_SIZE = 10;
  const userService = new UserService();
  const { hasPermission, user: currentUser } = usePermissions();

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
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
    if (filterRole !== 'all' && user.role !== filterRole) return false;
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

  // نفس دوال الألوان والترجمة من الأدمن
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

  // handlers (نفس الأدمن)
  const handleEdit = (id: string) => {
    const user = allUsers.find(u => u._id === id);
    if (!user) return;
    function dateToInputString(val: any): string {
      if (!val) return '';
      if (typeof val === 'string') {
        if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.substring(0, 10);
        return '';
      }
      if (val instanceof Date) return val.toISOString().substring(0, 10);
      return '';
    }
    function datetimeToInputString(val: any): string {
      if (!val) return '';
      if (typeof val === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) return val.substring(0, 16);
        return '';
      }
      if (val instanceof Date) return val.toISOString().substring(0, 16);
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
      emailVerificationToken: (user as any).emailVerificationToken || '',
      failedLoginAttempts: (user as any).failedLoginAttempts ?? 0,
      lockUntil: (user as any).lockUntil ? ((user as any).lockUntil instanceof Date ? (user as any).lockUntil.toISOString().slice(0, 16) : (user as any).lockUntil) : '',
      isDeleted: (user as any).isDeleted ?? false,
      subscriptionStartDate: dateToInputString(user.subscriptionStartDate),
      subscriptionEndDate: dateToInputString(user.subscriptionEndDate),
      subscriptionFreezeDays: user.subscriptionFreezeDays ?? 0,
      subscriptionFreezeUsed: user.subscriptionFreezeUsed ?? 0,
      subscriptionStatus: user.subscriptionStatus || 'active',
      subscriptionRenewalReminderSent: datetimeToInputString((user as any).subscriptionRenewalReminderSent),
      lastPaymentDate: dateToInputString(user.lastPaymentDate),
      nextPaymentDueDate: dateToInputString(user.nextPaymentDueDate),
      loyaltyPoints: user.loyaltyPoints ?? 0,
      membershipLevel: user.membershipLevel || 'basic',
      goals: user.goals || { weightLoss: false, muscleGain: false, endurance: false },
      trainerId: user.trainerId || '',
      metadata: (user as any).metadata || { emergencyContact: '', notes: '', lastLogin: '', ipAddress: '' },
      createdAt: user.createdAt ? (user.createdAt instanceof Date ? user.createdAt.toLocaleString('ar-EG') : user.createdAt) : '',
      updatedAt: user.updatedAt ? (user.updatedAt instanceof Date ? user.updatedAt.toLocaleString('ar-EG') : user.updatedAt) : '',
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        setEditForm((prev: any) => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof typeof prev] as any || {}),
            [childKey]: checked
          }
        }));
      } else {
        setEditForm((prev: any) => ({ ...prev, [name]: checked }));
      }
    } else {
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        setEditForm((prev: any) => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof typeof prev] as any || {}),
            [childKey]: value
          }
        }));
      } else {
        setEditForm((prev: any) => ({ ...prev, [name]: value }));
      }
    }
    if (editError) setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      setEditError('الرجاء ملء جميع الحقول الأساسية');
      return;
    }
    setIsEditSubmitting(true);
    try {
      const { _id, createdAt, updatedAt, ...toSend } = editForm;
      toSend.balance = Number(toSend.balance) || 0;
      toSend.subscriptionFreezeDays = Number(toSend.subscriptionFreezeDays) || 0;
      toSend.subscriptionFreezeUsed = Number(toSend.subscriptionFreezeUsed) || 0;
      toSend.loyaltyPoints = Number(toSend.loyaltyPoints) || 0;
      toSend.failedLoginAttempts = Number(toSend.failedLoginAttempts) || 0;
      toSend.isEmailVerified = Boolean(toSend.isEmailVerified);
      toSend.isDeleted = Boolean(toSend.isDeleted);
      if (toSend.goals) {
        toSend.goals.weightLoss = Boolean(toSend.goals.weightLoss);
        toSend.goals.muscleGain = Boolean(toSend.goals.muscleGain);
        toSend.goals.endurance = Boolean(toSend.goals.endurance);
      }
      const objectIdFields = ['trainerId'];
      objectIdFields.forEach(field => {
        if ((toSend as any)[field] === '' || (toSend as any)[field] === undefined) {
          (toSend as any)[field] = null;
        }
      });
      const stringFields = ['phone', 'avatarUrl', 'address'];
      stringFields.forEach(field => {
        if ((toSend as any)[field] === '' || (toSend as any)[field] === undefined) {
          (toSend as any)[field] = null;
        }
      });
      const dateKeys: (keyof typeof toSend)[] = [
        'dob',
        'subscriptionStartDate',
        'subscriptionEndDate',
        'subscriptionRenewalReminderSent',
        'lastPaymentDate',
        'nextPaymentDueDate',
      ];
      const submitData: any = { ...toSend };
      dateKeys.forEach((key) => {
        if (submitData[key] && submitData[key] !== '') {
          submitData[key] = new Date(submitData[key]);
        } else {
          submitData[key] = null;
        }
      });
      if (submitData.metadata) {
        Object.keys(submitData.metadata).forEach(key => {
          if (submitData.metadata[key] === '' || submitData.metadata[key] === null || submitData.metadata[key] === undefined) {
            delete submitData.metadata[key];
          }
        });
        if (Object.keys(submitData.metadata).length === 0) {
          delete submitData.metadata;
        }
      }
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === null || submitData[key] === undefined || submitData[key] === '') {
          delete submitData[key];
        }
      });
      const allowedKeys = [
        'name', 'email', 'role', 'phone', 'dob', 'avatarUrl', 'address', 'balance', 'status',
        'subscriptionStartDate', 'subscriptionEndDate', 'subscriptionFreezeDays', 'subscriptionFreezeUsed',
        'subscriptionStatus', 'subscriptionRenewalReminderSent', 'lastPaymentDate', 'nextPaymentDueDate',
        'loyaltyPoints', 'membershipLevel', 'goals', 'trainerId', 'metadata'
      ];
      if (!submitData.name || submitData.name.trim() === '') {
        throw new Error('الاسم مطلوب');
      }
      if (!submitData.email || submitData.email.trim() === '') {
        throw new Error('البريد الإلكتروني مطلوب');
      }
      if (!['admin', 'trainer', 'member', 'manager'].includes(submitData.role)) {
        throw new Error('الدور غير صحيح');
      }
      if (!['active', 'inactive', 'banned'].includes(submitData.status)) {
        throw new Error('الحالة غير صحيحة');
      }
      const filteredData: any = {};
      for (const key of allowedKeys) {
        if (typeof submitData[key] !== 'undefined') {
          filteredData[key] = submitData[key];
        }
      }
      Object.keys(filteredData).forEach((key) => {
        if (filteredData[key] === null || filteredData[key] === undefined) {
          delete filteredData[key];
        }
      });
      await userService.updateUser(editUser!._id, filteredData);
      setIsEditOpen(false);
      setRefresh(r => !r);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم تعديل المستخدم بنجاح' } }));
    } catch (err: any) {
      setEditError(err.message || 'حدث خطأ أثناء التعديل');
    } finally {
      setIsEditSubmitting(false);
    }
  };

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

  const handleChangeRole = (id: string, currentRole: string) => {
    const user = users.find((u: any) => u._id === id);
    if (!user) return;
    setRoleUser(user);
    setRoleForm(user.role);
    setRoleError(null);
    setIsRoleOpen(true);
  };

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

  const openDeleteModal = (id: string, type: 'soft' | 'hard') => {
    setDeleteUserId(id);
    setDeleteType(type);
    setIsDeleteOpen(true);
  };
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

  // userViewFields (جميع الحقول من User Schema)
  const userViewFields: { key: string; label: string; type?: 'object' }[] = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'role', label: 'الدور' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'dob', label: 'تاريخ الميلاد' },
    { key: 'avatarUrl', label: 'رابط الصورة' },
    { key: 'address', label: 'العنوان' },
    { key: 'balance', label: 'الرصيد' },
    { key: 'status', label: 'الحالة' },
    { key: 'subscriptionStartDate', label: 'تاريخ بداية الاشتراك' },
    { key: 'subscriptionEndDate', label: 'تاريخ نهاية الاشتراك' },
    { key: 'subscriptionFreezeDays', label: 'أيام تجميد الاشتراك' },
    { key: 'subscriptionFreezeUsed', label: 'أيام التجميد المستخدمة' },
    { key: 'subscriptionStatus', label: 'حالة الاشتراك' },
    { key: 'subscriptionRenewalReminderSent', label: 'تاريخ إرسال تذكير التجديد' },
    { key: 'lastPaymentDate', label: 'تاريخ آخر دفع' },
    { key: 'nextPaymentDueDate', label: 'تاريخ استحقاق الدفع القادم' },
    { key: 'loyaltyPoints', label: 'نقاط الولاء' },
    { key: 'membershipLevel', label: 'مستوى العضوية' },
    { key: 'goals', label: 'الأهداف', type: 'object' },
    { key: 'trainerId', label: 'معرف المدرب' },
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
        // لا تمرر onOpenCreate لإخفاء زر الإضافة
        hideCreateButton={true}
      />
      <AdminUsersTableList
        users={safeUsers}
        loading={loading}
        openViewUser={openViewUser}
        canEdit={hasPermission('users:write')}
        canChangeRole={hasPermission('users:write')}
        canDelete={true} // دائماً يمكن الحذف للمانجر
        canHardDelete={false}
        handleEdit={handleEdit}
        handleChangeRole={handleChangeRole}
        openDeleteModal={(id: string) => openDeleteModal(id, 'soft')}
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
        isCreateOpen={false} // لا يوجد إضافة
        setIsCreateOpen={() => {}}
        isSubmitting={false}
        formError={null}
        newUser={{}}
        handleCreateChange={() => {}}
        handleCreateSubmit={() => {}}
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

export default ManagerUsersTable;
