'use client';

import React, { useEffect, useState } from 'react';
import { LoyaltyService } from '@/services/loyaltyService';
import { UserService } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/models';

const loyaltyService = new LoyaltyService();
const userService = new UserService();

const TrainerLoyaltyPoints = () => {
  const { user: currentUser } = useAuth();
  const currentTrainerId = currentUser?.id;

  // State
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientPointsHistory, setClientPointsHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // جلب عملاء الترينر
  useEffect(() => {
    const fetchClients = async () => {
      console.log('Current user:', currentUser);
      console.log('Current trainer ID:', currentTrainerId);
      
      if (!currentTrainerId) {
        setError('لم يتم العثور على معرف المدرب');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const userService = new UserService();
        const membersRes: any = await userService.getUsersByRole('member', { page: 1, limit: 1000 });
        const arr = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
        
        const normalizeId = (val: any): string => {
          if (!val) return '';
          if (typeof val === 'string') return val;
          if (typeof val === 'object') return (val._id || val.id || '') as string;
          return String(val);
        };
        
        const me = normalizeId(currentTrainerId);
        console.log('Current trainer ID:', me);
        console.log('All members:', arr.length);
        
        const filtered = (arr || []).filter((m: any) => {
          const memberTrainerId = normalizeId(m?.trainerId);
          console.log('Member:', m.name, 'Trainer ID:', memberTrainerId, 'Match:', memberTrainerId === me);
          return memberTrainerId === me;
        });
        
        console.log('Filtered clients:', filtered.length);
        setClients(filtered);
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        setError('تعذر جلب العملاء');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [currentTrainerId]);

  // جلب سجل نقاط العميل المحدد
  const fetchClientPointsHistory = async (clientId: string) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await loyaltyService.getUserPointHistory(clientId, {});
      setClientPointsHistory(res?.history || []);
    } catch (err: any) {
      setHistoryError('تعذر جلب سجل النقاط');
    } finally {
      setHistoryLoading(false);
    }
  };

  // فلترة العملاء حسب البحث
  const filteredClients = clients.filter(client => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      (client.name || '').toLowerCase().includes(search) ||
      (client.email || '').toLowerCase().includes(search) ||
      (client.phone || '').toLowerCase().includes(search)
    );
  });

  // معالجة اختيار عميل
  const handleClientSelect = (client: User) => {
    setSelectedClient(client);
    const clientId = (client as any)._id || (client as any).id;
    fetchClientPointsHistory(clientId);
  };

  // إضافة نقاط للعميل
  const handleAddPoints = async (clientId: string, points: number, reason: string) => {
    try {
      await loyaltyService.addPoints(clientId, points, reason);
      // تحديث سجل النقاط
      if (selectedClient && ((selectedClient as any)._id === clientId || (selectedClient as any).id === clientId)) {
        fetchClientPointsHistory(clientId);
      }
      // تحديث قائمة العملاء
      setClients(prev => prev.map(client => {
        const clientIdToCheck = (client as any)._id || (client as any).id;
        return clientIdToCheck === clientId 
          ? { ...client, loyaltyPoints: (client.loyaltyPoints || 0) + points }
          : client;
      }));
    } catch (err: any) {
      console.error('خطأ في إضافة النقاط:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">{error}</div>
          <div className="text-sm text-gray-500">
            {!currentTrainerId && 'تأكد من تسجيل الدخول بشكل صحيح'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* البحث */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">نقاط الولاء - عملائي</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الهاتف أو الإيميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* قائمة العملاء */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">قائمة العملاء</h4>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredClients.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا يوجد عملاء</div>
          ) : (
            filteredClients.map((client) => {
              const clientId = (client as any)._id || (client as any).id;
              return (
                <div
                  key={clientId}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    selectedClient && ((selectedClient as any)._id === clientId || (selectedClient as any).id === clientId) ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => handleClientSelect(client)}
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-semibold">
                        {client.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{client.name}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                      {client.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {client.loyaltyPoints || 0} نقطة
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">نقاط الولاء</div>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>

      {/* تفاصيل العميل المحدد */}
      {selectedClient && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                تفاصيل نقاط {selectedClient.name}
              </h4>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {selectedClient.loyaltyPoints || 0} نقطة
              </div>
            </div>
          </div>

          {/* إضافة نقاط سريعة */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">إضافة نقاط سريعة</h5>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddPoints((selectedClient as any)._id || (selectedClient as any).id, 10, 'مكافأة حضور')}
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800"
              >
                +10 (حضور)
              </button>
              <button
                onClick={() => handleAddPoints((selectedClient as any)._id || (selectedClient as any).id, 25, 'مكافأة أداء')}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                +25 (أداء)
              </button>
              <button
                onClick={() => handleAddPoints((selectedClient as any)._id || (selectedClient as any).id, 50, 'مكافأة خاصة')}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-800"
              >
                +50 (خاصة)
              </button>
            </div>
          </div>

          {/* سجل النقاط */}
          <div className="p-6">
            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-4">سجل النقاط</h5>
            {historyLoading ? (
              <div className="text-center py-4 text-gray-500">جاري التحميل...</div>
            ) : historyError ? (
              <div className="text-center py-4 text-red-500">{historyError}</div>
            ) : clientPointsHistory.length === 0 ? (
              <div className="text-center py-4 text-gray-500">لا يوجد سجل نقاط</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">النقاط</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">النوع</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">السبب</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientPointsHistory.map((record, index) => (
                      <tr key={record._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <span className={`font-medium ${
                            record.points > 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {record.points > 0 ? '+' : ''}{record.points}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            record.type === 'earned' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : record.type === 'redeemed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {record.type === 'earned' ? 'مكتسبة' : 
                             record.type === 'redeemed' ? 'مستبدلة' : 
                             record.type === 'admin_added' ? 'مضافة' :
                             record.type === 'admin_deducted' ? 'مخصومة' : record.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{record.reason || '-'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                          {record.createdAt ? new Date(record.createdAt).toLocaleString('ar-EG') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerLoyaltyPoints;
