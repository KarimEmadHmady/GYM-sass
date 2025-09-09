import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import type { WorkoutPlan, Exercise, PaginationParams, PaginatedResponse } from '@/types';

export class WorkoutService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.workoutPlans.list);
  }

  // Get all workout plans
  async getAllWorkoutPlans(params?: PaginationParams & { trainerId?: string }): Promise<PaginatedResponse<WorkoutPlan>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.trainerId) queryParams.append('trainerId', params.trainerId);
    const qs = queryParams.toString();
    return this.apiCall<PaginatedResponse<WorkoutPlan>>(`${qs ? `?${qs}` : ''}`);
  }

  // Get workout plan by ID
  async getWorkoutPlan(id: string): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/plan/${id}`);
  }

  // Create new workout plan
  async createWorkoutPlan(userId: string, workoutData: Partial<WorkoutPlan> & { trainerId?: string }): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${userId}`, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  // Update workout plan
  async updateWorkoutPlan(id: string, workoutData: Partial<WorkoutPlan> & { trainerId?: string }): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workoutData),
    });
  }

  // Delete workout plan
  async deleteWorkoutPlan(id: string): Promise<void> {
    await this.apiCall<void>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Get workout plans for specific user
  async getUserWorkoutPlans(userId: string, params?: PaginationParams): Promise<PaginatedResponse<WorkoutPlan>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    const qs = queryParams.toString();
    return this.apiCall<PaginatedResponse<WorkoutPlan>>(`/${userId}${qs ? `?${qs}` : ''}`);
  }

  // Add exercise to workout plan
  async addExerciseToPlan(planId: string, exercise: Partial<Exercise>): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${planId}/exercises`, {
      method: 'POST',
      body: JSON.stringify(exercise),
    });
  }

  // Get exercises by plan id
  async getExercisesByPlanId(planId: string): Promise<Exercise[]> {
    return this.apiCall<Exercise[]>(`/${planId}/exercises`);
  }

  // Get exercise by id
  async getExerciseById(planId: string, exerciseId: string): Promise<Exercise> {
    return this.apiCall<Exercise>(`/${planId}/exercises/${exerciseId}`);
  }

  // Update exercise in workout plan
  async updateExerciseInPlan(planId: string, exerciseId: string, exercise: Partial<Exercise>): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${planId}/exercises/${exerciseId}`, {
      method: 'PUT',
      body: JSON.stringify(exercise),
    });
  }

  // Remove exercise from workout plan
  async removeExerciseFromPlan(planId: string, exerciseId: string): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${planId}/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
  }
}
