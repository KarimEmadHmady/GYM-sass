'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProgressService } from '@/services/progressService';

const MemberProgressTracking = () => {
  const { user } = useAuth();
  const userId = (user as any)?._id ?? user?.id ?? '';
  const [progressList, setProgressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressService = new ProgressService();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await progressService.getUserProgress(userId);
        setProgressList(list);
        setTotalRecords(list.length);
        setTotalPages(Math.ceil(list.length / itemsPerPage));
      } catch {
        setError('تعذر جلب سجلات التقدم');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProgress();
  }, [userId, itemsPerPage]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return progressList.slice(startIndex, endIndex);
  }, [progressList, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">سجلات تقدمي</h2>
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : paginatedItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">لا يوجد سجلات تقدم بعد</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((p) => (
            <div key={p._id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 text-base">📅</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-blue-400">⚖️</span> الوزن (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.weight ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-yellow-400">💧</span> نسبة الدهون %:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.bodyFatPercentage ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💪 الكتلة العضلية (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.muscleMass ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">📏 مقاس الوسط (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.waist ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">📏 مقاس الصدر (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.chest ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💪 مقاس الذراع (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.arms ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🦵 مقاس الرجل (سم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.legs ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🔄 تغير الوزن (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.weightChange ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🔄 تغير الدهون (%):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.fatChange ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">🔄 تغير الكتلة العضلية (كجم):</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.muscleChange ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">📊 الحالة العامة:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.status ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💡 نصيحة المدرب:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{p.advice ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><span className="text-green-400">📝</span> ملاحظات:</span>
                <span className="text-gray-700 dark:text-gray-200 text-xs">{p.notes || '-'}</span>
              </div>
            </div>
          ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          )}
          
          {/* Pagination Info */}
          {totalRecords > 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalRecords)} من {totalRecords} سجل تقدم
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberProgressTracking;
