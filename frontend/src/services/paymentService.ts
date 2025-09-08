import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import type { PaginationParams, PaginatedResponse } from '@/types';

export type Payment = {
  _id: string;
  userId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'card' | 'bank_transfer' | 'other';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PaymentService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.payments.list);
  }

  async getAllPayments(params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    return this.getAll<Payment>(params);
  }

  async getPaymentsByUser(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    return this.apiCall<PaginatedResponse<Payment>>(`/${userId}?${queryParams.toString()}`);
  }

  async createPayment(data: Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    return this.create<Payment>(data as any);
  }

  async updatePayment(id: string, data: Partial<Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Payment> {
    return this.update<Payment>(id, data as any);
  }

  async deletePayment(id: string): Promise<void> {
    return this.delete(id);
  }
}
