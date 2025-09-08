import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';

export interface PurchaseDTO {
  _id: string;
  userId: string;
  itemName: string;
  price: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class PurchaseService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.purchases.list);
  }

  async getByUser(userId: string): Promise<PurchaseDTO[]> {
    return this.apiCall<PurchaseDTO[]>(`/user/${userId}`);
  }

  async listAll(): Promise<PurchaseDTO[]> {
    return this.apiCall<PurchaseDTO[]>(``);
  }

  async createPurchase(data: { userId?: string; itemName: string; price: number; date?: string }): Promise<PurchaseDTO> {
    // Will use userId from token unless admin/manager supplies one
    return super.create<PurchaseDTO>(data);
  }

  async updatePurchase(id: string, data: Partial<{ userId: string; itemName: string; price: number; date: string }>): Promise<PurchaseDTO> {
    return super.update<PurchaseDTO>(id, data);
  }

  async deletePurchase(id: string): Promise<void> {
    return super.delete(id);
  }
}


