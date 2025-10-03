'use client';

import React, { useState, useEffect } from 'react';
import { SessionSchedule } from '@/types';
import { User } from '@/types/models';
import { SessionScheduleService } from '@/services/sessionScheduleService';
import { userService } from '@/services';
import CustomAlert from '@/components/ui/CustomAlert';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, DollarSign, FileText, Plus, UserCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const sessionScheduleService = new SessionScheduleService();

const TrainerClientSessions = () => {
  const { alertState, showSuccess, showError, showWarning, hideAlert } = useCustomAlert();
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm, handleCancel } = useConfirmationDialog();
  
  const [activeTab, setActiveTab] = useState('all');
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionSchedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    sessionType: 'شخصية' as 'شخصية' | 'جماعية' | 'أونلاين' | 'تغذية',
    location: 'Gym',
    price: 0,
    description: ''
  });

  // Get current trainer ID from Redux auth first, then fallback to token/localStorage
  const { user: authUser } = useAuth();
  const getCurrentTrainerId = () => {
    if (authUser) {
      return (authUser as any)._id || (authUser as any).id;
    }
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (authToken) {
      try {
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        return tokenData.userId || tokenData._id || tokenData.id;
      } catch (error) {
        console.error('Error parsing authToken:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const trainerId = getCurrentTrainerId();
      console.log('Trainer ID:', trainerId);
      
      if (!trainerId) {
        showError('خطأ في المصادقة', 'لم يتم العثور على بيانات المدرب. يرجى تسجيل الدخول مرة أخرى.');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        return;
      }

      // Load trainer's sessions and clients
      console.log('Loading sessions and clients...');
      const [sessionsData, clientsData] = await Promise.all([
        sessionScheduleService.getSessionsByUser(trainerId),
        // Use backend-authenticated endpoint to derive trainer from token
        userService.getMyClients()
      ]);

      console.log('Sessions data:', sessionsData);
      console.log('Clients data:', clientsData);

      setSessions(sessionsData || []);
      
      // Ensure clients is a flat array
      let clientsArr: User[] = Array.isArray(clientsData) ? clientsData : [];

      // Fallback: if empty, fetch members and filter by trainerId (as in TrainerClientsOverview)
      if (!clientsArr.length) {
        try {
          const membersRes: any = await userService.getUsersByRole('member', { page: 1, limit: 1000 } as any);
          const arr = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
          const normalizeId = (val: any): string => {
            if (!val) return '';
            if (typeof val === 'string') return val;
            if (typeof val === 'object') return (val._id || val.id || '') as string;
            return String(val);
          };
          const me = normalizeId(trainerId);
          clientsArr = (arr || []).filter((m: any) => normalizeId(m?.trainerId) === me);
        } catch (e) {
          console.warn('Fallback members fetch failed:', e);
        }
      }
      console.log('Processed clients:', clientsArr);
      setClients(clientsArr);
      
      // If no data is loaded, show a message
      if ((!sessionsData || sessionsData.length === 0) && clientsArr.length === 0) {
        showWarning('لا توجد بيانات', 'لا توجد حصص أو عملاء متاحين حالياً');
      }
      
      // If no clients are available, show a specific message
      if (clientsArr.length === 0) {
        showWarning('لا يوجد عملاء', 'لم يتم العثور على عملاء مرتبطين بهذا المدرب');
      }
      
      // If no sessions are available, show a specific message
      if (!sessionsData || sessionsData.length === 0) {
        showWarning('لا توجد حصص', 'لم يتم العثور على حصص مرتبطة بهذا المدرب');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showError('خطأ في التحميل', `حدث خطأ في تحميل البيانات: ${error instanceof Error ? error.message : String(error)}`);
      setSessions([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const trainerId = getCurrentTrainerId();
    if (!trainerId) {
      showError('خطأ في المصادقة', 'لم يتم العثور على بيانات المدرب. يرجى تسجيل الدخول مرة أخرى.');
      return;
    }

    // Validation
    if (!formData.userId || !formData.date || !formData.startTime || !formData.endTime) {
      showWarning('تحقق من البيانات', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Time validation
    if (formData.startTime >= formData.endTime) {
      showWarning('تحقق من الوقت', 'وقت البداية يجب أن يكون قبل وقت النهاية');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const sessionData = {
        ...formData,
        trainerId,
        date: new Date(formData.date)
      };
      await sessionScheduleService.createSession(formData.userId, sessionData);
      setShowCreateModal(false);
      resetForm();
      loadData();
      showSuccess('تم بنجاح!', 'تم إنشاء الحصة بنجاح');
    } catch (error) {
      console.error('Error creating session:', error);
      showError('خطأ في الإنشاء', 'حدث خطأ في إنشاء الحصة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    
    try {
      const trainerId = getCurrentTrainerId();
      if (!trainerId) {
        showError('خطأ في المصادقة', 'لم يتم العثور على بيانات المدرب. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }

      const sessionData = {
        ...formData,
        trainerId,
        date: new Date(formData.date)
      };
      await sessionScheduleService.updateSession(selectedSession._id, sessionData);
      setShowEditModal(false);
      setSelectedSession(null);
      resetForm();
      loadData();
      showSuccess('تم التحديث', 'تم تحديث الحصة بنجاح');
    } catch (error) {
      console.error('Error updating session:', error);
      showError('خطأ في التحديث', 'حدث خطأ في تحديث الحصة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleUpdateStatus = async (sessionId: string, status: 'مجدولة' | 'مكتملة' | 'ملغاة') => {
    try {
      await sessionScheduleService.updateSession(sessionId, { status });
      loadData();
      showSuccess('تم التحديث', 'تم تحديث حالة الحصة بنجاح');
    } catch (error) {
      console.error('Error updating status:', error);
      showError('خطأ في التحديث', 'حدث خطأ في تحديث حالة الحصة.');
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: 60,
      sessionType: 'شخصية' as 'شخصية' | 'جماعية' | 'أونلاين' | 'تغذية',
      location: 'Gym',
      price: 0,
      description: ''
    });
  };

  const openEditModal = (session: SessionSchedule) => {
    setSelectedSession(session);
    setFormData({
      userId: session.userId,
      date: new Date(session.date).toISOString().split('T')[0],
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration || 60,
      sessionType: session.sessionType as 'شخصية' | 'جماعية' | 'أونلاين' | 'تغذية',
      location: session.location || 'Gym',
      price: session.price || 0,
      description: session.description || ''
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'مكتملة': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'مجدولة': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'ملغاة': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return status; // Already in Arabic from API
  };

  const getUserName = (userId: string) => {
    if (!userId || !clients || clients.length === 0) {
      return 'غير محدد';
    }
    const normalize = (val: any): string => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') return (val._id || val.id || '') as string;
      return String(val);
    };
    const searchId = normalize(userId);
    const user = clients.find(u => normalize(u._id) === searchId || normalize((u as any).id) === searchId);
    return user?.name || 'غير محدد';
  };

  const getUserPhone = (userId: string) => {
    if (!userId || !clients || clients.length === 0) {
      return '';
    }
    const normalize = (val: any): string => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') return (val._id || val.id || '') as string;
      return String(val);
    };
    const searchId = normalize(userId);
    const user = clients.find(u => normalize(u._id) === searchId || normalize((u as any).id) === searchId);
    return (user?.phone as string) || '';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'شخصية': '👤',
      'جماعية': '👥',
      'أونلاين': '💻',
      'تغذية': '🥗'
    };
    return icons[type as keyof typeof icons] || '👤';
  };

  const filteredSessions = sessions?.filter(session => {
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return new Date(session.date).toISOString().split('T')[0] === today;
    } else if (activeTab === 'upcoming') {
      return session.status === 'مجدولة';
    } else if (activeTab === 'completed') {
      return session.status === 'مكتملة';
    }
    return true;
  }) || [];

  // حساب البيانات للصفحات
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  // تغيير الصفحة
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // إعادة تعيين الصفحة عند تغيير التبويب
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalRevenue = filteredSessions.reduce((sum, session) => sum + (session.price || 0), 0);

  // Helper to export filteredSessions to Excel
  const handleExport = () => {
    const data = filteredSessions.map(session => {
      const client = clients.find(c => c._id === session.userId);
      return {
        'اسم العميل': client?.name || 'غير محدد',
        'رقم الهاتف': client?.phone || '-',
        'نوع الحصة': session.sessionType,
        'التاريخ': new Date(session.date).toLocaleDateString('ar-EG'),
        'وقت البداية': session.startTime,
        'وقت النهاية': session.endTime,
        'المدة': session.duration || '-',
        'السعر': session.price || 0,
        'الحالة': session.status,
        'الوصف': session.description || '-',
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sessions');
    XLSX.writeFile(wb, 'client_sessions.xlsx');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                حصصي التدريبية
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  إجمالي الإيرادات
                </p>
                <p className="text-sm sm:text-xl font-bold text-green-600 dark:text-green-400">ج.م {totalRevenue}</p>
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">جدولة حصة جديدة</span>
                  <span className="sm:hidden">جدولة</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">تصدير البيانات</span>
                  <span className="sm:hidden">تصدير</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex m-2 gap-1 sm:gap-2 text-center align-center justify-center flex-wrap ">
            {[
              { id: 'all', name: 'الكل', count: sessions?.length || 0 },
              { id: 'today', name: 'اليوم', count: sessions?.filter(s => new Date(s.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length || 0 },
              { id: 'upcoming', name: 'المجدولة', count: sessions?.filter(s => s.status === 'مجدولة').length || 0 },
              { id: 'completed', name: 'المكتملة', count: sessions?.filter(s => s.status === 'مكتملة').length || 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
                <span className="mx-1 sm:mx-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1 sm:px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sessions List */}
        <div className="p-3 sm:p-6">
          {currentSessions.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <UserCheck className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {activeTab === 'all' ? 'لا توجد حصص' : 
                 activeTab === 'today' ? 'لا توجد حصص اليوم' :
                 activeTab === 'upcoming' ? 'لا توجد حصص مجدولة' :
                 activeTab === 'completed' ? 'لا توجد حصص مكتملة' : 'لا توجد حصص'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {currentSessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm sm:text-lg">
                          {getTypeIcon(session.sessionType)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white">
                          {session.sessionType} - {getUserName(session.userId)}
                        </h4>
                        {getUserPhone(session.userId) && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-medium">الهاتف:</span> {getUserPhone(session.userId)}
                          </p>
                        )}
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            <span className="text-xs sm:text-sm">{new Date(session.date).toLocaleDateString('ar-EG')}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                            <span className="text-xs sm:text-sm">{session.startTime} - {session.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400">
                            <span className="text-xs sm:text-sm">{session.duration} دقيقة</span>
                          </div>
                        </div>
                        {session.description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <span className="font-medium">الوصف:</span> {session.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 sm:space-y-2">
                      <div className="text-right flex justify-center items-center gap-1 sm:gap-2">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                          ج.م {session.price || 0}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                        {getStatusText(session.status)}
                      </span>
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button 
                          onClick={() => openEditModal(session)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm"
                        >
                          تعديل
                        </button>
                        {session.status === 'مجدولة' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(session._id, 'مكتملة')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm"
                            >
                              إكمال
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(session._id, 'ملغاة')}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm"
                            >
                              إلغاء
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                عرض {startIndex + 1} إلى {Math.min(endIndex, filteredSessions.length)} من {filteredSessions.length} حصة
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">السابق</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="hidden sm:inline">التالي</span>
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">إضافة حصة جديدة</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateSession} className="space-y-4">
                {/* العميل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    العميل
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">اختر العميل</option>
                    {clients?.filter(u => u.role === 'member').length === 0 ? (
                      <option value="" disabled>لا يوجد عملاء متاحين</option>
                    ) : (
                      clients?.filter(u => u.role === 'member').map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      وقت البداية
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      وقت النهاية
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نوع الحصة
                  </label>
                  <select
                    value={formData.sessionType}
                    onChange={(e) => setFormData({...formData, sessionType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="شخصية">شخصية</option>
                    <option value="جماعية">جماعية</option>
                    <option value="أونلاين">أونلاين</option>
                    <option value="تغذية">تغذية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    السعر
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الإضافة...
                      </>
                    ) : (
                      'إضافة'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">تعديل الحصة</h3>
              <form onSubmit={handleUpdateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      وقت البداية
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      وقت النهاية
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      onClick={(e) => e.currentTarget.showPicker?.()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نوع الحصة
                  </label>
                  <select
                    value={formData.sessionType}
                    onChange={(e) => setFormData({...formData, sessionType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="شخصية">شخصية</option>
                    <option value="جماعية">جماعية</option>
                    <option value="أونلاين">أونلاين</option>
                    <option value="تغذية">تغذية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    السعر
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        duration={alertState.duration}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        type={confirmationState.type}
      />
    </div>
  );
};

export default TrainerClientSessions;
