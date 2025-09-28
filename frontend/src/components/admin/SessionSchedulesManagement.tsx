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
import * as XLSX from 'xlsx';

const sessionScheduleService = new SessionScheduleService();

interface SessionSchedulesManagementProps {
  userRole?: 'admin' | 'manager';
  viewMode?: 'overview' | 'management';
}

const SessionSchedulesManagement = ({ 
  userRole = 'admin', 
  viewMode = 'management' 
}: SessionSchedulesManagementProps) => {
  const { alertState, showSuccess, showError, showWarning, hideAlert } = useCustomAlert();
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm, handleCancel } = useConfirmationDialog();
  const [activeTab, setActiveTab] = useState(viewMode === 'overview' ? 'today' : 'all');
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionSchedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    trainerId: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    sessionType: 'شخصية' as 'شخصية' | 'جماعية' | 'أونلاين' | 'تغذية',
    location: 'Gym',
    price: 0,
    description: ''
  });
  const [trainers, setTrainers] = useState<User[]>([]); // قائمة المدربين فقط
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [trainerClients, setTrainerClients] = useState<User[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCreateModal(false);
        setShowEditModal(false);
      }
    };

    if (showCreateModal || showEditModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showCreateModal, showEditModal]);

  // عند فتح المودال: جلب المدربين فقط
  useEffect(() => {
    if (showCreateModal) {
      setTrainersLoading(true);
      userService.getUsersByRole('trainer', { limit: 100 })
        .then(res => {
          // بعض APIs ترجع .data.items أو .data أو array مباشرة
          const arr = (res as any).data?.items || (res as any).data || res || [];
          setTrainers(arr);
        })
        .catch(() => setTrainers([]))
        .finally(() => setTrainersLoading(false));
    } else {
      setTrainers([]);
      setTrainerClients([]);
      setFormData((prev) => ({ ...prev, trainerId: '', userId: '' }));
    }
  }, [showCreateModal]);

  // عند إغلاق المودال أو تغييره، امسح trainerClients
  useEffect(() => {
    if (!showCreateModal) {
      setTrainerClients([]);
      setFormData((prev) => ({ ...prev, trainerId: '', userId: '' }));
    }
  }, [showCreateModal]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, usersResponse] = await Promise.all([
        sessionScheduleService.getAllSessions(),
        userService.getUsers()
      ]);
      setSessions(sessionsData || []);
      
      // Handle different response structures for users
      let usersArr: User[] = [];
      if (Array.isArray(usersResponse)) {
        usersArr = usersResponse;
      } else if (Array.isArray((usersResponse as any)?.data)) {
        usersArr = (usersResponse as any).data;
      } else if (Array.isArray((usersResponse as any)?.data?.items)) {
        usersArr = (usersResponse as any).data.items;
      }
      setUsers(usersArr);
    } catch (error) {
      console.error('Error loading data:', error);
      setSessions([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Validation
    if (!formData.userId || !formData.trainerId || !formData.date || !formData.startTime || !formData.endTime) {
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
      const sessionData = {
        ...formData,
        date: new Date(formData.date)
      };
      await sessionScheduleService.updateSession(selectedSession._id, sessionData);
      setShowEditModal(false);
      setSelectedSession(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    showConfirmation(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذه الحصة؟ لا يمكن التراجع عن هذا الإجراء.',
      async () => {
        try {
          await sessionScheduleService.deleteSession(sessionId);
          loadData();
          showSuccess('تم الحذف', 'تم حذف الحصة بنجاح');
        } catch (error) {
          console.error('Error deleting session:', error);
          showError('خطأ في الحذف', 'حدث خطأ في حذف الحصة. يرجى المحاولة مرة أخرى.');
        }
      },
      {
        confirmText: 'حذف',
        cancelText: 'إلغاء',
        type: 'danger'
      }
    );
  };

  const handleUpdateStatus = async (sessionId: string, status: 'مجدولة' | 'مكتملة' | 'ملغاة') => {
    try {
      await sessionScheduleService.updateSession(sessionId, { status });
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      trainerId: '',
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
      trainerId: session.trainerId,
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

  const getTypeIcon = (type: string) => {
    const icons = {
      'شخصية': '👤',
      'جماعية': '👥',
      'أونلاين': '💻',
      'تغذية': '🥗'
    };
    return icons[type as keyof typeof icons] || '👤';
  };

  const getUserName = (userId: string) => {
    if (!userId || !users || users.length === 0) {
      return 'غير محدد';
    }
    
    const user = users.find(u => {
      const userObjId = u._id?.toString();
      const searchId = userId?.toString();
      return userObjId === searchId;
    });
    
    return user?.name || 'غير محدد';
  };

  // دالة تصدير بيانات الجلسات إلى Excel
  const exportSessionsToExcel = () => {
    try {
      // تحضير البيانات للتصدير بناءً على الجلسات المفلترة
      const exportData = filteredSessions.map(session => ({
        'نوع الحصة': session.sessionType || '',
        'المتدرب': getUserName(session.userId),
        'المدرب': getUserName(session.trainerId),
        'التاريخ': new Date(session.date).toLocaleDateString('ar-EG'),
        'وقت البداية': session.startTime || '',
        'وقت النهاية': session.endTime || '',
        'المدة (دقيقة)': session.duration || 0,
        'السعر (ج.م)': session.price || 0,
        'الموقع': session.location || '',
        'الحالة': session.status || '',
        'الوصف': session.description || '',
        'تاريخ الإنشاء': session.createdAt ? new Date(session.createdAt).toLocaleDateString('ar-EG') : '',
        'آخر تعديل': session.updatedAt ? new Date(session.updatedAt).toLocaleDateString('ar-EG') : '',
      }));

      // إنشاء ورقة عمل
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // إنشاء كتاب عمل
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'جداول الجلسات');

      // تحديد عرض الأعمدة
      const columnWidths = [
        { wch: 15 }, // نوع الحصة
        { wch: 20 }, // المتدرب
        { wch: 20 }, // المدرب
        { wch: 15 }, // التاريخ
        { wch: 15 }, // وقت البداية
        { wch: 15 }, // وقت النهاية
        { wch: 15 }, // المدة
        { wch: 12 }, // السعر
        { wch: 15 }, // الموقع
        { wch: 12 }, // الحالة
        { wch: 30 }, // الوصف
        { wch: 15 }, // تاريخ الإنشاء
        { wch: 15 }, // آخر تعديل
      ];
      worksheet['!cols'] = columnWidths;

      // تصدير الملف
      const fileName = `جداول_الجلسات_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      // إظهار رسالة نجاح
      showSuccess('تم التصدير بنجاح', `تم تصدير ${exportData.length} جلسة بنجاح`);
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      showError('خطأ في التصدير', 'حدث خطأ أثناء تصدير البيانات');
    }
  };

  const filteredSessions = sessions?.filter(session => {
    // فلترة حسب التاريخ المحدد (إن وجد)
    if (filterDate) {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      if (sessionDate !== filterDate) return false;
    }
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return new Date(session.date).toISOString().split('T')[0] === today;
    } else if (activeTab === 'upcoming') {
      return session.status === 'مجدولة';
    } else if (activeTab === 'completed') {
      return session.status === 'مكتملة';
    } else if (activeTab === 'cancelled') {
      return session.status === 'ملغاة';
    }
    return true;
  }) || [];

  // إعادة تعيين الصفحة عند تغيير التاب أو الفلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterDate]);

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage));
  const visibleSessions = filteredSessions.slice(startIndex, endIndex);

  const totalRevenue = filteredSessions.reduce((sum, session) => sum + (session.price || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (!sessions && !users) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // عند تغيير المدرب: جلب المتدربين لهذا المدرب فقط
  const handleTrainerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const trainerId = e.target.value;
    setFormData({ ...formData, trainerId, userId: '' });
    setTrainerClients([]);
    if (!trainerId) return;
    setClientsLoading(true);
    try {
      const clients = await userService.getClientsOfTrainer(trainerId);
      setTrainerClients(clients);
    } catch (err) {
      setTrainerClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            {viewMode === 'overview' 
              ? `إدارة الحصص - ${userRole === 'admin' ? 'الإدارة' : 'الإدارة'}` 
              : 'إدارة جدولة الحصص'
            }
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">ج.م {totalRevenue}</p>
            </div>
          <div className="flex space-x-2">
            {/* فلتر التاريخ */}
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 flex-col justify-center gap-2"> 
            <label htmlFor="filterDate" className="text-sm text-gray-700 dark:text-gray-300">بحث بالتاريخ</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                placeholder="ابحث بالتاريخ"
                id="filterDate"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
              />
            </div>
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  مسح التاريخ
                </button>
              )}
            </div>
              {viewMode === 'management' && (
                <div className="flex items-end justify-center">
                  <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white w-32 py-3 rounded-md text-sm hover:bg-blue-700 transition-colors text-center"
                  >
                  إضافة حصة جديدة
                </button>
              </div>
              )}
              <div className="flex items-end justify-center">
              <button 
                onClick={exportSessionsToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-3 rounded-md text-sm transition-colors"
              >
                تصدير البيانات
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 justify-center">
            {(viewMode === 'overview' ? [
              { id: 'today', name: 'اليوم', count: sessions?.filter(s => new Date(s.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length || 0 },
              { id: 'upcoming', name: 'المجدولة', count: sessions?.filter(s => s.status === 'مجدولة').length || 0 },
              { id: 'completed', name: 'المكتملة', count: sessions?.filter(s => s.status === 'مكتملة').length || 0 },
              { id: 'all', name: 'الكل', count: sessions?.length || 0 }
            ] : [
              { id: 'all', name: 'الكل', count: sessions?.length || 0 },
              { id: 'today', name: 'اليوم', count: sessions?.filter(s => new Date(s.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length || 0 },
              { id: 'upcoming', name: 'المجدولة', count: sessions?.filter(s => s.status === 'مجدولة').length || 0 },
              { id: 'completed', name: 'المكتملة', count: sessions?.filter(s => s.status === 'مكتملة').length || 0 },
              { id: 'cancelled', name: 'الملغاة', count: sessions?.filter(s => s.status === 'ملغاة').length || 0 }
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0 px-2 mx-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sessions Display */}
        {viewMode === 'overview' ? (
          /* Overview Cards View */
          <div className="p-6">
            <div className="space-y-4">
              {visibleSessions.map((session) => (
                <div
                  key={session._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">
                        {getTypeIcon(session.sessionType)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {session.sessionType} - {getUserName(session.userId)}
                        </h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">المدرب:</span> {getUserName(session.trainerId)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">الوقت:</span> {session.startTime} - {session.endTime}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">التاريخ:</span> {new Date(session.date).toLocaleDateString('ar-EG')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">المدة:</span> {session.duration} دقيقة
                          </p>
                          {session.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">الوصف:</span> {session.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          ج.م {session.price || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">إيراد</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditModal(session)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                          تعديل
                        </button>
                        <button 
                          onClick={() => handleDeleteSession(session._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Management Table View */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  نوع الحصة
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  المتدرب
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  المدرب
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  التاريخ والوقت
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  المدة
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  السعر
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  الحالة
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {visibleSessions.map((session) => (
                <tr key={session._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getTypeIcon(session.sessionType)}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.sessionType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {getUserName(session.userId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {getUserName(session.trainerId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    <div>
                      <div>{new Date(session.date).toLocaleDateString('ar-EG')}</div>
                      <div className="text-gray-500">{session.startTime} - {session.endTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {session.duration} دقيقة
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400 text-center">
                    ج.م {session.price || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => openEditModal(session)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        تعديل
                      </button>
                      {session.status === 'مجدولة' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(session._id, 'مكتملة')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            إكمال
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(session._id, 'ملغاة')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            إلغاء
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                عرض {startIndex + 1} إلى {Math.min(endIndex, filteredSessions.length)} من {filteredSessions.length} نتيجة
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">عدد العناصر:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    السابق
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    التالي
                  </button>
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    المدرب
                  </label>
                </div>
                {/* المدرب */}
                {trainersLoading ? (
                  <div className="text-blue-600">جاري تحميل المدربين...</div>
                ) : (
                  <select
                    value={formData.trainerId}
                    onChange={handleTrainerChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">اختر المدرب</option>
                    {trainers.map(user => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                )}
                {/* المتدرب */}
                {formData.trainerId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      المتدرب
                    </label>
                    {clientsLoading ? (
                      <div className="text-blue-600">جاري تحميل المتدربين...</div>
                    ) : trainerClients.length === 0 ? (
                      <div className="text-gray-500">لا يوجد متدربين لهذا المدرب</div>
                    ) : (
                      <select
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      >
                        <option value="">اختر المتدرب</option>
                        {trainerClients?.filter(u => u.role === 'member').map(user => (
                          <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
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
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5  w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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

export default SessionSchedulesManagement;
