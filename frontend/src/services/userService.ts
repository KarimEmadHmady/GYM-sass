import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import type { User, PaginationParams, PaginatedResponse } from '@/types';

export class UserService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.users.list);
  }

  // Get all users with pagination
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    return this.getAll<User>(params);
  }

  // Get user by ID
  async getUser(id: string): Promise<User> {
    return this.getById<User>(id);
  }

  // Create new user
  async createUser(userData: Partial<User>): Promise<User> {
    return this.create<User>(userData);
  }

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.update<User>(id, userData);
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    return this.delete(id);
  }

  // Get users by role
  async getUsersByRole(role: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    queryParams.append('role', role);
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return this.apiCall<PaginatedResponse<User>>(`?${queryParams.toString()}`);
  }

  // Get active users
  async getActiveUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    queryParams.append('status', 'active');
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return this.apiCall<PaginatedResponse<User>>(`?${queryParams.toString()}`);
  }

  // Update user status
  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'banned'): Promise<User> {
    return this.apiCall<User>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Update user subscription
  async updateUserSubscription(
    id: string, 
    subscriptionData: {
      startDate: Date;
      endDate: Date;
      status: 'active' | 'frozen' | 'expired' | 'cancelled';
    }
  ): Promise<User> {
    return this.apiCall<User>(`/${id}/subscription`, {
      method: 'PATCH',
      body: JSON.stringify(subscriptionData),
    });
  }
}
