'use client';

import React, { useEffect, useState } from 'react';
import { LoyaltyService } from '@/services/loyaltyService';
import type { RewardsStatsResponse, LoyaltyPointsStatsResponse, RedeemableReward } from '@/types';
import { Plus, Edit, Trash } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/userService';
import { useLoyaltyStats } from '@/hooks/useLoyaltyStats';
import type { User } from '@/types/models';

const loyaltyService = new LoyaltyService();
const userService = new UserService();

const initialRewardForm = {
  name: '',
  description: '',
  pointsRequired: 0,
  category: 'discount',
  isActive: true,
  stock: 1,
  minMembershipLevel: 'basic',
  maxRedemptionsPerUser: 1,
  value: 0,
  valueUnit: 'جنيه',
  conditions: '',
  imageUrl: '',
  validUntil: '',
};

const AdminLoyalty = () => {
  // Use shared loyalty stats hook
  const { loyaltyStats, rewardsStats, refreshStats } = useLoyaltyStats();
  
  // State
  const [rewards, setRewards] = useState<RedeemableReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editReward, setEditReward] = useState<RedeemableReward | null>(null);
  const [rewardForm, setRewardForm] = useState<any>(initialRewardForm);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const { user: currentUser } = useAuth();

  // إضافة نقاط يدوياً
  const [addPointsUserId, setAddPointsUserId] = useState('');
  const [addPointsValue, setAddPointsValue] = useState(1);
  const [addPointsReason, setAddPointsReason] = useState('');
  const [addPointsLoading, setAddPointsLoading] = useState(false);
  const [addPointsError, setAddPointsError] = useState<string | null>(null);
  const [addPointsSuccess, setAddPointsSuccess] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // سجل النقاط
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyFilterUserId, setHistoryFilterUserId] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState('');

  // أفضل المستخدمين
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [topUsersLoading, setTopUsersLoading] = useState(false);

  // جلب المستخدمين
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  // Fetch rewards only (stats are handled by the hook)
  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const rewardsRes = await loyaltyService.getAllRedeemableRewards();
        setRewards(rewardsRes);
      } catch (err: any) {
        setError('تعذر جلب البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  useEffect(() => {
    setUsersLoading(true);
    userService.getUsers({ limit: 1000 }).then(res => {
      let usersArr: User[] = [];
      if (Array.isArray(res)) {
        usersArr = res as unknown as User[];
      } else if (Array.isArray(res.data)) {
        usersArr = res.data as unknown as User[];
      }
      setAllUsers(usersArr);
    }).catch(() => setAllUsers([])).finally(() => setUsersLoading(false));
  }, []);

  // جلب أفضل المستخدمين وسجل النقاط
  const fetchTopUsers = async () => {
    setTopUsersLoading(true);
    try {
      const users = await loyaltyService.getTopUsers(3);
      setTopUsers(users);
    } catch {
      setTopUsers([]);
    } finally {
      setTopUsersLoading(false);
    }
  };
  const fetchPointsHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      let filters: any = {};
      if (historyFilterType) filters.type = historyFilterType;
      if (historyFilterUserId) {
        // جلب سجل مستخدم معين
        const res = await loyaltyService.getUserPointHistory(historyFilterUserId, filters);
        setPointsHistory(res?.history || []);
      } else {
        // جلب كل السجل
        const res = await loyaltyService.getPointsHistory(filters);
        setPointsHistory(res?.history || []);
      }
    } catch {
      setHistoryError('تعذر جلب سجل النقاط');
    } finally {
      setHistoryLoading(false);
    }
  };
  useEffect(() => {
    fetchTopUsers();
    fetchPointsHistory();
  }, []);

  // Reset form when opening modal
  useEffect(() => {
    if (isRewardModalOpen) {
      if (editReward) {
        // تحميل البيانات مع القيم الافتراضية للحقول المفقودة
        setRewardForm({
          name: editReward.name || '',
          description: editReward.description || '',
          pointsRequired: editReward.pointsRequired || 0,
          category: editReward.category || 'discount',
          isActive: editReward.isActive !== undefined ? editReward.isActive : true,
          stock: editReward.stock !== undefined ? editReward.stock : 1,
          minMembershipLevel: editReward.minMembershipLevel || 'basic',
          maxRedemptionsPerUser: editReward.maxRedemptionsPerUser || 1,
          value: editReward.value || 0,
          valueUnit: editReward.valueUnit || 'جنيه',
          conditions: editReward.conditions || '',
          imageUrl: editReward.imageUrl || '',
          validUntil: editReward.validUntil ? new Date(editReward.validUntil).toISOString().slice(0, 16) : '',
        });
      } else {
        setRewardForm(initialRewardForm);
      }
      setModalError(null);
      setModalSuccess(null);
    }
  }, [isRewardModalOpen, editReward]);

  // Handle form change
  const handleRewardFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      checked = e.target.checked;
    }
    
    // معالجة خاصة للحقول الرقمية
    let processedValue: any = value;
    if (type === 'number') {
      processedValue = value === '' ? 0 : Number(value);
    }
    
    setRewardForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? processedValue : value),
    }));
    if (modalError) setModalError(null);
    if (modalSuccess) setModalSuccess(null);
  };

  // Handle form submit
  const handleRewardFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      // Validation بسيط
      if (!rewardForm.name || rewardForm.name.length < 3) {
        setModalError('اسم الجائزة يجب أن يكون 3 أحرف على الأقل');
        setModalLoading(false);
        return;
      }
      if (!rewardForm.description || rewardForm.description.length < 10) {
        setModalError('وصف الجائزة يجب أن يكون 10 أحرف على الأقل');
        setModalLoading(false);
        return;
      }
      // تجهيز البيانات - فقط الحقول المطلوبة
      const payload: any = {
        name: rewardForm.name,
        description: rewardForm.description,
        pointsRequired: Number(rewardForm.pointsRequired),
        category: rewardForm.category,
        isActive: rewardForm.isActive,
        stock: Number(rewardForm.stock),
        minMembershipLevel: rewardForm.minMembershipLevel,
        maxRedemptionsPerUser: Number(rewardForm.maxRedemptionsPerUser),
      };
      
      // إضافة الحقول الاختيارية فقط إذا كانت موجودة
      if (rewardForm.value) {
        payload.value = Number(rewardForm.value);
      }
      if (rewardForm.valueUnit) {
        payload.valueUnit = rewardForm.valueUnit;
      }
      if (rewardForm.conditions) {
        payload.conditions = rewardForm.conditions;
      }
      if (rewardForm.imageUrl) {
        payload.imageUrl = rewardForm.imageUrl;
      }
      if (rewardForm.validUntil) {
        payload.validUntil = new Date(rewardForm.validUntil).toISOString();
      }
      // اطبع جسم الطلب
      console.log('rewardForm sent:', payload);
      console.log('editReward:', editReward);
      if (editReward) {
        // Update
        const updated = await loyaltyService.updateRedeemableReward(editReward._id, payload);
        setRewards((prev) => prev.map(r => r._id === updated._id ? updated : r));
      } else {
        // Create
        const created = await loyaltyService.createRedeemableReward(payload);
        setRewards((prev) => [created, ...prev]);
      }
      
      // تحديث الإحصائيات بعد التعديل/الإضافة
      refreshStats();
      
      // إظهار رسالة نجاح
      setModalSuccess(editReward ? 'تم تحديث الجائزة بنجاح' : 'تم إضافة الجائزة بنجاح');
      setTimeout(() => {
        setModalSuccess(null);
        setIsRewardModalOpen(false);
      }, 1500);
    } catch (err: any) {
      console.log('Full error object:', err);
      console.log('Error message:', err.message);
      setModalError(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setModalLoading(false);
    }
  };

  // إضافة نقاط يدوياً
  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddPointsLoading(true);
    setAddPointsError(null);
    setAddPointsSuccess(null);
    try {
      if (!addPointsUserId || !addPointsValue || !addPointsReason) {
        setAddPointsError('يرجى ملء جميع الحقول');
        setAddPointsLoading(false);
        return;
      }
      await loyaltyService.addPoints(addPointsUserId, Number(addPointsValue), addPointsReason);
      setAddPointsSuccess('تمت إضافة النقاط بنجاح');
      setAddPointsUserId('');
      setAddPointsValue(1);
      setAddPointsReason('');
      
      // تحديث جميع البيانات
      fetchPointsHistory();
      fetchTopUsers();
      
      // تحديث الإحصائيات
      refreshStats();
    } catch {
      setAddPointsError('حدث خطأ أثناء إضافة النقاط');
    } finally {
      setAddPointsLoading(false);
    }
  };

  // فلترة سجل النقاط
  const handleHistoryFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPointsHistory();
  };
  
  // إعادة تعيين الفلاتر وتحديث البيانات
  const handleResetFilters = () => {
    setHistoryFilterUserId('');
    setHistoryFilterType('');
    fetchPointsHistory();
  };
  
  // تحديث تلقائي عند تغيير الفلاتر
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPointsHistory();
    }, 500); // تأخير 500ms لتجنب طلبات كثيرة
    
    return () => clearTimeout(timeoutId);
  }, [historyFilterUserId, historyFilterType]);
  
  // تحديث تلقائي عند تغيير البحث في المستخدمين
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // تحديث قائمة المستخدمين المفلترة
      // لا نحتاج لاستدعاء API لأن البيانات موجودة بالفعل
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchUser]);

  // Handlers
  const handleOpenAddReward = () => {
    setEditReward(null);
    setIsRewardModalOpen(true);
  };
  const handleOpenEditReward = (reward: RedeemableReward) => {
    setEditReward(reward);
    setIsRewardModalOpen(true);
  };
  const handleDeleteReward = async (rewardId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف الجائزة؟')) return;
    setLoading(true);
    try {
      await loyaltyService.deleteRedeemableReward(rewardId);
      setRewards(r => r.filter(rw => rw._id !== rewardId));
      
      // تحديث الإحصائيات بعد الحذف
      refreshStats();
      
      // إظهار رسالة نجاح
      setDeleteSuccess('تم حذف الجائزة بنجاح');
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch {
      setError('حدث خطأ أثناء الحذف');
    } finally {
      setLoading(false);
    }
  };

  // UI
  const filteredUsers = allUsers.filter(u => {
    if (!searchUser.trim()) return true;
    const q = searchUser.trim().toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* إحصائيات النقاط والجوائز */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">إجمالي النقاط</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{loyaltyStats?.stats.totalPoints ?? '--'}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">عدد المستخدمين</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">{loyaltyStats?.stats.totalUsers ?? '--'}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">متوسط النقاط</span>
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{loyaltyStats?.stats.avgPoints ?? '--'}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">أعلى نقاط</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{loyaltyStats?.stats.maxPoints ?? '--'}</span>
        </div>
      </div>
      {/* إحصائيات الجوائز */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">عدد الجوائز</span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{rewardsStats?.general.totalRewards ?? '--'}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">الجوائز الفعالة</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">{rewardsStats?.general.activeRewards ?? '--'}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500 text-sm">عدد مرات الاستبدال</span>
          <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">{rewardsStats?.general.totalRedemptions ?? '--'}</span>
        </div>
      </div>
      {/* جدول الجوائز */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة الجوائز</h3>
          <button onClick={handleOpenAddReward} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            <Plus size={16} /> إضافة جائزة
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : deleteSuccess ? (
          <div className="text-center py-8 text-green-600">{deleteSuccess}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الاسم</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الوصف</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">النقاط المطلوبة</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الفئة</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الحالة</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">العمليات</th>
                </tr>
              </thead>
              <tbody>
                {rewards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">لا توجد جوائز حالياً</td>
                  </tr>
                ) : rewards.map((reward) => (
                  <tr key={reward._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-2 whitespace-nowrap font-semibold">{reward.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">{reward.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{reward.pointsRequired}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{reward.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      {reward.isActive ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">فعالة</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">غير فعالة</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2 justify-center">
                      <button onClick={() => handleOpenEditReward(reward)} className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400" title="تعديل"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteReward(reward._id)} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400" title="حذف"><Trash size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* مودال إضافة/تعديل جائزة */}
      <Dialog open={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 z-50">
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              {editReward ? 'تعديل جائزة' : 'إضافة جائزة'}
            </Dialog.Title>
            <form onSubmit={handleRewardFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">الاسم</label>
                <input name="name" value={rewardForm.name} onChange={handleRewardFormChange} required className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">الوصف</label>
                <textarea name="description" value={rewardForm.description} onChange={handleRewardFormChange} required rows={2} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">النقاط المطلوبة</label>
                  <input name="pointsRequired" type="number" min={1} value={rewardForm.pointsRequired} onChange={handleRewardFormChange} required className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">الفئة</label>
                  <select name="category" value={rewardForm.category} onChange={handleRewardFormChange} required className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="discount">خصم</option>
                    <option value="free_session">حصة مجانية</option>
                    <option value="merchandise">منتج</option>
                    <option value="subscription_extension">تمديد اشتراك</option>
                    <option value="premium_feature">ميزة إضافية</option>
                    <option value="gift_card">كرت هدية</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">الحد الأدنى للعضوية</label>
                  <select name="minMembershipLevel" value={rewardForm.minMembershipLevel} onChange={handleRewardFormChange} required className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="basic">عادي</option>
                    <option value="silver">فضي</option>
                    <option value="gold">ذهبي</option>
                    <option value="platinum">بلاتينيوم</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">المخزون</label>
                  <input name="stock" type="number" min={-1} value={rewardForm.stock} onChange={handleRewardFormChange} required className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <span className="text-xs text-gray-400">-1 = غير محدود</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">الحد الأقصى للاستبدال للمستخدم</label>
                  <input name="maxRedemptionsPerUser" type="number" min={1} value={rewardForm.maxRedemptionsPerUser} onChange={handleRewardFormChange} required className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input name="isActive" type="checkbox" checked={rewardForm.isActive} onChange={handleRewardFormChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label className="text-sm text-gray-700 dark:text-gray-200">فعالة</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">القيمة</label>
                  <input name="value" type="number" min={0} value={rewardForm.value} onChange={handleRewardFormChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">وحدة القيمة</label>
                  <input name="valueUnit" value={rewardForm.valueUnit} onChange={handleRewardFormChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">الشروط</label>
                <textarea name="conditions" value={rewardForm.conditions} onChange={handleRewardFormChange} rows={2} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">رابط الصورة</label>
                <input name="imageUrl" type="url" value={rewardForm.imageUrl} onChange={handleRewardFormChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">تاريخ انتهاء الصلاحية</label>
                <input name="validUntil" type="datetime-local" value={rewardForm.validUntil} onChange={handleRewardFormChange} className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              {modalError && <div className="text-red-500 text-sm text-center">{modalError}</div>}
              {modalSuccess && <div className="text-green-600 text-sm text-center">{modalSuccess}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsRewardModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">إلغاء</button>
                <button type="submit" disabled={modalLoading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                  {modalLoading ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* إضافة نقاط يدوياً */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إضافة نقاط يدوياً</h3>
        <form onSubmit={handleAddPoints} className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ابحث بالاسم أو الهاتف أو الإيميل"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              className="rounded border px-3 py-2 mb-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={addPointsUserId}
              onChange={e => setAddPointsUserId(e.target.value)}
              className="rounded border px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            >
              <option value="">اختر المستخدم</option>
              {filteredUsers.map(u => (
                <option key={u._id} value={u._id}>{u.name} {u.phone ? `(${u.phone})` : ''} - {u.email}</option>
              ))}
            </select>
          </div>
          <input
            type="number"
            min={1}
            placeholder="عدد النقاط"
            value={addPointsValue}
            onChange={e => setAddPointsValue(Number(e.target.value))}
            className="rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white w-32"
            required
          />
          <input
            type="text"
            placeholder="السبب"
            value={addPointsReason}
            onChange={e => setAddPointsReason(e.target.value)}
            className="rounded border px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex-1"
            required
          />
          <button
            type="submit"
            disabled={addPointsLoading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {addPointsLoading ? 'جاري الإضافة...' : 'إضافة'}
          </button>
        </form>
        {addPointsError && <div className="text-red-500 text-sm mt-2">{addPointsError}</div>}
        {addPointsSuccess && <div className="text-green-600 text-sm mt-2">{addPointsSuccess}</div>}
      </div>

      {/* أفضل 3 مستخدمين */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">أفضل 3 مستخدمين بالنقاط</h3>
        {topUsersLoading ? (
          <div className="text-center py-4 text-gray-500">جاري التحميل...</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            {topUsers.map((u, i) => (
              <div key={u._id} className="flex-1 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300 mb-2">
                  {u.name?.charAt(0) || '?'}
                </div>
                <div className="font-semibold text-lg text-gray-900 dark:text-white">{u.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{u.email}</div>
                <div className="mt-2 text-blue-700 dark:text-blue-200 font-bold">{u.loyaltyPoints} نقطة</div>
                <div className="text-xs text-gray-400 mt-1">#{i + 1}</div>
              </div>
            ))}
            {topUsers.length === 0 && <div className="text-gray-400">لا يوجد بيانات</div>}
          </div>
        )}
      </div>

      {/* سجل النقاط */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">سجل النقاط</h3>
          <form onSubmit={handleHistoryFilter} className="flex flex-col md:flex-row gap-2 items-center">
            <div>
              <input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف أو الإيميل"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="rounded border px-2 py-1 mb-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <select
                value={historyFilterUserId}
                onChange={e => setHistoryFilterUserId(e.target.value)}
                className="rounded border px-2 py-1 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">كل المستخدمين</option>
                {filteredUsers.map(u => (
                  <option key={u._id} value={u._id}>{u.name} {u.phone ? `(${u.phone})` : ''} - {u.email}</option>
                ))}
              </select>
            </div>
            <select
              value={historyFilterType}
              onChange={e => setHistoryFilterType(e.target.value)}
              className="rounded border px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">كل الأنواع</option>
              <option value="earned">مكتسبة</option>
              <option value="redeemed">مستبدلة</option>
              <option value="admin_added">مضافة من الإدارة</option>
              <option value="admin_deducted">مخصومة من الإدارة</option>
              <option value="payment_bonus">مكافأة دفع</option>
              <option value="attendance_bonus">مكافأة حضور</option>
              <option value="expired">منتهية</option>
            </select>
            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">بحث</button>
            <button type="button" onClick={handleResetFilters} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">إعادة تعيين</button>
          </form>
        </div>
        {historyLoading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : historyError ? (
          <div className="text-center py-8 text-red-500">{historyError}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">المستخدم</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">النقاط</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">النوع</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">السبب</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {pointsHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">لا يوجد بيانات</td>
                  </tr>
                ) : pointsHistory.map((h, idx) => (
                  <tr key={h._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-2 whitespace-nowrap">{
                      (() => {
                        const user = allUsers.find(u => u._id === h.userId);
                        if (user) {
                          return `${user.name}${user.phone ? ' (' + user.phone + ')' : ''}`;
                        }
                        return h.userId || '-';
                      })()
                    }</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{h.points}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">{h.type}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{h.reason}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs">{h.createdAt ? new Date(h.createdAt).toLocaleString('ar-EG') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoyalty;


