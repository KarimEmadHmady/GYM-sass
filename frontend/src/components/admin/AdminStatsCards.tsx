'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { UserService } from '@/services/userService';
import { useLoyaltyStats } from '@/hooks/useLoyaltyStats';
import { expenseService, revenueService } from '@/services';
import { getAllFeedback } from '@/services/feedbackService';
import { SessionScheduleService } from '@/services/sessionScheduleService';
import type { Feedback } from '@/types/models';
import type { SessionSchedule } from '@/types/models';

const userService = new UserService();
const sessionScheduleService = new SessionScheduleService();

const AdminStatsCards = () => {
  const t = useTranslations('AdminDashboard.Stats');
  const { loyaltyStats, loading: loyaltyLoading } = useLoyaltyStats();
  const [usersCount, setUsersCount] = useState<number>(0);
  const [trainersCount, setTrainersCount] = useState<number>(0);
  const [sessionsToday, setSessionsToday] = useState<number>(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [revMonth, setRevMonth] = useState<number>(0);
  const [expMonth, setExpMonth] = useState<number>(0);
  const [profitMonth, setProfitMonth] = useState<number>(0);
  const [monthlySeries, setMonthlySeries] = useState<Array<{ month: string; revenue: number; expense: number }>>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [newReviewsCount, setNewReviewsCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Users and trainers
        const usersRes = await userService.getUsers({ limit: 1000 });
        const usersArr = Array.isArray(usersRes) ? usersRes as any[] : (usersRes as any)?.data || [];
        setUsersCount(usersArr.length || 0);
        setTrainersCount(usersArr.filter((u: any) => u.role === 'trainer').length || 0);

        // جلب ملخص الإيرادات والمصروفات الشهرية من الخدمات مباشرة
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0,10); // 6 شهور للخلف
        const to = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59,999).toISOString().slice(0,10);
        const [revSum, expSum] = await Promise.all([
          revenueService.summary({ from, to, sort: 'asc' }),
          expenseService.summary({ from, to, sort: 'asc' })
        ]);
        setRevMonth((revSum?.totals?.revenue) || 0);
        setExpMonth((expSum?.totals?.expense) || 0);
        setProfitMonth(((revSum?.totals?.revenue) || 0) - ((expSum?.totals?.expense) || 0));

        // بناء monthlySeries من البيانات الشهرية
        const monthsBack = 6;
        const monthly: Array<{ month: string; revenue: number; expense: number }> = [];
        for (let i = monthsBack-1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const year = d.getFullYear();
          const month = d.getMonth() + 1;
          const label = `${String(month).padStart(2,'0')}/${String(year).slice(2)}`;
          const rev = (revSum?.monthly || []).find((m:any) => m.year === year && m.month === month)?.revenue || 0;
          const exp = (expSum?.monthly || []).find((m:any) => m.year === year && m.month === month)?.expense || 0;
          monthly.push({ month: label, revenue: rev, expense: exp });
        }
        // إذا لم توجد بيانات، استخدم بيانات وهمية
        const fewNonZero = monthly.filter(s => (s.revenue || 0) > 0 || (s.expense || 0) > 0).length;
        const fakeSeries = [
          { month: '11/24', revenue: 12000, expense: 8000 },
          { month: '12/24', revenue: 15000, expense: 9000 },
          { month: '01/25', revenue: 18000, expense: 11000 },
          { month: '02/25', revenue: 17000, expense: 9500 },
          { month: '03/25', revenue: 21000, expense: 12000 },
          { month: '04/25', revenue: 25000, expense: 14000 },
        ];
        setMonthlySeries(fewNonZero <= 1 ? fakeSeries : monthly);
      } catch (error) {
        setMonthlySeries([
          { month: '11/24', revenue: 12000, expense: 8000 },
          { month: '12/24', revenue: 15000, expense: 9000 },
          { month: '01/25', revenue: 18000, expense: 11000 },
          { month: '02/25', revenue: 17000, expense: 9500 },
          { month: '03/25', revenue: 21000, expense: 12000 },
          { month: '04/25', revenue: 25000, expense: 14000 },
        ]);
      } finally {
        setUsersLoading(false);
      }
    })();
  }, []);

  // جلب التقييمات الجديدة ومتوسط التقييمات
  useEffect(() => {
    (async () => {
      setFeedbackLoading(true);
      try {
        const feedbackList = await getAllFeedback();
        setFeedbacks(feedbackList);
        // تقييمات الشهر الحالي
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const newReviews = feedbackList.filter(fb => {
          const d = new Date(fb.date);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        });
        setNewReviewsCount(newReviews.length);
        // متوسط التقييمات
        const avg = feedbackList.length
          ? feedbackList.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbackList.length
          : 0;
        setAvgRating(avg);
      } catch (e) {
        setNewReviewsCount(0);
        setAvgRating(0);
      } finally {
        setFeedbackLoading(false);
      }
    })();
  }, []);

  // جلب عدد الحصص اليومية
  useEffect(() => {
    (async () => {
      setSessionsLoading(true);
      try {
        const allSessions: SessionSchedule[] = await sessionScheduleService.getAllSessions();
        const todayStr = new Date().toISOString().split('T')[0];
        const todaySessions = allSessions.filter(s => {
          const sessionDate = new Date(s.date).toISOString().split('T')[0];
          return sessionDate === todayStr;
        });
        setSessionsToday(todaySessions.length);
      } catch (e) {
        setSessionsToday(0);
      } finally {
        setSessionsLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      title: t('totalMembers'),
      value: usersLoading ? '...' : usersCount.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    {
      title: t('activeTrainers'),
      value: usersLoading ? '...' : trainersCount.toLocaleString(),
      change: '+3',
      changeType: 'positive',
      icon: '🏋️',
      color: 'green'
    },
    {
      title: t('dailySessions'),
      value: sessionsLoading ? '...' : sessionsToday.toLocaleString(),
      change: '+15%',
      changeType: 'positive',
      icon: '📅',
      color: 'purple'
    },
    {
      title: t('monthlyRevenue'),
      value: `ج.م${new Intl.NumberFormat().format(revMonth)}`,
      change: '+8%',
      changeType: 'positive',
      icon: '💰',
      color: 'yellow'
    },
    {
      title: t('monthlyExpenses'),
      value: `ج.م${new Intl.NumberFormat().format(expMonth)}`,
      change: '+5%',
      changeType: 'negative',
      icon: '💸',
      color: 'red'
    },
    {
      title: t('netProfit'),
      value: `ج.م${new Intl.NumberFormat().format(profitMonth)}`,
      change: '+12%',
      changeType: 'positive',
      icon: '📈',
      color: 'green'
    },
    {
      title: t('loyaltyPoints'),
      value: loyaltyLoading ? '...' : (loyaltyStats?.stats?.totalPoints || 0).toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: '⭐',
      color: 'indigo'
    },
    {
      title: t('newReviews'),
      value: feedbackLoading ? '...' : newReviewsCount.toLocaleString(),
      change: avgRating ? `${avgRating.toFixed(1)} ★` : '',
      changeType: 'positive',
      icon: '💬',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    {t('sinceLastMonth')}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center text-white text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini charts: Revenue vs Expense last 6 months */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">الإيرادات مقابل المصروفات (آخر 6 أشهر)</h4>
        </div>
        <div className="w-full overflow-x-auto">
          {(() => {
            const maxVal = Math.max(...monthlySeries.flatMap(m => [m.revenue, m.expense]), 0);
            return (
              <div className="min-w-[560px]">
                <div className="h-48 flex items-end gap-4 px-2">
                  {monthlySeries.map((m, idx) => {
                    const revPct = maxVal > 0 ? Math.round((m.revenue / maxVal) * 100) : 0;
                    const expPct = maxVal > 0 ? Math.round((m.expense / maxVal) * 100) : 0;
                    return (
                      <div key={`${m.month}-${idx}`} className="flex-1 flex flex-col items-center">
                        <div className="w-full h-40 flex items-end gap-1">
                          <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t">
                            <div className="w-full bg-blue-600 dark:bg-blue-500 rounded-t" style={{ height: `${revPct}%` }} title={`Revenue ج.م${new Intl.NumberFormat().format(m.revenue)}`} />
                          </div>
                          <div className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-t">
                            <div className="w-full bg-red-600 dark:bg-red-500 rounded-t" style={{ height: `${expPct}%` }} title={`Expense ج.م${new Intl.NumberFormat().format(m.expense)}`} />
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">{m.month}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCards;
