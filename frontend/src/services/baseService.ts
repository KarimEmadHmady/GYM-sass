import { apiRequest } from '@/lib/api';
import type { ApiResponse, PaginationParams, PaginatedResponse } from '@/types';

export class BaseService {
  protected baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint;
  }

  // Generic CRUD operations
  async getAll<T>(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `${this.baseEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.json();
  }

  async getById<T>(id: string): Promise<T> {
    const response = await apiRequest(`${this.baseEndpoint}/${id}`);
    return response.json();
  }

  async create<T>(data: any): Promise<T> {
    const response = await apiRequest(this.baseEndpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async update<T>(id: string, data: any): Promise<T> {
    const response = await apiRequest(`${this.baseEndpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(id: string): Promise<void> {
    await apiRequest(`${this.baseEndpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic API call method
  async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await apiRequest(`${this.baseEndpoint}${endpoint}`, options);
    return response.json();
  }
}
