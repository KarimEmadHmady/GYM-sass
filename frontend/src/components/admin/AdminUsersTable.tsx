'use client';

import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/userService';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import AdminUsersTableHeader from './AdminUsersTableHeader';
import AdminUsersTableList from './AdminUsersTableList';
import AdminUsersTablePagination from './AdminUsersTablePagination';
import AdminUserModals from './AdminUserModals';
import { subscriptionAlertService } from '@/services/subscriptionAlertService';
import * as XLSX from 'xlsx';

const AdminUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ 
    name: '', email: '', password: '', role: 'member', phone: '', dob: '', avatarUrl: '', address: '', 
    balance: 0, status: 'active', isEmailVerified: false, loyaltyPoints: 0, membershipLevel: 'basic', 
    goals: { weightLoss: false, muscleGain: false, endurance: false }, trainerId: '',
    subscriptionStartDate: '', subscriptionEndDate: '', lastPaymentDate: '', nextPaymentDueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userService = new UserService();
  const { hasPermission, user: currentUser } = usePermissions();
  const PAGE_SIZE = 10;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserModel | null>(null);
  const [editForm, setEditForm] = useState({
    _id: '',
    name: '',
    email: '',
    role: 'member',
    phone: '',
    dob: '',
    avatarUrl: '',
    address: '',
    balance: 0,
    status: 'active',
    isEmailVerified: false,
    subscriptionStartDate: '',
    subscriptionEndDate: '',
    subscriptionFreezeDays: 0,
    subscriptionFreezeUsed: 0,
    subscriptionStatus: 'active',
    lastPaymentDate: '',
    nextPaymentDueDate: '',
    loyaltyPoints: 0,
    membershipLevel: 'basic',
    goals: { weightLoss: false, muscleGain: false, endurance: false },
    trainerId: '',
    // NEW: gym fields defaults
    heightCm: '',
    baselineWeightKg: '',
    targetWeightKg: '',
    activityLevel: '',
    healthNotes: '',
    createdAt: '',
    updatedAt: '',
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
  const [hasPlayedAlert, setHasPlayedAlert] = useState(false);

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
        
        // فحص التحذيرات (بدون تشغيل الصوت - يتم من SoundManager)
        if (!hasPlayedAlert) {
          const alerts = await subscriptionAlertService.getSubscriptionAlerts();
          const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
          if (criticalAlerts.length > 0) {
            setHasPlayedAlert(true);
          }
        }
      } catch (err) {
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, [refresh, hasPlayedAlert]);

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
    setNewUser({ 
      name: '', email: '', password: '', role: 'member', phone: '', dob: '', avatarUrl: '', address: '', 
      balance: 0, status: 'active', isEmailVerified: false, loyaltyPoints: 0, membershipLevel: 'basic', 
      goals: { weightLoss: false, muscleGain: false, endurance: false }, trainerId: '',
      subscriptionStartDate: '', subscriptionEndDate: '', lastPaymentDate: '', nextPaymentDueDate: ''
    });
    setIsCreateOpen(true);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // التعامل مع الحقول المتداخلة مثل goals.weightLoss
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        setNewUser(prev => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof typeof prev] as any || {}),
            [childKey]: checked
          }
        }));
      } else {
        setNewUser(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      // التعامل مع الحقول المتداخلة مثل metadata.lastLogin
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        setNewUser(prev => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof typeof prev] as any || {}),
            [childKey]: value
          }
        }));
      } else {
    setNewUser(prev => ({ ...prev, [name]: value }));
      }
    }
    
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
      // تحويل القيم الرقمية والتواريخ
      const userData: any = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role as any,
        phone: newUser.phone || null,
        dob: newUser.dob || null,
        avatarUrl: newUser.avatarUrl || null,
        address: newUser.address || null,
        balance: Number(newUser.balance) || 0,
        status: newUser.status as any,
        isEmailVerified: Boolean(newUser.isEmailVerified),
        loyaltyPoints: Number(newUser.loyaltyPoints) || 0,
        membershipLevel: newUser.membershipLevel as any,
        goals: newUser.goals || { weightLoss: false, muscleGain: false, endurance: false },
        trainerId: newUser.trainerId || null,
        subscriptionStartDate: newUser.subscriptionStartDate || null,
        subscriptionEndDate: newUser.subscriptionEndDate || null,
        lastPaymentDate: newUser.lastPaymentDate || null,
        nextPaymentDueDate: newUser.nextPaymentDueDate || null,
      };
      
      // حذف الحقول الفارغة
      Object.keys(userData).forEach(key => {
        if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
          delete userData[key];
        }
      });
      
      await userService.createUser(userData);
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
    
    function datetimeToInputString(val: any): string {
      if (!val) return '';
      if (typeof val === 'string') {
        // إذا string من نوع ISO
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) return val.substring(0, 16);
        // إذا string تاريخ عربي أو غيره
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
      // NEW gym fields
      heightCm: (user as any).heightCm ?? '',
      baselineWeightKg: (user as any).baselineWeightKg ?? '',
      targetWeightKg: (user as any).targetWeightKg ?? '',
      activityLevel: (user as any).activityLevel ?? '',
      healthNotes: (user as any).healthNotes ?? '',
      createdAt: user.createdAt ? (user.createdAt instanceof Date ? user.createdAt.toLocaleString('ar-EG') : user.createdAt) : '',
      updatedAt: user.updatedAt ? (user.updatedAt instanceof Date ? user.updatedAt.toLocaleString('ar-EG') : user.updatedAt) : '',
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  // تحديث handleEditChange ليشمل كل الحقول
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Debug log for subscriptionRenewalReminderSent
    if (name === 'subscriptionRenewalReminderSent') {
      console.log('subscriptionRenewalReminderSent changed:', value);
    }
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // التعامل مع الحقول المتداخلة مثل goals.weightLoss
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        setEditForm(prev => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof typeof prev] as any || {}),
            [childKey]: checked
          }
        }));
      } else {
        setEditForm(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      // التعامل مع الحقول المتداخلة مثل metadata.lastLogin
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        setEditForm(prev => ({
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof typeof prev] as any || {}),
            [childKey]: value
          }
        }));
      } else {
    setEditForm(prev => ({ ...prev, [name]: value }));
      }
    }
    
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
      // تحويل القيم الرقمية والتأكد من صحة البيانات
      toSend.balance = Number(toSend.balance) || 0;
      toSend.subscriptionFreezeDays = Number(toSend.subscriptionFreezeDays) || 0;
      toSend.subscriptionFreezeUsed = Number(toSend.subscriptionFreezeUsed) || 0;
      toSend.loyaltyPoints = Number(toSend.loyaltyPoints) || 0;
      
      // التأكد من صحة القيم المنطقية
      toSend.isEmailVerified = Boolean(toSend.isEmailVerified);
      
      // التأكد من صحة goals
      if (toSend.goals) {
        toSend.goals.weightLoss = Boolean(toSend.goals.weightLoss);
        toSend.goals.muscleGain = Boolean(toSend.goals.muscleGain);
        toSend.goals.endurance = Boolean(toSend.goals.endurance);
      }
      
      // معالجة الحقول التي تحتاج ObjectId (تحويل القيم الفارغة إلى null)
      const objectIdFields = ['trainerId'];
      objectIdFields.forEach(field => {
        if ((toSend as any)[field] === '' || (toSend as any)[field] === undefined) {
          (toSend as any)[field] = null;
        }
      });
      
      // معالجة الحقول النصية الفارغة
      const stringFields = ['phone', 'avatarUrl', 'address'];
      stringFields.forEach(field => {
        if ((toSend as any)[field] === '' || (toSend as any)[field] === undefined) {
          (toSend as any)[field] = null;
        }
      });
      // تجهيز submitData مع تحويل الحقول الفارغة إلى null وتحويل التواريخ
      const dateKeys: (keyof typeof toSend)[] = [
        'dob',
        'subscriptionStartDate',
        'subscriptionEndDate',
        'lastPaymentDate',
        'nextPaymentDueDate',
      ];
      const submitData: any = { ...toSend };
      
      // تحويل حقول التاريخ من strings إلى Date objects
      dateKeys.forEach((key) => {
        if (submitData[key] && submitData[key] !== '') {
          submitData[key] = new Date(submitData[key]);
        } else {
          submitData[key] = null;
        }
      });
      
      // التعامل مع metadata بشكل صحيح (فقط notes)
      if (submitData.metadata) {
        // حذف الحقول الفارغة في metadata
        Object.keys(submitData.metadata).forEach(key => {
          if (submitData.metadata[key] === '' || submitData.metadata[key] === null || submitData.metadata[key] === undefined) {
            delete submitData.metadata[key];
          }
        });
        
        // إذا كان metadata فارغ تماماً، احذفه
        if (Object.keys(submitData.metadata).length === 0) {
          delete submitData.metadata;
        }
      }
      // حذف الحقول التي قيمتها null أو undefined أو string فارغ
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === null || submitData[key] === undefined || submitData[key] === '') {
          delete submitData[key];
        }
      });
      // تحويل الحقول الرقمية (بما فيها حقول الجيم)
      ['balance','subscriptionFreezeDays','subscriptionFreezeUsed','loyaltyPoints','heightCm','baselineWeightKg','targetWeightKg'].forEach((field) => {
        if (submitData[field] !== undefined && submitData[field] !== '') {
          submitData[field] = Number(submitData[field]);
          if (Number.isNaN(submitData[field])) delete submitData[field];
        }
      });
      // فلترة الحقول المسموحة فقط حسب schema
      const allowedKeys = [
        'name','email','role','phone','avatarUrl','address','balance','status','isEmailVerified',
        'subscriptionStartDate','subscriptionEndDate','subscriptionFreezeDays','subscriptionFreezeUsed','subscriptionStatus',
        'lastPaymentDate','nextPaymentDueDate','loyaltyPoints','membershipLevel','goals','trainerId',
        // NEW gym fields
        'heightCm','baselineWeightKg','targetWeightKg','activityLevel','healthNotes'
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
      console.log('editForm original:', editForm);
      console.log('submitData before filtering:', submitData);
      console.log('editForm sent:', filteredData);
      await userService.updateUser(editUser!._id, filteredData);
      setIsEditOpen(false);
      setRefresh(r => !r);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'تم تعديل المستخدم بنجاح' } }));
    } catch (err: any) {
      console.error('Error updating user:', err);
      setEditError(err.message || 'حدث خطأ أثناء التعديل');
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

  // دالة تصدير البيانات إلى Excel
  const exportToExcel = () => {
    try {
      // تحضير البيانات للتصدير
      const exportData = filteredUsers.map(user => ({
        'الاسم': user.name || '',
        'البريد الإلكتروني': user.email || '',
        'الدور': getRoleText(user.role),
        'رقم الهاتف': user.phone || '',
        'تاريخ الميلاد': user.dob ? new Date(user.dob).toLocaleDateString('ar-EG') : '',
        'العنوان': user.address || '',
        'الرصيد': user.balance || 0,
        'الحالة': user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'محظور',
        'تم التحقق من البريد': user.isEmailVerified ? 'نعم' : 'لا',
        'تاريخ بداية الاشتراك': user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString('ar-EG') : '',
        'تاريخ نهاية الاشتراك': user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('ar-EG') : '',
        'حالة الاشتراك': user.subscriptionStatus === 'active' ? 'نشط' : user.subscriptionStatus === 'expired' ? 'منتهي' : 'ملغي',
        'تاريخ آخر دفع': user.lastPaymentDate ? new Date(user.lastPaymentDate).toLocaleDateString('ar-EG') : '',
        'تاريخ استحقاق الدفع القادم': user.nextPaymentDueDate ? new Date(user.nextPaymentDueDate).toLocaleDateString('ar-EG') : '',
        'نقاط الولاء': user.loyaltyPoints || 0,
        'مستوى العضوية': user.membershipLevel || '',
        'الأهداف': user.goals ? Object.entries(user.goals).filter(([_, value]) => value).map(([key, _]) => {
          const goalNames = { weightLoss: 'فقدان الوزن', muscleGain: 'بناء العضلات', endurance: 'تحسين التحمل' };
          return goalNames[key as keyof typeof goalNames] || key;
        }).join(', ') : '',
        'معرف المدرب': user.trainerId || '',
        'تاريخ الإنشاء': user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : '',
        'آخر تعديل': user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ar-EG') : '',
      }));

      // إنشاء ورقة عمل
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // إنشاء كتاب عمل
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات المستخدمين');

      // تحديد عرض الأعمدة
      const columnWidths = [
        { wch: 20 }, // الاسم
        { wch: 30 }, // البريد الإلكتروني
        { wch: 15 }, // الدور
        { wch: 15 }, // رقم الهاتف
        { wch: 15 }, // تاريخ الميلاد
        { wch: 30 }, // العنوان
        { wch: 10 }, // الرصيد
        { wch: 10 }, // الحالة
        { wch: 15 }, // تم التحقق من البريد
        { wch: 20 }, // تاريخ بداية الاشتراك
        { wch: 20 }, // تاريخ نهاية الاشتراك
        { wch: 15 }, // حالة الاشتراك
        { wch: 20 }, // تاريخ آخر دفع
        { wch: 25 }, // تاريخ استحقاق الدفع القادم
        { wch: 15 }, // نقاط الولاء
        { wch: 15 }, // مستوى العضوية
        { wch: 30 }, // الأهداف
        { wch: 15 }, // معرف المدرب
        { wch: 15 }, // تاريخ الإنشاء
        { wch: 15 }, // آخر تعديل
      ];
      worksheet['!cols'] = columnWidths;

      // تصدير الملف
      const fileName = `بيانات_المستخدمين_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      // إظهار رسالة نجاح
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { 
          type: 'success', 
          message: `تم تصدير ${exportData.length} مستخدم بنجاح` 
        } 
      }));
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { 
          type: 'error', 
          message: 'حدث خطأ أثناء تصدير البيانات' 
        } 
      }));
    }
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
    { key: 'isEmailVerified', label: 'تم التحقق من البريد' },
    { key: 'emailVerificationToken', label: 'رمز تأكيد البريد الإلكتروني' },
    { key: 'failedLoginAttempts', label: 'محاولات الدخول الفاشلة' },
    { key: 'lockUntil', label: 'تاريخ القفل' },
    { key: 'isDeleted', label: 'محذوف؟' },
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
        onOpenCreate={openCreate}
        onExportData={exportToExcel}
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
