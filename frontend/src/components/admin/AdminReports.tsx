'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { SessionScheduleService } from '@/services/sessionScheduleService';
import { apiGet } from '@/lib/api';
import { WorkoutService } from '@/services/workoutService';
import { DietService } from '@/services/dietService';
import { AttendanceService } from '@/services/attendanceService';
import { useLoyaltyStats } from '@/hooks/useLoyaltyStats';
import { UserService } from '@/services/userService';

const AdminReports = () => {
  const [activeReport, setActiveReport] = useState('financial');

  // --- المالية ---
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [financialLoading, setFinancialLoading] = useState(true);
  const [financialError, setFinancialError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancial = async () => {
      setFinancialLoading(true);
      setFinancialError(null);
      try {
        // endpoint backend: /financial/summary أو /api/financial/summary حسب config
        // إذا لم يعمل endpoint عدل حسب المسار الصحيح
        const data = await apiGet<any>('/financial/summary');
        setFinancialSummary(data);
      } catch (e: any) {
        setFinancialError('فشل تحميل البيانات المالية');
      } finally {
        setFinancialLoading(false);
      }
    };
    if (activeReport === 'financial') fetchFinancial();
  }, [activeReport]);

  // --- المستخدمين ---
  const { list: fetchUsers, isLoading: usersLoading, error: usersError } = useUsers();
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  // جلب المستخدمين دائماً عند تحميل الصفحة
  useEffect(() => {
    let mounted = true;
    fetchUsers().then((data) => {
      if (mounted) {
        setUsers(data);
        setUsersLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, [fetchUsers]);

  // --- الحصص ---
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  useEffect(() => {
    if (activeReport !== 'sessions') return;
    setSessionsLoading(true);
    setSessionsError(null);
    const service = new SessionScheduleService();
    service.getAllSessions()
      .then((data) => {
        setSessions(data);
      })
      .catch(() => setSessionsError('فشل تحميل بيانات الحصص'))
      .finally(() => setSessionsLoading(false));
  }, [activeReport]);

  // --- الخطط ---
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  useEffect(() => {
    if (activeReport !== 'plans') return;
    setPlansLoading(true);
    setPlansError(null);
    const workoutService = new WorkoutService();
    const dietService = new DietService();
    Promise.all([
      workoutService.getAllWorkoutPlans({ limit: 100 }),
      dietService.getDietPlans({ limit: 100 })
    ])
      .then(([workoutRes, dietRes]) => {
        const workoutArr = Array.isArray(workoutRes) ? workoutRes : (workoutRes?.data || []);
        const dietArr = Array.isArray(dietRes) ? dietRes : (dietRes?.data || []);
        console.log('Workout plans fetched:', workoutArr);
        console.log('Diet plans fetched:', dietArr);
        setWorkoutPlans(workoutArr);
        setDietPlans(dietArr);
      })
      .catch(() => setPlansError('فشل تحميل بيانات الخطط'))
      .finally(() => setPlansLoading(false));
  }, [activeReport]);

  const plansStats = useMemo(() => {
    if (!workoutPlans && !dietPlans) return null;
    const totalWorkout = workoutPlans.length;
    const totalDiet = dietPlans.length;
    const activeWorkout = workoutPlans.filter((p) => new Date(p.endDate) > new Date()).length;
    const activeDiet = dietPlans.filter((p) => !p.endDate || new Date(p.endDate) > new Date()).length;
    const endedWorkout = totalWorkout - activeWorkout;
    const endedDiet = totalDiet - activeDiet;
    return {
      totalWorkout,
      totalDiet,
      activeWorkout,
      activeDiet,
      endedWorkout,
      endedDiet,
      latestWorkout: workoutPlans.slice(0, 3),
      latestDiet: dietPlans.slice(0, 3)
    };
  }, [workoutPlans, dietPlans]);

  // --- الحضور ---
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  useEffect(() => {
    if (activeReport !== 'attendance') return;
    setAttendanceLoading(true);
    setAttendanceError(null);
    const attendanceService = new AttendanceService();
    attendanceService.getAttendanceRecords({ limit: 100 })
      .then((res) => {
        const arr = Array.isArray(res) ? res : (res?.data || []);
        setAttendanceRecords(arr);
      })
      .catch(() => setAttendanceError('فشل تحميل بيانات الحضور'))
      .finally(() => setAttendanceLoading(false));
  }, [activeReport]);

  // جلب بيانات المستخدمين المفقودين في الحضور
  useEffect(() => {
    if (!attendanceRecords || attendanceRecords.length === 0) return;
    const userService = new UserService();
    // استخرج كل userId غير الموجود في users
    const missingUserIds = Array.from(new Set(
      attendanceRecords
        .map((a) => a.userId)
        .filter((id) => id && !users.some((u) => u._id === id))
    ));
    if (missingUserIds.length === 0) return;
    Promise.all(
      missingUserIds.map((id) =>
        userService.getUser(id).catch(() => null)
      )
    ).then((fetched) => {
      // فلتر أكثر أماناً
      const validUsers = fetched.filter((u): u is any => !!u && !!u._id);
      if (validUsers.length > 0) {
        setUsers((prev) => ([...prev, ...validUsers.filter((u) => !prev.some((p) => p._id === u._id))]));
      }
    });
  }, [attendanceRecords, users]);

  const attendanceStats = useMemo(() => {
    if (!attendanceRecords || attendanceRecords.length === 0) return null;
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((a) => a.status === 'present').length;
    const absent = attendanceRecords.filter((a) => a.status === 'absent').length;
    const excused = attendanceRecords.filter((a) => a.status === 'excused').length;
    const attendanceRate = ((present / total) * 100).toFixed(1);
    // Top members by attendance
    const memberAttendance: Record<string, number> = {};
    attendanceRecords.forEach((a) => {
      memberAttendance[a.userId] = (memberAttendance[a.userId] || 0) + (a.status === 'present' ? 1 : 0);
    });
    const topMembers = Object.entries(memberAttendance)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([userId, count]) => ({ userId, count }));
    return { total, present, absent, excused, attendanceRate, topMembers, latest: attendanceRecords.slice(0, 3) };
  }, [attendanceRecords]);

  // --- الولاء ---
  const { loyaltyStats, loading: loyaltyLoading } = useLoyaltyStats();

  // --- حساب الإحصائيات ---
  // المالية: سنعرض ملخص الشهر الحالي فقط (يمكنك تطويره لاحقاً)
  let financialData = null;
  if (financialSummary && financialSummary.monthly && financialSummary.monthly.length > 0) {
    const latest = financialSummary.monthly[financialSummary.monthly.length - 1];
    const prev = financialSummary.monthly.length > 1 ? financialSummary.monthly[financialSummary.monthly.length - 2] : null;
    const growth = prev ? (((latest.revenue - prev.revenue) / (prev.revenue || 1)) * 100).toFixed(1) : '0';
    financialData = {
      monthly: {
        revenue: latest.revenue,
        expenses: latest.expense,
        profit: latest.netProfit,
        growth: growth,
      },
      // يمكنك إضافة weekly/daily لو backend يدعم
    };
  }

  // المستخدمين
  const userStats = useMemo(() => {
    if (!users || users.length === 0) return null;
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const inactive = users.filter((u) => u.status === 'inactive').length;
    const now = new Date();
    const newThisMonth = users.filter((u) => {
      const created = new Date(u.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
    const growth = ((newThisMonth / (total || 1)) * 100).toFixed(1);
    return { total, active, inactive, newThisMonth, growth };
  }, [users]);

  // الحصص
  const sessionStats = useMemo(() => {
    if (!sessions || sessions.length === 0) return null;
    const total = sessions.length;
    const completed = sessions.filter((s) => s.status === 'مكتملة').length;
    const upcoming = sessions.filter((s) => s.status === 'مجدولة').length;
    const cancelled = sessions.filter((s) => s.status === 'ملغاة').length;
    const revenue = sessions.reduce((sum, s) => sum + (s.price || 0), 0);
    return { total, completed, upcoming, cancelled, revenue };
  }, [sessions]);

  // Helper: get user info by id
  const getUserInfo = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return { name: `غير معروف (${userId})`, phone: '' };
    return { name: user.name, phone: user.phone || '' };
  };

  // --- التقارير ---
  const reports = [
    { id: 'financial', name: 'التقارير المالية', icon: '💰', description: 'تقارير شاملة عن الإيرادات والمصروفات والأرباح' },
    { id: 'users', name: 'تقارير المستخدمين', icon: '👥', description: 'إحصائيات مفصلة عن الأعضاء والمدربين' },
    { id: 'sessions', name: 'تقارير الحصص', icon: '🏋️', description: 'تحليل شامل للحصص التدريبية والإيرادات' },
    { id: 'plans', name: 'تقارير الخطط', icon: '📋', description: 'تقييم أداء خطط التمرين والغذائية' },
    { id: 'attendance', name: 'تقارير الحضور', icon: '📅', description: 'متابعة حضور الأعضاء وتقييم الالتزام' },
    { id: 'loyalty', name: 'تقارير نقاط الولاء', icon: '⭐', description: 'تحليل نظام نقاط الولاء والاسترداد' },
  ];

  return (
    <div className="space-y-6">
      {/* Report Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">أنواع التقارير</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`p-4 rounded-lg border-2 text-right transition-all ${activeReport === report.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{report.icon}</span>
                <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* المالية */}
        {activeReport === 'financial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">التقارير المالية</h3>
            {financialLoading ? (
              <div className="text-center py-8 text-blue-600">جاري التحميل...</div>
            ) : financialError ? (
              <div className="text-center py-8 text-red-600">{financialError}</div>
            ) : !financialData ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات مالية متاحة</div>
            ) : (
              <>
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">الإيرادات</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ج.م{financialData.monthly.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      +{financialData.monthly.growth}% من الشهر الماضي
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">المصروفات</h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ج.م{financialData.monthly.expenses.toLocaleString()}
                    </p>
                    {/* لا يوجد نمو المصروفات في الداتا الحقيقية هنا */}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">الربح الصافي</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ج.م{financialData.monthly.profit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* المستخدمين */}
        {activeReport === 'users' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير المستخدمين</h3>
            {usersLoading && !usersLoaded ? (
              <div className="text-center py-8 text-blue-600">جاري التحميل...</div>
            ) : usersError ? (
              <div className="text-center py-8 text-red-600">{usersError}</div>
            ) : usersLoaded && users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات مستخدمين متاحة</div>
            ) : !userStats ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات مستخدمين متاحة</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">👥</span>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">إجمالي المستخدمين</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.total}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">✅</span>
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">النشطين</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.active}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">🚫</span>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">غير النشطين</h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{userStats.inactive}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">🆕</span>
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">جدد هذا الشهر</h4>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.newThisMonth}</p>
                  </div>
                </div>
                {/* جدول أحدث الأعضاء */}
                <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
                        <th className="py-2 px-4">الاسم</th>
                        <th className="py-2 px-4">الإيميل</th>
                        <th className="py-2 px-4">رقم الهاتف</th>
                        <th className="py-2 px-4">الحالة</th>
                        <th className="py-2 px-4">تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .slice()
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 8)
                        .map((user) => (
                          <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="py-2 px-4 font-medium">{user.name}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">{user.phone || '-'}</td>
                            <td className="py-2 px-4">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {user.status === 'active' ? 'نشط' : 'غير نشط'}
                              </span>
                            </td>
                            <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* الحصص */}
        {activeReport === 'sessions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير الحصص</h3>
            {sessionsLoading ? (
              <div className="text-center py-8 text-blue-600">جاري التحميل...</div>
            ) : sessionsError ? (
              <div className="text-center py-8 text-red-600">{sessionsError}</div>
            ) : !sessionStats ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات حصص متاحة</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">إجمالي الحصص</h4>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sessionStats.total}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">المكتملة</h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionStats.completed}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">القادمة</h4>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{sessionStats.upcoming}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">إيرادات الحصص</h4>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">ج.م{sessionStats.revenue}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* الخطط */}
        {activeReport === 'plans' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير الخطط</h3>
            {plansLoading ? (
              <div className="text-center py-8 text-blue-600">جاري التحميل...</div>
            ) : plansError ? (
              <div className="text-center py-8 text-red-600">{plansError}</div>
            ) : !plansStats ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات خطط متاحة</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">🏋️</span>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">إجمالي خطط التمرين</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plansStats.totalWorkout}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">✅</span>
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">الخطط النشطة (تمرين)</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{plansStats.activeWorkout}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">⏰</span>
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">الخطط المنتهية (تمرين)</h4>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{plansStats.endedWorkout}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">🥗</span>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">إجمالي خطط التغذية</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plansStats.totalDiet}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">✅</span>
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">الخطط النشطة (غذائية)</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{plansStats.activeDiet}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">⏰</span>
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">الخطط المنتهية (غذائية)</h4>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{plansStats.endedDiet}</p>
                  </div>
                </div>
                {/* أحدث الخطط */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">أحدث خطط التمرين</h4>
                  <ul className="list-disc pr-6 text-sm text-gray-700 dark:text-gray-300">
                    {plansStats.latestWorkout.map((plan: any) => {
                      const info = getUserInfo(plan.userId);
                      return (
                        <li key={plan._id}>{plan.planName} - {info.name} {info.phone && `(${info.phone})`}</li>
                      );
                    })}
                  </ul>
                  <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">أحدث خطط التغذية</h4>
                  <ul className="list-disc pr-6 text-sm text-gray-700 dark:text-gray-300">
                    {plansStats.latestDiet.map((plan: any) => {
                      const info = getUserInfo(plan.userId);
                      return (
                        <li key={plan._id}>{plan.planName} - {info.name} {info.phone && `(${info.phone})`}</li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
        {/* الحضور */}
        {activeReport === 'attendance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير الحضور</h3>
            {attendanceLoading ? (
              <div className="text-center py-8 text-blue-600">جاري التحميل...</div>
            ) : attendanceError ? (
              <div className="text-center py-8 text-red-600">{attendanceError}</div>
            ) : !attendanceStats ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات حضور متاحة</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">📅</span>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">إجمالي السجلات</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{attendanceStats.total}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">✅</span>
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">الحضور</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{attendanceStats.present}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">🚫</span>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">الغياب</h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{attendanceStats.absent}</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">📝</span>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">إعفاءات</h4>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{attendanceStats.excused}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center">
                    <span className="text-3xl mb-2">📈</span>
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">نسبة الالتزام</h4>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{attendanceStats.attendanceRate}%</p>
                  </div>
                </div>
                {/* Top members */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">الأعضاء الأكثر التزامًا</h4>
                  <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
                        <th className="py-2 px-4">الاسم</th>
                        <th className="py-2 px-4">رقم الهاتف</th>
                        <th className="py-2 px-4">عدد الحضور</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceStats.topMembers.map((m: any) => {
                        const info = getUserInfo(m.userId);
                        return (
                          <tr key={m.userId} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="py-2 px-4 font-medium">{info.name}</td>
                            <td className="py-2 px-4">{info.phone || '-'}</td>
                            <td className="py-2 px-4">{m.count}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">أحدث سجلات الحضور</h4>
                  <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
                        <th className="py-2 px-4">الاسم</th>
                        <th className="py-2 px-4">رقم الهاتف</th>
                        <th className="py-2 px-4">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceStats.latest.map((a: any) => {
                        const info = getUserInfo(a.userId);
                        return (
                          <tr key={a._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="py-2 px-4 font-medium">{info.name}</td>
                            <td className="py-2 px-4">{info.phone || '-'}</td>
                            <td className="py-2 px-4">{a.status === 'present' ? 'حضور' : a.status === 'absent' ? 'غياب' : 'إعفاء'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
        {/* الولاء */}
        {activeReport === 'loyalty' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تقارير نقاط الولاء</h3>
            {loyaltyLoading ? (
              <div className="text-center py-8 text-blue-600">جاري التحميل...</div>
            ) : !loyaltyStats ? (
              <div className="text-center py-8 text-gray-500">لا توجد بيانات ولاء متاحة</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">إجمالي النقاط</h4>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{loyaltyStats.stats.totalPoints}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">عدد المستخدمين</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{loyaltyStats.stats.totalUsers}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">متوسط النقاط</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{loyaltyStats.stats.avgPoints}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">أعلى نقاط</h4>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{loyaltyStats.stats.maxPoints}</p>
                  </div>
                </div>
                {/* Top users */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">أعلى المستخدمين بالنقاط</h4>
                  <ul className="list-disc pr-6 text-sm text-gray-700 dark:text-gray-300">
                    {loyaltyStats.topUsers?.slice(0, 5).map((u: any) => (
                      <li key={u._id}>{u.name} - {u.loyaltyPoints} نقطة</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* Export Options */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">تصدير التقرير</h4>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              تصدير PDF
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
              تصدير Excel
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
              تصدير CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
