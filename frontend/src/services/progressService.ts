import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ClientProgress } from '@/types/models';

export class ProgressService {
  async getAll(): Promise<ClientProgress[]> {
    const res = await apiRequest(API_ENDPOINTS.progress.list);
    return res.json();
  }

  async getUserProgress(userId: string): Promise<ClientProgress[]> {
    const res = await apiRequest(API_ENDPOINTS.progress.user(userId));
    return res.json();
  }

  async getTrainerProgress(trainerId: string): Promise<ClientProgress[]> {
    const res = await apiRequest(API_ENDPOINTS.progress.trainer(trainerId));
    return res.json();
  }

  async create(data: Omit<ClientProgress, '_id' | 'createdAt' | 'updatedAt'>): Promise<ClientProgress> {
    const res = await apiRequest(API_ENDPOINTS.progress.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async update(id: string, data: Partial<ClientProgress>): Promise<ClientProgress> {
    const res = await apiRequest(API_ENDPOINTS.progress.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await apiRequest(API_ENDPOINTS.progress.delete(id), {
      method: 'DELETE',
    });
  }

  async getLatestProgress(userId: string): Promise<ClientProgress | null> {
    const list = await this.getUserProgress(userId);
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
}
