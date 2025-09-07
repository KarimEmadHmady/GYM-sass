import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Reward, PaginationParams, PaginatedResponse } from '@/types';

export class LoyaltyService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.loyalty.user(''));
  }

  // Get user's loyalty points
  async getUserPoints(userId: string): Promise<{
    totalPoints: number;
    availablePoints: number;
    redeemedPoints: number;
    transactions: Reward[];
  }> {
    return this.apiCall(`/user/${userId}`);
  }

  // Get current user's points
  async getMyPoints(): Promise<{
    totalPoints: number;
    availablePoints: number;
    redeemedPoints: number;
    transactions: Reward[];
  }> {
    return this.apiCall('/my-points');
  }

  // Add points to user (Admin only)
  async addPoints(userId: string, points: number, reason: string): Promise<Reward> {
    return this.apiCall('/add', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        points,
        reason
      }),
    });
  }

  // Redeem points
  async redeemPoints(points: number, redeemedFor: string): Promise<Reward> {
    return this.apiCall('/redeem', {
      method: 'POST',
      body: JSON.stringify({
        points,
        redeemedFor
      }),
    });
  }

  // Get loyalty statistics (Admin only)
  async getLoyaltyStats(): Promise<{
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    activeUsers: number;
    averagePointsPerUser: number;
  }> {
    return this.apiCall('/stats');
  }

  // Get top users by points
  async getTopUsers(limit: number = 10): Promise<Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    totalPoints: number;
    rank: number;
  }>> {
    return this.apiCall(`/top-users?limit=${limit}`);
  }

  // Add points from payment (Admin only)
  async addPointsFromPayment(userId: string, paymentAmount: number, pointsPerDollar: number = 1): Promise<Reward> {
    return this.apiCall('/payment-points', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        paymentAmount,
        pointsPerDollar
      }),
    });
  }

  // Add points from attendance (Admin/Trainer only)
  async addAttendancePoints(userId: string, points: number, reason: string): Promise<Reward> {
    return this.apiCall('/attendance-points', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        points,
        reason
      }),
    });
  }

  // Get user's point history
  async getUserPointHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Reward>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return this.apiCall<PaginatedResponse<Reward>>(`/user/${userId}/history?${queryParams.toString()}`);
  }

  // Get available rewards
  async getAvailableRewards(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    category: string;
    isActive: boolean;
  }>> {
    return this.apiCall('/rewards');
  }

  // Get user's membership level
  async getUserMembershipLevel(userId: string): Promise<{
    level: 'basic' | 'silver' | 'gold' | 'platinum';
    pointsRequired: number;
    currentPoints: number;
    nextLevelPoints: number;
    benefits: string[];
  }> {
    return this.apiCall(`/user/${userId}/membership-level`);
  }
}
