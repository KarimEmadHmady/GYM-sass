import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import { SessionSchedule } from '@/types';

export class SessionScheduleService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.sessionSchedules.list);
  }

  // جلب جميع الجلسات
  async getAllSessions(): Promise<SessionSchedule[]> {
    try {
      const response = await this.apiCall<SessionSchedule[]>('');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error in getAllSessions:', error);
      throw error;
    }
  }

  // جلب الجلسات لمستخدم (كعضو أو مدرب)
  async getSessionsByUser(userId: string): Promise<SessionSchedule[]> {
    const response = await this.apiCall<SessionSchedule[]>(`/${userId}`);
    return response;
  }

  // إنشاء جلسة جديدة
  async createSession(userId: string, session: Partial<SessionSchedule>): Promise<SessionSchedule> {
    const response = await this.apiCall<SessionSchedule>(`/${userId}`, {
      method: 'POST',
      body: JSON.stringify(session),
    });
    return response;
  }

  // تحديث جلسة
  async updateSession(id: string, session: Partial<SessionSchedule>): Promise<SessionSchedule> {
    const response = await this.apiCall<SessionSchedule>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(session),
    });
    return response;
  }

  // حذف جلسة
  async deleteSession(id: string): Promise<void> {
    await this.apiCall<void>(`/${id}`, {
      method: 'DELETE',
    });
  }
}
