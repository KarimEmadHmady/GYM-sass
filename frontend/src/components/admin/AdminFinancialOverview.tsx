
 'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { RevenueService } from '@/services/revenueService';
import { ExpenseService } from '@/services/expenseService';
import { invoiceService } from '@/services';
import { payrollService } from '@/services';
import { revenueService } from '@/services';
import { expenseService } from '@/services';
import { userService } from '@/services';

const AdminFinancialOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const t = useTranslations();
  
  // State للبيانات الحقيقية
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPageSize] = useState(10);
  
  // State للتقارير المالية
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<{
    invoices: any;
    payrolls: any;
    revenues: any;
    expenses: any;
    summary: any;
  } | null>(null);

  // State لبيانات المستخدمين
  const [users, setUsers] = useState<any[]>([]);
  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    users.forEach(u => { map[u._id] = u; });
    return map;
  }, [users]);

  const financialData = {
    revenue: { monthly: 45678, weekly: 11420, daily: 1631, growth: 8.5 },
    expenses: { monthly: 12345, weekly: 3086, daily: 441, growth: 5.2 },
    profit: { monthly: 33333, weekly: 8333, daily: 1190, growth: 12.3 },
  };
  const [metrics, setMetrics] = useState({
    revenue: { monthly: 0, growth: 0 },
    expenses: { monthly: 0, growth: 0 },
    profit: { monthly: 0, growth: 0 },
  });

  // Pagination calculations for transactions
  const transactionsPageCount = Math.max(1, Math.ceil(recentTransactions.length / transactionsPageSize));
  const transactionsStartIndex = (transactionsCurrentPage - 1) * transactionsPageSize;
  const transactionsEndIndex = Math.min(transactionsStartIndex + transactionsPageSize, recentTransactions.length);
  const paginatedTransactions = recentTransactions.slice(transactionsStartIndex, transactionsEndIndex);

  // Reset to first page when transactions are loaded
  React.useEffect(() => {
    setTransactionsCurrentPage(1);
  }, [recentTransactions.length]);

  React.useEffect(() => {
    const revenueService = new RevenueService();
    const expenseService = new ExpenseService();

    const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    const toISODate = (d: Date) => d.toISOString().split('T')[0];

    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevStart = startOfMonth(prev);
    const prevEnd = endOfMonth(prev);

    const from = toISODate(prevStart);
    const to = toISODate(currentEnd);

    Promise.all([
      revenueService.summary({ from, to, sort: 'asc' }),
      expenseService.summary({ from, to, sort: 'asc' }),
    ])
      .then(([revSummary, expSummary]) => {
        const findMonth = (arr: any[], y: number, m: number, key: 'revenue' | 'expense') => {
          const item = arr.find((i) => i.year === y && i.month === m);
          return item ? item[key] : 0;
        };

        const yCur = now.getFullYear();
        const mCur = now.getMonth() + 1;
        const yPrev = prev.getFullYear();
        const mPrev = prev.getMonth() + 1;

        const revenueCurrent = findMonth(revSummary.monthly || [], yCur, mCur, 'revenue');
        const revenuePrev = findMonth(revSummary.monthly || [], yPrev, mPrev, 'revenue');
        const expenseCurrent = findMonth(expSummary.monthly || [], yCur, mCur, 'expense');
        const expensePrev = findMonth(expSummary.monthly || [], yPrev, mPrev, 'expense');

        const profitCurrent = revenueCurrent - expenseCurrent;
        const profitPrev = revenuePrev - expensePrev;

        const growth = (curr: number, prevVal: number) => (prevVal > 0 ? ((curr - prevVal) / prevVal) * 100 : 0);

        setMetrics({
          revenue: { monthly: revenueCurrent, growth: growth(revenueCurrent, revenuePrev) },
          expenses: { monthly: expenseCurrent, growth: growth(expenseCurrent, expensePrev) },
          profit: { monthly: profitCurrent, growth: growth(profitCurrent, profitPrev) },
        });
      })
      .catch(() => {
        // leave zeros on error
      });
  }, []);

  // دالة لجلب البيانات الحقيقية
  const loadRecentTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoices, payrolls, revenues, expenses] = await Promise.all([
        invoiceService.getInvoices({ limit: 5, sort: 'desc' }),
        payrollService.list({ limit: 5, sort: 'desc' }),
        revenueService.list({ limit: 5, sort: 'desc' }),
        expenseService.list({ limit: 5, sort: 'desc' })
      ]);

      const transactions: any[] = [];

      // إضافة الفواتير
      const invoiceResults = Array.isArray(invoices) ? invoices : (invoices as any).results;
      if (invoiceResults) {
        invoiceResults.forEach((invoice: any) => {
          transactions.push({
            id: `invoice_${invoice._id}`,
            type: 'revenue',
            description: `فاتورة #${invoice.invoiceNumber || invoice._id}`,
            amount: invoice.totalAmount || 0,
            date: invoice.createdAt ? new Date(invoice.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: 'invoice',
            source: 'invoice'
          });
        });
      }

      // إضافة الرواتب
      if (payrolls.results) {
        payrolls.results.forEach((payroll: any) => {
          transactions.push({
            id: `payroll_${payroll._id}`,
            type: 'expense',
            description: `راتب - ${payroll.employeeId || 'موظف'}`,
            amount: -(payroll.salaryAmount || 0),
            date: payroll.paymentDate ? new Date(payroll.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: 'payroll',
            source: 'payroll'
          });
        });
      }

      // إضافة الإيرادات
      if (revenues.results) {
        revenues.results.forEach((revenue: any) => {
          transactions.push({
            id: `revenue_${revenue._id}`,
            type: 'revenue',
            description: revenue.notes || 'إيراد',
            amount: revenue.amount || 0,
            date: revenue.date ? new Date(revenue.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: revenue.sourceType || 'other',
            source: 'revenue'
          });
        });
      }

      // إضافة المصروفات
      if (expenses.results) {
        expenses.results.forEach((expense: any) => {
          transactions.push({
            id: `expense_${expense._id}`,
            type: 'expense',
            description: expense.description || 'مصروف',
            amount: -(expense.amount || 0),
            date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: expense.category || 'other',
            source: 'expense'
          });
        });
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // أخذ آخر 10 معاملات
      setRecentTransactions(transactions.slice(0, 10));
    } catch (e: any) {
      setError(e?.message || 'فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // دالة لجلب بيانات التقارير المالية
  const loadReportsData = async () => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const [invoices, payrolls, revenues, expenses] = await Promise.all([
        invoiceService.getInvoices({ limit: 100, sort: 'desc' }),
        payrollService.list({ limit: 100, sort: 'desc' }),
        revenueService.list({ limit: 100, sort: 'desc' }),
        expenseService.list({ limit: 100, sort: 'desc' })
      ]);

      // حساب الإحصائيات
      const invoiceResults = Array.isArray(invoices) ? invoices : (invoices as any).results || [];
      const payrollResults = payrolls.results || [];
      const revenueResults = revenues.results || [];
      const expenseResults = expenses.results || [];

      // إحصائيات الفواتير
      const invoiceStats = {
        total: invoiceResults.length,
        paid: invoiceResults.filter((inv: any) => inv.status === 'paid').length,
        pending: invoiceResults.filter((inv: any) => inv.status === 'pending').length,
        overdue: invoiceResults.filter((inv: any) => inv.status === 'overdue').length,
        totalAmount: invoiceResults.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
        paidAmount: invoiceResults
          .filter((inv: any) => inv.status === 'paid')
          .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
        pendingAmount: invoiceResults
          .filter((inv: any) => inv.status === 'pending')
          .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
        overdueAmount: invoiceResults
          .filter((inv: any) => inv.status === 'overdue')
          .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
        data: invoiceResults
      };

      // إحصائيات الرواتب
      const payrollStats = {
        total: payrollResults.length,
        totalAmount: payrollResults.reduce((sum: number, payroll: any) => sum + (payroll.salaryAmount || 0), 0),
        totalBonuses: payrollResults.reduce((sum: number, payroll: any) => sum + (payroll.bonuses || 0), 0),
        totalDeductions: payrollResults.reduce((sum: number, payroll: any) => sum + (payroll.deductions || 0), 0),
        netAmount: payrollResults.reduce((sum: number, payroll: any) => 
          sum + (payroll.salaryAmount || 0) + (payroll.bonuses || 0) - (payroll.deductions || 0), 0),
        data: payrollResults
      };

      // إحصائيات الإيرادات
      const revenueStats = {
        total: revenueResults.length,
        totalAmount: revenueResults.reduce((sum: number, rev: any) => sum + (rev.amount || 0), 0),
        bySource: revenueResults.reduce((acc: any, rev: any) => {
          const source = rev.sourceType || 'other';
          acc[source] = (acc[source] || 0) + (rev.amount || 0);
          return acc;
        }, {}),
        byPaymentMethod: revenueResults.reduce((acc: any, rev: any) => {
          const method = rev.paymentMethod || 'cash';
          acc[method] = (acc[method] || 0) + (rev.amount || 0);
          return acc;
        }, {}),
        data: revenueResults
      };

      // إحصائيات المصروفات
      const expenseStats = {
        total: expenseResults.length,
        totalAmount: expenseResults.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0),
        byCategory: expenseResults.reduce((acc: any, exp: any) => {
          const category = exp.category || 'other';
          acc[category] = (acc[category] || 0) + (exp.amount || 0);
          return acc;
        }, {}),
        data: expenseResults
      };

      // التقرير الشامل
      const summaryStats = {
        totalRevenue: revenueStats.totalAmount,
        totalExpenses: expenseStats.totalAmount + payrollStats.netAmount,
        netProfit: revenueStats.totalAmount - (expenseStats.totalAmount + payrollStats.netAmount),
        totalInvoices: invoiceStats.totalAmount,
        paidInvoices: invoiceStats.paidAmount,
        pendingInvoices: invoiceStats.pendingAmount,
        overdueInvoices: invoiceStats.overdueAmount,
        profitMargin: revenueStats.totalAmount > 0 ? 
          ((revenueStats.totalAmount - (expenseStats.totalAmount + payrollStats.netAmount)) / revenueStats.totalAmount) * 100 : 0
      };

      setReportsData({
        invoices: invoiceStats,
        payrolls: payrollStats,
        revenues: revenueStats,
        expenses: expenseStats,
        summary: summaryStats
      });
    } catch (e: any) {
      setReportsError(e?.message || 'فشل في تحميل بيانات التقارير');
    } finally {
      setReportsLoading(false);
    }
  };

  // دالة لجلب بيانات المستخدمين
  const loadUsers = async () => {
    try {
      const res = await userService.getUsers({ limit: 500 });
      const list = Array.isArray(res) ? res : [];
      setUsers(list);
    } catch (e) {
      console.error('Failed to load users:', e);
    }
  };

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    loadRecentTransactions();
    loadUsers();
  }, []);
  
  const summaryData = {
    invoices: {
      totalCount: 125,
      dueCount: 12,
      totalAmount: 27890,
    },
    payroll: {
      employeesCount: 24,
      monthAmount: 56000,
      lastRun: '2024-01-25',
    },
    revenue: {
      thisMonth: financialData.revenue.monthly,
      growth: financialData.revenue.growth,
    },
    expenses: {
      thisMonth: financialData.expenses.monthly,
      growth: financialData.expenses.growth,
    },
  };


  const getTransactionIcon = (type: string) => {
    return type === 'revenue' ? '💰' : '💸';
  };

  const getTransactionColor = (type: string) => {
    return type === 'revenue' ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryText = (category: string) => {
    return t(`AdminFinancialOverview.categories.${category}`);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الإيرادات الشهرية</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">ج.م{metrics.revenue.monthly.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{metrics.revenue.growth >= 0 ? '+' : ''}{metrics.revenue.growth.toFixed(1)}% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              💰
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المصروفات الشهرية</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">ج.م{metrics.expenses.monthly.toLocaleString()}</p>
              <p className="text-sm text-red-600 dark:text-red-400">{metrics.expenses.growth >= 0 ? '+' : ''}{metrics.expenses.growth.toFixed(1)}% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl">
              💸
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">صافي الربح الشهري</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">ج.م{metrics.profit.monthly.toLocaleString()}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{metrics.profit.growth >= 0 ? '+' : ''}{metrics.profit.growth.toFixed(1)}% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: 'overview',
                name: 'نظرة عامة',
                icon: '📊',
              },
              {
                id: 'transactions',
                name: 'المعاملات الأخيرة',
                icon: '💳',
              },
              {
                id: 'reports',
                name: 'التقارير',
                icon: '📈',
              },
              {
                id: 'invoices',
                name: 'الفواتير',
                icon: '🧾',
              },
              {
                id: 'payroll',
                name: 'الرواتب',
                icon: '🧑\u200d💼',
              },
              {
                id: 'revenue',
                name: 'الإيرادات',
                icon: '💹',
              },
              {
                id: 'expenses',
                name: 'المصروفات',
                icon: '💸',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('AdminFinancialOverview.overviewTitle')}
              </h3>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">🧾 الفواتير</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ج.م{summaryData.invoices.totalAmount.toLocaleString()}
                      </p>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>إجمالي: {summaryData.invoices.totalCount}</p>
                        <p>المستحقة: {summaryData.invoices.dueCount}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                      🧾
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">🧑‍💼 الرواتب</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ج.م{summaryData.payroll.monthAmount.toLocaleString()}
                      </p>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>عدد الموظفين: {summaryData.payroll.employeesCount}</p>
                        <p>آخر تشغيل: {summaryData.payroll.lastRun}</p>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white text-xl">
                      🧑‍💼
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">💹 الإيرادات</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ج.م{summaryData.revenue.thisMonth.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">+{summaryData.revenue.growth}% هذا الشهر</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
                      💹
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">💸 المصروفات</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ج.م{summaryData.expenses.thisMonth.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">+{summaryData.expenses.growth}% هذا الشهر</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl">
                      💸
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.revenues')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.monthly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.revenue.monthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.weekly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.revenue.weekly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.daily')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.revenue.daily.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('AdminFinancialOverview.expenses')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.monthly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.expenses.monthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.weekly')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.expenses.weekly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('AdminFinancialOverview.daily')}
                      </span>
                      <span className="font-medium">
                        ج.م{financialData.expenses.daily.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                المعاملات الأخيرة
                </h3>
                <button 
                  onClick={loadRecentTransactions}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'جارِ التحميل...' : 'تحديث'}
                </button>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
              
              {loading && recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  جارِ تحميل المعاملات...
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد معاملات حديثة
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getCategoryText(transaction.category)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${getTransactionColor(
                          transaction.type,
                        )}`}
                      >
                        {transaction.amount > 0 ? '+' : ''}ج.م
                        {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                ))}
                </div>
              )}
              
              {recentTransactions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    عرض {transactionsStartIndex + 1} إلى {transactionsEndIndex} من {recentTransactions.length} نتيجة
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50"
                      onClick={() => setTransactionsCurrentPage(p => Math.max(1, p - 1))}
                      disabled={transactionsCurrentPage === 1}
                    >
                      السابق
                    </button>
                    <span>
                      صفحة {transactionsCurrentPage} من {transactionsPageCount}
                    </span>
                    <button
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50"
                      onClick={() => setTransactionsCurrentPage(p => Math.min(transactionsPageCount, p + 1))}
                      disabled={transactionsCurrentPage === transactionsPageCount}
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  التقارير المالية الشاملة
                </h3>
                <button 
                  onClick={loadReportsData}
                  disabled={reportsLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {reportsLoading ? 'جارِ التحميل...' : 'تحديث التقارير'}
                </button>
              </div>

              {reportsError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {reportsError}
                </div>
              )}

              {reportsLoading && !reportsData ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              جارِ تحميل التقارير المالية...
                            </div>
              ) : reportsData ? (
                <div className="space-y-6">
                  {/* أزرار اختيار التقرير */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button 
                      onClick={() => setSelectedReport('invoices')}
                      className={`p-3 rounded-lg border transition-colors text-right ${
                        selectedReport === 'invoices' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">🧾</div>
                      <div className="font-medium text-sm">الفواتير</div>
                    </button>
                    <button 
                      onClick={() => setSelectedReport('payrolls')}
                      className={`p-3 rounded-lg border transition-colors text-right ${
                        selectedReport === 'payrolls' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">🧑‍💼</div>
                      <div className="font-medium text-sm">الرواتب</div>
                    </button>
                    <button 
                      onClick={() => setSelectedReport('revenues')}
                      className={`p-3 rounded-lg border transition-colors text-right ${
                        selectedReport === 'revenues' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">💹</div>
                      <div className="font-medium text-sm">الإيرادات</div>
                    </button>
                    <button 
                      onClick={() => setSelectedReport('expenses')}
                      className={`p-3 rounded-lg border transition-colors text-right ${
                        selectedReport === 'expenses' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">💸</div>
                      <div className="font-medium text-sm">المصروفات</div>
                    </button>
                    <button 
                      onClick={() => setSelectedReport('summary')}
                      className={`p-3 rounded-lg border transition-colors text-right ${
                        selectedReport === 'summary' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">📊</div>
                      <div className="font-medium text-sm">التقرير الشامل</div>
                    </button>
                  </div>

                  {/* عرض التقرير المحدد */}
                  {selectedReport && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      {selectedReport === 'invoices' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            🧾 تقرير الفواتير
                          </h4>
                          
                          {/* إحصائيات الفواتير */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{reportsData.invoices.total}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي الفواتير</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">{reportsData.invoices.paid}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">مدفوعة</div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                              <div className="text-2xl font-bold text-yellow-600">{reportsData.invoices.pending}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">معلقة</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                              <div className="text-2xl font-bold text-red-600">{reportsData.invoices.overdue}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">متأخرة</div>
                            </div>
                          </div>

                          {/* المبالغ المالية */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-white-900 mb-2">المبالغ المالية</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">إجمالي الفواتير:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.invoices.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                  <span>المدفوع:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.invoices.paidAmount)}</span>
                                </div>
                                <div className="flex justify-between text-yellow-600">
                                  <span>المعلق:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.invoices.pendingAmount)}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                  <span>المتأخر:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.invoices.overdueAmount)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-white-900 mb-2">نسب التحصيل</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة التحصيل:</span>
                                  <span className="font-medium">
                                    {reportsData.invoices.totalAmount > 0 
                                      ? ((reportsData.invoices.paidAmount / reportsData.invoices.totalAmount) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة المعلق:</span>
                                  <span className="font-medium">
                                    {reportsData.invoices.totalAmount > 0 
                                      ? ((reportsData.invoices.pendingAmount / reportsData.invoices.totalAmount) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة المتأخر:</span>
                                  <span className="font-medium">
                                    {reportsData.invoices.totalAmount > 0 
                                      ? ((reportsData.invoices.overdueAmount / reportsData.invoices.totalAmount) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* قائمة الفواتير */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b">
                              <h5 className="font-medium text-gray-900">آخر الفواتير</h5>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {reportsData.invoices.data.slice(0, 10).map((invoice: any, index: number) => (
                                <div key={invoice._id || index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      invoice.status === 'paid' ? 'bg-green-500' :
                                      invoice.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                    <div>
                                      <div className="font-medium">فاتورة #{invoice.invoiceNumber || invoice._id}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {userMap[invoice.userId]?.name || invoice.userId} • {new Date(invoice.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">ج.م{new Intl.NumberFormat().format(invoice.amount || 0)}</div>
                                    <div className={`text-sm ${
                                      invoice.status === 'paid' ? 'text-green-600' :
                                      invoice.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {invoice.status === 'paid' ? 'مدفوعة' :
                                       invoice.status === 'pending' ? 'معلقة' : 'متأخرة'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedReport === 'payrolls' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            🧑‍💼 تقرير الرواتب
                          </h4>
                          
                          {/* إحصائيات الرواتب */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{reportsData.payrolls.total}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي الرواتب</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">ج.م{new Intl.NumberFormat().format(reportsData.payrolls.totalAmount)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي الرواتب</div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                              <div className="text-2xl font-bold text-yellow-600">ج.م{new Intl.NumberFormat().format(reportsData.payrolls.totalBonuses)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي المكافآت</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                              <div className="text-2xl font-bold text-red-600">ج.م{new Intl.NumberFormat().format(reportsData.payrolls.totalDeductions)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي الخصومات</div>
                            </div>
                          </div>

                          {/* تفاصيل الرواتب */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-500 mb-2">تفاصيل الرواتب</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">صافي الرواتب:</span>
                                  <span className="font-medium text-green-600">ج.م{new Intl.NumberFormat().format(reportsData.payrolls.netAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">متوسط الراتب:</span>
                                  <span className="font-medium">
                                    ج.م{reportsData.payrolls.total > 0 
                                      ? new Intl.NumberFormat().format(reportsData.payrolls.totalAmount / reportsData.payrolls.total)
                                      : 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة المكافآت:</span>
                                  <span className="font-medium">
                                    {reportsData.payrolls.totalAmount > 0 
                                      ? ((reportsData.payrolls.totalBonuses / reportsData.payrolls.totalAmount) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة الخصومات:</span>
                                  <span className="font-medium">
                                    {reportsData.payrolls.totalAmount > 0 
                                      ? ((reportsData.payrolls.totalDeductions / reportsData.payrolls.totalAmount) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-500 mb-2">آخر الرواتب</h5>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {reportsData.payrolls.data.slice(0, 5).map((payroll: any, index: number) => (
                                  <div key={payroll._id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                      <div className="font-medium text-sm text-gray-400">راتب - {userMap[payroll.employeeId]?.name || payroll.employeeId || 'موظف'}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(payroll.paymentDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium text-sm">ج.م{new Intl.NumberFormat().format(payroll.salaryAmount || 0)}</div>
                                      {payroll.bonuses > 0 && (
                                        <div className="text-xs text-green-600">+{payroll.bonuses} مكافأة</div>
                                      )}
                                      {payroll.deductions > 0 && (
                                        <div className="text-xs text-red-600">-{payroll.deductions} خصم</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedReport === 'revenues' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            💹 تقرير الإيرادات
                          </h4>
                          
                          {/* إحصائيات الإيرادات */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{reportsData.revenues.total}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي المعاملات</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">ج.م{new Intl.NumberFormat().format(reportsData.revenues.totalAmount)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي الإيرادات</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                ج.م{reportsData.revenues.total > 0 
                                  ? new Intl.NumberFormat().format(reportsData.revenues.totalAmount / reportsData.revenues.total)
                                  : 0}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-black-300">متوسط المعاملة</div>
                            </div>
                          </div>

                          {/* توزيع الإيرادات حسب المصدر */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-400 mb-2">توزيع الإيرادات حسب المصدر</h5>
                              <div className="space-y-2">
                                {Object.entries(reportsData.revenues.bySource).map(([source, amount]: [string, any]) => (
                                  <div key={source} className="flex justify-between">
                                    <span className="text-gray-600 capitalize">{source}:</span>
                                    <span className="font-medium">ج.م{new Intl.NumberFormat().format(amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-400 mb-2">توزيع الإيرادات حسب طريقة الدفع</h5>
                              <div className="space-y-2">
                                {Object.entries(reportsData.revenues.byPaymentMethod).map(([method, amount]: [string, any]) => (
                                  <div key={method} className="flex justify-between">
                                    <span className="text-gray-600 capitalize">{method}:</span>
                                    <span className="font-medium">ج.م{new Intl.NumberFormat().format(amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* قائمة الإيرادات */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b">
                              <h5 className="font-medium text-gray-900">آخر الإيرادات</h5>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {reportsData.revenues.data.slice(0, 10).map((revenue: any, index: number) => (
                                <div key={revenue._id || index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <div>
                                      <div className="font-medium">{revenue.notes || 'إيراد'}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {revenue.sourceType} • {new Date(revenue.date).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-green-600">ج.م{new Intl.NumberFormat().format(revenue.amount || 0)}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{revenue.paymentMethod}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedReport === 'expenses' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            💸 تقرير المصروفات
                          </h4>
                          
                          {/* إحصائيات المصروفات */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{reportsData.expenses.total}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي المصروفات</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                              <div className="text-2xl font-bold text-red-600">ج.م{new Intl.NumberFormat().format(reportsData.expenses.totalAmount)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300">إجمالي المبلغ</div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">
                                ج.م{reportsData.expenses.total > 0 
                                  ? new Intl.NumberFormat().format(reportsData.expenses.totalAmount / reportsData.expenses.total)
                                  : 0}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-black-300">متوسط المصروف</div>
                            </div>
                          </div>

                          {/* توزيع المصروفات حسب الفئة */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-400 mb-2">توزيع المصروفات حسب الفئة</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(reportsData.expenses.byCategory).map(([category, amount]: [string, any]) => (
                                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                  <span className="text-gray-600 capitalize">{category}:</span>
                                  <span className="font-medium text-red-600">ج.م{new Intl.NumberFormat().format(amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* قائمة المصروفات */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b">
                              <h5 className="font-medium text-gray-900">آخر المصروفات</h5>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {reportsData.expenses.data.slice(0, 10).map((expense: any, index: number) => (
                                <div key={expense._id || index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div>
                                      <div className="font-medium">{expense.description || 'مصروف'}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-red-600">ج.م{new Intl.NumberFormat().format(expense.amount || 0)}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedReport === 'summary' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            📊 التقرير المالي الشامل
                          </h4>
                          
                          {/* المؤشرات الرئيسية */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                              <div className="text-3xl font-bold text-green-600">ج.م{new Intl.NumberFormat().format(reportsData.summary.totalRevenue)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300 mt-1">إجمالي الإيرادات</div>
                            </div>
                            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                              <div className="text-3xl font-bold text-red-600">ج.م{new Intl.NumberFormat().format(reportsData.summary.totalExpenses)}</div>
                              <div className="text-sm text-gray-600 dark:text-black-300 mt-1">إجمالي المصروفات</div>
                            </div>
                            <div className={`p-6 rounded-lg border ${
                              reportsData.summary.netProfit >= 0 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className={`text-3xl font-bold ${
                                reportsData.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ج.م{new Intl.NumberFormat().format(reportsData.summary.netProfit)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-black-300 mt-1">صافي الربح</div>
                            </div>
                          </div>

                          {/* تفاصيل الفواتير */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-400 mb-3">حالة الفواتير</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">إجمالي الفواتير:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.summary.totalInvoices)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                  <span>المدفوع:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.summary.paidInvoices)}</span>
                                </div>
                                <div className="flex justify-between text-yellow-600">
                                  <span>المعلق:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.summary.pendingInvoices)}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                  <span>المتأخر:</span>
                                  <span className="font-medium">ج.م{new Intl.NumberFormat().format(reportsData.summary.overdueInvoices)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h5 className="font-medium text-gray-400 mb-3">مؤشرات الأداء</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">هامش الربح:</span>
                                  <span className={`font-medium ${
                                    reportsData.summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {reportsData.summary.profitMargin.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة التحصيل:</span>
                                  <span className="font-medium text-blue-600">
                                    {reportsData.summary.totalInvoices > 0 
                                      ? ((reportsData.summary.paidInvoices / reportsData.summary.totalInvoices) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">نسبة المصروفات:</span>
                                  <span className="font-medium text-red-600">
                                    {reportsData.summary.totalRevenue > 0 
                                      ? ((reportsData.summary.totalExpenses / reportsData.summary.totalRevenue) * 100).toFixed(1)
                                      : 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ملخص سريع */}
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">ملخص سريع</h5>
                            <div className="text-sm text-gray-600 dark:text-black-300">
                              {reportsData.summary.netProfit >= 0 ? (
                                <span className="text-green-600 dark:text-green-400">
                                  ✅ المؤسسة تحقق ربحاً إيجابياً بنسبة {reportsData.summary.profitMargin.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-red-600 dark:text-red-400">
                                  ⚠️ المؤسسة تعاني من خسارة بقيمة ج.م{new Intl.NumberFormat().format(Math.abs(reportsData.summary.netProfit))}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  اضغط على "تحديث التقارير" لعرض البيانات المالية
                </div>
              )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {(() => {
                const AdminInvoices = dynamic(() => import('./AdminInvoices'), { ssr: false });
                return <AdminInvoices />;
              })()}
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-4">
              {(() => {
                const AdminPayroll = dynamic(() => import('./AdminPayroll'), { ssr: false });
                return <AdminPayroll />;
              })()}
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-4">
              {(() => {
                const AdminRevenue = dynamic(() => import('./AdminRevenue'), { ssr: false });
                return <AdminRevenue />;
              })()}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              {(() => {
                const AdminExpenses = dynamic(() => import('./AdminExpenses'), { ssr: false });
                return <AdminExpenses />;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialOverview;