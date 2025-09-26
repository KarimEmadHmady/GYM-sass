'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import type { WorkoutPlan } from '@/types';
import { workoutService, userService } from '@/services';
import { dietService } from '@/services';
import type { DietPlan } from '@/types';

type AdminPlansOverviewProps = {
  filterUserIds?: Set<string>;
};

const AdminPlansOverview = ({ filterUserIds }: AdminPlansOverviewProps = {}) => {
  const { user } = useAuth();
  const currentRole = (user as any)?.role as string | undefined;
  const currentTrainerId = React.useMemo(() => ((user as any)?._id ?? (user as any)?.id ?? ''), [user]);
  const [activeTab, setActiveTab] = useState('workout');
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<null | string>(null);
  const [viewWorkoutPlan, setViewWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [creatingUserId, setCreatingUserId] = useState('');
  const [formPlanName, setFormPlanName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formExercises, setFormExercises] = useState<Array<Pick<WorkoutPlan['exercises'][number], 'name' | 'reps' | 'sets' | 'notes'>>> ([]);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [members, setMembers] = useState<Array<{ _id: string; name: string; email?: string; phone?: string }>>([]);
  const [trainers, setTrainers] = useState<Array<{ _id: string; name: string; email?: string; phone?: string }>>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [trainerSearch, setTrainerSearch] = useState('');
  const [creatingTrainerId, setCreatingTrainerId] = useState('');
  const [userNameMap, setUserNameMap] = useState<Record<string, string>>({});
  const t = useTranslations();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [dietLoading, setDietLoading] = useState(false);
  const [dietError, setDietError] = useState<string | null>(null);
  const [editingDietPlan, setEditingDietPlan] = useState<DietPlan | null>(null);
  const [showEditDietModal, setShowEditDietModal] = useState(false);
  const [dietMealsLoading, setDietMealsLoading] = useState(false);
  const [dietMealsError, setDietMealsError] = useState<string | null>(null);
  const [showDeleteDietModal, setShowDeleteDietModal] = useState<null | string>(null);
  const [viewDietPlan, setViewDietPlan] = useState<DietPlan | null>(null);
  const [dietPlanNameInput, setDietPlanNameInput] = useState('');
  const [dietPlanDescInput, setDietPlanDescInput] = useState('');
  const [dietPlanStartInput, setDietPlanStartInput] = useState('');
  const [dietPlanEndInput, setDietPlanEndInput] = useState('');
  const [showCreateDietModal, setShowCreateDietModal] = useState(false);
  const [createDietUserId, setCreateDietUserId] = useState('');
  const [createDietName, setCreateDietName] = useState('');
  const [createDietDesc, setCreateDietDesc] = useState('');
  const [createDietStart, setCreateDietStart] = useState('');
  const [createDietEnd, setCreateDietEnd] = useState('');
  const [createDietMeals, setCreateDietMeals] = useState<Array<{ mealName: string; calories: number; quantity: string; notes?: string }>>([]);
  const [createDietError, setCreateDietError] = useState<string | null>(null);
  const [createDietLoading, setCreateDietLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await workoutService.getAllWorkoutPlans();
        setWorkoutPlans((res as any).data || (res as any));
        // load members and trainers for selector
        try {
          const membersRes = await userService.getUsersByRole('member', { limit: 1000 });
          const raw = (membersRes as any).data || (membersRes as any);
          const list = (raw?.items || raw || []) as any[];
          if (currentRole === 'trainer') {
            const normalizeId = (val: any): string => {
              if (!val) return '';
              if (typeof val === 'string') return val;
              if (typeof val === 'object') return (val._id || val.id || '') as string;
              return String(val);
            };
            const me = normalizeId(currentTrainerId);
            setMembers(list.filter((m) => normalizeId((m as any)?.trainerId) === me));
          } else {
            setMembers(list);
          }
        } catch {}
        try {
          const trainersRes = await userService.getUsersByRole('trainer', { limit: 100 });
          const tdata = (trainersRes as any).data || (trainersRes as any);
          setTrainers(tdata?.items || tdata || []);
        } catch {}
      } catch (e: any) {
        setError(e.message || 'فشل تحميل الخطط');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const loadNames = async () => {
      const ids = Array.from(new Set([
        ...((workoutPlans || []).map(p => p.userId).filter(Boolean)),
        ...((workoutPlans || []).map((p:any) => p.trainerId).filter(Boolean)),
        ...((dietPlans || []).map((p:any) => p.userId).filter(Boolean)),
        ...((dietPlans || []).map((p:any) => p.trainerId).filter(Boolean)),
      ]));
      const missing = ids.filter(id => !userNameMap[id]);
      if (missing.length === 0) return;
      try {
        const pairs = await Promise.all(missing.map(async (id) => {
          try { const u = await userService.getUser(id); return [id, u.name] as const; }
          catch { return [id, id] as const; }
        }));
        setUserNameMap(prev => ({ ...prev, ...Object.fromEntries(pairs) }));
      } catch {}
    };
    loadNames();
  }, [workoutPlans, dietPlans, userNameMap]);

  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        setDietLoading(true);
        setDietError(null);
        const res: any = await dietService.getDietPlans();
        setDietPlans((res?.data || res || []) as DietPlan[]);
      } catch (e: any) {
        setDietError(e.message || 'فشل تحميل الخطط الغذائية');
      } finally {
        setDietLoading(false);
      }
    };
    fetchDietPlans();
  }, []);

  const resetForm = () => {
    setCreatingUserId('');
    setCreatingTrainerId('');
    setFormPlanName('');
    setFormDescription('');
    setFormStartDate('');
    setFormEndDate('');
    setFormExercises([]);
  };

  const openCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEdit = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setFormPlanName(plan.planName || '');
    setFormDescription((plan as any).description || '');
    setFormStartDate(plan.startDate ? new Date(plan.startDate).toISOString().slice(0,10) : '');
    setFormEndDate(plan.endDate ? new Date(plan.endDate).toISOString().slice(0,10) : '');
    setFormExercises((plan.exercises || []).map((e) => ({ name: e.name, reps: e.reps, sets: e.sets, notes: e.notes })));
    setShowEditModal(true);
  };

  const openEditDiet = (plan: DietPlan) => {
    setEditingDietPlan(plan);
    setShowEditDietModal(true);
    setDietPlanNameInput(plan.planName || '');
    setDietPlanDescInput(plan.description || '');
    setDietPlanStartInput(plan.startDate ? new Date(plan.startDate).toISOString().slice(0,10) : '');
    setDietPlanEndInput(plan.endDate ? new Date(plan.endDate).toISOString().slice(0,10) : '');
  };

  const canSubmitCreate = useMemo(() => creatingUserId && formPlanName && formStartDate && formEndDate, [creatingUserId, formPlanName, formStartDate, formEndDate]);

  const getTypeText = (type: string) => {
    return t(`AdminPlansOverview.types.${type}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyText = (difficulty: string) => {
    return t(`AdminPlansOverview.difficulties.${difficulty}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return t(`AdminPlansOverview.statuses.${status}`);
  };

  const filteredWorkoutPlans = useMemo(() => {
    if (!filterUserIds || filterUserIds.size === 0) return workoutPlans;
    return workoutPlans.filter((p) => filterUserIds.has(p.userId as any));
  }, [workoutPlans, filterUserIds]);

  const filteredDietPlans = useMemo(() => {
    if (!filterUserIds || filterUserIds.size === 0) return dietPlans as any[];
    return (dietPlans as any[]).filter((p: any) => filterUserIds.has(p.userId));
  }, [dietPlans, filterUserIds]);

  const currentPlans = activeTab === 'workout' ? filteredWorkoutPlans : filteredDietPlans as any[];

  // 1. أضف دالة لإضافة وجبة جديدة لأول خطة غذائية:
  const handleAddMealToFirstDietPlan = async () => {
    if (!dietPlans.length) {
      alert('لا توجد خطط غذائية لإضافة وجبة');
      return;
    }
    try {
      setDietMealsLoading(true);
      const plan = dietPlans[0];
      const updated = await dietService.addMealToPlan(plan._id, { mealName: 'وجبة جديدة', calories: 1, quantity: '1', notes: '' });
      await refreshDietPlan(plan._id);
    } catch (e: any) {
      setDietMealsError(e.message || 'فشل إضافة الوجبة');
    } finally {
      setDietMealsLoading(false);
    }
  };

  // أضف دالة لجلب خطة غذائية واحدة وتحديثها في الواجهة:
  const refreshDietPlan = async (planId: string) => {
    try {
      const res = await dietService.getDietPlan(planId);
      setDietPlans((prev) => prev.map((p) => p._id === planId ? res : p));
      setEditingDietPlan(res);
    } catch {}
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            {currentRole === 'trainer' ? 'إدارة الخطط (مدرب)' : t('AdminPlansOverview.title')}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {activeTab === 'workout' ? (
                <>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors" onClick={openCreate}>{t('AdminPlansOverview.addNewPlan')}</button>
                </>
              ) : (
                <>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors" onClick={() => {
                    setCreateDietUserId('');
                    setCreateDietName('');
                    setCreateDietDesc('');
                    setCreateDietStart('');
                    setCreateDietEnd('');
                    setCreateDietMeals([]);
                    setCreateDietError(null);
                    setShowCreateDietModal(true);
                  }}>إنشاء خطة غذائية</button>
                </>
              )}
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {t('AdminPlansOverview.exportData')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow_sm border border_gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'workout', name: t('AdminPlansOverview.tabs.workout'), count: filteredWorkoutPlans.length, icon: '🏋️' },
              { id: 'diet', name: t('AdminPlansOverview.tabs.diet'), count: filteredDietPlans.length, icon: '🍎' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Plans List */}
        <div className="p-6">
          {loading && (
            <p className="text-sm text-gray-600 dark:text-gray-400">جاري التحميل...</p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'workout' && workoutPlans.map((plan) => (
              <div
                key={plan._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify_between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {plan.planName}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-1">👤 اسم المستخدم: {userNameMap[plan.userId] || '...'}</p>
                { (plan as any).trainerId && (
                  <p className="text-xs text-gray-500 mb-2">🧑‍🏫 اسم المدرب: {userNameMap[(plan as any).trainerId as any] || '...'}</p>
                )}
                {plan.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{plan.description}</p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">🏋️ {t('AdminPlansOverview.labels.exercises')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.exercises?.length || 0} {t('AdminPlansOverview.exerciseUnit')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">⏳ {t('AdminPlansOverview.labels.duration')}</span>
                    <span className="text-sm font-medium text-white dark:text_white">
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setViewWorkoutPlan(plan)}
                    title="عرض"
                  >
                    <span className="inline-flex items-center gap-2 justify-center w-full">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#2563eb" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
                      عرض
                    </span>
                  </button>
                  <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={() => openEdit(plan)}>{t('AdminPlansOverview.edit')}</button>
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 transition-colors" onClick={() => setShowDeleteModal(plan._id)}>حذف</button>
                </div>
              </div>
            ))}
            {activeTab === 'diet' && (
              dietLoading ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">جاري التحميل...</p>
              ) : dietError ? (
                <p className="text-sm text-red-600">{dietError}</p>
              ) : dietPlans.map((plan) => (
                <div key={plan._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{plan.planName}</h4>
                    <div className="flex gap-2">
                      <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs inline-flex items-center gap-1" onClick={() => setViewDietPlan(plan)} title="عرض">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#2563eb" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
                        عرض
                      </button>
                      <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs" onClick={() => openEditDiet(plan)}>تعديل</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => setShowDeleteDietModal(plan._id)}>حذف</button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">👤 اسم المستخدم: {userNameMap[(plan as any).userId] || '...'}</p>
                  {(plan as any).trainerId && (
                    <p className="text-xs text-gray-500 mb-2">🧑‍🏫 اسم المدرب: {userNameMap[(plan as any).trainerId] || '...'}</p>
                  )}
                  {plan.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{plan.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">📅 الفترة:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(plan.startDate).toLocaleDateString()} {plan.endDate ? `- ${new Date(plan.endDate).toLocaleDateString()}` : ''}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">🍽️ عدد الوجبات:</span>
                      <span className="text-gray-900 dark:text-white">{plan.meals?.length || 0} وجبة</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
 
    {/* Create Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={() => { setShowCreateModal(false); }}
            aria-label="Close"
            title="إغلاق"
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold text_gray-900 dark:text-white mb-4">إنشاء خطة تمرين</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">المستخدم (الأعضاء فقط)</label>
              <input
                className="mb-2 w-full border rounded px-3 py-2 bg-white dark:bg-gray-900"
                placeholder="ابحث بالاسم أو الهاتف أو الإيميل"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
              <select value={creatingUserId} onChange={(e) => setCreatingUserId(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900">
                <option value="">اختر عضو...</option>
                {members
                  .filter((m) => {
                    const q = memberSearch.trim().toLowerCase();
                    if (!q) return true;
                    const phone = (m.phone || '').toLowerCase();
                    const name = (m.name || '').toLowerCase();
                    const email = (m.email || '').toLowerCase();
                    return phone.includes(q) || name.includes(q) || email.includes(q);
                  })
                  .map((m) => (
                    <option key={m._id} value={m._id}>{(m.phone || 'بدون هاتف')} - {m.name}</option>
                  ))}
              </select>
            </div>
            {currentRole !== 'trainer' && (
              <div>
                <label className="block text-sm mb-1">المدرب</label>
                <input
                  className="mb-2 w-full border rounded px-3 py-2 bg-white dark:bg-gray-900"
                  placeholder="ابحث بالاسم أو الهاتف أو الإيميل"
                  value={trainerSearch}
                  onChange={(e) => setTrainerSearch(e.target.value)}
                />
                <select value={creatingTrainerId} onChange={(e) => setCreatingTrainerId(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900">
                  <option value="">اختر مدرب...</option>
                  {trainers
                    .filter((m) => {
                      const q = trainerSearch.trim().toLowerCase();
                      if (!q) return true;
                      const phone = (m.phone || '').toLowerCase();
                      const name = (m.name || '').toLowerCase();
                      const email = (m.email || '').toLowerCase();
                      return phone.includes(q) || name.includes(q) || email.includes(q);
                    })
                    .map((m) => (
                      <option key={m._id} value={m._id}>{(m.phone || 'بدون هاتف')} - {m.name}</option>
                    ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">اسم الخطة</label>
              <input value={formPlanName} onChange={(e) => setFormPlanName(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="اكتب اسم الخطة (مثال: خطة تخسيس)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الوصف</label>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="اكتب وصفًا مختصرًا للخطة" />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ البداية</label>
              <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="تاريخ البداية" />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ النهاية</label>
              <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="تاريخ النهاية" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">التمارين</h4>
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => setFormExercises((prev) => [...prev, { name: '', reps: 0, sets: 0, notes: '' }])}>إضافة تمرين</button>
            </div>
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 mb-1">
              <span className="col-span-3">اسم التمرين</span>
              <span className="col-span-2">التكرارات </span>
              <span className="col-span-2">المجموعات </span>
              <span className="col-span-4">ملاحظات</span>
              <span className="col-span-1">إجراء</span>
            </div>
            {formExercises.length === 0 && (
              <p className="text-sm text-gray-500">لا يوجد تمارين</p>
            )}
            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {formExercises.map((ex, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-3 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: سكوات" value={ex.name} onChange={(e) => setFormExercises((prev) => prev.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: 12" value={ex.reps} onChange={(e) => setFormExercises((prev) => prev.map((p, i) => i === idx ? { ...p, reps: Number(e.target.value) } : p))} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: 3" value={ex.sets} onChange={(e) => setFormExercises((prev) => prev.map((p, i) => i === idx ? { ...p, sets: Number(e.target.value) } : p))} />
                  <input className="col-span-4 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: راحة 60 ثانية" value={ex.notes || ''} onChange={(e) => setFormExercises((prev) => prev.map((p, i) => i === idx ? { ...p, notes: e.target.value } : p))} />
                  <button className="col-span-1 text-red-600" onClick={() => setFormExercises((prev) => prev.filter((_, i) => i !== idx))}>حذف</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => { setShowCreateModal(false); }}>إلغاء</button>
            <button className={`px-4 py-2 rounded text-white ${canSubmitCreate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`} disabled={!canSubmitCreate} onClick={async () => {
              try {
                setLoading(true);
                const created = await workoutService.createWorkoutPlan(creatingUserId, {
                  planName: formPlanName,
                  description: formDescription,
                  startDate: new Date(formStartDate) as any,
                  endDate: new Date(formEndDate) as any,
                  exercises: formExercises as any,
                  trainerId: currentRole === 'trainer' ? undefined : (creatingTrainerId || undefined),
                });
                setWorkoutPlans((prev) => [created, ...prev]);
                setShowCreateModal(false);
                resetForm();
              } catch (e: any) {
                alert(e.message || 'فشل إنشاء الخطة');
              } finally {
                setLoading(false);
              }
            }}>حفظ</button>
          </div>
        </div>
      </div>
    )}

    {/* Create Diet Plan Modal */}
    {showCreateDietModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowCreateDietModal(false)}
            aria-label="Close"
            title="إغلاق"
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إنشاء خطة غذائية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">المستخدم (الأعضاء فقط)</label>
              <input
                className="mb-2 w-full border rounded px-3 py-2 bg-white dark:bg-gray-900"
                placeholder="ابحث بالاسم أو الهاتف أو الإيميل"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
              <select value={createDietUserId} onChange={(e) => setCreateDietUserId(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900">
                <option value="">اختر عضو...</option>
                {members
                  .filter((m) => {
                    const q = memberSearch.trim().toLowerCase();
                    if (!q) return true;
                    const phone = (m.phone || '').toLowerCase();
                    const name = (m.name || '').toLowerCase();
                    const email = (m.email || '').toLowerCase();
                    return phone.includes(q) || name.includes(q) || email.includes(q);
                  })
                  .map((m) => (
                    <option key={m._id} value={m._id}>{(m.phone || 'بدون هاتف')} - {m.name}</option>
                  ))}
              </select>
            </div>
            {currentRole !== 'trainer' && (
              <div>
                <label className="block text-sm mb-1">المدرب</label>
                <select value={creatingTrainerId} onChange={(e) => setCreatingTrainerId(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900">
                  <option value="">اختر مدرب...</option>
                  {trainers.map((m) => (
                    <option key={m._id} value={m._id}>{(m.phone || 'بدون هاتف')} - {m.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">اسم الخطة</label>
              <input value={createDietName} onChange={(e) => setCreateDietName(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="مثال: خطة غذائية" />
            </div>
            <div>
              <label className="block text-sm mb-1">الوصف</label>
              <input value={createDietDesc} onChange={(e) => setCreateDietDesc(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="وصف مختصر" />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ البداية</label>
              <input type="date" value={createDietStart} onChange={(e) => setCreateDietStart(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ النهاية</label>
              <input type="date" value={createDietEnd} onChange={(e) => setCreateDietEnd(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">الوجبات</h4>
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => setCreateDietMeals((prev) => [...prev, { mealName: '', calories: 1, quantity: '1', notes: '' }])}>إضافة وجبة</button>
            </div>
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 mb-1">
              <span className="col-span-3">اسم الوجبة</span>
              <span className="col-span-2">السعرات</span>
              <span className="col-span-2">الكمية</span>
              <span className="col-span-4">ملاحظات</span>
              <span className="col-span-1">إجراء</span>
            </div>
            {createDietMeals.length === 0 && (
              <p className="text-sm text-gray-500">لا يوجد وجبات</p>
            )}
            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {createDietMeals.map((meal, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-3 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: فطور" value={meal.mealName} onChange={(e)=> setCreateDietMeals(prev => prev.map((m,i)=> i===idx ? { ...m, mealName: e.target.value } : m))} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: 300" value={meal.calories} onChange={(e)=> setCreateDietMeals(prev => prev.map((m,i)=> i===idx ? { ...m, calories: Number(e.target.value) } : m))} />
                  <input className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: 1 طبق" value={meal.quantity} onChange={(e)=> setCreateDietMeals(prev => prev.map((m,i)=> i===idx ? { ...m, quantity: e.target.value } : m))} />
                  <input className="col-span-4 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="اختياري" value={meal.notes || ''} onChange={(e)=> setCreateDietMeals(prev => prev.map((m,i)=> i===idx ? { ...m, notes: e.target.value } : m))} />
                  <button className="col-span-1 text-red-600" onClick={()=> setCreateDietMeals(prev => prev.filter((_,i)=> i!==idx))}>حذف</button>
                </div>
              ))}
            </div>
          </div>

          {createDietError && <p className="text-xs text-red-600 mt-2">{createDietError}</p>}

          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => setShowCreateDietModal(false)}>إلغاء</button>
            <button className={`px-4 py-2 rounded text-white ${createDietLoading ? 'bg-blue-300 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={createDietLoading} onClick={async () => {
              if (!createDietUserId) { setCreateDietError('يجب اختيار عضو'); return; }
              if (!createDietName.trim()) { setCreateDietError('اسم الخطة مطلوب'); return; }
              if (!createDietStart) { setCreateDietError('تاريخ البداية مطلوب'); return; }
              try {
                setCreateDietLoading(true);
                const created = await dietService.createDietPlan({
                  userId: createDietUserId,
                  planName: createDietName.trim(),
                  description: createDietDesc,
                  startDate: new Date(createDietStart) as any,
                  endDate: createDietEnd ? new Date(createDietEnd) as any : undefined,
                  meals: createDietMeals as any,
                  trainerId: currentRole === 'trainer' ? undefined : (creatingTrainerId || undefined),
                });
                setDietPlans((prev) => [created as any, ...prev]);
                setShowCreateDietModal(false);
                setCreateDietMeals([]);
              } catch (e: any) {
                setCreateDietError(e.message || 'فشل إنشاء الخطة الغذائية');
              } finally {
                setCreateDietLoading(false);
              }
            }}>حفظ</button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Modal */}
    {showEditModal && editingPlan && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={() => { setShowEditModal(false); setEditingPlan(null); }}
            aria-label="Close"
            title="إغلاق"
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تعديل الخطة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">اسم الخطة</label>
              <input value={formPlanName} onChange={(e) => setFormPlanName(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="اكتب اسم الخطة" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الوصف</label>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="اكتب وصف الخطة" />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ البداية</label>
              <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="تاريخ البداية" />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ النهاية</label>
              <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" placeholder="تاريخ النهاية" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">التمارين</h4>
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={async () => {
                try {
                  const createdPlan = await workoutService.addExerciseToPlan(editingPlan!._id, { name: 'تمرين جديد', reps: 8, sets: 3, notes: '' });
                  setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan!._id ? createdPlan : p));
                  setEditingPlan(createdPlan);
                  setFormExercises(createdPlan.exercises.map((e) => ({ name: e.name, reps: e.reps, sets: e.sets, notes: e.notes })));
                } catch (e: any) {
                  alert(e.message || 'فشل إضافة التمرين');
                }
              }}>إضافة تمرين</button>
            </div>
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 mb-1">
              <span className="col-span-3">اسم التمرين</span>
              <span className="col-span-2">التكرارات</span>
              <span className="col-span-2">المجموعات</span>
              <span className="col-span-4">ملاحظات</span>
              <span className="col-span-1">إجراء</span>
            </div>
            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {((editingPlan?.exercises) || []).map((ex, idx) => (
                <div key={ex._id} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-3 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: سكوات" defaultValue={ex.name} onBlur={async (e) => {
                    try { const updated = await workoutService.updateExerciseInPlan(editingPlan!._id, ex._id, { name: e.target.value }); setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan!._id ? updated : p)); setEditingPlan(updated); } catch(err:any){ alert(err.message || 'تعذر تحديث التمرين'); }
                  }} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: 12" defaultValue={ex.reps} onBlur={async (e) => {
                    try { const updated = await workoutService.updateExerciseInPlan(editingPlan!._id, ex._id, { reps: Number(e.target.value) }); setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan!._id ? updated : p)); setEditingPlan(updated); } catch(err:any){ alert(err.message || 'تعذر تحديث التمرين'); }
                  }} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: 3" defaultValue={ex.sets} onBlur={async (e) => {
                    try { const updated = await workoutService.updateExerciseInPlan(editingPlan!._id, ex._id, { sets: Number(e.target.value) }); setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan!._id ? updated : p)); setEditingPlan(updated); } catch(err:any){ alert(err.message || 'تعذر تحديث التمرين'); }
                  }} />
                  <input className="col-span-4 border rounded px-2 py-1 bg-white dark:bg-gray-900" placeholder="مثال: راحة 60 ثانية" defaultValue={ex.notes || ''} onBlur={async (e) => {
                    try { const updated = await workoutService.updateExerciseInPlan(editingPlan!._id, ex._id, { notes: e.target.value }); setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan!._id ? updated : p)); setEditingPlan(updated); } catch(err:any){ alert(err.message || 'تعذر تحديث التمرين'); }
                  }} />
                  <button className="col-span-1 text-red-600" onClick={async () => {
                    try { const updated = await workoutService.removeExerciseFromPlan(editingPlan!._id, ex._id); setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan!._id ? updated : p)); setEditingPlan(updated); } catch(err:any){ alert(err.message || 'تعذر حذف التمرين'); }
                  }}>حذف</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => { setShowEditModal(false); setEditingPlan(null); }}>إغلاق</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={async () => {
              if (!editingPlan) return;
              try {
                const updated = await workoutService.updateWorkoutPlan(editingPlan._id, {
                  planName: formPlanName,
                  description: formDescription,
                  startDate: formStartDate ? new Date(formStartDate) as any : undefined,
                  endDate: formEndDate ? new Date(formEndDate) as any : undefined,
                });
                setWorkoutPlans((prev) => prev.map((p) => p._id === editingPlan._id ? updated : p));
                setEditingPlan(updated);
                setShowEditModal(false);
              } catch (e:any) {
                alert(e.message || 'فشل حفظ الخطة');
              }
            }}>حفظ</button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirm */}
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تأكيد الحذف</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">هل أنت متأكد من حذف هذه الخطة؟</p>
          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => setShowDeleteModal(null)}>إلغاء</button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded" onClick={async () => {
              try {
                await workoutService.deleteWorkoutPlan(showDeleteModal as string);
                setWorkoutPlans((prev) => prev.filter((p) => p._id !== showDeleteModal));
                setShowDeleteModal(null);
              } catch (e:any) {
                alert(e.message || 'فشل حذف الخطة');
              }
            }}>حذف</button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Diet Modal */}
    {showEditDietModal && editingDietPlan && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={() => { setShowEditDietModal(false); setEditingDietPlan(null); }}
            aria-label="Close"
            title="إغلاق"
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تعديل الخطة الغذائية</h3>
          <div className="mb-4">
            <label className="block text-sm mb-1">اسم الخطة</label>
            <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" value={dietPlanNameInput} onChange={(e)=>setDietPlanNameInput(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">الوصف</label>
            <textarea className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" value={dietPlanDescInput} onChange={(e)=>setDietPlanDescInput(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">تاريخ البداية</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" value={dietPlanStartInput} onChange={(e)=>setDietPlanStartInput(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} />
            </div>
            <div>
              <label className="block text-sm mb-1">تاريخ النهاية</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900" value={dietPlanEndInput} onChange={(e)=>setDietPlanEndInput(e.target.value)} onFocus={(e)=> (e.currentTarget as any).showPicker?.()} onClick={(e)=> (e.currentTarget as any).showPicker?.()} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">الوجبات</label>
            <button className="px-3 py-1 bg-green-600 text-white rounded mb-2" onClick={async () => {
              if (!editingDietPlan) return;
              try {
                setDietMealsLoading(true);
                const updatedMeal = await dietService.addMealToPlan(editingDietPlan._id, { mealName: 'وجبة جديدة', calories: 1, quantity: '1', notes: '' });
                await refreshDietPlan(editingDietPlan._id);
              } catch (e: any) {
                setDietMealsError(e.message || 'فشل إضافة الوجبة');
              } finally {
                setDietMealsLoading(false);
              }
            }}>إضافة وجبة</button>
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 mb-1">
              <span className="col-span-3">اسم الوجبة</span>
              <span className="col-span-2">السعرات</span>
              <span className="col-span-2">الكمية</span>
              <span className="col-span-3">ملاحظات</span>
              <span className="col-span-2">إجراء</span>
            </div>
            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {(editingDietPlan.meals || []).map((meal) => (
                <div key={meal.mealId} className="grid grid-cols-12 gap-2 items-center mb-2">
                  <input className="col-span-3 border rounded px-2 py-1 bg-white dark:bg-gray-900" defaultValue={meal.mealName} onBlur={async (e) => {
                    if (!editingDietPlan) return;
                    try {
                      setDietMealsLoading(true);
                      const updatedMeal = await dietService.updateMealInPlan(editingDietPlan._id, meal.mealId, {
                        mealName: e.target.value,
                        calories: meal.calories,
                        quantity: meal.quantity,
                        notes: meal.notes || ''
                      });
                      await refreshDietPlan(editingDietPlan._id);
                    } catch (err: any) {
                      setDietMealsError(err.message || 'تعذر تحديث الوجبة');
                    } finally {
                      setDietMealsLoading(false);
                    }
                  }} />
                  <input type="number" className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" defaultValue={meal.calories} onBlur={async (e) => {
                    if (!editingDietPlan) return;
                    try {
                      setDietMealsLoading(true);
                      const updatedMeal = await dietService.updateMealInPlan(editingDietPlan._id, meal.mealId, {
                        mealName: meal.mealName,
                        calories: Number(e.target.value),
                        quantity: meal.quantity,
                        notes: meal.notes || ''
                      });
                      await refreshDietPlan(editingDietPlan._id);
                    } catch (err: any) {
                      setDietMealsError(err.message || 'تعذر تحديث الوجبة');
                    } finally {
                      setDietMealsLoading(false);
                    }
                  }} />
                  <input className="col-span-2 border rounded px-2 py-1 bg-white dark:bg-gray-900" defaultValue={meal.quantity} onBlur={async (e) => {
                    if (!editingDietPlan) return;
                    try {
                      setDietMealsLoading(true);
                      const updatedMeal = await dietService.updateMealInPlan(editingDietPlan._id, meal.mealId, {
                        mealName: meal.mealName,
                        calories: meal.calories,
                        quantity: e.target.value,
                        notes: meal.notes || ''
                      });
                      await refreshDietPlan(editingDietPlan._id);
                    } catch (err: any) {
                      setDietMealsError(err.message || 'تعذر تحديث الوجبة');
                    } finally {
                      setDietMealsLoading(false);
                    }
                  }} />
                  <input className="col-span-3 border rounded px-2 py-1 bg-white dark:bg-gray-900" defaultValue={meal.notes || ''} onBlur={async (e) => {
                    if (!editingDietPlan) return;
                    try {
                      setDietMealsLoading(true);
                      const updatedMeal = await dietService.updateMealInPlan(editingDietPlan._id, meal.mealId, {
                        mealName: meal.mealName,
                        calories: meal.calories,
                        quantity: meal.quantity,
                        notes: e.target.value
                      });
                      await refreshDietPlan(editingDietPlan._id);
                    } catch (err: any) {
                      setDietMealsError(err.message || 'تعذر تحديث الوجبة');
                    } finally {
                      setDietMealsLoading(false);
                    }
                  }} />
                  <button className="col-span-2 text-red-600" onClick={async () => {
                    if (!editingDietPlan) return;
                    try {
                      setDietMealsLoading(true);
                      const deleted = await dietService.removeMealFromPlan(editingDietPlan._id, meal.mealId);
                      await refreshDietPlan(editingDietPlan._id);
                    } catch (err: any) {
                      setDietMealsError(err.message || 'تعذر حذف الوجبة');
                    } finally {
                      setDietMealsLoading(false);
                    }
                  }}>حذف</button>
                </div>
              ))}
            </div>
            {dietMealsError && <p className="text-red-600 text-xs mt-2">{dietMealsError}</p>}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => { setShowEditDietModal(false); setEditingDietPlan(null); }}>إلغاء</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={async ()=>{
              if(!editingDietPlan) return;
              try{
                setDietMealsLoading(true);
                const updated = await dietService.updateDietPlan(editingDietPlan._id, {
                  planName: dietPlanNameInput,
                  description: dietPlanDescInput,
                  startDate: dietPlanStartInput ? (new Date(dietPlanStartInput) as any) : undefined,
                  endDate: dietPlanEndInput ? (new Date(dietPlanEndInput) as any) : undefined,
                });
                await refreshDietPlan(editingDietPlan._id);
                setEditingDietPlan(updated);
                setShowEditDietModal(false);
              }catch(err:any){
                setDietMealsError(err.message || 'فشل حفظ الخطة الغذائية');
              }finally{
                setDietMealsLoading(false);
              }
            }}>حفظ</button>
          </div>
        </div>
      </div>
    )}

  {/* View Workout Plan Modal */}
  {viewWorkoutPlan && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => setViewWorkoutPlan(null)}
          aria-label="Close"
          title="إغلاق"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تفاصيل خطة التمرين</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">اسم الخطة:</span>
            <span className="text-gray-900 dark:text-white font-medium">{viewWorkoutPlan.planName}</span>
          </div>
          {viewWorkoutPlan.description && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">الوصف:</span> 
              <span className="text-gray-900 dark:text-white font-medium">{viewWorkoutPlan.description}</span>

            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">المستخدم:</span>
            <span className="text-gray-900 dark:text-white font-medium">{userNameMap[(viewWorkoutPlan as any).userId] || (viewWorkoutPlan as any).userId}</span>
          </div>
          {(viewWorkoutPlan as any).trainerId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">المدرب:</span>
              <span className="text-gray-900 dark:text-white font-medium">{userNameMap[(viewWorkoutPlan as any).trainerId] || (viewWorkoutPlan as any).trainerId}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">الفترة:</span>
            <span className="text-gray-900 dark:text-white font-medium">{new Date(viewWorkoutPlan.startDate).toLocaleDateString()} - {new Date(viewWorkoutPlan.endDate).toLocaleDateString()}</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">التمارين ({viewWorkoutPlan.exercises?.length || 0})</h4>
            <div className="border rounded-lg divide-y dark:border-gray-700">
              {(viewWorkoutPlan.exercises || []).map((ex, i) => (
                <div key={i} className="p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{ex.name}</span>
                    <span className="text-gray-600 dark:text-gray-300">{ex.sets} مجموعات × {ex.reps} تكرارات</span>
                  </div>
                  {ex.notes && <div className="text-gray-500 dark:text-gray-400 mt-1">ملاحظات: {ex.notes}</div>}
                </div>
              ))}
              {(!viewWorkoutPlan.exercises || viewWorkoutPlan.exercises.length === 0) && (
                <div className="p-3 text-sm text-gray-500">لا يوجد تمارين</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* View Diet Plan Modal */}
  {viewDietPlan && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => setViewDietPlan(null)}
          aria-label="Close"
          title="إغلاق"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تفاصيل الخطة الغذائية</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">اسم الخطة:</span>
            <span className="text-gray-900 dark:text-white font-medium">{viewDietPlan.planName}</span>
          </div>
          {viewDietPlan.description && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">الوصف:</span> 
              <span className="text-gray-900 dark:text-white font-medium">{viewDietPlan.description}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">المستخدم:</span>
            <span className="text-gray-900 dark:text-white font-medium">{userNameMap[(viewDietPlan as any).userId] || (viewDietPlan as any).userId}</span>
          </div>
          {(viewDietPlan as any).trainerId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">المدرب:</span>
              <span className="text-gray-900 dark:text-white font-medium">{userNameMap[(viewDietPlan as any).trainerId] || (viewDietPlan as any).trainerId}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">الفترة:</span>
            <span className="text-gray-900 dark:text-white font-medium">{new Date(viewDietPlan.startDate).toLocaleDateString()} {viewDietPlan.endDate ? `- ${new Date(viewDietPlan.endDate).toLocaleDateString()}` : ''}</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">الوجبات ({viewDietPlan.meals?.length || 0})</h4>
            <div className="border rounded-lg divide-y dark:border-gray-700">
              {(viewDietPlan.meals || []).map((m, i) => (
                <div key={m.mealId || i} className="p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{m.mealName}</span>
                    <span className="text-gray-600 dark:text-gray-300">{m.calories} س.ح • {m.quantity}</span>
                  </div>
                  {m.notes && <div className="text-gray-500 dark:text-gray-400 mt-1">ملاحظات: {m.notes}</div>}
                </div>
              ))}
              {(!viewDietPlan.meals || viewDietPlan.meals.length === 0) && (
                <div className="p-3 text-sm text-gray-500">لا يوجد وجبات</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
    {/* Delete Diet Confirm */}
    {showDeleteDietModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تأكيد حذف الخطة الغذائية</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">هل أنت متأكد من حذف هذه الخطة الغذائية؟</p>
          <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => setShowDeleteDietModal(null)}>إلغاء</button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded" onClick={async () => {
              try {
                await dietService.deleteDietPlan(showDeleteDietModal as string);
                setDietPlans((prev) => prev.filter((p) => p._id !== showDeleteDietModal));
                setShowDeleteDietModal(null);
              } catch (e: any) {
                alert(e.message || 'فشل حذف الخطة الغذائية');
              }
            }}>حذف</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminPlansOverview;
