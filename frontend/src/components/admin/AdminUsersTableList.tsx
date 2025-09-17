import React from 'react';
import type { User as UserModel } from '@/types/models';

interface AdminUsersTableListProps {
  users: UserModel[];
  loading: boolean;
  openViewUser: (id: string) => void;
  canEdit: boolean;
  canChangeRole: boolean;
  canDelete: boolean;
  canHardDelete: boolean;
  handleEdit: (id: string) => void;
  handleChangeRole: (id: string, role: string) => void;
  openDeleteModal: (id: string, type: 'soft' | 'hard') => void;
  getRoleText: (role: string) => string;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: string) => string;
  getSubscriptionColor: (status: string) => string;
}

const AdminUsersTableList: React.FC<AdminUsersTableListProps> = ({
  users,
  loading,
  openViewUser,
  canEdit,
  canChangeRole,
  canDelete,
  canHardDelete,
  handleEdit,
  handleChangeRole,
  openDeleteModal,
  getRoleText,
  getRoleColor,
  getStatusColor,
  getSubscriptionColor,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">المستخدم</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">الدور</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">الحالة</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">الاشتراك</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">الرصيد</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">آخر دخول</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-start">الإجراءات</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <tr><td colSpan={8} className="text-center py-8">جاري التحميل...</td></tr>
        ) : users.length === 0 ? (
          <tr><td colSpan={8} className="text-center py-8">لا يوجد مستخدمين</td></tr>
        ) : users.map((user) => (
          <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => openViewUser(user._id)}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="mr-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>{getRoleText(user.role)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'محظور'}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionColor(user.subscriptionStatus)}`}>{user.subscriptionStatus === 'active' ? 'نشط' : user.subscriptionStatus === 'expired' ? 'منتهي' : user.subscriptionStatus === 'cancelled' ? 'ملغي' : 'مجمد'}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">ج.م{user.balance}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ar-EG') : '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative z-30">
              <div className="flex space-x-2 relative z-30">
                {canEdit && (
                  <button onClick={e => { e.stopPropagation(); handleEdit(user._id); }} className="relative z-30 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 group p-3 cursor-pointer  rounded-md">
                    <span className="relative z-30">تعديل</span>
                    <span className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 rounded transition-all z-20 pointer-events-none"></span>
                  </button>
                )}
                {canChangeRole && (
                  <button onClick={e => { e.stopPropagation(); handleChangeRole(user._id, user.role); }} className="relative z-30 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 group p-3 cursor-pointer  rounded-md">
                    <span className="relative z-30">تغيير دور</span>
                    <span className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded transition-all z-20 pointer-events-none"></span>
                  </button>
                )}
                {canDelete && (
                  <button onClick={e => { e.stopPropagation(); openDeleteModal(user._id, 'soft'); }} className="relative z-30 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 group p-3 cursor-pointer  rounded-md">
                    <span className="relative z-30">حذف</span>
                    <span className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 rounded transition-all z-20 pointer-events-none"></span>
                  </button>
                )}
                {canHardDelete && (
                  <button onClick={e => { e.stopPropagation(); openDeleteModal(user._id, 'hard'); }} className="relative z-30 text-red-800 hover:text-red-900 font-bold group p-3 cursor-pointer  rounded-md">
                    <span className="relative z-30">حذف نهائي</span>
                    <span className="absolute inset-0 bg-red-800/10 group-hover:bg-red-800/20 rounded transition-all z-20 pointer-events-none"></span>
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminUsersTableList;
