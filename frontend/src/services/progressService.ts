import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ClientProgress } from '@/types/models';

export class ProgressService {
  async getUserProgress(userId: string): Promise<ClientProgress[]> {
    const res = await apiRequest(API_ENDPOINTS.progress.user(userId));
    return res.json();
  }

  async getLatestProgress(userId: string): Promise<ClientProgress | null> {
    const list = await this.getUserProgress(userId);
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
}
