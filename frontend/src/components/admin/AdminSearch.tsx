'use client';

import React, { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import { UserService } from '@/services/userService';

interface SearchResult {
  type: string;
  id: string;
  amount: number;
  date: string;
  userId?: string;
  employeeId?: string;
  method?: string;
  sourceType?: string;
  category?: string;
  status?: string;
  invoiceNumber?: string;
  itemName?: string;
  notes?: string;
  bonuses?: number;
  deductions?: number;
  raw: any;
}

interface SearchFilters {
  type: string;
  userId: string;
  employeeId: string;
  invoiceNumber: string;
  status: string;
  category: string;
  sourceType: string;
  paymentMethod: string;
  minAmount: string;
  maxAmount: string;
  from: string;
  to: string;
  sort: string;
  limit: number;
}

const AdminSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    userId: '',
    employeeId: '',
    invoiceNumber: '',
    status: '',
    category: '',
    sourceType: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
    from: '',
    to: '',
    sort: 'desc',
    limit: 10
  });

  const userService = new UserService();

  // جلب المستخدمين للفلترة
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers({ limit: 500 });
        const usersArr = Array.isArray(res) ? res : (res?.data || []);
        setUsers(usersArr);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  // تطبيع رقم الفاتورة المختصر إلى التنسيق القياسي (INV-0001)
  const normalizeInvoiceNumber = (value: string): string => {
    if (!value) return value;
    const trimmed = String(value).trim();
    // إذا كان بالفعل يبدأ بـ INV- نعيده كما هو
    if (/^INV-\d+$/i.test(trimmed)) return trimmed.toUpperCase();
    // لو المستخدم كتب أرقام فقط (مثلاً 2 أو 0002)
    if (/^\d+$/.test(trimmed)) {
      const padded = trimmed.padStart(4, '0');
      return `INV-${padded}`;
    }
    // لو كتب inv بدون شرطة أو مسافات
    const digits = trimmed.replace(/[^0-9]/g, '');
    if (/^inv/i.test(trimmed) && digits) {
      const padded = digits.padStart(4, '0');
      return `INV-${padded}`;
    }
    return trimmed;
  };

  // البحث
  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      
      // إضافة المعاملات غير الفارغة
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'all') {
          if (key === 'limit') return; // لا ترسل limit للسيرفر، نقوم بالتقسيم محلياً
          if (key === 'invoiceNumber') {
            const normalized = normalizeInvoiceNumber(String(value));
            queryParams.append(key, normalized);
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await apiGet(`/financial/search?${queryParams.toString()}`) as any;
      const arr = response.results || [];
      setResults(arr);
      setTotalCount(arr.length);
    } catch (err: any) {
      setError(err?.message || 'فشل في البحث');
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // البحث التلقائي عند تغيير الفلاتر
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  // البحث عند تغيير الصفحة
  // لا تعيد الجلب عند تغيير الصفحة؛ الصفحة تُحسب محلياً

  // تحديث الفلاتر
  const updateFilter = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      type: 'all',
      userId: '',
      employeeId: '',
      invoiceNumber: '',
      status: '',
      category: '',
      sourceType: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: '',
      from: '',
      to: '',
      sort: 'desc',
      limit: 10
    });
    setCurrentPage(1);
  };

  // الحصول على معلومات المستخدم
  const getUserInfo = (userId: string) => {
    const user = users.find(u => u._id === userId);
    return user ? { name: user.name, phone: user.phone } : { name: 'غير معروف', phone: '' };
  };

  // تنسيق النتائج حسب النوع
  const getResultIcon = (type: string) => {
    const icons = {
      revenue: '💰',
      expense: '💸',
      invoice: '🧾',
      payroll: '👥',
      payment: '💳',
      purchase: '🛒'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getResultColor = (type: string) => {
    const colors = {
      revenue: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      expense: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      invoice: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      payroll: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200',
      payment: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      purchase: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      revenue: 'إيراد',
      expense: 'مصروف',
      invoice: 'فاتورة',
      payroll: 'راتب',
      payment: 'دفعة',
      purchase: 'شراء'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Pagination (client-side slicing to enforce page size visually)
  const startIndex = (currentPage - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const totalPages = Math.max(1, Math.ceil((results?.length || 0) / filters.limit));
  const visibleResults = results.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">البحث المتقدم</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ابحث في جميع المعاملات المالية بمرونة عالية</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showAdvanced ? 'إخفاء المتقدم' : 'إظهار المتقدم'}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع المعاملة</label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">الكل</option>
              <option value="revenue">إيرادات</option>
              <option value="expense">مصروفات</option>
              <option value="invoice">فواتير</option>
              <option value="payroll">رواتب</option>
              <option value="payment">مدفوعات</option>
              <option value="purchase">مشتريات</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المستخدم</label>
            <select
              value={filters.userId}
              onChange={(e) => updateFilter('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">الكل</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.phone && `(${user.phone})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">من تاريخ</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => updateFilter('from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => updateFilter('to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">فلاتر متقدمة</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الفاتورة</label>
                <input
                  type="text"
                  value={filters.invoiceNumber}
                  onChange={(e) => updateFilter('invoiceNumber', e.target.value)}
                  placeholder="رقم الفاتورة"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">الكل</option>
                  <option value="paid">مدفوعة</option>
                  <option value="pending">معلقة</option>
                  <option value="overdue">متأخرة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">فئة المصروف</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">الكل</option>
                  <option value="rent">إيجار</option>
                  <option value="utilities">مرافق</option>
                  <option value="equipment">معدات</option>
                  <option value="maintenance">صيانة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع الإيراد</label>
                <select
                  value={filters.sourceType}
                  onChange={(e) => updateFilter('sourceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">الكل</option>
                  <option value="membership">عضوية</option>
                  <option value="training">تدريب</option>
                  <option value="products">منتجات</option>
                  <option value="services">خدمات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">طريقة الدفع</label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => updateFilter('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">الكل</option>
                  <option value="cash">نقدي</option>
                  <option value="card">بطاقة</option>
                  <option value="bank">تحويل بنكي</option>
                  <option value="online">أونلاين</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الترتيب</label>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="desc">الأحدث أولاً</option>
                  <option value="asc">الأقدم أولاً</option>
                </select>
              </div>
            </div>

            {/* Amount Range */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحد الأدنى</label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => updateFilter('minAmount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحد الأقصى</label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => updateFilter('maxAmount', e.target.value)}
                  placeholder="1000000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عدد النتائج</label>
                <select
                  value={filters.limit}
                  onChange={(e) => updateFilter('limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              نتائج البحث ({Math.min(endIndex, totalCount).toLocaleString()} / {totalCount.toLocaleString()})
            </h4>
            {loading && <span className="text-sm text-blue-600">جاري البحث...</span>}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {results.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد نتائج للبحث
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
                    <th className="py-3 px-4 text-center">النوع</th>
                    <th className="py-3 px-4 text-center">المبلغ</th>
                    <th className="py-3 px-4 text-center">التاريخ</th>
                    <th className="py-3 px-4 text-center">المستخدم</th>
                    <th className="py-3 px-4 text-center">التفاصيل</th>
                    <th className="py-3 px-4 text-center">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleResults.map((result) => {
                    const userInfo = result.userId ? getUserInfo(result.userId) : null;
                    return (
                      <tr key={`${result.type}-${result.id}`} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getResultColor(result.type)}`}>
                            {getResultIcon(result.type)} {getTypeLabel(result.type)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">
                          ج.م{result.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {new Date(result.date).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {userInfo ? (
                            <div>
                              <div className="font-medium">{userInfo.name}</div>
                              {userInfo.phone && <div className="text-xs text-gray-500">{userInfo.phone}</div>}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="text-sm">
                            {result.invoiceNumber && <div>فاتورة: {result.invoiceNumber}</div>}
                            {result.itemName && <div>المنتج: {result.itemName}</div>}
                            {result.method && <div>الطريقة: {result.method}</div>}
                            {result.status && <div>الحالة: {result.status}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {result.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                عرض {startIndex + 1} إلى {Math.min(endIndex, totalCount)} من {totalCount} نتيجة
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  السابق
                </button>
                <span className="px-3 py-1 text-sm">
                  صفحة {currentPage} من {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSearch;
