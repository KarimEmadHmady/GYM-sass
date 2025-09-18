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

const sessionScheduleService = new SessionScheduleService();

const TrainerClientSessions = () => {
  const { alertState, showSuccess, showError, showWarning, hideAlert } = useCustomAlert();
  const { confirmationState, showConfirmation, hideConfirmation, handleConfirm, handleCancel } = useConfirmationDialog();
  
  const [activeTab, setActiveTab] = useState('today');
  const [sessions, setSessions] = useState<SessionSchedule[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionSchedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const totalRevenue = filteredSessions.reduce((sum, session) => sum + (session.price || 0), 0);

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            حصصي التدريبية
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">ج.م {totalRevenue}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                جدولة حصة جديدة
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                تصدير البيانات
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'today', name: 'اليوم', count: sessions?.filter(s => new Date(s.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length || 0 },
              { id: 'upcoming', name: 'المجدولة', count: sessions?.filter(s => s.status === 'مجدولة').length || 0 },
              { id: 'completed', name: 'المكتملة', count: sessions?.filter(s => s.status === 'مكتملة').length || 0 },
              { id: 'all', name: 'الكل', count: sessions?.length || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
                <span className="mx-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400  px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sessions List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredSessions.map((session) => (
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
                      {getUserPhone(session.userId) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">الهاتف:</span> {getUserPhone(session.userId)}
                        </p>
                      )}
                      <div className="mt-2 space-y-1">
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
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ج.م {session.price || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">إيراد</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(session)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        تعديل
                      </button>
                      {session.status === 'مجدولة' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(session._id, 'مكتملة')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm"
                          >
                            إكمال
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(session._id, 'ملغاة')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
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
        </div>
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
