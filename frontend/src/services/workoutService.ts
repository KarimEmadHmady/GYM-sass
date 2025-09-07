import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import type { WorkoutPlan, Exercise, PaginationParams, PaginatedResponse } from '@/types';

export class WorkoutService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.workoutPlans.list);
  }

  // Get all workout plans
  async getWorkoutPlans(params?: PaginationParams): Promise<PaginatedResponse<WorkoutPlan>> {
    return this.getAll<WorkoutPlan>(params);
  }

  // Get workout plan by ID
  async getWorkoutPlan(id: string): Promise<WorkoutPlan> {
    return this.getById<WorkoutPlan>(id);
  }

  // Create new workout plan
  async createWorkoutPlan(workoutData: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    return this.create<WorkoutPlan>(workoutData);
  }

  // Update workout plan
  async updateWorkoutPlan(id: string, workoutData: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    return this.update<WorkoutPlan>(id, workoutData);
  }

  // Delete workout plan
  async deleteWorkoutPlan(id: string): Promise<void> {
    return this.delete(id);
  }

  // Get workout plans for specific user
  async getUserWorkoutPlans(userId: string, params?: PaginationParams): Promise<PaginatedResponse<WorkoutPlan>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return this.apiCall<PaginatedResponse<WorkoutPlan>>(`/user/${userId}?${queryParams.toString()}`);
  }

  // Get active workout plan for user
  async getActiveWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
    return this.apiCall<WorkoutPlan | null>(`/user/${userId}/active`);
  }

  // Add exercise to workout plan
  async addExerciseToPlan(planId: string, exercise: Partial<Exercise>): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${planId}/exercises`, {
      method: 'POST',
      body: JSON.stringify(exercise),
    });
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

  // Duplicate workout plan
  async duplicateWorkoutPlan(planId: string, newPlanName: string, userId: string): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/${planId}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({
        newPlanName,
        userId
      }),
    });
  }

  // Get workout plan templates
  async getWorkoutTemplates(): Promise<WorkoutPlan[]> {
    return this.apiCall<WorkoutPlan[]>('/templates');
  }

  // Create workout plan from template
  async createFromTemplate(templateId: string, userId: string, planName: string): Promise<WorkoutPlan> {
    return this.apiCall<WorkoutPlan>(`/templates/${templateId}/create`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        planName
      }),
    });
  }
}
